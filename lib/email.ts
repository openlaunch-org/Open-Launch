import { Resend } from "resend"

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY)

interface EmailPayload {
  to: string
  subject: string
  html: string
}

/**
 * Sends an email using Resend
 * @param payload - Email configuration object
 * @returns Promise that resolves when email is sent
 */
export async function sendEmail(payload: EmailPayload) {
  const { to, subject, html } = payload

  try {
    const data = await resend.emails.send({
      from: `${process.env.NEXT_PUBLIC_APP_NAME} <noreply@productlaunch.com.br>`,
      to,
      subject,
      html,
    })

    console.log("Email sent successfully:", data)

    return { success: true, data }
  } catch (error) {
    console.error("Failed to send email:", error)
    throw new Error("Failed to send email")
  }
}
