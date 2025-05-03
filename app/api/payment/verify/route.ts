import { NextResponse } from "next/server"

import { db } from "@/drizzle/db"
import { project } from "@/drizzle/db/schema"
import { eq } from "drizzle-orm"
import Stripe from "stripe"

// Initialiser le client Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function GET(request: Request) {
  try {
    // Récupérer l'ID de session des paramètres de requête
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("session_id")

    if (!sessionId) {
      return NextResponse.json({ error: "Missing session ID" }, { status: 400 })
    }

    // Récupérer les détails de la session depuis Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    // Récupérer l'ID du projet depuis la session
    const projectId = session.client_reference_id

    if (!projectId) {
      return NextResponse.json({ error: "No project ID found in session" }, { status: 400 })
    }

    // Vérifier le statut du paiement
    if (session.payment_status === "paid") {
      // Récupérer les informations du projet
      const [projectData] = await db
        .select({
          id: project.id,
          slug: project.slug,
          launchStatus: project.launchStatus,
        })
        .from(project)
        .where(eq(project.id, projectId))

      if (!projectData) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 })
      }

      return NextResponse.json({
        status: "complete",
        projectId: projectData.id,
        projectSlug: projectData.slug,
        launchStatus: projectData.launchStatus,
      })
    } else if (session.payment_status === "unpaid") {
      return NextResponse.json({ status: "pending" })
    } else {
      return NextResponse.json({ status: "failed" })
    }
  } catch (error) {
    console.error("Error verifying payment:", error)
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 })
  }
}
