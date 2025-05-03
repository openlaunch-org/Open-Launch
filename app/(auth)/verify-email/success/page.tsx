import Link from "next/link"

import { CircleCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function VerifyEmailSuccess() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-sm items-center justify-center">
      <Card className="w-full">
        <CardHeader className="flex flex-col items-center gap-2 pb-2">
          <CircleCheck className="h-12 w-12 text-green-600" />
          <CardTitle className="font-heading text-2xl">Email Verified</CardTitle>
          <CardDescription className="text-center">
            Your email has been successfully verified. You can now sign in to your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href="/sign-in">Continue to Sign in</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
