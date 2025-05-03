import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"

import { db } from "@/drizzle/db"
import { launchQuota, launchStatus, launchType, project } from "@/drizzle/db/schema"
import { eq, sql } from "drizzle-orm"
import Stripe from "stripe"

// Initialiser le client Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature") as string

    // Vérifier la signature du webhook
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error("Webhook signature verification failed:", err)
      return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 })
    }

    // Traiter l'événement
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session

      // Find the project using client_reference_id (which we set as projectId)
      const projectId = session.client_reference_id
      if (!projectId) {
        console.error("No project ID found in session metadata")
        return NextResponse.json(
          { error: "No project ID found in session metadata" },
          { status: 400 },
        )
      }

      // Vérifier si le paiement a réussi
      if (session.payment_status === "paid") {
        // Récupérer les informations de la chaîne
        const [projectData] = await db
          .select({
            id: project.id,
            launchType: project.launchType,
            scheduledLaunchDate: project.scheduledLaunchDate,
          })
          .from(project)
          .where(eq(project.id, projectId))

        if (!projectData) {
          console.error("Project not found:", projectId)
          return NextResponse.json({ error: "Project not found" }, { status: 404 })
        }

        if (!projectData.scheduledLaunchDate) {
          console.error("Project data incomplete:", projectId)
          return NextResponse.json({ error: "Project data incomplete" }, { status: 400 })
        }

        // Update the project status to 'scheduled'
        await db
          .update(project)
          .set({
            launchStatus: launchStatus.SCHEDULED,
            // Pour Premium Plus, activer la mise en avant sur la page d'accueil
            featuredOnHomepage: projectData.launchType === launchType.PREMIUM_PLUS,
            updatedAt: new Date(),
          })
          .where(eq(project.id, projectId))

        // Mettre à jour le quota pour cette date
        const launchDate = projectData.scheduledLaunchDate
        const quotaResult = await db
          .select()
          .from(launchQuota)
          .where(eq(launchQuota.date, launchDate))
          .limit(1)

        if (quotaResult.length === 0) {
          // Créer un nouveau quota
          await db.insert(launchQuota).values({
            id: crypto.randomUUID(),
            date: launchDate,
            freeCount: 0,
            premiumCount: projectData.launchType === launchType.PREMIUM ? 1 : 0,
            premiumPlusCount: projectData.launchType === launchType.PREMIUM_PLUS ? 1 : 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
        } else {
          // Mettre à jour le quota existant
          await db
            .update(launchQuota)
            .set({
              premiumCount:
                projectData.launchType === launchType.PREMIUM
                  ? sql`${launchQuota.premiumCount} + 1`
                  : launchQuota.premiumCount,
              premiumPlusCount:
                projectData.launchType === launchType.PREMIUM_PLUS
                  ? sql`${launchQuota.premiumPlusCount} + 1`
                  : launchQuota.premiumPlusCount,
              updatedAt: new Date(),
            })
            .where(eq(launchQuota.id, quotaResult[0].id))
        }

        // Revalidate the project page path using the project ID
        try {
          revalidatePath(`/projects`) // Revalidation plus large pour l'instant
          console.log(`Revalidated path for project: ${projectId}`)
        } catch (revalidateError) {
          console.error("Error revalidating path:", revalidateError)
        }

        return NextResponse.json({ success: true })
      } else {
        // Si le paiement n'a pas réussi, mettre à jour le statut à PAYMENT_FAILED
        await db
          .update(project)
          .set({
            launchStatus: launchStatus.PAYMENT_FAILED,
            updatedAt: new Date(),
          })
          .where(eq(project.id, projectId))

        return NextResponse.json({ success: true })
      }
    } else if (event.type === "checkout.session.expired") {
      const session = event.data.object as Stripe.Checkout.Session
      const projectId = session.client_reference_id

      if (projectId) {
        // Mettre à jour le statut de la chaîne à PAYMENT_FAILED
        await db
          .update(project)
          .set({
            launchStatus: launchStatus.PAYMENT_FAILED,
            updatedAt: new Date(),
          })
          .where(eq(project.id, projectId))
      }

      return NextResponse.json({ success: true })
    }

    // Pour les autres types d'événements
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}
