import * as z from "zod"

type TranslateFunction = (msg: string) => string
export type SignInFormData = { email: string; password: string }
export type SignUpFormData = { name: string } & SignInFormData
export type ForgotPasswordFormData = { email: string }

export const signInSchema = (t: TranslateFunction) =>
  z.object({
    email: z.string().email(t("emailRule")),
    password: z.string().min(8, t("passwordRule")),
  })

export const signUpSchema = (t: TranslateFunction) =>
  z.object({
    name: z.string().min(2, t("nameRule")),
    email: z.string().email(t("emailRule")),
    password: z
      .string()
      .min(8, t("passwordRule"))
      .regex(/[A-Z]/, t("passwordUppercaseRule"))
      .regex(/[a-z]/, t("passwordLowercaseRule"))
      .regex(/[0-9]/, t("passwordNumberRule")),
  })

export const forgotPasswordSchema = (t: TranslateFunction) =>
  z.object({
    email: z.string().email(t("emailRule")),
  })
