/* eslint-disable @next/next/no-img-element */
import Link from "next/link"

import { RiDiscordFill, RiInstagramFill } from "@remixicon/react"
import { useTranslations } from "next-intl"

// Liens pour la nouvelle colonne "Connect"
const connectLinkItems = [
  {
    href: "https://discord.gg/productlaunch",
    icon: RiDiscordFill,
    label: "Discord",
  },
  {
    href: "https://instagram.com/productlaunch",
    icon: RiInstagramFill,
    label: "Instagram",
  },
]

export default function FooterSection() {
  const t = useTranslations("footer")
  const legalLinks = [
    { title: t("termsOfService"), href: "/legal/terms" },
    { title: t("privacyPolicy"), href: "/legal/privacy" },
  ]
  const resourcesLinks = [
    { title: t("pricing"), href: "/pricing" },
    { title: t("helpCenter"), href: "#" },
  ]

  // Link groups for a columnar layout
  const discoverLinks = [
    { title: t("trending"), href: "/trending" },
    { title: t("categories"), href: "/categories" },
    { title: t("submitProject"), href: "/projects/submit" },
  ]

  return (
    <footer className="bg-background border-t pt-6 pb-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-12 md:gap-x-8">
          {/* Left Section: Brand, Copyright, Author, Badges - Align left on mobile */}
          <div className="flex flex-col items-start text-left md:col-span-4 lg:col-span-4">
            <Link href="/" className="font-heading mb-3 flex items-center">
              <span className="font-heading flex items-center text-lg font-bold">
                <img src="/logo.svg" alt="logo" className="mr-1 h-6 w-6" />
                Product Launch
              </span>
            </Link>
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} Product Launch. {t("allRightsReserved")}
            </p>
            <p className="text-muted-foreground mb-4 text-sm">
              {t("createdBy")}{" "}
              <Link
                href="https://wysion.com"
                target="_blank"
                rel="noopener"
                className="hover:text-primary underline"
              >
                Wysion
              </Link>
            </p>
            <div className="flex items-center justify-start space-x-3">
              <img
                src="/images/badges/top1-light.svg"
                alt="Top 1 Product Badge (Light Theme)"
                className="w-[150px]"
              />
              <img
                src="/images/badges/top1-dark.svg"
                alt="Top 1 Product Badge (Dark Theme)"
                className="w-[150px]"
              />
            </div>
          </div>

          {/* Right Section: Columnar Navigation Links - 2 colonnes sur mobile, 4 sur md */}
          <div className="grid grid-cols-2 gap-8 md:col-span-8 md:grid-cols-4">
            {/* Discover Column */}
            <div className="text-left">
              <h3 className="text-foreground text-sm font-semibold tracking-wider uppercase">
                {t("discover")}
              </h3>
              <ul role="list" className="mt-4 flex flex-col items-start space-y-3">
                {discoverLinks.map((link) => (
                  <li key={link.title}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-primary text-sm transition-colors duration-150"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Column */}
            <div className="text-left">
              <h3 className="text-foreground text-sm font-semibold tracking-wider uppercase">
                {t("resources")}
              </h3>
              <ul role="list" className="mt-4 flex flex-col items-start space-y-3">
                {resourcesLinks.map((link) => (
                  <li key={link.title}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-primary text-sm transition-colors duration-150"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Column */}
            <div className="text-left">
              <h3 className="text-foreground text-sm font-semibold tracking-wider uppercase">
                {t("legal")}
              </h3>
              <ul role="list" className="mt-4 flex flex-col items-start space-y-3">
                {legalLinks.map((link) => (
                  <li key={link.title}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-primary text-sm transition-colors duration-150"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect Column */}
            <div className="text-left">
              <h3 className="text-foreground text-sm font-semibold tracking-wider uppercase">
                {t("connect")}
              </h3>
              <ul role="list" className="mt-4 flex flex-col items-start space-y-3">
                {connectLinkItems.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary inline-flex items-center gap-1.5 text-sm transition-colors duration-150"
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
