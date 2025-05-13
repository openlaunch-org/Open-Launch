/* eslint-disable @next/next/no-img-element */
import { headers } from "next/headers"
import Link from "next/link"

import {
  RiDashboardLine,
  RiFlashlightLine,
  RiHomeLine,
  RiLayoutGridLine,
  RiLoginBoxLine,
  RiMedalLine,
  RiMenuLine,
  RiMoneyDollarCircleLine,
  RiUserAddLine,
} from "@remixicon/react"
import { User } from "better-auth"
import { getTranslations } from "next-intl/server"

import { auth } from "@/lib/auth"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { ThemeToggle } from "../theme/theme-toggle"
import { ThemeToggleMenu } from "../theme/theme-toggle-menu"
import { Button } from "../ui/button"
import { NavMenu } from "./nav-menu"
import { SearchCommand } from "./search-command"
import { UserNav } from "./user-nav"

export default async function Nav() {
  const t = await getTranslations("nav")
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  const user = session?.user

  // Pré-charger l'image si elle existe - Correction pour éviter l'erreur
  try {
    if (user && typeof user.image === "string" && user.image) {
      await fetch(user.image)
    }
  } catch (error) {
    console.error("Erreur lors du préchargement de l'image:", error)
    // Continuer l'exécution même en cas d'erreur
  }

  return (
    <nav className="bg-background/95 sticky top-0 z-50 border-b backdrop-blur-sm">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="font-heading flex items-center">
            <span className="font-heading flex items-center text-lg font-bold">
              <img src="/logo.svg" alt="logo" className="mr-1 h-6 w-6" />
              Product Launch
            </span>
          </Link>

          {/* Navigation principale - uniquement visible si connecté */}
          {session && <NavMenu />}
        </div>

        {/* Version Desktop - Recherche et actions */}
        <div className="hidden items-center gap-3 md:flex">
          {session && <SearchCommand />}

          <ThemeToggle />
          {session ? (
            <UserNav user={user as User} />
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/sign-in">{t("signIn")}</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/sign-up">{t("signUp")}</Link>
              </Button>
            </>
          )}
        </div>

        {/* Version Mobile - Menu Drawer */}
        <div className="flex items-center md:hidden">
          {session && <UserNav user={user as User} />}
          {!session && (
            <Button variant="default" size="sm" asChild className="mr-2">
              <Link href="/sign-in">
                <RiLoginBoxLine className="h-4 w-4" />
                {t("signIn")}
              </Link>
            </Button>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <RiMenuLine className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex h-full flex-col">
                <div className="px-2">
                  <SheetHeader className="mb-2 pb-0">
                    <SheetTitle>{t("menu")}</SheetTitle>
                  </SheetHeader>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {session && (
                    <>
                      <div className="mt-2 mb-6 px-6">
                        <SearchCommand />
                      </div>
                      <div className="bg-border my-4 h-px" />
                    </>
                  )}
                  {/* Navigation */}
                  {session && (
                    <div className="mb-4">
                      <div className="mb-2 px-6">
                        <h3 className="text-muted-foreground mb-2 text-xs font-medium">
                          NAVIGATION
                        </h3>
                      </div>
                      <div className="space-y-1">
                        <SheetClose asChild>
                          <Link
                            href="/"
                            className="hover:bg-muted/50 flex items-center gap-3 px-6 py-2.5 text-sm transition-colors"
                          >
                            <RiHomeLine className="text-muted-foreground h-4 w-4" />
                            <span>{t("home")}</span>
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link
                            href="/trending"
                            className="hover:bg-muted/50 flex items-center gap-3 px-6 py-2.5 text-sm transition-colors"
                          >
                            <RiFlashlightLine className="text-muted-foreground h-4 w-4" />
                            <span>{t("trending")}</span>
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link
                            href="/categories"
                            className="hover:bg-muted/50 flex items-center gap-3 px-6 py-2.5 text-sm transition-colors"
                          >
                            <RiLayoutGridLine className="text-muted-foreground h-4 w-4" />
                            <span>{t("categories")}</span>
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link
                            href="/winners"
                            className="hover:bg-muted/50 flex items-center gap-3 px-6 py-2.5 text-sm transition-colors"
                          >
                            <RiMedalLine className="text-muted-foreground h-4 w-4" />
                            <span>{t("winners")}</span>
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link
                            href="/pricing"
                            className="hover:bg-muted/50 flex items-center gap-3 px-6 py-2.5 text-sm transition-colors"
                          >
                            <RiMoneyDollarCircleLine className="text-muted-foreground h-4 w-4" />
                            <span>{t("pricing")}</span>
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link
                            href="/dashboard"
                            className="hover:bg-muted/50 flex items-center gap-3 px-6 py-2.5 text-sm transition-colors"
                          >
                            <RiDashboardLine className="text-muted-foreground h-4 w-4" />
                            <span>{t("dashboard")}</span>
                          </Link>
                        </SheetClose>
                      </div>
                    </div>
                  )}

                  {/* Séparateur */}
                  <div className="bg-border my-4 h-px" />

                  {/* Actions */}
                  <div className="mb-4">
                    <div className="mb-2 px-6">
                      <h3 className="text-muted-foreground mb-2 text-xs font-medium">ACTIONS</h3>
                    </div>
                    <div>
                      <ThemeToggleMenu />
                    </div>

                    {!session && (
                      <div className="space-y-1">
                        <SheetClose asChild>
                          <Link
                            href="/sign-in"
                            className="hover:bg-muted/50 flex items-center gap-3 px-6 py-2.5 text-sm transition-colors"
                          >
                            <RiLoginBoxLine className="text-muted-foreground h-4 w-4" />
                            <span>{t("signIn")}</span>
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link
                            href="/sign-up"
                            className="hover:bg-muted/50 flex items-center gap-3 px-6 py-2.5 text-sm transition-colors"
                          >
                            <RiUserAddLine className="text-muted-foreground h-4 w-4" />
                            <span>{t("signUp")}</span>
                          </Link>
                        </SheetClose>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
