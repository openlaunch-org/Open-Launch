/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextComment } from "@fuma-comment/next";
import { commentAuth, commentStorage } from "@/lib/comment.config";
import { NextRequest, NextResponse } from "next/server";
import { sendDiscordCommentNotification } from "@/lib/discord-notification";
import { extractTextFromContent } from "@/lib/content-utils";
import { checkCommentRateLimit } from "@/lib/comment-rate-limit";

// Create standard Fuma Comment handler
const commentHandler = NextComment({
  mention: { enabled: true },
  auth: commentAuth,
  storage: commentStorage,
});

// Intercept POST requests to add Discord notification and rate limiting
export async function POST(req: NextRequest, context: any) {
  try {
    // Get parameters and user session
    const params = await context.params;
    const commentParams = params.comment || [];
    const session = await commentAuth.getSession(req as any);

    // Check if it's a new comment (only 1 segment = projectId)
    const isNewComment = commentParams.length === 1;

    // Only for new comments with authenticated users
    if (isNewComment && session) {
      // Apply rate limiting for comments
      const rateLimit = await checkCommentRateLimit(session.id);

      if (!rateLimit.success) {
        return NextResponse.json(
          {
            message:
              "You've posted too many comments. Please wait a few minutes before adding another one.",
            details: `Rate limit exceeded. You can comment again in ${rateLimit.reset} seconds. You have ${rateLimit.remaining} comments left for this period.`,
            type: "rate_limit_exceeded",
            resetInSeconds: rateLimit.reset,
          },
          { status: 429 }
        );
      }

      // The project ID is the first segment in commentParams
      const projectId = commentParams[0];

      try {
        // Clone the request to be able to read it
        const clonedReq = req.clone();
        const body = await clonedReq.json();

        // Extract comment text and send notification
        if (body && body.content) {
          const commentText = extractTextFromContent(body.content);

          // Send Discord notification asynchronously
          void sendDiscordCommentNotification(
            projectId,
            session.id || "",
            commentText
          );
        }
      } catch (error) {
        console.error("Error processing comment:", error);
      }
    }
  } catch (error) {
    console.error("Error intercepting request:", error);
  }

  // Continue with normal handler
  return commentHandler.POST(req, context);
}

// Export other methods without modification
export const { GET, DELETE, PATCH } = commentHandler;
