import Link from "next/link"

import { CircleCheck } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function VerifyEmailSuccess() {
  const t = useTranslations("verifyEmailSuccess")

  return (
    <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-sm items-center justify-center">
      <Card className="w-full">
        <CardHeader className="flex flex-col items-center gap-2 pb-2">
          <CircleCheck className="h-12 w-12 text-green-600" />
          <CardTitle className="font-heading text-2xl">{t("title")}</CardTitle>
          <CardDescription className="text-center">{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href="/sign-in">{t("continueToSignIn")}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
