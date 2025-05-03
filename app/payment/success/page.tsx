"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { RiCheckLine, RiLoader4Line } from "@remixicon/react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"

// Composant qui utilise useSearchParams
function PaymentSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [projectSlug, setProjectSlug] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(5)

  // Délai de redirection à 5 secondes
  const redirectDelay = 5000

  // Effet pour le compte à rebours
  useEffect(() => {
    let timer: NodeJS.Timeout

    if (projectSlug && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [projectSlug, countdown])

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        // Get session ID from URL parameters
        const sessionId = searchParams.get("session_id")

        if (!sessionId) {
          setError("Missing session identifier")
          setIsLoading(false)
          return
        }

        // Verify payment status using the session ID
        const response = await fetch(`/api/payment/verify?session_id=${sessionId}`)
        const data = await response.json()

        if (!response.ok) {
          setError(data.error || "Failed to verify payment")
          setIsLoading(false)
          return
        }

        if (data.status === "complete") {
          // Payment successful, store the project slug for redirection
          setIsLoading(false)
          setProjectSlug(data.projectSlug)

          // Redirect after a delay to show success message
          setTimeout(() => {
            router.push(`/projects/${data.projectSlug}`)
          }, redirectDelay)
        } else if (data.status === "pending") {
          setError("Votre paiement est en cours de traitement. Veuillez patienter un moment...")
          setIsLoading(false)
        } else {
          setError("Le paiement n'a pas pu être traité. Veuillez réessayer.")
          setIsLoading(false)
        }
      } catch (error) {
        console.error("Error checking payment status:", error)
        setError("An error occurred while verifying the payment")
        setIsLoading(false)
      }
    }

    checkPaymentStatus()
  }, [router, searchParams, redirectDelay])

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-card rounded-lg border p-8 text-center shadow-md">
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center">
                <RiLoader4Line className="text-primary/70 h-12 w-12 animate-spin" />
              </div>
              <h1 className="mb-3 text-2xl font-bold">Processing Payment</h1>
              <p className="text-muted-foreground mb-6">
                We&apos;re confirming your payment with our payment provider. This should only take
                a moment...
              </p>
              <div className="bg-muted/30 mx-auto h-1 w-full max-w-xs overflow-hidden rounded-full">
                <motion.div
                  className="bg-primary/40 h-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </motion.div>
          ) : projectSlug ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-green-200 bg-green-50">
                  <RiCheckLine className="h-6 w-6 text-green-500" />
                </div>
              </div>

              <h1 className="mb-3 text-2xl font-bold">Payment Successful</h1>

              <p className="text-muted-foreground mb-8">
                Your premium project launch has been successfully scheduled and will be featured on
                our platform on the selected date.
              </p>

              <div className="flex flex-col items-center">
                <div className="border-muted mb-3 flex h-8 w-8 items-center justify-center rounded-full border">
                  <span className="text-sm font-medium">{countdown}</span>
                </div>
                <p className="text-muted-foreground text-sm">Redirecting to your project page...</p>
              </div>
            </motion.div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-red-200 bg-red-50">
                  <span className="text-xl font-medium text-red-500">!</span>
                </div>
              </div>

              <h1 className="mb-3 text-2xl font-bold">Issue Detected</h1>
              <p className="text-muted-foreground mb-6">{error}</p>

              <Button onClick={() => router.push("/")} variant="outline" size="lg">
                Back to Home
              </Button>
            </motion.div>
          ) : null}
        </div>
      </motion.div>
    </div>
  )
}

// Fallback pour le Suspense
function PaymentSuccessLoading() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-lg border p-8 text-center shadow-md">
          <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center">
            <RiLoader4Line className="text-primary/70 h-12 w-12 animate-spin" />
          </div>
          <h1 className="mb-3 text-2xl font-bold">Loading...</h1>
          <p className="text-muted-foreground mb-6">
            Please wait while we prepare your payment information...
          </p>
        </div>
      </div>
    </div>
  )
}

// Composant principal avec Suspense
export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<PaymentSuccessLoading />}>
      <PaymentSuccessContent />
    </Suspense>
  )
}
