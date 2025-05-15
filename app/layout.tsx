import type { Metadata } from "next"
import { Outfit as FontHeading, Inter as FontSans } from "next/font/google"

import { NextIntlClientProvider } from "next-intl"
import { getTranslations } from "next-intl/server"
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

const appUrl = new URL(process.env.NEXT_PUBLIC_APP_URL!)

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta")

  const appName = process.env.NEXT_PUBLIC_APP_NAME!
  const title = t("title", { appName })
  const description = t("description", { appName })

  return {
    metadataBase: appUrl,
    title,
    description,
    openGraph: {
      title,
      description,
      url: process.env.NEXT_PUBLIC_APP_URL,
      siteName: process.env.NEXT_PUBLIC_APP_NAME!,
      images: [
        {
          url: "og.png",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "pt_BR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["og.png"],
    },
  }
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
          domain={appUrl.hostname}
          customDomain={process.env.NEXT_PUBLIC_PLAUSIBLE_URL}
          selfHosted={true}
          trackOutboundLinks={true}
          scriptProps={{
            src: `${process.env.NEXT_PUBLIC_PLAUSIBLE_URL}/js/script.js`,
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
