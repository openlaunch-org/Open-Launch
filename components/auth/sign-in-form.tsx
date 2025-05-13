"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { zodResolver } from "@hookform/resolvers/zod"
import { RiGithubFill, RiGoogleFill } from "@remixicon/react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { oneTap, signIn } from "@/lib/auth-client"
import { SignInFormData, signInSchema } from "@/lib/validations/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { TurnstileCaptcha } from "./turnstile-captcha"

export function SignInForm() {
  const router = useRouter()
  const t = useTranslations("auth")

  const [loadingButtons, setLoadingButtons] = useState({
    google: false,
    email: false,
    github: false,
  })
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema(t)),
  })

  const [generalError, setGeneralError] = useState<string | null>(null)

  const handleLogin = async (provider: string) => {
    setLoadingButtons((prevState) => ({ ...prevState, [provider]: true }))
    try {
      await signIn.social({
        provider: provider as "google" | "github",
        callbackURL: "/dashboard",
      })
    } catch (error) {
      setGeneralError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setLoadingButtons((prevState) => ({ ...prevState, [provider]: false }))
    }
  }

  const handleLoginEmail = async (data: SignInFormData) => {
    if (!turnstileToken) {
      setGeneralError("Please complete the security verification")
      return
    }

    const options = {
      email: data.email,
      password: data.password,
      callbackURL: "/dashboard",
      fetchOptions: {
        headers: {
          "x-captcha-response": turnstileToken,
        },
      },
    }

    try {
      setLoadingButtons((prevState) => ({ ...prevState, email: true }))
      setGeneralError(null)

      const result = await signIn.email(options)
      if (result?.error?.message) {
        setGeneralError(result.error.message)
        return
      }
      router.push("/dashboard")
    } catch (error) {
      setGeneralError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setLoadingButtons((prevState) => ({ ...prevState, email: false }))
    }
  }

  useEffect(() => {
    oneTap({
      fetchOptions: {
        onError: ({ error }) => {
          toast.error(error.message || "An error occurred")
        },
        onSuccess: () => {
          toast.success("Successfully signed in")
          window.location.href = "/dashboard"
        },
      },
    })
  }, [])

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4 px-4 sm:px-0">
      <Card className="w-full rounded-md shadow-none">
        <CardHeader className="flex flex-col items-center gap-2 px-4 sm:px-6">
          <CardTitle className="text-center text-xl sm:text-2xl">{t("welcomeBack")}</CardTitle>
          <CardDescription className="text-center">{t("signInToContinue")}</CardDescription>
        </CardHeader>
        <CardContent className="px-4 pb-6 sm:px-6">
          <form onSubmit={handleSubmit(handleLoginEmail)} className="flex flex-col gap-4">
            <Button
              className="w-full cursor-pointer"
              variant="outline"
              type="button"
              onClick={() => handleLogin("google")}
              disabled={loadingButtons.google}
            >
              <RiGoogleFill className="me-1" size={16} aria-hidden="true" />
              {loadingButtons.google ? t("loggingIn") : t("loginWithGoogle")}
            </Button>
            <Button
              className="w-full cursor-pointer"
              variant="outline"
              type="button"
              onClick={() => handleLogin("github")}
              disabled={loadingButtons.github}
            >
              <RiGithubFill className="me-1" size={16} aria-hidden="true" />
              {loadingButtons.github ? t("loggingIn") : t("loginWithGitHub")}
            </Button>

            <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
              <span className="bg-background text-muted-foreground relative z-10 px-2">
                {t("orContinueWith")}
              </span>
            </div>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">{t("email")}</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="m@example.com"
                  className="w-full"
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
              </div>
              <div className="grid gap-2">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <Label htmlFor="password">{t("password")}</Label>
                  <Link
                    href="/forgot-password"
                    className="text-xs underline-offset-4 hover:underline"
                  >
                    {t("forgotPassword")}
                  </Link>
                </div>
                <Input id="password" type="password" {...register("password")} className="w-full" />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>

              <TurnstileCaptcha onVerify={(token) => setTurnstileToken(token)} />

              {generalError && <p className="text-center text-sm text-red-500">{generalError}</p>}
              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={loadingButtons.email || !turnstileToken}
              >
                {loadingButtons.email ? t("loggingIn") : t("login")}
              </Button>
            </div>

            <div className="text-muted-foreground text-center text-sm">
              {t("dontHaveAccount")}{" "}
              <Link href="/sign-up" className="text-primary underline-offset-4 hover:underline">
                {t("signUp")}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground [&_a]:hover:text-primary px-4 text-center text-xs text-balance [&_a]:underline [&_a]:underline-offset-4">
        {t("agreeToTerms")} <Link href="/legal/terms">{t("termsOfService")}</Link>{" "}
        {t("privacyPolicy")} <Link href="/legal/privacy">{t("privacyPolicy")}</Link>.
      </div>
    </div>
  )
}
