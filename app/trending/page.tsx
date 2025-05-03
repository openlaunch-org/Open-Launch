import { Suspense } from "react"
import { headers } from "next/headers"
import Link from "next/link"

import { auth } from "@/lib/auth"
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

export const metadata = {
  title: "Trending - Open-Launch",
  description: "Discover trending tech products on Open-Launch",
}

// Composant Skeleton principal
function TrendingDataSkeleton() {
  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="px-3 sm:px-4">
        <div className="bg-muted h-8 w-64 animate-pulse rounded"></div>
      </div>
      <div className="space-y-1">
        {Array(5)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="dark:bg-secondary/20 mx-3 flex animate-pulse gap-3 rounded-lg border border-zinc-100 bg-white/70 px-3 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.05)] sm:mx-4 sm:gap-4 sm:px-4 sm:py-4 dark:border-zinc-800/50"
            >
              <div className="flex-shrink-0">
                <div className="bg-muted h-12 w-12 rounded-lg sm:h-14 sm:w-14"></div>
              </div>
              <div className="flex-1 space-y-2">
                <div className="bg-muted h-4 w-1/3 rounded"></div>
                <div className="bg-muted h-3 w-2/3 rounded"></div>
              </div>
              <div className="flex flex-shrink-0 flex-col items-end justify-between">
                <div className="bg-muted h-5 w-14 rounded-full"></div>
                <div className="bg-muted h-4 w-10 rounded"></div>
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
}: {
  filter: string
  isAuthenticated: boolean
}) {
  let projects: ProjectSummary[] = [] // Utiliser le type défini
  let title

  // Appeler les bonnes fonctions
  if (filter === "today") {
    projects = await getTodayProjects()
    title = "Today's Launches"
  } else if (filter === "yesterday") {
    projects = await getYesterdayProjects()
    title = "Yesterday's Launches"
  } else {
    projects = await getMonthBestProjects()
    title = "Best of the Month"
  }

  const sortedProjects = [...projects]
  if (filter === "month") {
    sortedProjects.sort((a, b) => b.upvoteCount - a.upvoteCount)
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xl font-bold sm:text-2xl">{title}</h2>
      </div>

      {sortedProjects.length === 0 ? (
        <div className="dark:bg-secondary/20 mx-3 rounded-lg border border-zinc-100 bg-white/70 p-6 text-center shadow-[0_1px_3px_rgba(0,0,0,0.05)] sm:mx-4 dark:border-zinc-800/50">
          <p className="text-muted-foreground">No projects found for this period.</p>
        </div>
      ) : (
        <div className="space-y-1">
          {sortedProjects.map((project: ProjectSummary, index: number) => (
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
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:items-start">
          {/* Contenu principal */}
          <div className="md:col-span-2">
            <Suspense fallback={<TrendingDataSkeleton />}>
              <TrendingData filter={filter} isAuthenticated={isAuthenticated} />
            </Suspense>
          </div>

          {/* Sidebar */}
          <div className="space-y-3">
            {/* Quick Stats */}
            <div className="space-y-3 p-5 pt-0">
              <h3 className="flex items-center gap-2 font-semibold">Live Now</h3>
              <Link
                href="/trending"
                className="bg-secondary/30 hover:bg-secondary/50 border-primary block rounded-md border-l-4 px-5 py-2 shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="text-primary text-2xl font-bold">{ongoingLaunches}</div>
                  <div className="text-sm font-medium">Active Launches</div>
                </div>
              </Link>
            </div>

            {/* Time Filters */}
            <div className="space-y-3 p-5">
              <h3 className="flex items-center gap-2 font-semibold">Time Range</h3>
              <div className="space-y-2">
                <Link
                  href="/trending?filter=today"
                  className={`flex items-center gap-2 rounded-md p-2 text-sm transition-colors ${
                    filter === "today" ? "bg-muted font-medium" : "hover:bg-muted/40"
                  }`}
                >
                  Today&apos;s Launches
                </Link>
                <Link
                  href="/trending?filter=yesterday"
                  className={`flex items-center gap-2 rounded-md p-2 text-sm transition-colors ${
                    filter === "yesterday" ? "bg-muted font-medium" : "hover:bg-muted/40"
                  }`}
                >
                  Yesterday&apos;s Launches
                </Link>
                <Link
                  href="/trending?filter=month"
                  className={`flex items-center gap-2 rounded-md p-2 text-sm transition-colors ${
                    filter === "month" ? "bg-muted font-medium" : "hover:bg-muted/40"
                  }`}
                >
                  This Month&apos;s Best
                </Link>
              </div>
            </div>
            {/* Quick Access */}
            <div className="space-y-3 p-5">
              <h3 className="flex items-center gap-2 font-semibold">Quick Access</h3>
              <div className="space-y-2">
                <Link
                  href="/winners"
                  className="flex items-center gap-2 rounded-md p-2 text-sm transition-colors hover:underline"
                >
                  Daily Winners
                </Link>
                <Link
                  href="/categories"
                  className="flex items-center gap-2 rounded-md p-2 text-sm transition-colors hover:underline"
                >
                  Browse Categories
                </Link>
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-3 p-5">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-semibold">Top Categories</h3>
                <Button variant="ghost" size="sm" className="text-sm" asChild>
                  <Link href="/categories" className="flex items-center gap-1">
                    View all
                  </Link>
                </Button>
              </div>
              <div className="space-y-2">
                {topCategories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/categories?category=${category.id}`}
                    className="hover:bg-muted/40 flex items-center justify-between rounded-md p-2"
                  >
                    <span className="text-sm hover:underline">{category.name}</span>
                    {/* Adapter le texte */}
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
