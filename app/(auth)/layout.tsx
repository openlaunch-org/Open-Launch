import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (session?.user) redirect("/dashboard")

  return <>{children}</>
}
