"use client"

import { useState } from "react"
import Link from "next/link"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { forgetPassword } from "@/lib/auth-client"
import { ForgotPasswordFormData, forgotPasswordSchema } from "@/lib/validations/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { TurnstileCaptcha } from "./turnstile-captcha"

export function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState("")
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const handleForgotPassword = async (data: ForgotPasswordFormData) => {
    if (!turnstileToken) {
      setError("Please complete the security verification")
      return
    }

    try {
      setLoading(true)
      setError(null)
      setSubmittedEmail(data.email)

      await forgetPassword({
        email: data.email,
        redirectTo: "/reset-password",
        fetchOptions: {
          headers: {
            "x-captcha-response": turnstileToken,
          },
        },
      })

      setSuccess(true)
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred")
      setSuccess(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4 px-4 sm:px-0">
      <Card className="w-full rounded-md shadow-none">
        <CardHeader className="flex flex-col items-center gap-2 px-4 sm:px-6">
          <CardTitle className="text-center text-xl sm:text-2xl">Forgot your password?</CardTitle>
          <CardDescription className="text-center">
            Enter your email to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 pb-6 sm:px-6">
          <form onSubmit={handleSubmit(handleForgotPassword)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="m@example.com"
                className="w-full"
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <TurnstileCaptcha onVerify={(token) => setTurnstileToken(token)} />

            {error && <p className="text-center text-sm text-red-500">{error}</p>}

            {success && (
              <div className="text-center text-sm">
                <p className="text-muted-foreground">
                  If an account exists for {submittedEmail}, you will receive a password reset email
                  shortly.
                </p>
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading || !turnstileToken}>
              {loading ? "Sending..." : "Send reset link"}
            </Button>
            <div className="text-muted-foreground text-center text-sm">
              Remember your password?{" "}
              <Link href="/sign-in" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground [&_a]:hover:text-primary px-4 text-center text-xs text-balance [&_a]:underline [&_a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a> and{" "}
        <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
