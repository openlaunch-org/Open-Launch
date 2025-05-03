import { checkRateLimit } from "@/lib/rate-limit"

// Adjust values according to your needs
const COMMENT_LIMITS = {
  ACTIONS_PER_WINDOW: 10, // Maximum 10 comments per window
  TIME_WINDOW_MS: 5 * 60 * 1000, // 5 minute window
}

// Separate limits for votes (likes/dislikes)
const VOTE_LIMITS = {
  ACTIONS_PER_WINDOW: 30, // Maximum 30 votes per window
  TIME_WINDOW_MS: 5 * 60 * 1000, // 5 minute window
}

/**
 * Checks if the user has exceeded the comment rate limit
 * @param userId User identifier
 * @returns Result of the rate limit check
 */
export async function checkCommentRateLimit(userId: string) {
  // Key starts with 'comment:' to clearly separate from other limits
  return checkRateLimit(
    `comment:${userId}`,
    COMMENT_LIMITS.ACTIONS_PER_WINDOW,
    COMMENT_LIMITS.TIME_WINDOW_MS,
  )
}

/**
 * Checks if the user has exceeded the vote rate limit (likes/dislikes)
 * @param userId User identifier
 * @returns Result of the rate limit check
 */
export async function checkUpvoteRateLimit(userId: string) {
  // Key starts with 'vote:' to avoid confusion with 'comment:'
  return checkRateLimit(
    `vote:${userId}`,
    VOTE_LIMITS.ACTIONS_PER_WINDOW,
    VOTE_LIMITS.TIME_WINDOW_MS,
  )
}
