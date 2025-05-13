"use client"

import { useRouter } from "next/navigation"

import { RiAddCircleFill } from "@remixicon/react"
import { useTranslations } from "next-intl"

import { Button } from "../ui/button"

export function WelcomeBanner() {
  const t = useTranslations("banner")
  const router = useRouter()

  return (
    <div className="dark:bg-secondary/20 rounded-md border border-zinc-100 bg-white/70 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)] dark:border-zinc-800/50">
      <div className="flex items-start justify-between md:items-center">
        <div className="flex items-start gap-4 md:items-center">
          <div>
            <h2 className="text-foreground mb-1 text-lg font-semibold">{t("welcome")}</h2>
            <p className="text-muted-foreground mb-3 max-w-xl text-sm">{t("description")}</p>
            <Button onClick={() => router.push("/projects/submit")} variant="outline">
              {t("submitProject")}
              <RiAddCircleFill className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
