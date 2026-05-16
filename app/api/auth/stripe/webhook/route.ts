import { revalidatePath, revalidateTag } from "next/cache"
import { NextResponse } from "next/server"

import { db } from "@/drizzle/db"
import { directoryOrder, launchQuota, launchStatus, project } from "@/drizzle/db/schema"
import { and, eq, inArray, sql } from "drizzle-orm"
import Stripe from "stripe"

import {
  DIRECTORY_ORDER_REF_PREFIX,
  DIRECTORY_TIER_CONFIG,
  isDirectoryTier,
  type DirectoryTier,
} from "@/lib/directory-tiers"
import { ULTRA_SPONSORS_CACHE_TAG } from "@/lib/sponsors"
import {
  sendAdminPaymentNotification,
  sendBuyerDirectoryOrderConfirmation,
} from "@/lib/transactional-emails"

// Initialiser le client Stripe.
// Pin the API version explicitly so behaviour stays stable across
// Stripe-side default-version updates. Bump together with the
// `stripe` npm SDK; the SDK's `LatestApiVersion` type tracks what
// it knows about.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-04-22.dahlia",
})
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

/**
 * Cancel a directory_order tied to an Ultra subscription that's no longer
 * billable. Stripe fires both `subscription.deleted` AND
 * `subscription.updated[status=canceled]` for a single cancel — the
 * WHERE clause restricts to paid/fulfilled so the second hit is a
 * 0-row no-op, and `revalidateTag` only runs when we actually changed
 * the row. Accepts both `paid` and `fulfilled` because Plus/Pro/Ultra
 * orders sit at `paid` until the admin manually marks them fulfilled,
 * and a customer can cancel before that step.
 */
async function markUltraOrderCanceled(stripeSubscriptionId: string, reason: string) {
  const result = await db
    .update(directoryOrder)
    .set({ status: "canceled", updatedAt: new Date() })
    .where(
      and(
        eq(directoryOrder.stripeSubscriptionId, stripeSubscriptionId),
        inArray(directoryOrder.status, ["paid", "fulfilled"]),
      ),
    )
  if (!result.rowCount || result.rowCount === 0) {
    console.log(
      "ℹ️ subscription cancel signal for unknown / already-canceled order:",
      stripeSubscriptionId,
      "reason:",
      reason,
    )
    return
  }
  console.log("✅ Subscription dead, marked order canceled:", stripeSubscriptionId, "via", reason)
  // A canceled Ultra vacates a sidebar slot — bust the cache so the
  // now-empty slot vanishes promptly.
  revalidateTag(ULTRA_SPONSORS_CACHE_TAG, "max")
}

/**
 * Stripe webhook is allowed to silently 200 on missing project / order
 * (so Stripe doesn't retry forever), but we still need a human to look
 * at the payment — otherwise customers paid for nothing and we never
 * notice. Reuses the admin payment email template with an ORPHAN tag.
 *
 * Best-effort: a send failure just logs and falls through, so the
 * webhook still returns 200.
 */
async function alertOrphanPayment(
  session: Stripe.Checkout.Session,
  reason: string,
  ref: string | null,
) {
  try {
    const userEmail = session.customer_details?.email ?? "unknown"
    const amount = (session.amount_total ?? 0) / 100
    const currency = session.currency ?? "usd"
    await sendAdminPaymentNotification({
      userEmail,
      amount,
      currency,
      projectName: reason,
      websiteUrl: `Stripe session: ${session.id} | client_reference_id: ${ref ?? "(none)"}`,
      orphan: true,
    })
  } catch (err) {
    console.error("⚠️ Failed to send orphan-payment alert:", err)
  }
}

export async function POST(request: Request) {
  try {
    // 检查环境变量是否配置
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("❌ STRIPE_SECRET_KEY is not configured")
      return NextResponse.json({ error: "Stripe configuration error" }, { status: 500 })
    }
    if (!webhookSecret) {
      console.error("❌ STRIPE_WEBHOOK_SECRET is not configured")
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 })
    }

    const body = await request.text()
    const signature = request.headers.get("stripe-signature") as string

    if (!signature) {
      console.error("❌ No stripe-signature header found")
      return NextResponse.json({ error: "No signature header" }, { status: 400 })
    }

    // Vérifier la signature du webhook
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
      console.log("✅ Webhook signature verified, event type:", event.type)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error"
      console.error("❌ Webhook signature verification failed:", errorMessage)
      return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 })
    }

    // Traiter l'événement
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session

      // Branch: directory-listing orders use a `dir_<orderId>` prefix on
      // `client_reference_id` so they don't collide with bare project
      // ids that the premium-launch flow uses.
      const ref = session.client_reference_id
      if (ref?.startsWith(DIRECTORY_ORDER_REF_PREFIX)) {
        return await handleDirectoryOrderCompleted(session, ref)
      }

      // Find the project using client_reference_id (which we set as projectId)
      const projectId = ref
      if (!projectId) {
        console.error("⚠️ No project ID found in session metadata, session_id:", session.id)
        // 返回 200 避免 Stripe 重试，但发管理员告警
        await alertOrphanPayment(session, "no client_reference_id", null)
        return NextResponse.json({ received: true, warning: "No project ID" }, { status: 200 })
      }

      console.log("📦 Processing payment for project:", projectId)

      // Vérifier si le paiement a réussi
      if (session.payment_status === "paid") {
        // Récupérer les informations de la chaîne
        const [projectData] = await db
          .select({
            id: project.id,
            name: project.name,
            websiteUrl: project.websiteUrl,
            launchType: project.launchType,
            launchStatus: project.launchStatus,
            scheduledLaunchDate: project.scheduledLaunchDate,
          })
          .from(project)
          .where(eq(project.id, projectId))

        if (!projectData) {
          console.error("⚠️ Project not found:", projectId)
          // 返回 200 避免 Stripe 无限重试,同时发管理员告警
          await alertOrphanPayment(session, `project ${projectId} not found`, projectId)
          return NextResponse.json(
            { received: true, warning: "Project not found" },
            { status: 200 },
          )
        }

        if (!projectData.scheduledLaunchDate) {
          console.error("⚠️ Project data incomplete:", projectId)
          return NextResponse.json(
            { received: true, warning: "Project data incomplete" },
            { status: 200 },
          )
        }

        console.log("✅ Project found, scheduled date:", projectData.scheduledLaunchDate)

        // Atomic conditional update: only transition PAYMENT_PENDING → SCHEDULED
        // The WHERE clause ensures only the first writer (verify or webhook) succeeds
        const updateResult = await db
          .update(project)
          .set({
            launchStatus: launchStatus.SCHEDULED,
            featuredOnHomepage: false,
            updatedAt: new Date(),
          })
          .where(
            and(eq(project.id, projectId), eq(project.launchStatus, launchStatus.PAYMENT_PENDING)),
          )

        // Only update quota if THIS request actually performed the transition
        if (!updateResult.rowCount || updateResult.rowCount === 0) {
          console.log("ℹ️ Project already processed by verify endpoint, skipping quota update")
        } else {
          console.log("✅ Webhook: Payment confirmed for project:", projectId)

          revalidatePath("/sitemap.xml")

          const launchDate = projectData.scheduledLaunchDate
          const quotaResult = await db
            .select()
            .from(launchQuota)
            .where(eq(launchQuota.date, launchDate))
            .limit(1)

          if (quotaResult.length === 0) {
            await db.insert(launchQuota).values({
              id: crypto.randomUUID(),
              date: launchDate,
              freeCount: 0,
              badgeCount: 0,
              premiumCount: 1,
              createdAt: new Date(),
              updatedAt: new Date(),
            })
          } else {
            await db
              .update(launchQuota)
              .set({
                premiumCount: sql`${launchQuota.premiumCount} + 1`,
                updatedAt: new Date(),
              })
              .where(eq(launchQuota.id, quotaResult[0].id))
          }

          try {
            revalidatePath(`/projects`)
            console.log(`✅ Revalidated path for project: ${projectId}`)
          } catch (revalidateError) {
            console.error("⚠️ Error revalidating path:", revalidateError)
          }
        }

        // Send admin notification
        try {
          const userEmail = session.customer_details?.email || "unknown@example.com"
          const amount = (session.amount_total || 0) / 100
          const currency = session.currency || "usd"

          await sendAdminPaymentNotification({
            userEmail,
            amount,
            currency,
            projectName: projectData.name || "Unknown Project",
            websiteUrl: projectData.websiteUrl || "https://aat.ee",
          })
          console.log("✅ Admin payment notification sent")
        } catch (emailError) {
          console.error("⚠️ Failed to send admin notification:", emailError)
        }

        console.log("✅ Webhook processed successfully for project:", projectId)
        return NextResponse.json({ success: true }, { status: 200 })
      } else {
        // Si le paiement n'a pas réussi, mettre à jour le statut à PAYMENT_FAILED
        console.log("⚠️ Payment not completed, status:", session.payment_status)
        await db
          .update(project)
          .set({
            launchStatus: launchStatus.PAYMENT_FAILED,
            updatedAt: new Date(),
          })
          .where(eq(project.id, projectId))

        return NextResponse.json({ success: true }, { status: 200 })
      }
    } else if (event.type === "checkout.session.async_payment_succeeded") {
      // Delayed-payment methods (SEPA, ACH, bank transfer) fire
      // `completed` with status `unpaid`, then this event when the
      // funds settle. For directory orders we route both through the
      // same handler — `payment_status` will now be `paid` so the
      // status flip happens here.
      const session = event.data.object as Stripe.Checkout.Session
      const ref = session.client_reference_id
      if (ref?.startsWith(DIRECTORY_ORDER_REF_PREFIX)) {
        return await handleDirectoryOrderCompleted(session, ref)
      }
      // Premium-launch flow uses card-only checkout, so async_payment
      // events shouldn't hit this branch; log and acknowledge.
      console.log("ℹ️ async_payment_succeeded for non-directory order:", ref)
      return NextResponse.json({ received: true }, { status: 200 })
    } else if (event.type === "checkout.session.async_payment_failed") {
      const session = event.data.object as Stripe.Checkout.Session
      const ref = session.client_reference_id
      if (ref?.startsWith(DIRECTORY_ORDER_REF_PREFIX)) {
        const orderId = ref.slice(DIRECTORY_ORDER_REF_PREFIX.length)
        await db
          .update(directoryOrder)
          .set({ status: "failed", updatedAt: new Date() })
          .where(and(eq(directoryOrder.id, orderId), eq(directoryOrder.status, "pending")))
        console.log("✅ Marked directory order as failed (async):", orderId)
      }
      return NextResponse.json({ success: true }, { status: 200 })
    } else if (event.type === "customer.subscription.deleted") {
      // Ultra is a subscription. When canceled (by user or admin via
      // Stripe Dashboard), flip the matching order to `canceled` so
      // the admin queue stops treating it as active.
      const sub = event.data.object as Stripe.Subscription
      await markUltraOrderCanceled(sub.id, "deleted")
      return NextResponse.json({ success: true }, { status: 200 })
    } else if (event.type === "customer.subscription.updated") {
      // Stripe fires `updated` for every state transition. We only act
      // on the three terminal-death states (subscription effectively
      // gone) and treat them as a cancel-equivalent for our directory
      // order. Healthy transitions (active, trialing, past_due-pending-
      // retry, paused) are no-ops — kicking customers on past_due would
      // punish them mid-retry-window.
      const sub = event.data.object as Stripe.Subscription
      const DEAD_STATUSES: ReadonlyArray<Stripe.Subscription.Status> = [
        "incomplete_expired",
        "unpaid",
        "canceled",
      ]
      if (!DEAD_STATUSES.includes(sub.status)) {
        return NextResponse.json({ success: true, noop: true }, { status: 200 })
      }
      await markUltraOrderCanceled(sub.id, `updated[${sub.status}]`)
      return NextResponse.json({ success: true }, { status: 200 })
    } else if (event.type === "checkout.session.expired") {
      const session = event.data.object as Stripe.Checkout.Session
      const ref = session.client_reference_id

      console.log("⏰ Checkout session expired, session_id:", session.id)

      if (ref?.startsWith(DIRECTORY_ORDER_REF_PREFIX)) {
        const orderId = ref.slice(DIRECTORY_ORDER_REF_PREFIX.length)
        await db
          .update(directoryOrder)
          .set({ status: "failed", updatedAt: new Date() })
          .where(and(eq(directoryOrder.id, orderId), eq(directoryOrder.status, "pending")))
        console.log("✅ Marked directory order as failed:", orderId)
        return NextResponse.json({ success: true }, { status: 200 })
      }

      const projectId = ref

      if (projectId) {
        // Mettre à jour le statut de la chaîne à PAYMENT_FAILED
        await db
          .update(project)
          .set({
            launchStatus: launchStatus.PAYMENT_FAILED,
            updatedAt: new Date(),
          })
          .where(eq(project.id, projectId))
        console.log("✅ Updated project status to PAYMENT_FAILED:", projectId)
      }

      return NextResponse.json({ success: true }, { status: 200 })
    }

    // Pour les autres types d'événements
    console.log("ℹ️ Received event type:", event.type, "(not handled)")
    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    const errorStack = error instanceof Error ? error.stack : undefined
    console.error("❌ Webhook error:", errorMessage)
    if (errorStack) {
      console.error("Stack trace:", errorStack)
    }
    // 返回 500 让 Stripe 重试（这是真正的服务器错误）
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}

/**
 * Handles a successful Stripe checkout for a directory listing
 * order. Idempotent: re-running on the same session id (Stripe
 * retries on 5xx) is a no-op once the order is already paid.
 *
 * Status flow:
 *   pending → paid                   (Plus / Pro / Ultra: admin fulfils)
 *   pending → paid → fulfilled       (Basic: same row, both flags set)
 */
async function handleDirectoryOrderCompleted(
  session: Stripe.Checkout.Session,
  ref: string,
): Promise<NextResponse> {
  const orderId = ref.slice(DIRECTORY_ORDER_REF_PREFIX.length)

  if (session.payment_status !== "paid") {
    // Async payment methods (SEPA / bank transfer / some wallets)
    // fire `completed` with status `unpaid` and only later fire
    // `async_payment_succeeded` once the funds settle. Don't flip
    // to `failed` here — the order should stay `pending` and we'll
    // handle the eventual outcome via the async events.
    console.log(
      "ℹ️ Directory order completed but not yet paid (likely async method):",
      session.payment_status,
      orderId,
    )
    return NextResponse.json({ success: true, asyncPending: true }, { status: 200 })
  }

  // Pull the order row so we can branch on tier (Basic auto-fulfils).
  const [order] = await db
    .select()
    .from(directoryOrder)
    .where(eq(directoryOrder.id, orderId))
    .limit(1)

  if (!order) {
    console.error("⚠️ Directory order not found:", orderId)
    // Orphan — most likely the project (and its directory_order via
    // CASCADE) was deleted between createDirectoryOrder + the buyer
    // paying. Send admin alert so this $ doesn't fall into a hole.
    await alertOrphanPayment(session, `directory_order ${orderId} not found (deleted?)`, ref)
    return NextResponse.json(
      { received: true, warning: "Directory order not found" },
      { status: 200 },
    )
  }

  if (!isDirectoryTier(order.tier)) {
    console.error("⚠️ Directory order has invalid tier:", order.tier, orderId)
    return NextResponse.json({ received: true, warning: "Invalid tier" }, { status: 200 })
  }

  const tier: DirectoryTier = order.tier
  const cfg = DIRECTORY_TIER_CONFIG[tier]
  const now = new Date()
  const subId =
    typeof session.subscription === "string"
      ? session.subscription
      : (session.subscription?.id ?? null)
  const customerId =
    typeof session.customer === "string" ? session.customer : (session.customer?.id ?? null)

  // Atomic conditional update: only `pending` orders flip to `paid`.
  // Re-deliveries (Stripe retried after a 5xx) hit zero rows and we
  // skip the rest of the work below — keeps the operation idempotent.
  const updateResult = await db
    .update(directoryOrder)
    .set({
      status: cfg.autoFulfil ? "fulfilled" : "paid",
      amountCents: session.amount_total ?? cfg.amountCents,
      currency: session.currency ?? "usd",
      stripeSessionId: session.id,
      stripeSubscriptionId: subId,
      stripeCustomerId: customerId,
      paidAt: now,
      fulfilledAt: cfg.autoFulfil ? now : null,
      updatedAt: now,
    })
    .where(and(eq(directoryOrder.id, orderId), eq(directoryOrder.status, "pending")))

  if (!updateResult.rowCount || updateResult.rowCount === 0) {
    // Disambiguate idempotent (Stripe retry on already-paid order) vs
    // stale (someone canceled/refunded the order between createCheckout
    // and pay). The former is normal; the latter means money came in
    // for an order the user explicitly killed — admin needs to refund.
    const STALE_STATUSES: ReadonlyArray<string> = ["canceled", "refunded", "failed"]
    if (STALE_STATUSES.includes(order.status)) {
      console.error("⚠️ Paid webhook hit non-pending order:", orderId, "status was:", order.status)
      await alertOrphanPayment(
        session,
        `directory_order ${orderId} was '${order.status}' when paid webhook arrived`,
        ref,
      )
    } else {
      console.log("ℹ️ Directory order already processed, skipping:", orderId)
    }
    return NextResponse.json({ success: true, idempotent: true }, { status: 200 })
  }

  // Bust the sponsor-list cache so an Ultra subscription becomes
  // visible on the sidebar at the next page request — without
  // waiting for the per-page `revalidate` window (≤1h).
  if (tier === "ultra") {
    revalidateTag(ULTRA_SPONSORS_CACHE_TAG, "max")
  }

  // If this order was paid AT submit time (project still in
  // `payment_pending`), promote the project off the queue: flip to
  // SCHEDULED and burn a premium-quota slot. This unifies the
  // submit-time paid flow into the directory_order pipeline so
  // there's no need for a separate Premium-Launch code path.
  //
  // For dashboard "Boost listing" purchases against an already-
  // launched project, `launchStatus` is no longer `payment_pending`
  // and the WHERE clause guards skip this block — schedule data
  // stays untouched.
  await scheduleProjectIfPendingPayment(order.projectId)

  // Sanity check (post-write so re-deliveries don't spam the warn):
  // log once if Stripe's amount differs from the configured tier
  // price. Most likely cause is an env var pointing at the wrong
  // Stripe Payment Link. We've already trusted Stripe's amount for
  // the row — this just leaves a paper trail.
  if (typeof session.amount_total === "number" && session.amount_total !== cfg.amountCents) {
    console.warn(
      `⚠️ Directory order amount mismatch — config=${cfg.amountCents}, stripe=${session.amount_total}, tier=${tier}, order=${orderId}`,
    )
  }

  console.log(
    `✅ Directory order ${cfg.autoFulfil ? "auto-fulfilled" : "marked paid"}:`,
    orderId,
    "tier:",
    tier,
  )

  // Send admin + buyer notifications. Both wrapped in their own
  // try/catch so a single email failure doesn't poison the other —
  // and neither bubbles up to the webhook (Stripe would retry the
  // whole event forever on a 5xx).
  const [proj] = await db
    .select({ name: project.name, websiteUrl: project.websiteUrl })
    .from(project)
    .where(eq(project.id, order.projectId))
    .limit(1)

  const userEmail = session.customer_details?.email || ""
  const userName = session.customer_details?.name ?? null
  const amount = (session.amount_total ?? cfg.amountCents) / 100
  const currency = session.currency ?? "usd"
  const projectName = proj?.name ?? "Unknown"
  const websiteUrl = proj?.websiteUrl || order.url || "https://aat.ee"

  try {
    await sendAdminPaymentNotification({
      userEmail: userEmail || "unknown@example.com",
      amount,
      currency,
      projectName: `${projectName} — Directory ${tier.toUpperCase()}`,
      websiteUrl,
    })
    console.log("✅ Admin notification sent for directory order:", orderId)
  } catch (emailError) {
    console.error("⚠️ Failed to send admin notification for directory order:", emailError)
  }

  if (userEmail) {
    try {
      await sendBuyerDirectoryOrderConfirmation({
        buyerEmail: userEmail,
        buyerName: userName,
        tier,
        projectName,
        websiteUrl,
        amount,
        currency,
        // `order.locale` was captured at checkout creation
        // (createDirectoryOrder) — null for any pre-Phase-6 row.
        locale: order.locale ?? null,
      })
      console.log("✅ Buyer confirmation sent for directory order:", orderId)
    } catch (emailError) {
      console.error("⚠️ Failed to send buyer confirmation for directory order:", emailError)
    }
  } else {
    console.warn("⚠️ No buyer email on session; skipping buyer confirmation:", orderId)
  }

  return NextResponse.json({ success: true }, { status: 200 })
}

/**
 * If the given project is still in `payment_pending` (i.e. the
 * Directory order was created from the at-submit checkout flow),
 * promote it to SCHEDULED and burn a premium-quota slot. Mirrors
 * the existing Premium-Launch webhook scheduling logic so paid
 * Directory tiers correctly skip the free queue.
 *
 * The status guard makes this a no-op for "Boost listing"
 * purchases against already-scheduled / launched projects — those
 * paths shouldn't touch the project's launch state.
 */
async function scheduleProjectIfPendingPayment(projectId: string): Promise<void> {
  const [proj] = await db
    .select({
      id: project.id,
      slug: project.slug,
      launchStatus: project.launchStatus,
      scheduledLaunchDate: project.scheduledLaunchDate,
    })
    .from(project)
    .where(eq(project.id, projectId))
    .limit(1)

  if (!proj || proj.launchStatus !== launchStatus.PAYMENT_PENDING) return

  if (!proj.scheduledLaunchDate) {
    console.warn(
      "⚠️ Project in payment_pending has no scheduledLaunchDate; cannot promote to SCHEDULED:",
      projectId,
    )
    return
  }

  // Atomic transition — only the first writer wins, mirroring the
  // existing Premium-Launch idempotency guard.
  const updateResult = await db
    .update(project)
    .set({
      launchStatus: launchStatus.SCHEDULED,
      featuredOnHomepage: false,
      updatedAt: new Date(),
    })
    .where(and(eq(project.id, projectId), eq(project.launchStatus, launchStatus.PAYMENT_PENDING)))

  if (!updateResult.rowCount || updateResult.rowCount === 0) {
    console.log("ℹ️ Project already promoted by another writer:", projectId)
    return
  }

  // Bump the day's premium quota counter so the per-day cap stays
  // accurate. Same pattern as the existing Premium-Launch path.
  const launchDate = proj.scheduledLaunchDate
  const [existingQuota] = await db
    .select()
    .from(launchQuota)
    .where(eq(launchQuota.date, launchDate))
    .limit(1)

  if (!existingQuota) {
    await db.insert(launchQuota).values({
      id: crypto.randomUUID(),
      date: launchDate,
      freeCount: 0,
      badgeCount: 0,
      premiumCount: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  } else {
    await db
      .update(launchQuota)
      .set({
        premiumCount: sql`${launchQuota.premiumCount} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(launchQuota.id, existingQuota.id))
  }

  revalidatePath("/projects")
  revalidatePath("/sitemap.xml")
  try {
    revalidatePath(`/projects/${proj.slug}`)
  } catch (err) {
    console.error("⚠️ Error revalidating slug path:", err)
  }
  console.log("✅ Project scheduled via directory_order at-submit path:", projectId)
}
