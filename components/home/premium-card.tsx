"use client"

import Image from "next/image"
import Link from "next/link"

import { RiStarSFill } from "@remixicon/react"

interface Project {
  id: string
  slug: string
  name: string
  logoUrl: string
  description?: string | null
  launchStatus: string
}

interface PremiumCardProps {
  projects: Project[]
}

export function PremiumCard({ projects }: PremiumCardProps) {
  const displayItems = [...projects]
  const placeholdersNeeded = Math.max(0, 3 - projects.length)

  for (let i = 0; i < placeholdersNeeded; i++) {
    displayItems.push({
      id: `placeholder-${i}`,
      slug: "",
      name: "Available Slot",
      logoUrl: "",
      description: "Premium Plus Spot",
      launchStatus: "placeholder",
    })
  }

  return (
    <section className="space-y-3 sm:space-y-4">
      <div className="flex items-center justify-between px-3 sm:px-4">
        <h2 className="text-xl font-bold sm:text-2xl">Featured Premium Plus</h2>
      </div>
      <div className="bg-background grid grid-cols-3 gap-2 rounded-xl p-4">
        {displayItems.map((item) =>
          item.launchStatus === "placeholder" ? (
            <div key={item.id} className="flex flex-col items-center">
              <Link
                href="/pricing"
                className="group hover:bg-muted/50 flex flex-col items-center gap-3 rounded-lg p-2 text-center transition-colors sm:items-center sm:text-left"
              >
                <div className="relative flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg bg-zinc-100 sm:h-14 sm:w-14 dark:bg-zinc-800">
                  <div className="flex h-full w-full items-center justify-center rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-700">
                    <span className="text-xs text-zinc-400 dark:text-zinc-500">+</span>
                  </div>
                </div>
                <div className="min-w-0">
                  <h4 className="group-hover:text-primary line-clamp-2 text-center text-xs font-medium transition-colors sm:text-base">
                    Premium Plus Spot
                  </h4>
                </div>
              </Link>
            </div>
          ) : (
            <Link
              key={item.id}
              href={`/projects/${item.slug}`}
              className="group hover:bg-muted/50 flex flex-col items-center gap-3 rounded-lg p-2 text-center transition-colors sm:items-center sm:text-left"
            >
              <div className="bg-muted relative h-12 w-12 flex-shrink-0 rounded-lg sm:h-14 sm:w-14">
                {item.logoUrl ? (
                  <Image
                    src={item.logoUrl}
                    alt={item.name}
                    fill
                    className="rounded-md object-contain p-1"
                  />
                ) : (
                  <span className="text-muted-foreground flex h-full w-full items-center justify-center text-xl font-bold">
                    {item.name.charAt(0)}
                  </span>
                )}
                <div className="bg-primary border-background absolute -top-2 -right-2 z-10 flex h-5 w-5 items-center justify-center rounded-full border-2">
                  <RiStarSFill className="h-3 w-3 text-white" />
                </div>
              </div>
              <div className="min-w-0">
                <h4 className="group-hover:text-primary line-clamp-2 text-xs font-medium transition-colors sm:text-base">
                  {item.name}
                </h4>
              </div>
            </Link>
          ),
        )}
      </div>
    </section>
  )
}
