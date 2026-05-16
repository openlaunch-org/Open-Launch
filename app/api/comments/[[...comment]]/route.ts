/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server"

import { NextComment } from "@fuma-comment/next"

import { checkCommentRateLimit } from "@/lib/comment-rate-limit"
import { commentAuth, commentStorage } from "@/lib/comment.config"
import { extractTextFromContent } from "@/lib/content-utils"
import { sendDiscordCommentNotification } from "@/lib/discord-notification"

/**
 * Supprime tous les liens du contenu en transformant les nœuds "link" en texte simple
 * @param content Le contenu JSON du commentaire
 * @returns Le contenu modifié sans liens
 */
function removeLinksFromContent(content: any): any {
  if (!content) return content

  const processNode = (node: any): any => {
    if (!node || typeof node !== "object") return node

    // Si c'est un nœud link, on le transforme en texte simple
    if (node.type === "link") {
      // Récupérer le texte du lien depuis son contenu
      const linkText =
        node.content?.map((child: any) => child.text || "").join("") || node.attrs?.href || ""
      return {
        type: "text",
        text: linkText,
      }
    }

    // Traiter les marks (liens stockés comme marques)
    if (node.marks && Array.isArray(node.marks)) {
      node.marks = node.marks.filter((mark: any) => mark.type !== "link")
    }

    // Traitement récursif du contenu
    if (node.content && Array.isArray(node.content)) {
      node.content = node.content.map(processNode)
    }

    return node
  }

  return processNode(content)
}

/**
 * Traite une requête en supprimant les liens du contenu
 * @param req La requête originale
 * @returns Une nouvelle requête avec le contenu nettoyé
 */
async function processRequestWithLinkRemoval(req: NextRequest) {
  try {
    const body = await req.json()

    // Supprimer les liens du contenu si présent
    if (body && body.content) {
      body.content = removeLinksFromContent(body.content)
    }

    // Créer une nouvelle requête avec le contenu modifié
    return new NextRequest(req.url, {
      method: req.method,
      headers: req.headers,
      body: JSON.stringify(body),
    })
  } catch (error) {
    console.error("Error processing request:", error)
    // En cas d'erreur, retourner la requête originale
    return req
  }
}

// Create standard Fuma Comment handler
const commentHandler = NextComment({
  mention: { enabled: true },
  auth: commentAuth,
  storage: commentStorage,
})

// Intercept POST requests to add Discord notification and rate limiting
export async function POST(req: NextRequest, context: any) {
  try {
    // Get parameters and user session
    const params = await context.params
    const commentParams = params.comment || []
    const session = await commentAuth.getSession(req as any)

    // Check if it's a new comment (only 1 segment = projectId)
    const isNewComment = commentParams.length === 1

    // Only for new comments with authenticated users
    if (isNewComment && session) {
      // Apply rate limiting for comments
      const rateLimit = await checkCommentRateLimit(session.id)

      if (!rateLimit.success) {
        return NextResponse.json(
          {
            message:
              "You've posted too many comments. Please wait a few minutes before adding another one.",
            details: `Rate limit exceeded. You can comment again in ${rateLimit.reset} seconds. You have ${rateLimit.remaining} comments left for this period.`,
            type: "rate_limit_exceeded",
            resetInSeconds: rateLimit.reset,
          },
          { status: 429 },
        )
      }

      // The project ID is the first segment in commentParams
      const projectId = commentParams[0]

      try {
        // Lire le body de la requête
        const body = await req.json()

        // Supprimer les liens du contenu
        if (body && body.content) {
          body.content = removeLinksFromContent(body.content)

          // Extract comment text and send notification
          const commentText = extractTextFromContent(body.content)

          // Send Discord notification asynchronously
          void sendDiscordCommentNotification(projectId, session.id || "", commentText)
        }

        // Créer une nouvelle requête avec le contenu modifié
        const modifiedReq = new NextRequest(req.url, {
          method: req.method,
          headers: req.headers,
          body: JSON.stringify(body),
        })

        // Passer la nouvelle requête au handler
        return commentHandler.POST(modifiedReq, context)
      } catch (error) {
        console.error("Error processing comment:", error)
      }
    }

    // Pour tous les autres cas (pas de rate limiting), traiter quand même les liens
    const processedReq = await processRequestWithLinkRemoval(req)
    return commentHandler.POST(processedReq, context)
  } catch (error) {
    console.error("Error intercepting request:", error)
    // En cas d'erreur, passer la requête originale
    return commentHandler.POST(req, context)
  }
}

// Intercept PATCH requests (édition de commentaires) pour aussi supprimer les liens
export async function PATCH(req: NextRequest, context: any) {
  try {
    // Traiter la requête pour supprimer les liens
    const processedReq = await processRequestWithLinkRemoval(req)
    return commentHandler.PATCH(processedReq, context)
  } catch (error) {
    console.error("Error intercepting PATCH request:", error)
    // En cas d'erreur, passer la requête originale
    return commentHandler.PATCH(req, context)
  }
}

// Wrappers around fuma-comment's handler methods. Originally added to
// silence Next.js 15 type-compat noise; keeping them through Next 16
// because they're harmless and removing them risks regression.
export async function GET(req: NextRequest, context: any) {
  return commentHandler.GET(req, context)
}

export async function DELETE(req: NextRequest, context: any) {
  return commentHandler.DELETE(req, context)
}
