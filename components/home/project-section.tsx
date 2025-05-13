"use client"

import Link from "next/link"

import { RiArrowRightLine } from "@remixicon/react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"

import { ProjectCard } from "./project-card"

interface Project {
  id: string
  slug: string
  name: string
  description: string | null
  logoUrl: string
  websiteUrl?: string | null
  upvoteCount: number
  commentCount?: number | null
  launchStatus: string
  launchType?: string | null
  scheduledLaunchDate?: Date | string | null
  createdAt: Date | string
  userHasUpvoted?: boolean
  categories?: { id: string; name: string }[]
  dailyRanking?: number | null
}

interface ProjectSectionProps {
  title: string
  projects: Project[]
  moreHref?: string
  sortByUpvotes?: boolean
  isAuthenticated: boolean
}

export function ProjectSection({
  title,
  projects,
  moreHref,
  sortByUpvotes = false,
  isAuthenticated,
}: ProjectSectionProps) {
  const t = useTranslations("projects")
  const tc = useTranslations("common")

  const sortedProjects = sortByUpvotes
    ? [...projects].sort((a, b) => (b.upvoteCount ?? 0) - (a.upvoteCount ?? 0))
    : projects

  const ViewAllButton = () => (
    <Button variant="ghost" size="sm" className={"w-full justify-center text-sm sm:w-auto"} asChild>
      <Link href={moreHref!} className="flex items-center gap-1">
        {tc("viewAll", { gender: "male" })} <RiArrowRightLine className="h-4 w-4" />
      </Link>
    </Button>
  )

  const ViewAllButtonMobile = () => (
    <Button
      variant="ghost"
      size="sm"
      className={"bg-secondary w-full justify-center text-sm sm:w-auto"}
      asChild
    >
      <Link href={moreHref!} className="flex items-center gap-1">
        {tc("viewAll", { gender: "male" })} <RiArrowRightLine className="h-4 w-4" />
      </Link>
    </Button>
  )

  return (
    <section className="space-y-3 sm:space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold sm:text-2xl">{title}</h2>
        {moreHref && (
          <div className="hidden sm:block">
            <ViewAllButton />
          </div>
        )}
      </div>

      <div>
        {sortedProjects.length > 0 ? (
          <div className="-mx-3 flex flex-col sm:-mx-4">
            {sortedProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                id={project.id}
                name={project.name}
                slug={project.slug}
                description={project.description || ""}
                logoUrl={project.logoUrl}
                upvoteCount={project.upvoteCount ?? 0}
                commentCount={project.commentCount ?? 0}
                launchStatus={project.launchStatus}
                launchType={project.launchType}
                dailyRanking={project.dailyRanking}
                userHasUpvoted={project.userHasUpvoted ?? false}
                categories={project.categories ?? []}
                isAuthenticated={isAuthenticated}
                index={index}
                websiteUrl={project.websiteUrl ?? undefined}
              />
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground border-border bg-card rounded-lg border border-dashed py-8 text-center text-sm">
            {t("noProjectFound", { title })}
          </div>
        )}

        {moreHref && (
          <div className="mt-4 sm:hidden">
            <ViewAllButtonMobile />
          </div>
        )}
      </div>
    </section>
  )
}
