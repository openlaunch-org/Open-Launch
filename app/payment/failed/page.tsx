"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RiAlertLine, RiArrowLeftLine } from "@remixicon/react";

export default function PaymentFailedPage() {
  const router = useRouter();

  return (
    <div className="container max-w-md mx-auto py-12 px-4">
      <div className="bg-card border rounded-lg shadow-sm p-6 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <RiAlertLine className="h-8 w-8 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Payment Failed</h1>
        <p className="text-muted-foreground mb-6">
          Your payment could not be processed. Please try again later or contact
          support if the issue persists.
        </p>
        <Button
          onClick={() => router.push("/")}
          className="flex items-center gap-2"
        >
          <RiArrowLeftLine className="h-4 w-4" />
          Back to Home
        </Button>
      </div>
    </div>
  );
}
