import Link from "next/link"

import { RiCheckboxCircleFill } from "@remixicon/react"
import { useMessages, useTranslations } from "next-intl"
import { getTranslations } from "next-intl/server"

import { LAUNCH_LIMITS, LAUNCH_SETTINGS } from "@/lib/constants"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"

export async function generateMetadata() {
  const t = await getTranslations("pricing")

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  }
}

export default function PricingPage() {
  const t = useTranslations("pricing")
  const messages = useMessages()

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="mb-3 text-2xl font-bold sm:text-3xl">{t("title")}</h1>
        <p className="text-muted-foreground mx-auto max-w-2xl text-sm">{t("description")}</p>
      </div>

      {/* First row: Free and Premium */}
      <div className="mx-auto mb-4">
        <div className="grid grid-cols-1 overflow-hidden rounded-lg border md:grid-cols-10">
          {/* Free Launch Option */}
          <div className="flex h-full flex-col p-5 md:col-span-4">
            <div className="flex-grow">
              <h5 className="mb-2 text-base font-medium">{t("freeLaunch.title")}</h5>
              <div className="mb-2 text-2xl font-bold">{t("freeLaunch.price")}</div>
              <p className="text-muted-foreground mb-3 text-xs">
                {t("freeLaunch.description", { days: LAUNCH_SETTINGS.MAX_DAYS_AHEAD })}
              </p>
              <ul className="mb-5 space-y-2 text-sm">
                {Object.keys(messages.pricing.freeLaunch.features).map((key) => (
                  <li key={key} className="flex items-center gap-2">
                    <RiCheckboxCircleFill className="text-muted-foreground h-4 w-4" />
                    <span>
                      {t(`freeLaunch.features.${key}`, { slots: LAUNCH_LIMITS.FREE_DAILY_LIMIT })}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-auto pt-3">
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/projects/submit">{t("freeLaunch.button")}</Link>
              </Button>
            </div>
          </div>

          {/* Premium Launch Option */}
          <div className="bg-muted/5 border-t p-5 md:col-span-6 md:border-t-0 md:border-l">
            <div className="flex h-full flex-col">
              <div className="flex-grow">
                <h5 className="mb-2 text-base font-medium">{t("premiumLaunch.title")}</h5>
                <div className="mb-2 text-2xl font-bold">
                  {t("premiumLaunch.price", { price: LAUNCH_SETTINGS.PREMIUM_PRICE })}
                </div>
                <p className="text-muted-foreground mb-3 text-xs">
                  {t("premiumLaunch.description")}
                </p>
                <ul className="mb-5 space-y-2 text-sm">
                  {Object.keys(messages.pricing.premiumLaunch.features).map((key) => (
                    <li key={key} className="flex items-center gap-2">
                      <RiCheckboxCircleFill className="text-primary h-4 w-4" />
                      <span>
                        {t(`premiumLaunch.features.${key}`, {
                          slots: LAUNCH_LIMITS.PREMIUM_DAILY_LIMIT,
                        })}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-auto pt-3">
                <Button size="sm" className="w-full" asChild>
                  <Link href="/projects/submit">{t("premiumLaunch.button")}</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Second row: Premium Plus */}
      <div className="mx-auto mb-12 max-w-3xl">
        <div className="rounded-lg border p-5">
          <div className="flex flex-col md:flex-row">
            <div className="mb-6 flex flex-col md:mb-0 md:w-2/5 md:border-r md:pr-6">
              <div className="flex-grow">
                <h5 className="mb-1 text-lg font-semibold">{t("premiumPlusLaunch.title")}</h5>
                <div className="mb-4 flex flex-col gap-1">
                  <div className="flex items-baseline text-3xl font-bold">
                    {t("premiumPlusLaunch.price", { price: LAUNCH_SETTINGS.PREMIUM_PLUS_PRICE })}
                    <span className="text-muted-foreground ml-2 text-base font-normal line-through">
                      {t("premiumPlusLaunch.discountedPrice", { discountedPrice: 50 })}
                    </span>
                  </div>
                  <span className="bg-primary/10 text-primary w-fit rounded-full px-2 py-0.5 text-xs font-medium">
                    {t("premiumPlusLaunch.discountCode", { code: "PRODUCTBUILDER" })}
                  </span>
                </div>
                <p className="text-muted-foreground mb-6 text-xs">
                  {t("premiumPlusLaunch.description")}
                </p>
              </div>
              <div className="mt-auto">
                <Button size="sm" className="w-full" variant="default" asChild>
                  <Link href="/projects/submit">{t("premiumPlusLaunch.button")}</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-3/5 md:pl-6">
              <h6 className="mb-3 text-sm font-semibold">{t("faq.title")}</h6>
              <div className="space-y-1">
                {Object.keys(messages.pricing.premiumPlusLaunch.features).map((key) => (
                  <div key={key} className="rounded border p-2">
                    <div className="flex items-start gap-2">
                      <RiCheckboxCircleFill className="text-primary mt-0.5 h-4 w-4" />
                      <div>
                        <p className="text-sm font-medium">
                          {
                            t(`premiumPlusLaunch.features.${key}`, {
                              slots: LAUNCH_LIMITS.PREMIUM_PLUS_DAILY_LIMIT,
                            }).split(":")[0]
                          }
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {
                            t(`premiumPlusLaunch.features.${key}`, {
                              slots: LAUNCH_LIMITS.PREMIUM_PLUS_DAILY_LIMIT,
                            }).split(":")[1]
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl">
        <h2 className="mb-4 text-xl font-bold sm:text-2xl">{t("faq.title")}</h2>
        <Accordion type="single" collapsible className="w-full -space-y-px" defaultValue="1">
          {Object.keys(messages.pricing.faq.items).map((key) => (
            <AccordionItem
              value={key}
              key={key}
              className="bg-background has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative border px-4 py-1 outline-none first:rounded-t-md last:rounded-b-md last:border-b has-focus-visible:z-10 has-focus-visible:ring-[3px]"
            >
              <AccordionTrigger className="py-2 text-[15px] leading-6 hover:no-underline focus-visible:ring-0">
                {t(`faq.items.${key}.title`)}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-2">
                {t(`faq.items.${key}.content`, {
                  free: LAUNCH_LIMITS.FREE_DAILY_LIMIT,
                  premium: LAUNCH_LIMITS.PREMIUM_DAILY_LIMIT,
                  premiumPlus: LAUNCH_LIMITS.PREMIUM_PLUS_DAILY_LIMIT,
                  freeDays: LAUNCH_SETTINGS.MAX_DAYS_AHEAD,
                  premiumDays: LAUNCH_SETTINGS.PREMIUM_MAX_DAYS_AHEAD,
                  premiumPlusDays: LAUNCH_SETTINGS.PREMIUM_PLUS_MAX_DAYS_AHEAD,
                })}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}
