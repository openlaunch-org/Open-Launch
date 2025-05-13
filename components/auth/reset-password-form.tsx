"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { resetPassword } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { Input } from "../ui/input"
import { Label } from "../ui/label"

type ResetPasswordFormData = { password: string; confirmPassword: string }

export function ResetPasswordForm() {
  const [loading, setLoading] = useState(false)
  const [generalError, setGeneralError] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const router = useRouter()
  const t = useTranslations("auth")

  const resetPasswordSchema = z
    .object({
      password: z
        .string()
        .min(8, t("passwordRule"))
        .regex(/[A-Z]/, t("passwordUppercaseRule"))
        .regex(/[a-z]/, t("passwordLowercaseRule"))
        .regex(/[0-9]/, t("passwordNumberRule")),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("passwordsDontMatch"),
      path: ["confirmPassword"],
    })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  })

  useEffect(() => {
    // Récupérer le token depuis l'URL
    const searchParams = new URLSearchParams(window.location.search)
    const tokenFromUrl = searchParams.get("token")
    if (!tokenFromUrl) {
      setGeneralError(t("missingToken"))
      return
    }
    setToken(tokenFromUrl)
  }, [])

  const handleResetPassword = async (data: ResetPasswordFormData) => {
    if (!token) {
      setGeneralError(t("missingToken"))
      return
    }

    setLoading(true)
    setGeneralError(null)

    try {
      await resetPassword({
        newPassword: data.password,
        token,
      })
      router.push("/sign-in?message=" + encodeURIComponent(t("resetPasswordSuccess")))
    } catch {
      setGeneralError(t("resetPasswordError"))
    }

    setLoading(false)
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4 px-4 sm:px-0">
      <Card className="w-full rounded-md shadow-none">
        <CardHeader className="flex flex-col items-center gap-2 px-4 sm:px-6">
          <CardTitle className="text-center text-xl sm:text-2xl">{t("resetPassword")}</CardTitle>
          <CardDescription className="text-center">{t("enterPasswordBelow")}</CardDescription>
        </CardHeader>
        <CardContent className="px-4 pb-6 sm:px-6">
          <form onSubmit={handleSubmit(handleResetPassword)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">{t("newPassword")}</Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                placeholder="Min. 8 characters"
                className="w-full"
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t("confirmNewPassword")}</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
                placeholder={t("confirmNewPasswordPlaceholder")}
                className="w-full"
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>
            {generalError && <p className="text-center text-sm text-red-500">{generalError}</p>}
            <Button type="submit" className="w-full" disabled={loading || !token}>
              {loading ? t("resettingPassword") : t("resetPassword")}
            </Button>
            <div className="text-muted-foreground text-center text-sm">
              {t("rememberPassword")}{" "}
              <Link href="/sign-in" className="text-primary hover:underline">
                {t("signIn")}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground [&_a]:hover:text-primary px-4 text-center text-xs text-balance [&_a]:underline [&_a]:underline-offset-4">
        {t("agreeToTerms")} <a href="#">{t("termsOfService")}</a> {t("and")}{" "}
        <a href="#">{t("privacyPolicy")}</a>.
      </div>
    </div>
  )
}
