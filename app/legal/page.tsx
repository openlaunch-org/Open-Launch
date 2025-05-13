import Link from "next/link"

import { RiFilePaper2Line, RiShieldUserLine } from "@remixicon/react"
import { useTranslations } from "next-intl"
import { getTranslations } from "next-intl/server"

export async function generateMetadata() {
  const t = await getTranslations("legal")

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  }
}

export default function LegalPage() {
  const t = useTranslations("legal")

  return (
    <div className="bg-secondary/20 py-8 sm:py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="bg-background rounded-xl border p-6 shadow-sm sm:p-8 dark:border-zinc-800">
          <h1 className="mb-6 text-2xl font-bold sm:text-3xl">{t("title")}</h1>
          <p className="text-muted-foreground mb-8">{t("description")}</p>

          <div className="grid gap-6 md:grid-cols-2">
            <Link
              href="/legal/terms"
              className="hover:bg-secondary/10 flex flex-col items-center rounded-lg border p-6 text-center transition-colors dark:border-zinc-800"
            >
              <RiFilePaper2Line className="text-primary mb-4 h-12 w-12" />
              <h2 className="mb-2 text-lg font-semibold">{t("terms.title")}</h2>
              <p className="text-muted-foreground text-sm">{t("terms.description")}</p>
            </Link>

            <Link
              href="/legal/privacy"
              className="hover:bg-secondary/10 flex flex-col items-center rounded-lg border p-6 text-center transition-colors dark:border-zinc-800"
            >
              <RiShieldUserLine className="text-primary mb-4 h-12 w-12" />
              <h2 className="mb-2 text-lg font-semibold">{t("privacy.title")}</h2>
              <p className="text-muted-foreground text-sm">{t("privacy.description")}</p>
            </Link>
          </div>

          <div className="mt-10 border-t pt-6 dark:border-zinc-800">
            <h2 className="mb-4 text-xl font-semibold">{t("contact.title")}</h2>
            <p className="mb-2">{t("contact.description")}</p>
            <ul className="mb-6 space-y-2">
              <li>
                <strong>{t("contact.mail")}:</strong>{" "}
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
              {t("returnToHome")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
