/* eslint-disable react/no-unescaped-entities */
import Link from "next/link"

import { useTranslations } from "next-intl"
import { getTranslations } from "next-intl/server"

export async function generateMetadata() {
  const t = await getTranslations("terms")

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  }
}

export default function TermsOfServicePage() {
  const t = useTranslations("terms")

  return (
    <div className="bg-secondary/20 py-8 sm:py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="bg-background rounded-xl border p-6 shadow-sm sm:p-8 dark:border-zinc-800">
          <h1 className="mb-6 text-2xl font-bold sm:text-3xl">{t("title")}</h1>
          <p className="text-muted-foreground mb-6">
            {t("lastUpdated")}:{" "}
            {new Date().toLocaleDateString("pt-BR", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>

          <div className="space-y-6">
            <section>
              <h2 className="mb-3 text-xl font-semibold">{t("sections.introduction.title")}</h2>
              <p className="mb-3">{t("sections.introduction.paragraph1")}</p>
              <p className="mb-3">{t("sections.introduction.paragraph2")}</p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">{t("sections.usingService.title")}</h2>
              <p className="mb-3">
                <strong>{t("sections.usingService.ageRequirements.title")}</strong>{" "}
                {t("sections.usingService.ageRequirements.description")}
              </p>
              <p className="mb-3">
                <strong>{t("sections.usingService.accountResponsibility.title")}</strong>{" "}
                {t("sections.usingService.accountResponsibility.description")}
              </p>
              <p className="mb-3">
                <strong>{t("sections.usingService.acceptableUse.title")}</strong>{" "}
                {t("sections.usingService.acceptableUse.description")}
              </p>
              <ul className="mb-3 list-disc space-y-1 pl-6">
                <li>{t("sections.usingService.acceptableUse.items.illegalContent")}</li>
                <li>{t("sections.usingService.acceptableUse.items.misrepresentation")}</li>
                <li>{t("sections.usingService.acceptableUse.items.interference")}</li>
                <li>{t("sections.usingService.acceptableUse.items.dataCollection")}</li>
                <li>{t("sections.usingService.acceptableUse.items.unauthorizedCommercial")}</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">{t("sections.content.title")}</h2>
              <p className="mb-3">
                <strong>{t("sections.content.yourContent")}</strong>{" "}
                {t("sections.content.yourContentDescription")}
              </p>
              <p className="mb-3">
                <strong>{t("sections.content.responsibility")}</strong>{" "}
                {t("sections.content.responsibilityDescription")}
              </p>
              <p className="mb-3">
                <strong>{t("sections.content.ourRights")}</strong>{" "}
                {t("sections.content.ourRightsDescription")}
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">
                {t("sections.intellectualProperty.title")}
              </h2>
              <p className="mb-3">
                {t("sections.intellectualProperty.description1")}{" "}
                <a
                  href="https://github.com/drdruide/open-launch"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
                .
              </p>
              <p className="mb-3">{t("sections.intellectualProperty.description2")}</p>
              <ul className="mb-3 list-disc space-y-1 pl-6">
                <li>{t("sections.intellectualProperty.list.use")}</li>
                <li>{t("sections.intellectualProperty.list.distribute")}</li>
                <li>{t("sections.intellectualProperty.list.sublicense")}</li>
              </ul>
              <p className="mb-3">{t("sections.intellectualProperty.description3")}</p>
              <p className="mb-3">{t("sections.intellectualProperty.description4")}</p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">
                {t("sections.thirdPartyContent.title")}
              </h2>
              <p className="mb-3">{t("sections.thirdPartyContent.description1")}</p>
              <p className="mb-3">{t("sections.thirdPartyContent.description2")}</p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">{t("sections.termination.title")}</h2>
              <p className="mb-3">{t("sections.termination.description1")}</p>
              <p className="mb-3">{t("sections.termination.description2")}</p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">{t("sections.disclaimers.title")}</h2>
              <p className="mb-3">{t("sections.disclaimers.description1")}</p>
              <p className="mb-3">{t("sections.disclaimers.description2")}</p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">
                {t("sections.limitationOfLiability.title")}
              </h2>
              <p className="mb-3">{t("sections.limitationOfLiability.description")}</p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">{t("sections.changesToTerms.title")}</h2>
              <p className="mb-3">{t("sections.changesToTerms.description1")}</p>
              <p className="mb-3">{t("sections.changesToTerms.description2")}</p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">{t("sections.contactUs.title")}</h2>
              <p className="mb-3">{t("sections.contactUs.description1")}</p>
              <p className="mb-3">
                <a
                  href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`}
                  className="text-primary hover:underline"
                >
                  {process.env.NEXT_PUBLIC_CONTACT_EMAIL}
                </a>
              </p>
            </section>
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
