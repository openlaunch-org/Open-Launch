/* eslint-disable @next/next/no-img-element */
"use client"

import * as React from "react"
import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"

import {
  RiAddCircleLine,
  RiAppsLine,
  RiDashboardLine,
  RiErrorWarningLine,
  RiFireLine,
  RiLoader4Line,
  RiRocketLine,
  RiSearchLine,
} from "@remixicon/react"

import { useSearch } from "@/lib/hooks/use-search"
import { CommandDialog, CommandInput } from "@/components/ui/command"
import { DialogTitle } from "@/components/ui/dialog"

export function SearchCommand() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const resultsRef = useRef<HTMLDivElement>(null)

  // Utiliser notre hook de recherche
  const { query, setQuery, results, isLoading, error } = useSearch({
    debounceMs: 300,
    minLength: 2,
  })

  // Raccourci clavier
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  // Gestion de la navigation au clavier
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignorer si on est en train de charger
      if (isLoading) return

      // Déterminer le nombre total d'éléments sélectionnables
      let totalItems = 0

      // Compter les résultats de recherche
      if (results && results.length > 0) {
        totalItems = results.length
      }
      // Compter les suggestions si pas de recherche
      else if (query.length === 0) {
        totalItems = 5 // 3 suggestions + 2 navigation
      }

      if (totalItems === 0) return

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          setActiveIndex((prev) => (prev + 1) % totalItems)
          break
        case "ArrowUp":
          e.preventDefault()
          setActiveIndex((prev) => (prev <= 0 ? totalItems - 1 : prev - 1))
          break
        case "Enter":
          e.preventDefault()
          if (activeIndex >= 0) {
            const activeElement = resultsRef.current?.querySelector(
              `[data-index="${activeIndex}"]`,
            ) as HTMLDivElement
            if (activeElement) {
              activeElement.click()
            }
          }
          break
        case "Escape":
          setOpen(false)
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, isLoading, results, query, activeIndex])

  // Réinitialiser l'index actif quand les résultats changent
  useEffect(() => {
    setActiveIndex(-1)
  }, [results, query])

  // Fonction pour naviguer vers un résultat
  const runCommand = useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])

  // Réinitialiser l'état lors de l'ouverture/fermeture
  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      setOpen(isOpen)
      if (!isOpen) {
        // Réinitialiser l'état lors de la fermeture
        setQuery("")
        setActiveIndex(-1)
      }
    },
    [setQuery],
  )

  // Rendu des résultats de recherche
  const renderSearchResults = () => {
    if (!results || results.length === 0) return null

    return (
      <div>
        <div className="text-muted-foreground mb-2 px-1 text-xs">
          {results.length} results found
        </div>
        <div className="space-y-1">
          {results.map((result, index) => (
            <div
              key={`${result.type || "unknown"}-${result.id || index}`}
              data-index={index}
              className={`flex cursor-pointer items-center rounded-md p-2 transition-colors ${
                activeIndex === index ? "bg-muted text-foreground" : "hover:bg-muted/50"
              }`}
              onClick={() => {
                runCommand(() => {
                  const url =
                    result.type === "project"
                      ? `/projects/${result.slug || result.id}`
                      : `/categories?category=${result.id}`
                  router.push(url)
                })
              }}
            >
              {result.type === "project" && result.logoUrl ? (
                <div className="border-border mr-2 h-8 w-8 flex-shrink-0 overflow-hidden rounded-full border">
                  <img
                    src={result.logoUrl}
                    alt={result.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://placehold.co/100x100?text=?"
                    }}
                  />
                </div>
              ) : (
                <div className="bg-primary/10 mr-2 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full">
                  <RiAppsLine className="text-primary h-4 w-4" />
                </div>
              )}
              <div className="flex min-w-0 flex-col">
                <span className="truncate font-medium">{result.name}</span>
                {result.description && (
                  <span className="text-muted-foreground truncate text-xs">
                    {result.description}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Calculer la hauteur minimale pour éviter la scrollbar à l'ouverture
  const getMinHeight = () => {
    if (query.length === 0) {
      // Hauteur pour les suggestions (5 items + titres + espacement)
      return "100%"
    } else if (isLoading) {
      // Hauteur pour l'indicateur de chargement
      return "100%"
    } else if (error || (query.length >= 2 && (!results || results.length === 0))) {
      // Hauteur pour les messages d'erreur ou "No results found"
      return "100%"
    } else if (results && results.length > 0) {
      // Hauteur dynamique basée sur le nombre de résultats (environ 60px par résultat)
      const resultsHeight = Math.min(results.length * 60, 350)
      return `${resultsHeight}px`
    }
    return "auto"
  }

  return (
    <>
      <button
        type="button"
        className="text-muted-foreground bg-muted/60 hover:bg-muted flex h-8 w-64 cursor-pointer items-center justify-start rounded-md border-none px-2 text-sm transition-colors focus:outline-none"
        onClick={() => setOpen(true)}
      >
        <RiSearchLine className="mr-2 h-3.5 w-3.5" />
        <span>Search...</span>
        <kbd className="bg-muted pointer-events-none ml-auto hidden h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={handleOpenChange}>
        <DialogTitle className="sr-only">Search</DialogTitle>
        <CommandInput
          placeholder="Search projects, categories..."
          value={query}
          onValueChange={setQuery}
          className="border-none focus:ring-0"
        />
        <div
          className="scrollbar-hide overflow-y-auto p-2"
          style={{
            minHeight: getMinHeight(),
            maxHeight: "350px",
          }}
          ref={resultsRef}
        >
          {/* Afficher le chargement */}
          {isLoading && (
            <div className="flex items-center justify-center py-4 text-center">
              <RiLoader4Line className="text-primary mr-2 h-5 w-5 animate-spin" />
              <span className="text-sm">Searching...</span>
            </div>
          )}

          {/* Afficher l'erreur */}
          {error && (
            <div className="flex flex-col items-center justify-center py-4 text-center text-sm text-red-500">
              <RiErrorWarningLine className="mb-2 h-5 w-5" />
              <span>{error}</span>
            </div>
          )}

          {/* Afficher "No results" */}
          {!isLoading && !error && query.length >= 2 && (!results || results.length === 0) && (
            <div className="text-muted-foreground py-4 text-center text-sm">No results found.</div>
          )}

          {/* Afficher les résultats */}
          {!isLoading && !error && renderSearchResults()}

          {/* Afficher les suggestions */}
          {query.length === 0 && (
            <div className="space-y-4">
              <div>
                <h4 className="mb-2 px-1 text-sm font-medium">Suggestions</h4>
                <div className="space-y-1">
                  <div
                    data-index="0"
                    className={`flex cursor-pointer items-center rounded-md p-2 transition-colors ${
                      activeIndex === 0 ? "bg-muted text-foreground" : "hover:bg-muted/50"
                    }`}
                    onClick={() => runCommand(() => router.push("/trending"))}
                  >
                    <RiFireLine className="mr-2 h-4 w-4 text-orange-500" />
                    <span>Trending projects</span>
                  </div>
                  <div
                    data-index="1"
                    className={`flex cursor-pointer items-center rounded-md p-2 transition-colors ${
                      activeIndex === 1 ? "bg-muted text-foreground" : "hover:bg-muted/50"
                    }`}
                    onClick={() => runCommand(() => router.push("/categories"))}
                  >
                    <RiAppsLine className="mr-2 h-4 w-4 text-purple-500" />
                    <span>Categories</span>
                  </div>
                </div>
              </div>

              <div className="border-border border-t pt-4">
                <h4 className="mb-2 px-1 text-sm font-medium">Navigation</h4>

                <div className="space-y-1">
                  {/* pour explore launches */}

                  <div
                    data-index="2"
                    className={`flex cursor-pointer items-center rounded-md p-2 transition-colors ${
                      activeIndex === 2 ? "bg-muted text-foreground" : "hover:bg-muted/50"
                    }`}
                    onClick={() => runCommand(() => router.push("/"))}
                  >
                    <RiRocketLine className="text-primary mr-2 h-4 w-4" />
                    <span>Explore launches</span>
                  </div>

                  {/* pour dashboard */}
                  <div
                    data-index="3"
                    className={`flex cursor-pointer items-center rounded-md p-2 transition-colors ${
                      activeIndex === 3 ? "bg-muted text-foreground" : "hover:bg-muted/50"
                    }`}
                    onClick={() => runCommand(() => router.push("/dashboard"))}
                  >
                    <RiDashboardLine className="mr-2 h-4 w-4 text-green-500" />
                    <span>Dashboard</span>
                  </div>
                  <div
                    data-index="4"
                    className={`flex cursor-pointer items-center rounded-md p-2 transition-colors ${
                      activeIndex === 4 ? "bg-muted text-foreground" : "hover:bg-muted/50"
                    }`}
                    onClick={() => runCommand(() => router.push("/projects/submit"))}
                  >
                    <RiAddCircleLine className="mr-2 h-4 w-4 text-sky-500" />
                    <span>Submit Project</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CommandDialog>
    </>
  )
}
