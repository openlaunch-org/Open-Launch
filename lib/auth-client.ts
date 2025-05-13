import { stripeClient } from "@better-auth/stripe/client"
import { adminClient, oneTapClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

export const {
  signIn,
  signUp,
  useSession,
  signOut,
  getSession,
  updateUser,
  changePassword,
  forgetPassword,
  resetPassword,
  oneTap,
  admin,
} = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL!,
  trustedOrigins: [
    process.env.NODE_ENV !== "development"
      ? "https://www.productlaunch.com"
      : "http://localhost:3000",
  ],
  plugins: [
    stripeClient({
      subscription: true, //if you want to enable subscription management
    }),
    oneTapClient({
      clientId: process.env.NEXT_PUBLIC_ONE_TAP_CLIENT_ID!,
      promptOptions: {
        maxAttempts: 1,
      },
    }),
    adminClient(),
  ],
})
