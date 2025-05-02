"use client";

import { useTheme } from "next-themes";
import { RiMoonLine, RiSunLine } from "@remixicon/react";

export function ThemeToggleMenu() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="flex cursor-pointer items-center gap-3 px-6 py-2.5 text-sm hover:bg-muted/50 transition-colors w-full"
    >
      <span className="relative flex items-center justify-center w-4 h-4 text-muted-foreground">
        <RiSunLine className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <RiMoonLine className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </span>
      <span>Toggle theme</span>
    </button>
  );
}
