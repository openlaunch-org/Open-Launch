"use client"

import { RiMoonLine, RiSunLine } from "@remixicon/react"
import { useTheme } from "next-themes"

export function ThemeToggleMenu() {
  const { theme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="hover:bg-muted/50 flex w-full cursor-pointer items-center gap-3 px-6 py-2.5 text-sm transition-colors"
    >
      <span className="text-muted-foreground relative flex h-4 w-4 items-center justify-center">
        <RiSunLine className="h-4 w-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
        <RiMoonLine className="absolute h-4 w-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      </span>
      <span>Toggle theme</span>
    </button>
  )
}
