"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { zodResolver } from "@hookform/resolvers/zod"
import { RiGithubFill, RiGoogleFill } from "@remixicon/react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { oneTap, signIn, signUp } from "@/lib/auth-client"
import { SignUpFormData, signUpSchema } from "@/lib/validations/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { TurnstileCaptcha } from "./turnstile-captcha"

export function SignUpForm() {
  const router = useRouter()
  const [loadingButtons, setLoadingButtons] = useState({
    google: false,
    email: false,
    github: false,
  })
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const t = useTranslations("auth")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
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

  const handleSignUp = async (data: SignUpFormData) => {
    if (!turnstileToken) {
      setGeneralError("Please complete the security verification")
      return
    }

    const options = {
      name: data.name,
      email: data.email,
      password: data.password,
      callbackURL: "/verify-email/success",
      fetchOptions: {
        headers: {
          "x-captcha-response": turnstileToken,
        },
      },
    }

    try {
      setLoadingButtons((prevState) => ({ ...prevState, email: true }))
      setGeneralError(null)

      await signUp.email(options)
      router.push("/verify-email/sent")
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
          <CardTitle className="text-center text-xl sm:text-2xl">{t("createAccount")}</CardTitle>
          <CardDescription className="text-center">{t("signUpToGetStarted")}</CardDescription>
        </CardHeader>
        <CardContent className="px-4 pb-6 sm:px-6">
          <form onSubmit={handleSubmit(handleSignUp)} className="flex flex-col gap-4">
            <Button
              className="w-full cursor-pointer"
              variant="outline"
              type="button"
              onClick={() => handleLogin("google")}
              disabled={loadingButtons.google}
            >
              <RiGoogleFill className="me-1" size={16} aria-hidden="true" />
              {loadingButtons.google ? t("loading") : t("loginWithGoogle")}
            </Button>
            <Button
              className="w-full cursor-pointer"
              variant="outline"
              type="button"
              onClick={() => handleLogin("github")}
              disabled={loadingButtons.github}
            >
              <RiGithubFill className="me-1" size={16} aria-hidden="true" />
              {loadingButtons.github ? t("loading") : t("loginWithGitHub")}
            </Button>
            <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
              <span className="bg-background text-muted-foreground relative z-10 px-2">
                {t("orContinueWith")}
              </span>
            </div>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">{t("fullName")}</Label>
                <Input id="name" {...register("name")} placeholder="John Doe" className="w-full" />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
              </div>
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
                <Label htmlFor="password">{t("password")}</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  placeholder={t("min8Characters")}
                  className="w-full"
                />
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
                {loadingButtons.email ? t("creatingAccount") : t("createAccount")}
              </Button>
              <div className="text-muted-foreground text-center text-sm">
                {t("alreadyHaveAccount")}{" "}
                <Link href="/sign-in" className="text-primary hover:underline">
                  {t("signIn")}
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground [&_a]:hover:text-primary px-4 text-center text-xs text-balance [&_a]:underline [&_a]:underline-offset-4">
        {t("agreeToTerms")} <Link href="/legal/terms">{t("termsOfService")}</Link> {t("and")}{" "}
        <Link href="/legal/privacy">{t("privacyPolicy")}</Link>.
      </div>
    </div>
  )
}
