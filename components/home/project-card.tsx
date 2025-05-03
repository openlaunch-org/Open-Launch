"use client"

import Image from "next/image"
import Link from "next/link"

import { RiExternalLinkLine } from "@remixicon/react"

import { ProjectCardButtons } from "./project-card-buttons"

interface Category {
  id: string
  name: string
}

interface ProjectCardProps {
  id: string
  slug: string
  name: string
  description: string
  logoUrl: string
  upvoteCount: number
  commentCount: number
  launchStatus: string
  index?: number
  userHasUpvoted: boolean
  categories: Category[]
  isAuthenticated: boolean
  websiteUrl?: string
}

export function ProjectCard({
  id,
  slug,
  name,
  description,
  logoUrl,
  upvoteCount,
  commentCount,
  launchStatus,
  index,
  userHasUpvoted,
  categories,
  isAuthenticated,
  websiteUrl,
}: ProjectCardProps) {
  const projectPageUrl = `/projects/${slug}`

  return (
    <div className="group rounded-xl p-3 transition-colors hover:bg-zinc-50 sm:p-4 dark:hover:bg-zinc-900/50">
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="flex-shrink-0">
          <Link href={projectPageUrl}>
            <div className="relative h-12 w-12 overflow-hidden rounded-md sm:h-14 sm:w-14">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={`${name} logo`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 48px, 56px"
                />
              ) : (
                <span className="text-muted-foreground flex h-full w-full items-center justify-center text-xl font-bold">
                  {name.charAt(0)}
                </span>
              )}
            </div>
          </Link>
        </div>

        <div className="min-w-0 flex-grow">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <Link href={projectPageUrl}>
                <h3 className="group-hover:text-primary line-clamp-1 text-sm font-medium transition-colors sm:text-base">
                  {typeof index === "number" ? `${index + 1}. ` : ""}
                  {name}
                </h3>
              </Link>
              {websiteUrl && (
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary mb-px inline-flex items-center transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                  title={`Visit ${name} website`}
                >
                  <RiExternalLinkLine className="hidden h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100 md:inline-block" />
                </a>
              )}
            </div>

            <p className="text-muted-foreground mb-1 line-clamp-2 text-xs sm:line-clamp-1 sm:text-sm">
              {description}
            </p>

            {categories.length > 0 && (
              <div className="text-muted-foreground mt-1 hidden flex-wrap items-center gap-1.5 text-xs sm:flex">
                {categories.slice(0, 3).map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/categories?category=${cat.id}`}
                    className="bg-secondary hover:bg-secondary/80 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <ProjectCardButtons
          projectPageUrl={projectPageUrl}
          commentCount={commentCount}
          projectId={id}
          upvoteCount={upvoteCount}
          isAuthenticated={isAuthenticated}
          hasUpvoted={userHasUpvoted}
          launchStatus={launchStatus}
          projectName={name}
        />
      </div>
    </div>
  )
}
