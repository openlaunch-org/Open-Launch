import Link from "next/link";
import { RiFilePaper2Line, RiShieldUserLine } from "@remixicon/react";

export const metadata = {
  title: "Legal Information - Open-Launch",
  description: "Legal information and policies for Open-Launch platform",
};

export default function LegalPage() {
  return (
    <div className="py-8 sm:py-12 bg-secondary/20">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="bg-background border dark:border-zinc-800 rounded-xl p-6 sm:p-8 shadow-sm">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6">
            Legal Information
          </h1>
          <p className="text-muted-foreground mb-8">
            At Open Launch, we are committed to transparency and protecting your
            rights. As an open source project, we believe in openness and
            community collaboration. Please review our legal documents to
            understand how we operate and protect your information.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            <Link
              href="/legal/terms"
              className="flex flex-col items-center p-6 border dark:border-zinc-800 rounded-lg hover:bg-secondary/10 transition-colors text-center"
            >
              <RiFilePaper2Line className="h-12 w-12 mb-4 text-primary" />
              <h2 className="text-lg font-semibold mb-2">Terms of Service</h2>
              <p className="text-sm text-muted-foreground">
                The rules and guidelines for using our platform and services.
              </p>
            </Link>

            <Link
              href="/legal/privacy"
              className="flex flex-col items-center p-6 border dark:border-zinc-800 rounded-lg hover:bg-secondary/10 transition-colors text-center"
            >
              <RiShieldUserLine className="h-12 w-12 mb-4 text-primary" />
              <h2 className="text-lg font-semibold mb-2">Privacy Policy</h2>
              <p className="text-sm text-muted-foreground">
                How we collect, use, and protect your personal information.
              </p>
            </Link>
          </div>

          <div className="mt-10 pt-6 border-t dark:border-zinc-800">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <p className="mb-2">
              If you have any questions about our legal policies, please contact
              us:
            </p>
            <ul className="space-y-2 mb-6">
              <li>
                <strong>Mail:</strong>{" "}
                <a
                  href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`}
                  className="text-primary hover:underline"
                >
                  {process.env.NEXT_PUBLIC_CONTACT_EMAIL}
                </a>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t dark:border-zinc-800">
            <Link href="/" className="text-primary hover:underline">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
