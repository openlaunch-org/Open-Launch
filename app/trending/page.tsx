import { Suspense } from "react"
import { headers } from "next/headers"
import Link from "next/link"

import { getTranslations } from "next-intl/server"

import { auth } from "@/lib/auth"
import { PROJECT_LIMITS_VARIABLES } from "@/lib/constants"
import { Button } from "@/components/ui/button"
// import { RiFilterLine, RiArrowDownSLine } from "@remixicon/react";
import { ProjectCard } from "@/components/home/project-card"
import { getMonthBestProjects, getTodayProjects, getYesterdayProjects } from "@/app/actions/home"
import { getTopCategories } from "@/app/actions/projects"

interface ProjectSummary {
  id: string
  slug: string
  name: string
  description: string | null
  logoUrl: string
  websiteUrl?: string | null
  upvoteCount: number
  commentCount?: number | null
  launchStatus: string
  scheduledLaunchDate?: Date | string | null
  createdAt: Date | string
  userHasUpvoted?: boolean
  categories?: { id: string; name: string }[]
}

export async function generateMetadata() {
  const t = await getTranslations("trending")

  return {
    title: `${t("title")} - ${process.env.NEXT_PUBLIC_APP_NAME}`,
    description: t("description"),
  }
}

// Composant Skeleton principal
function TrendingDataSkeleton() {
  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="px-3 sm:px-4">
        <div className="bg-muted h-8 w-64 animate-pulse rounded"></div>
      </div>
      <div className="-mx-3 flex flex-col sm:-mx-4">
        {Array(5)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="mx-3 animate-pulse rounded-xl border border-zinc-100 bg-white/70 p-3 shadow-sm sm:mx-4 sm:p-4 dark:border-zinc-800/50 dark:bg-zinc-900/30"
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0">
                  <div className="bg-muted h-12 w-12 rounded-md sm:h-14 sm:w-14"></div>
                </div>
                <div className="min-w-0 flex-grow">
                  <div className="flex flex-col">
                    <div className="bg-muted mb-2 h-5 w-1/3 rounded"></div>
                    <div className="bg-muted h-4 w-2/3 rounded"></div>
                  </div>
                </div>
                <div className="flex flex-shrink-0 flex-col items-end gap-2 sm:flex-row sm:items-start">
                  <div className="bg-muted h-10 w-10 rounded-xl border-2 border-dashed"></div>
                  <div className="bg-muted hidden h-10 w-10 rounded-xl border-2 border-dashed sm:block"></div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

// Composant pour afficher les données
async function TrendingData({
  filter,
  isAuthenticated,
  t,
}: {
  filter: string
  isAuthenticated: boolean
  t: (key: string) => string
}) {
  let projects: ProjectSummary[] = [] // Utiliser le type défini
  let title

  if (filter === "today") {
    projects = await getTodayProjects(PROJECT_LIMITS_VARIABLES.VIEW_ALL_PAGE_TODAY_YESTERDAY_LIMIT)
    title = t("trending.today")
  } else if (filter === "yesterday") {
    projects = await getYesterdayProjects(
      PROJECT_LIMITS_VARIABLES.VIEW_ALL_PAGE_TODAY_YESTERDAY_LIMIT,
    )
    title = t("trending.yesterday")
  } else {
    projects = await getMonthBestProjects(PROJECT_LIMITS_VARIABLES.VIEW_ALL_PAGE_MONTH_LIMIT)
    title = t("trending.thisMonth")
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold sm:text-2xl">{title}</h2>
      </div>

      {projects.length === 0 ? (
        <div className="text-muted-foreground border-border bg-card rounded-lg border border-dashed py-8 text-center text-sm">
          {t("trending.noProjectFound")}
        </div>
      ) : (
        <div className="-mx-3 flex flex-col sm:-mx-4">
          {projects.map((project: ProjectSummary, index: number) => (
            <ProjectCard
              key={project.id}
              {...project}
              description={project.description || ""}
              websiteUrl={project.websiteUrl ?? undefined}
              commentCount={project.commentCount ?? 0}
              index={index}
              userHasUpvoted={project.userHasUpvoted ?? false}
              categories={project.categories || []}
              isAuthenticated={isAuthenticated}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default async function TrendingPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>
}) {
  const t = await getTranslations()

  const params = await searchParams
  const filter = params.filter || "today"
  const topCategories = await getTopCategories(5)

  const session = await auth.api.getSession({
    headers: await headers(),
  })
  const isAuthenticated = !!session?.user

  const todayProjects = await getTodayProjects()
  const ongoingLaunches = todayProjects.filter(
    (project) => project.launchStatus === "ongoing",
  ).length

  return (
    <main className="bg-secondary/20">
      <div className="container mx-auto min-h-screen max-w-6xl px-4 pt-8 pb-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:items-start">
          {/* Contenu principal */}
          <div className="space-y-6 sm:space-y-8 lg:col-span-2">
            <Suspense fallback={<TrendingDataSkeleton />}>
              <TrendingData filter={filter} isAuthenticated={isAuthenticated} t={t} />
            </Suspense>
          </div>

          {/* Sidebar */}
          <div className="top-24">
            {/* Quick Stats */}
            <div className="space-y-3 py-5 pt-0">
              <h3 className="flex items-center gap-2 font-semibold">{t("home.liveNow")}</h3>
              <Link
                href="/trending"
                className="bg-secondary/30 hover:bg-secondary/50 border-primary block rounded-md border-l-4 px-5 py-2 shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="text-primary text-2xl font-bold">{ongoingLaunches}</div>
                  <div className="text-sm font-medium">{t("common.activeLaunches")}</div>
                </div>
              </Link>
            </div>

            {/* Time Filters */}
            <div className="space-y-3 py-5">
              <h3 className="flex items-center gap-2 font-semibold">{t("trending.timeRange")}</h3>
              <div className="space-y-2">
                <Link
                  href="/trending?filter=today"
                  className={`-mx-2 flex items-center gap-2 rounded-md p-2 text-sm transition-colors ${
                    filter === "today" ? "bg-muted font-medium" : "hover:bg-muted/40"
                  }`}
                >
                  {t("trending.today")}
                </Link>
                <Link
                  href="/trending?filter=yesterday"
                  className={`-mx-2 flex items-center gap-2 rounded-md p-2 text-sm transition-colors ${
                    filter === "yesterday" ? "bg-muted font-medium" : "hover:bg-muted/40"
                  }`}
                >
                  {t("trending.yesterday")}
                </Link>
                <Link
                  href="/trending?filter=month"
                  className={`-mx-2 flex items-center gap-2 rounded-md p-2 text-sm transition-colors ${
                    filter === "month" ? "bg-muted font-medium" : "hover:bg-muted/40"
                  }`}
                >
                  {t("trending.thisMonth")}
                </Link>
              </div>
            </div>

            {/* Quick Access */}
            <div className="space-y-3 py-5">
              <h3 className="flex items-center gap-2 font-semibold">
                {t("categories.quickAccess")}
              </h3>
              <div className="space-y-2">
                <Link
                  href="/winners"
                  className="-mx-2 flex items-center gap-2 rounded-md p-2 text-sm transition-colors hover:underline"
                >
                  {t("home.dailyWinners")}
                </Link>
                <Link
                  href="/categories"
                  className="-mx-2 flex items-center gap-2 rounded-md p-2 text-sm transition-colors hover:underline"
                >
                  {t("categories.browseCategories")}
                </Link>
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-3 py-5">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-semibold">{t("home.topCategories")}</h3>
                <Button variant="ghost" size="sm" className="text-sm" asChild>
                  <Link href="/categories" className="flex items-center gap-1">
                    {t("common.viewAll", { gender: "female" })}
                  </Link>
                </Button>
              </div>
              <div className="space-y-2">
                {topCategories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/categories?category=${category.id}`}
                    className="hover:bg-muted/40 -mx-2 flex items-center justify-between rounded-md p-2"
                  >
                    <span className="text-sm">{category.name}</span>
                    <span className="text-muted-foreground bg-secondary rounded-full px-2 py-0.5 text-xs">
                      {category.count} projects
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
