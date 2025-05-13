import type { Metadata } from "next"
import { Outfit as FontHeading, Inter as FontSans } from "next/font/google"

import { NextIntlClientProvider } from "next-intl"
import PlausibleProvider from "next-plausible"
import { Toaster } from "sonner"

import Footer from "@/components/layout/footer"
import Nav from "@/components/layout/nav"
import { ThemeProvider } from "@/components/theme/theme-provider"

import "./globals.css"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontHeading = FontHeading({
  subsets: ["latin"],
  variable: "--font-heading",
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL!),
  title: "Open Launch - Discover the Best Tech Products",
  description:
    "Open Launch is a platform to discover and upvote the best tech products. Find top products launching daily.",
  openGraph: {
    title: "Open Launch - Discover the Best Tech Products",
    description:
      "Open Launch is a platform to discover and upvote the best tech products. Find top products launching daily.",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "Open Launch",
    images: [
      {
        url: "og.png",
        width: 1200,
        height: 630,
        alt: "Open Launch - Discover the Best Tech Products",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Open Launch - Discover the Best Tech Products",
    description:
      "Open Launch is a platform to discover and upvote the best tech products. Find top products launching daily.",
    images: ["og.png"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <head>
        <PlausibleProvider
          domain="open-launch.com"
          customDomain="https://plausible.dailypings.com"
          selfHosted={true}
          trackOutboundLinks={true}
          scriptProps={{
            src: "https://plausible.dailypings.com/js/script.js",
          }}
          enabled={process.env.NODE_ENV === "production"}
        />
      </head>
      <body
        className={`font-sans antialiased ${fontSans.variable} ${fontHeading.variable} sm:overflow-y-scroll`}
        suppressHydrationWarning
      >
        <NextIntlClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex min-h-dvh flex-col">
              <Nav />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
          </ThemeProvider>
        </NextIntlClientProvider>
        <Toaster />
      </body>
    </html>
  )
}
