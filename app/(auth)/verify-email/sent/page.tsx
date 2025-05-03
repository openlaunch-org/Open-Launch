import Link from "next/link"

import { RiMailSendLine } from "@remixicon/react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function VerifyEmailSent() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-sm items-center justify-center">
      <Card className="w-full">
        <CardHeader className="flex flex-col items-center gap-2 pb-2">
          <RiMailSendLine className="text-muted-foreground h-12 w-12" />
          <CardTitle className="font-heading text-2xl">Check your email</CardTitle>
          <CardDescription className="text-center">
            We&apos;ve sent you a verification link to your email address. Please check your inbox
            and spam folder.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-muted-foreground text-center text-sm">
            The verification link will expire in 24 hours. If you don&apos;t see the email, you can
            request a new one.
          </p>
          <div className="flex flex-col gap-2">
            <Button asChild variant="outline">
              <Link href="/sign-in">Back to Sign in</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
