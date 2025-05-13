import Link from "next/link"

import { useMessages, useTranslations } from "next-intl"
import { getTranslations } from "next-intl/server"

export async function generateMetadata() {
  const t = await getTranslations("privacyPolicy")

  return {
    title: t("metaTitle", { appName: process.env.NEXT_PUBLIC_APP_NAME! }),
    description: t("metaDescription", { appName: process.env.NEXT_PUBLIC_APP_NAME! }),
  }
}

export default function PrivacyPolicyPage() {
  const t = useTranslations("privacyPolicy")
  const { privacyPolicy: messages } = useMessages()

  return (
    <div className="bg-secondary/20 py-8 sm:py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="bg-background rounded-xl border p-6 shadow-sm sm:p-8 dark:border-zinc-800">
          <h1 className="mb-6 text-2xl font-bold sm:text-3xl">{t("title")}</h1>
          <p className="text-muted-foreground mb-6">
            {t("lastUpdated", {
              date: new Date().toLocaleDateString("pt-BR", {
                month: "long",
                day: "numeric",
                year: "numeric",
              }),
            })}
          </p>

          <div className="space-y-6">
            <section>
              <h2 className="mb-3 text-xl font-semibold">{t("sections.introduction.title")}</h2>
              <p className="mb-3">{t("sections.introduction.content")}</p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">
                {t("sections.informationWeCollect.title")}
              </h2>
              {["provided", "collected"].map((section) => (
                <div key={section}>
                  <p className="mb-3">
                    <strong>{t(`sections.informationWeCollect.${section}`)}</strong>
                  </p>
                  <ul className="mb-3 list-disc space-y-1 pl-6">
                    {Object.keys(messages.sections.informationWeCollect[`${section}List`]).map(
                      (key) => (
                        <li key={key}>
                          {t(`sections.informationWeCollect.${section}List.${key}`)}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              ))}
            </section>

            {[
              "howWeUse",
              "sharing",
              "rights",
              "security",
              "retention",
              "children",
              "changes",
              "contact",
              "openSource",
            ].map((section, index) => (
              <section key={index}>
                <h2 className="mb-3 text-xl font-semibold">{t(`sections.${section}.title`)}</h2>
                <p className="mb-3">
                  {t(`sections.${section}.content`, {
                    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL!,
                  })}
                </p>
                {messages.sections[section].list && (
                  <ul className="mb-3 list-disc space-y-1 pl-6">
                    {Object.keys(messages.sections[section].list).map((key) => (
                      <li key={key}>{t(`sections.${section}.list.${key}`)}</li>
                    ))}
                  </ul>
                )}
                {messages.sections[section].feedback && (
                  <p className="mb-3">
                    {t(`sections.${section}.feedback`, {
                      email: process.env.NEXT_PUBLIC_CONTACT_EMAIL!,
                    })}
                  </p>
                )}
              </section>
            ))}
          </div>

          <div className="mt-8 border-t pt-6 dark:border-zinc-800">
            <Link href="/" className="text-primary hover:underline">
              {t("sections.returnToHome")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
