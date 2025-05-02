"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RiCheckLine, RiLoader4Line } from "@remixicon/react";
import { motion } from "framer-motion";

// Composant qui utilise useSearchParams
function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projectSlug, setProjectSlug] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(5);

  // Délai de redirection à 5 secondes
  const redirectDelay = 5000;

  // Effet pour le compte à rebours
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (projectSlug && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [projectSlug, countdown]);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        // Get session ID from URL parameters
        const sessionId = searchParams.get("session_id");

        if (!sessionId) {
          setError("Missing session identifier");
          setIsLoading(false);
          return;
        }

        // Verify payment status using the session ID
        const response = await fetch(
          `/api/payment/verify?session_id=${sessionId}`
        );
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Failed to verify payment");
          setIsLoading(false);
          return;
        }

        if (data.status === "complete") {
          // Payment successful, store the project slug for redirection
          setIsLoading(false);
          setProjectSlug(data.projectSlug);

          // Redirect after a delay to show success message
          setTimeout(() => {
            router.push(`/projects/${data.projectSlug}`);
          }, redirectDelay);
        } else if (data.status === "pending") {
          setError(
            "Votre paiement est en cours de traitement. Veuillez patienter un moment..."
          );
          setIsLoading(false);
        } else {
          setError("Le paiement n'a pas pu être traité. Veuillez réessayer.");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
        setError("An error occurred while verifying the payment");
        setIsLoading(false);
      }
    };

    checkPaymentStatus();
  }, [router, searchParams, redirectDelay]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-card border rounded-lg shadow-md p-8 text-center">
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-12 h-12 mx-auto mb-6 flex items-center justify-center">
                <RiLoader4Line className="h-12 w-12 text-primary/70 animate-spin" />
              </div>
              <h1 className="text-2xl font-bold mb-3">Processing Payment</h1>
              <p className="text-muted-foreground mb-6">
                We&apos;re confirming your payment with our payment provider.
                This should only take a moment...
              </p>
              <div className="w-full max-w-xs mx-auto bg-muted/30 h-1 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary/40"
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
              <div className="w-12 h-12 mx-auto mb-6 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
                  <RiCheckLine className="h-6 w-6 text-green-500" />
                </div>
              </div>

              <h1 className="text-2xl font-bold mb-3">Payment Successful</h1>

              <p className="text-muted-foreground mb-8">
                Your premium project launch has been successfully scheduled and
                will be featured on our platform on the selected date.
              </p>

              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full border border-muted flex items-center justify-center mb-3">
                  <span className="font-medium text-sm">{countdown}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Redirecting to your project page...
                </p>
              </div>
            </motion.div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-12 h-12 mx-auto mb-6 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-red-50 border border-red-200 flex items-center justify-center">
                  <span className="text-red-500 text-xl font-medium">!</span>
                </div>
              </div>

              <h1 className="text-2xl font-bold mb-3">Issue Detected</h1>
              <p className="text-muted-foreground mb-6">{error}</p>

              <Button
                onClick={() => router.push("/")}
                variant="outline"
                size="lg"
              >
                Back to Home
              </Button>
            </motion.div>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
}

// Fallback pour le Suspense
function PaymentSuccessLoading() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-card border rounded-lg shadow-md p-8 text-center">
          <div className="w-12 h-12 mx-auto mb-6 flex items-center justify-center">
            <RiLoader4Line className="h-12 w-12 text-primary/70 animate-spin" />
          </div>
          <h1 className="text-2xl font-bold mb-3">Loading...</h1>
          <p className="text-muted-foreground mb-6">
            Please wait while we prepare your payment information...
          </p>
        </div>
      </div>
    </div>
  );
}

// Composant principal avec Suspense
export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<PaymentSuccessLoading />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
