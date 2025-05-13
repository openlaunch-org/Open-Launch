import Link from "next/link"

import { RiMailSendLine } from "@remixicon/react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function VerifyEmailSent() {
  const t = useTranslations("verifyEmail")

  return (
    <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-sm items-center justify-center">
      <Card className="w-full">
        <CardHeader className="flex flex-col items-center gap-2 pb-2">
          <RiMailSendLine className="text-muted-foreground h-12 w-12" />
          <CardTitle className="font-heading text-2xl">{t("title")}</CardTitle>
          <CardDescription className="text-center">{t("description")}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-muted-foreground text-center text-sm">{t("expireMessage")}</p>
          <div className="flex flex-col gap-2">
            <Button asChild variant="outline">
              <Link href="/sign-in">{t("backToSignIn")}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
