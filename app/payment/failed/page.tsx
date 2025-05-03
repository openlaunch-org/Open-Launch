"use client"

import { useRouter } from "next/navigation"

import { RiAlertLine, RiArrowLeftLine } from "@remixicon/react"

import { Button } from "@/components/ui/button"

export default function PaymentFailedPage() {
  const router = useRouter()

  return (
    <div className="container mx-auto max-w-md px-4 py-12">
      <div className="bg-card rounded-lg border p-6 text-center shadow-sm">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <RiAlertLine className="h-8 w-8 text-red-500" />
        </div>
        <h1 className="mb-2 text-2xl font-bold">Payment Failed</h1>
        <p className="text-muted-foreground mb-6">
          Your payment could not be processed. Please try again later or contact support if the
          issue persists.
        </p>
        <Button onClick={() => router.push("/")} className="flex items-center gap-2">
          <RiArrowLeftLine className="h-4 w-4" />
          Back to Home
        </Button>
      </div>
    </div>
  )
}
