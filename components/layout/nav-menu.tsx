"use client"

import Link from "next/link"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

export function NavMenu() {
  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList className="gap-1">
        <NavigationMenuItem>
          <NavigationMenuTrigger className="h-9 cursor-pointer px-3 text-sm">
            Explore
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[280px] gap-1 p-2">
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    href="/trending"
                    className="block rounded-md px-2 py-2 text-sm no-underline transition-colors outline-none select-none"
                  >
                    <div className="mb-1 font-medium">Trending Now</div>
                    <p className="text-muted-foreground text-xs leading-tight">
                      Discover the most popular projects
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    href="/winners"
                    className="block rounded-md px-2 py-2 text-sm no-underline transition-colors outline-none select-none"
                  >
                    <div className="mb-1 font-medium">Daily Winners</div>
                    <p className="text-muted-foreground text-xs leading-tight">
                      See the best projects of the day
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    href="/trending?filter=month"
                    className="block rounded-md px-2 py-2 text-sm no-underline transition-colors outline-none select-none"
                  >
                    <div className="mb-1 font-medium">Best of Month</div>
                    <p className="text-muted-foreground text-xs leading-tight">
                      See the best projects of the month
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    href="/categories"
                    className="block rounded-md px-2 py-2 text-sm no-underline transition-colors outline-none select-none"
                  >
                    <div className="mb-1 font-medium">Categories</div>
                    <p className="text-muted-foreground text-xs leading-tight">
                      Browse projects by category
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/dashboard" className={`${navigationMenuTriggerStyle()} h-9 px-3 text-sm`}>
              Dashboard
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              href="/projects/submit"
              className={`${navigationMenuTriggerStyle()} h-9 px-3 text-sm`}
            >
              Submit Project
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link href="/pricing" className={`${navigationMenuTriggerStyle()} h-9 px-3 text-sm`}>
              Pricing
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
