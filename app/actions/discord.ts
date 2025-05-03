"use server"

import { notifyDiscordLaunch as sendRealDiscordLaunchNotification } from "@/lib/discord-notification"

export async function notifyDiscordLaunch(
  projectName: string,
  launchDate: string,
  launchType: string,
  websiteUrl: string,
  projectUrl: string,
) {
  try {
    const result = await sendRealDiscordLaunchNotification(
      projectName,
      launchDate,
      launchType,
      websiteUrl,
      projectUrl,
    )
    return { success: result }
  } catch (error) {
    console.error("Error sending Discord launch notification via action:", error)
    return {
      success: false,
      error: "Failed to send Discord launch notification",
    }
  }
}
