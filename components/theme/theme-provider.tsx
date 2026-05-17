"use client"

import * as React from "react"

import { ThemeProvider as NextThemesProvider } from "next-themes"

/**
 * Known upstream noise (do not "fix" by replacing next-themes — see below):
 *
 * `next-themes@0.4.6` injects a `<script dangerouslySetInnerHTML>` inside
 * its provider tree to set the theme class before paint (the standard
 * no-flash trick). React 19 added a diagnostic that warns on ANY `<script>`
 * rendered inside a component body — regardless of `dangerouslySetInnerHTML`
 * + `suppressHydrationWarning` — so dev console shows:
 *
 *   "Encountered a script tag while rendering React component"
 *
 * and the SSR'd script causes a hydration mismatch which React handles
 * as "recoverable" (regenerates the client tree).
 *
 * Why we're not fixing it here:
 *   - Warning is dev-only; prod builds silence console.error.
 *   - Theme switching works correctly; user-visible impact is at most
 *     a 1-frame flash on initial dark-mode page load.
 *   - `next-themes@1.0.0-beta.0` is a stale year-old beta that doesn't
 *     address it; latest stable is 0.4.6. Waiting for upstream.
 *   - Rolling our own ThemeProvider just to silence a dev warning is
 *     net-negative on maintenance.
 *
 * Revisit when next-themes ships a React 19 fix.
 */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
