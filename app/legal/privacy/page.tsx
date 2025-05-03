import Link from "next/link"

export const metadata = {
  title: "Privacy Policy - Open-Launch",
  description: "Privacy Policy for Open-Launch platform",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-secondary/20 py-8 sm:py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="bg-background rounded-xl border p-6 shadow-sm sm:p-8 dark:border-zinc-800">
          <h1 className="mb-6 text-2xl font-bold sm:text-3xl">Privacy Policy</h1>
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
                At Open Launch, we highly value the protection of your personal data. This privacy
                policy explains how we collect, use, and protect your information when you use our
                platform.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">2. Information We Collect</h2>
              <p className="mb-3">
                <strong>Information you provide to us:</strong>
              </p>
              <ul className="mb-3 list-disc space-y-1 pl-6">
                <li>Account information (name, email address, password)</li>
                <li>Profile information (username, photo)</li>
                <li>Content you publish (project submissions, comments)</li>
                <li>Communications with us</li>
              </ul>

              <p className="mb-3">
                <strong>Information automatically collected:</strong>
              </p>
              <ul className="mb-3 list-disc space-y-1 pl-6">
                <li>Usage data (pages visited, time spent, interactions)</li>
                <li>Device information (device type, operating system, browser)</li>
                <li>Country</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">3. How We Use Your Information</h2>
              <p className="mb-3">We use your information to:</p>
              <ul className="mb-3 list-disc space-y-1 pl-6">
                <li>Provide, maintain, and improve our platform</li>
                <li>Create and manage your account</li>
                <li>Process your transactions</li>
                <li>Communicate with you about our services</li>
                <li>Personalize your experience</li>
                <li>Ensure the security of our platform</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">4. Sharing Your Information</h2>
              <p className="mb-3">
                We do not sell your personal data. We may share your information in the following
                situations:
              </p>
              <ul className="mb-3 list-disc space-y-1 pl-6">
                <li>
                  <strong>With service providers</strong> who help us operate our platform
                </li>
                <li>
                  <strong>For legal obligations</strong> (when required by law or to protect our
                  rights)
                </li>
                <li>
                  <strong>With your consent</strong> or according to your instructions
                </li>
              </ul>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">5. Your Rights and Choices</h2>
              <p className="mb-3">You have the following rights regarding your personal data:</p>
              <ul className="mb-3 list-disc space-y-1 pl-6">
                <li>Access your data</li>
                <li>Rectify or update your information</li>
                <li>Delete your account and data (with certain limitations)</li>
                <li>Limit the processing of your data</li>
                <li>Withdraw your consent</li>
              </ul>
              <p className="mb-3">
                To exercise these rights, contact us at{" "}
                <a
                  href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`}
                  className="text-primary hover:underline"
                >
                  {process.env.NEXT_PUBLIC_CONTACT_EMAIL}
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">6. Data Security</h2>
              <p className="mb-3">
                We implement appropriate security measures to protect your information. However, no
                method of transmission over the Internet or electronic storage is completely secure.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">7. Data Retention</h2>
              <p className="mb-3">
                We retain your personal data for as long as necessary to provide you with our
                services and as required by law. When you delete your account, we delete your
                personal data or anonymize it, unless retention is necessary for legal reasons.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">8. Children</h2>
              <p className="mb-3">
                Our service is not intended for individuals under the age of 13. We do not knowingly
                collect personal information from children under 13.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">9. Changes to This Policy</h2>
              <p className="mb-3">
                We may update this privacy policy from time to time. We will notify you of
                significant changes, but we encourage you to review this page regularly to stay
                informed.
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">10. Contact Us</h2>
              <p className="mb-3">
                If you have any questions about this privacy policy, please contact us at:
              </p>
              <p className="mb-3">
                <a
                  href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`}
                  className="text-primary hover:underline"
                >
                  {process.env.NEXT_PUBLIC_CONTACT_EMAIL}
                </a>
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold">11. Open Source Transparency</h2>
              <p className="mb-3">
                As an open source project, Open Launch is committed to transparency in how we handle
                data. Our source code is publicly available on{" "}
                <a
                  href="https://github.com/drdruide/open-launch"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
                , allowing you to review how we process and protect your information.
              </p>
              <p className="mb-3">
                We encourage community contributions and feedback on our privacy practices. If you
                have suggestions for improving our data handling, please open an issue or submit a
                pull request on our GitHub repository.
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
