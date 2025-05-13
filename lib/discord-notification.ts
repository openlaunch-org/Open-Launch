/**
 * Utility for sending notifications to Discord via webhook
 */

import { db } from "@/drizzle/db"
import { project, user } from "@/drizzle/db/schema"
import { eq } from "drizzle-orm"

interface DiscordEmbed {
  title: string
  color: number
  description: string
  url?: string
  fields: {
    name: string
    value: string
    inline: boolean
  }[]
  footer: {
    text: string
  }
  timestamp: string
}

interface DiscordMessage {
  embeds: DiscordEmbed[]
}

/**
 * Send a Discord notification for a new comment
 * @param projectId ID of the project where the comment was posted
 * @param userId ID of the user who posted the comment
 * @param commentText Text of the comment
 */
export async function sendDiscordCommentNotification(
  projectId: string,
  userId: string,
  commentText: string,
): Promise<boolean> {
  try {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL

    if (!webhookUrl) {
      console.error("DISCORD_WEBHOOK_URL is not defined in environment variables")
      return false
    }

    // Retrieve user information
    let userInfo = { email: userId, name: "Unknown User" }
    try {
      const userResult = await db
        .select({ email: user.email, name: user.name })
        .from(user)
        .where(eq(user.id, userId))
        .limit(1)

      if (userResult.length > 0) {
        userInfo = userResult[0]
      }
    } catch (error) {
      console.error("Error retrieving user information:", error)
    }

    // Retrieve project information
    let projectInfo = { slug: projectId, name: "Unknown Project" }
    try {
      const projectResult = await db
        .select({ slug: project.slug, name: project.name })
        .from(project)
        .where(eq(project.id, projectId))
        .limit(1)

      if (projectResult.length > 0) {
        projectInfo = projectResult[0]
      }
    } catch (error) {
      console.error("Error retrieving project information:", error)
    }

    // Build project URL
    const projectUrl = `${process.env.NEXT_PUBLIC_APP_URL || ""}/projects/${projectInfo.slug}`

    // Truncate comment text if it's too long
    const truncatedText =
      commentText.length > 1500 ? commentText.substring(0, 1500) + "..." : commentText

    // Create message to send to Discord
    const message: DiscordMessage = {
      embeds: [
        {
          title: "New Comment",
          color: 0x00ff00, // Green for Open Launch
          description: truncatedText,
          url: projectUrl,
          fields: [
            {
              name: "Project",
              value: `[${projectInfo.name}](${projectUrl})`,
              inline: true,
            },
            {
              name: "User",
              value: `${userInfo.name} (${userInfo.email})`,
              inline: true,
            },
          ],
          footer: {
            text: "Open Launch Comment Notification",
          },
          timestamp: new Date().toISOString(),
        },
      ],
    }

    // Send request to Discord webhook
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    })

    if (!response.ok) {
      console.error(`Error sending to Discord: ${response.status} ${response.statusText}`)
      return false
    }

    return true
  } catch (error) {
    console.error("Error sending Discord notification:", error)
    return false
  }
}

/**
 * Send a Discord notification for a scheduled launch
 * @param projectName Name of the project being launched
 * @param launchDate Date of the launch
 * @param launchType Type of launch (free, premium, premium plus)
 * @param websiteUrl URL of the project website
 * @param projectUrl URL of the project page on Open-Launch
 */
export async function notifyDiscordLaunch(
  projectName: string,
  launchDate: string,
  launchType: string,
  websiteUrl: string,
  projectUrl: string,
): Promise<boolean> {
  try {
    const webhookUrl = process.env.DISCORD_LAUNCH_WEBHOOK_URL

    if (!webhookUrl) {
      console.error("Discord webhook URL is not defined")
      return false
    }

    // Format the launch type for display
    const formattedLaunchType = launchType
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")

    // Determine color based on launch type
    let color = 0x00ff00 // Default green
    if (launchType === "PREMIUM") {
      color = 0xff9900 // Orange for premium
    } else if (launchType === "PREMIUM_PLUS") {
      color = 0xff0000 // Red for premium plus
    }

    // Create message to send to Discord
    const message = {
      embeds: [
        {
          title: "New Project Launch Scheduled",
          color: color,
          url: projectUrl,
          description: `A new tech project has been scheduled for launch. Check it out!\n➡️ [${projectName}](${projectUrl})`,
          fields: [
            {
              name: "Project",
              value: `[${projectName}](${projectUrl})`,
              inline: true,
            },
            {
              name: "Launch Date",
              value: launchDate,
              inline: true,
            },
            {
              name: "Launch Type",
              value: formattedLaunchType,
              inline: true,
            },
            {
              name: "Website",
              value: `[Visit Website](${websiteUrl})`,
              inline: true,
            },
          ],
          footer: {
            text: "Open Launch Launch Notification",
          },
          timestamp: new Date().toISOString(),
        },
      ],
    }

    // Send request to Discord webhook
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    })

    if (!response.ok) {
      console.error(`Error sending to Discord: ${response.status} ${response.statusText}`)
      return false
    }

    return true
  } catch (error) {
    console.error("Error sending Discord notification:", error)
    return false
  }
}
