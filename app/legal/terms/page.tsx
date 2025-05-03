/* eslint-disable react/no-unescaped-entities */
import Link from "next/link"

export const metadata = {
  title: "Terms of Service - Open-Launch",
  description: "Terms of Service for Open-Launch platform",
}

export default function TermsOfServicePage() {
  return (
    <div className="bg-secondary/20 py-8 sm:py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="bg-background rounded-xl border p-6 shadow-sm sm:p-8 dark:border-zinc-800">
          <h1 className="mb-6 text-2xl font-bold sm:text-3xl">Terms of Service</h1>
          <p className="text-muted-foreground mb-6">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>

          <div className="space-y-6">
            <section>
              <h2 className="mb-3 text-xl font-semibold">1. Introduction</h2>
              <p className="mb-3">
                Welcome to Open Launch. These Terms of Service govern your use of our platform,
                which focuses on discovering and supporting projects.
              </p>
              <p className="mb-3">
                By using Open Launch, you agree to these terms. If you don't agree, please don't use
                our services.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">2. Using Our Service</h2>
              <p className="mb-3">
                <strong>Age Requirements:</strong> You must be at least 13 years old to use Open
                Launch.
              </p>
              <p className="mb-3">
                <strong>Account Responsibility:</strong> If you create an account, you're
                responsible for maintaining its security and for all activities under your account.
              </p>
              <p className="mb-3">
                <strong>Acceptable Use:</strong> When using Open Launch, you agree not to:
              </p>
              <ul className="mb-3 list-disc space-y-1 pl-6">
                <li>Post content that's illegal, harmful, or violates others' rights</li>
                <li>Misrepresent yourself or your affiliation with others</li>
                <li>Interfere with the platform's operation or security</li>
                <li>Collect user data without permission</li>
                <li>Use the service for unauthorized commercial purposes</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">3. Content</h2>
              <p className="mb-3">
                <strong>Your Content:</strong> When you submit projects, comments, or other content
                on Open Launch, you retain ownership, but grant us permission to display and use
                that content on our platform.
              </p>
              <p className="mb-3">
                <strong>Responsibility:</strong> You're responsible for the content you submit. Make
                sure you have the right to share it and that it doesn't violate any laws or these
                terms.
              </p>
              <p className="mb-3">
                <strong>Our Rights:</strong> We can remove any content at our discretion if we
                believe it violates these terms or might harm our platform, users, or third parties.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">4. Intellectual Property</h2>
              <p className="mb-3">
                Open Launch is an open source project licensed under the MIT License. The source
                code is available on{" "}
                <a
                  href="https://github.com/drdruide/open-launch"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
                .
              </p>
              <p className="mb-3">
                While the core platform is open source, certain features or services may be
                proprietary. The MIT License allows you to:
              </p>
              <ul className="mb-3 list-disc space-y-1 pl-6">
                <li>Use, copy, and modify the software</li>
                <li>Distribute the software</li>
                <li>Sublicense the software</li>
              </ul>
              <p className="mb-3">
                You must include the original copyright notice and license in any substantial
                portions of the software.
              </p>
              <p className="mb-3">
                User-submitted content remains the property of the respective users, who grant Open
                Launch a license to display and use that content on our platform.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">5. Third-Party Content</h2>
              <p className="mb-3">
                Open Launch may contain links to third-party websites or services, including
                projects. We're not responsible for the content, policies, or practices of these
                third parties.
              </p>
              <p className="mb-3">
                Your interactions with third-party services are between you and that third party.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">6. Termination</h2>
              <p className="mb-3">
                We can suspend or terminate your access to Open Launch at any time for any reason,
                particularly if you violate these terms.
              </p>
              <p className="mb-3">
                If your account is terminated, you'll no longer have access to your content or
                account information.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">7. Disclaimers</h2>
              <p className="mb-3">
                Open Launch is provided "as is" without warranties of any kind. We don't guarantee
                that the service will be uninterrupted, secure, or error-free.
              </p>
              <p className="mb-3">
                We're not responsible for the accuracy or reliability of any content posted by users
                or third parties.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">8. Limitation of Liability</h2>
              <p className="mb-3">
                To the extent permitted by law, Open Launch and its team will not be liable for any
                indirect, incidental, special, or consequential damages resulting from your use of
                or inability to use our service.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">9. Changes to These Terms</h2>
              <p className="mb-3">
                We may update these terms from time to time. We'll notify you of significant
                changes, but it's your responsibility to review these terms periodically.
              </p>
              <p className="mb-3">
                Your continued use of Open Launch after changes means you accept the updated terms.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">10. Contact Us</h2>
              <p className="mb-3">If you have questions about these terms, please contact us at:</p>
              <p className="mb-3">
                <a
                  href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`}
                  className="text-primary hover:underline"
                >
                  {process.env.NEXT_PUBLIC_CONTACT_EMAIL}
                </a>
              </p>
            </section>
          </div>

          <div className="mt-8 border-t pt-6 dark:border-zinc-800">
            <Link href="/" className="text-primary hover:underline">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
