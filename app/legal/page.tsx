import Link from "next/link"

import { RiFilePaper2Line, RiShieldUserLine } from "@remixicon/react"

export const metadata = {
  title: "Legal Information - " + process.env.NEXT_PUBLIC_APP_NAME,
  description: "Legal information and policies for Open-Launch platform",
}

export default function LegalPage() {
  return (
    <div className="bg-secondary/20 py-8 sm:py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="bg-background rounded-xl border p-6 shadow-sm sm:p-8 dark:border-zinc-800">
          <h1 className="mb-6 text-2xl font-bold sm:text-3xl">Legal Information</h1>
          <p className="text-muted-foreground mb-8">
            At Open Launch, we are committed to transparency and protecting your rights. As an open
            source project, we believe in openness and community collaboration. Please review our
            legal documents to understand how we operate and protect your information.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            <Link
              href="/legal/terms"
              className="hover:bg-secondary/10 flex flex-col items-center rounded-lg border p-6 text-center transition-colors dark:border-zinc-800"
            >
              <RiFilePaper2Line className="text-primary mb-4 h-12 w-12" />
              <h2 className="mb-2 text-lg font-semibold">Terms of Service</h2>
              <p className="text-muted-foreground text-sm">
                The rules and guidelines for using our platform and services.
              </p>
            </Link>

            <Link
              href="/legal/privacy"
              className="hover:bg-secondary/10 flex flex-col items-center rounded-lg border p-6 text-center transition-colors dark:border-zinc-800"
            >
              <RiShieldUserLine className="text-primary mb-4 h-12 w-12" />
              <h2 className="mb-2 text-lg font-semibold">Privacy Policy</h2>
              <p className="text-muted-foreground text-sm">
                How we collect, use, and protect your personal information.
              </p>
            </Link>
          </div>

          <div className="mt-10 border-t pt-6 dark:border-zinc-800">
            <h2 className="mb-4 text-xl font-semibold">Contact Information</h2>
            <p className="mb-2">
              If you have any questions about our legal policies, please contact us:
            </p>
            <ul className="mb-6 space-y-2">
              <li>
                <strong>Mail:</strong>{" "}
                <a
                  href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`}
                  className="text-primary hover:underline"
                >
                  {process.env.NEXT_PUBLIC_CONTACT_EMAIL}
                </a>
              </li>
            </ul>
          </div>

          <div className="mt-8 border-t pt-6 dark:border-zinc-800">
            <Link href="/" className="text-primary hover:underline">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
