import Link from "next/link";
import { Button } from "../ui/button";
import { auth } from "@/lib/auth";
import { UserNav } from "./user-nav";
import { ThemeToggle } from "../theme/theme-toggle";
import { headers } from "next/headers";
import { User } from "better-auth";
import { NavMenu } from "./nav-menu";
import { SearchCommand } from "./search-command";
import {
  RiMenuLine,
  RiFlashlightLine,
  RiLayoutGridLine,
  RiDashboardLine,
  RiHomeLine,
  RiLoginBoxLine,
  RiUserAddLine,
  RiMoneyDollarCircleLine,
  RiMedalLine,
} from "@remixicon/react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { ThemeToggleMenu } from "../theme/theme-toggle-menu";
import { DiOpensource } from "react-icons/di";
export default async function Nav() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user;

  // Pré-charger l'image si elle existe - Correction pour éviter l'erreur
  try {
    if (user && typeof user.image === "string" && user.image) {
      await fetch(user.image);
    }
  } catch (error) {
    console.error("Erreur lors du préchargement de l'image:", error);
    // Continuer l'exécution même en cas d'erreur
  }

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
      <div className="container flex h-16 max-w-6xl items-center justify-between px-4 mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center font-heading">
            <span className="font-bold text-lg font-heading flex items-center">
              <DiOpensource className="w-6 h-6 mr-1 text-primary" />
              Open-Launch
            </span>
          </Link>

          {/* Navigation principale - uniquement visible si connecté */}
          {session && <NavMenu />}
        </div>

        {/* Version Desktop - Recherche et actions */}
        <div className="hidden md:flex items-center gap-3">
          {session && <SearchCommand />}

          <ThemeToggle />
          {session ? (
            <UserNav user={user as User} />
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/sign-up">Sign up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Version Mobile - Menu Drawer */}
        <div className="md:hidden flex items-center">
          {session && <UserNav user={user as User} />}
          {!session && (
            <Button variant="default" size="sm" asChild className="mr-2">
              <Link href="/sign-in">
                <RiLoginBoxLine className="h-4 w-4" />
                Sign in
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
              <div className="flex flex-col h-full">
                <div className="px-2">
                  <SheetHeader className="mb-2 pb-0">
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {session && (
                    <>
                      <div className="px-6 mb-6 mt-2">
                        <SearchCommand />
                      </div>
                      <div className="h-px bg-border my-4" />
                    </>
                  )}
                  {/* Navigation */}
                  {session && (
                    <div className="mb-4">
                      <div className="px-6 mb-2">
                        <h3 className="text-xs font-medium text-muted-foreground mb-2">
                          NAVIGATION
                        </h3>
                      </div>
                      <div className="space-y-1">
                        <SheetClose asChild>
                          <Link
                            href="/"
                            className="flex items-center gap-3 px-6 py-2.5 text-sm hover:bg-muted/50 transition-colors"
                          >
                            <RiHomeLine className="h-4 w-4 text-muted-foreground" />
                            <span>Home</span>
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link
                            href="/trending"
                            className="flex items-center gap-3 px-6 py-2.5 text-sm hover:bg-muted/50 transition-colors"
                          >
                            <RiFlashlightLine className="h-4 w-4 text-muted-foreground" />
                            <span>Trending</span>
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link
                            href="/categories"
                            className="flex items-center gap-3 px-6 py-2.5 text-sm hover:bg-muted/50 transition-colors"
                          >
                            <RiLayoutGridLine className="h-4 w-4 text-muted-foreground" />
                            <span>Categories</span>
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link
                            href="/winners"
                            className="flex items-center gap-3 px-6 py-2.5 text-sm hover:bg-muted/50 transition-colors"
                          >
                            <RiMedalLine className="h-4 w-4 text-muted-foreground" />
                            <span>Winners</span>
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link
                            href="/pricing"
                            className="flex items-center gap-3 px-6 py-2.5 text-sm hover:bg-muted/50 transition-colors"
                          >
                            <RiMoneyDollarCircleLine className="h-4 w-4 text-muted-foreground" />
                            <span>Pricing</span>
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link
                            href="/dashboard"
                            className="flex items-center gap-3 px-6 py-2.5 text-sm hover:bg-muted/50 transition-colors"
                          >
                            <RiDashboardLine className="h-4 w-4 text-muted-foreground" />
                            <span>Dashboard</span>
                          </Link>
                        </SheetClose>
                      </div>
                    </div>
                  )}

                  {/* Séparateur */}
                  <div className="h-px bg-border my-4" />

                  {/* Actions */}
                  <div className="mb-4">
                    <div className="px-6 mb-2">
                      <h3 className="text-xs font-medium text-muted-foreground mb-2">
                        ACTIONS
                      </h3>
                    </div>
                    <div>
                      <ThemeToggleMenu />
                    </div>

                    {!session && (
                      <div className="space-y-1">
                        <SheetClose asChild>
                          <Link
                            href="/sign-in"
                            className="flex items-center gap-3 px-6 py-2.5 text-sm hover:bg-muted/50 transition-colors"
                          >
                            <RiLoginBoxLine className="h-4 w-4 text-muted-foreground" />
                            <span>Sign in</span>
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link
                            href="/sign-up"
                            className="flex items-center gap-3 px-6 py-2.5 text-sm hover:bg-muted/50 transition-colors"
                          >
                            <RiUserAddLine className="h-4 w-4 text-muted-foreground" />
                            <span>Sign up</span>
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
  );
}
