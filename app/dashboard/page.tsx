import { headers } from "next/headers"
import Image from "next/image"
import Link from "next/link"

import {
  RiAddLine,
  RiCalendarLine,
  RiFireLine,
  RiHashtag,
  RiRocketLine,
  RiThumbUpLine,
} from "@remixicon/react"
import { getTranslations } from "next-intl/server"

import { auth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardProjectCard } from "@/components/dashboard/dashboard-project-card"
import { getUserCreatedProjects, getUserUpvotedProjects } from "@/app/actions/projects"

// Base project type that matches the actual structure from the database
interface BaseProject {
  id: string
  name: string
  slug: string
  logoUrl: string
  description: string
  launchStatus: string
  scheduledLaunchDate?: string | Date | null
  upvoteCount?: string | number | null
  commentCount?: string | number | null
  websiteUrl?: string | null
  createdAt: string | Date
  createdBy?: string | null
  dailyRanking?: number | null
}

export default async function Dashboard() {
  const t = await getTranslations("dashboard")

  const session = await auth.api.getSession({
    headers: await headers(),
  })

  // If user is not logged in, we shouldn't be here
  if (!session?.user?.id) {
    return null
  }

  // Get data from actions
  const upvotedProjectsData = await getUserUpvotedProjects()
  const createdProjectsData = await getUserCreatedProjects()

  // Process the data to match our expected formats
  const upvotedProjects = upvotedProjectsData.map((item) => item.project) as BaseProject[]
  const createdProjects = createdProjectsData as BaseProject[]

  // projects with badge (launched + top 3)
  const badgeProjects = createdProjects.filter(
    (project) =>
      project.launchStatus === "launched" && project.dailyRanking && project.dailyRanking <= 3,
  )

  const upcomingLaunches = createdProjects.filter((project) => project.launchStatus === "scheduled")

  const activeLaunches = createdProjects.filter((project) => project.launchStatus === "ongoing")

  const previousLaunches = createdProjects.filter((project) => project.launchStatus === "launched")

  return (
    <div className="min-h-[calc(100vh-64px)] py-6 sm:py-8">
      <div className="mx-auto max-w-6xl px-4">
        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="font-heading text-2xl font-bold sm:text-3xl">{t("title")}</h1>
              <p className="text-muted-foreground">{t("welcome", { name: session?.user?.name })}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" asChild>
                <Link href="/">{t("exploreLaunches")}</Link>
              </Button>
              <Button asChild>
                <Link
                  href="/projects/submit"
                  className="flex w-full items-center justify-center gap-2 sm:w-auto"
                >
                  <RiAddLine className="h-4 w-4" />
                  {t("submitProject")}
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column - My Projects */}
          <div className="space-y-6 lg:col-span-2">
            <Card className="border dark:border-zinc-800">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="font-heading text-xl font-semibold">
                    {t("myProjects")}
                  </CardTitle>
                </div>
                <CardDescription>{t("manageProjects")}</CardDescription>
              </CardHeader>
              <CardContent className="pb-1">
                <Tabs defaultValue="active">
                  <TabsList className="mb-4 grid w-full grid-cols-3">
                    <TabsTrigger
                      value="active"
                      className="cursor-pointer px-1 py-1.5 text-xs sm:px-3 sm:py-1 sm:text-sm"
                    >
                      {t("active")} ({activeLaunches.length})
                    </TabsTrigger>
                    <TabsTrigger
                      value="upcoming"
                      className="cursor-pointer px-1 py-1.5 text-xs sm:px-3 sm:py-1 sm:text-sm"
                    >
                      {t("upcoming")} ({upcomingLaunches.length})
                    </TabsTrigger>
                    <TabsTrigger
                      value="past"
                      className="cursor-pointer px-1 py-1.5 text-xs sm:px-3 sm:py-1 sm:text-sm"
                    >
                      {t("past")} ({previousLaunches.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="upcoming" className="mt-0">
                    {upcomingLaunches.length > 0 ? (
                      <div className="space-y-3">
                        {upcomingLaunches.map((project) => (
                          <DashboardProjectCard key={project.id} {...project} />
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 text-center">
                        <div className="bg-secondary/50 mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full">
                          <RiCalendarLine className="text-muted-foreground h-6 w-6" />
                        </div>
                        <h3 className="mb-1 font-medium">{t("noUpcoming")}</h3>
                        <p className="text-muted-foreground mb-4 text-sm">{t("noUpcomingDesc")}</p>
                        <Button size="sm" asChild>
                          <Link href="/projects/submit">{t("submitProject")}</Link>
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="active" className="mt-0">
                    {activeLaunches.length > 0 ? (
                      <div className="space-y-3">
                        {activeLaunches.map((project) => (
                          <DashboardProjectCard key={project.id} {...project} />
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 text-center">
                        <div className="bg-secondary/50 mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full">
                          <RiRocketLine className="text-muted-foreground h-6 w-6" />
                        </div>
                        <h3 className="mb-1 font-medium">{t("noActive")}</h3>
                        <p className="text-muted-foreground mb-4 text-sm">{t("noActiveDesc")}</p>
                        <Button size="sm" asChild>
                          <Link href="/projects/submit">{t("submitProject")}</Link>
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="past" className="mt-0">
                    {previousLaunches.length > 0 ? (
                      <div className="space-y-3">
                        {previousLaunches.map((project) => (
                          <DashboardProjectCard key={project.id} {...project} />
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 text-center">
                        <div className="bg-secondary/50 mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full">
                          <RiRocketLine className="text-muted-foreground h-6 w-6" />
                        </div>
                        <h3 className="mb-1 font-medium">{t("noPast")}</h3>
                        <p className="text-muted-foreground mb-4 text-sm">{t("noPastDesc")}</p>
                        <Button size="sm" asChild>
                          <Link href="/projects/submit">{t("submitProject")}</Link>
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Section Badges */}
            {badgeProjects.length > 0 && (
              <Card className="border dark:border-zinc-800">
                <CardHeader className="pb-3">
                  <CardTitle className="font-heading text-xl font-semibold">
                    {t("yourBadges")}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {t("badgesDesc")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 pt-0">
                  {badgeProjects.map((project) => (
                    <DashboardProjectCard
                      key={project.id}
                      {...project}
                      actionButton={
                        <Button
                          asChild
                          variant="default"
                          size="sm"
                          className="h-8 w-full px-4 text-sm font-semibold sm:w-auto"
                          title={t("seeBadge")}
                        >
                          <Link href={`/projects/${project.slug}/badges`}>{t("badges")}</Link>
                        </Button>
                      }
                    />
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Recent Upvotes Section */}
            <Card className="border dark:border-zinc-800">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="font-heading text-xl font-semibold">
                    {t("recentUpvotes")}
                  </CardTitle>
                </div>
                <CardDescription>{t("upvotesDesc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upvotedProjects.length > 0 ? (
                    upvotedProjects
                      .slice(0, 4)
                      .map((project) => <DashboardProjectCard key={project.id} {...project} />)
                  ) : (
                    <div className="py-6 text-center">
                      <div className="bg-secondary/50 mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full">
                        <RiThumbUpLine className="text-muted-foreground h-6 w-6" />
                      </div>
                      <h3 className="mb-1 font-medium">{t("noUpvotes")}</h3>
                      <p className="text-muted-foreground mb-4 text-sm">{t("noUpvotesDesc")}</p>
                      <Button size="sm" asChild>
                        <Link href="/trending">{t("exploreProjects")}</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Profile and Actions */}
          <div className="space-y-6">
            <Card className="border dark:border-zinc-800">
              <CardHeader className="pb-3">
                <CardTitle className="font-heading text-xl font-semibold">{t("profile")}</CardTitle>
                <CardDescription>{t("accountInfo")}</CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 overflow-hidden rounded-full border">
                    {session?.user?.image ? (
                      <Image
                        src={session?.user?.image}
                        alt={session?.user?.name || "User"}
                        width={64}
                        height={64}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center object-cover text-2xl font-bold">
                        {session?.user?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-lg font-medium">{session?.user?.name}</h4>
                    <p className="text-muted-foreground text-sm">{session?.user?.email}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2 pt-0">
                <Button variant="outline" asChild className="w-full">
                  <Link href="/settings" className="flex items-center justify-center gap-2">
                    <RiRocketLine className="h-4 w-4" />
                    {t("editProfile")}
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="border dark:border-zinc-800">
              <CardHeader>
                <CardTitle className="font-heading text-xl font-semibold">
                  {t("quickActions")}
                </CardTitle>
                <CardDescription>{t("quickActionsDesc")}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                <Button variant="outline" asChild className="justify-start">
                  <Link href="/projects/submit" className="flex items-center gap-2">
                    <RiAddLine className="h-4 w-4" />
                    {t("submitProject")}
                  </Link>
                </Button>
                <Button variant="outline" asChild className="justify-start">
                  <Link href="/" className="flex items-center gap-2">
                    <RiRocketLine className="h-4 w-4" />
                    {t("exploreLaunches")}
                  </Link>
                </Button>
                <Button variant="outline" asChild className="justify-start">
                  <Link href="/winners" className="flex items-center gap-2">
                    <RiRocketLine className="h-4 w-4" />
                    {t("winners")}
                  </Link>
                </Button>
                <Button variant="outline" asChild className="justify-start">
                  <Link href="/trending" className="flex items-center gap-2">
                    <RiFireLine className="h-4 w-4" />
                    {t("trendingProjects")}
                  </Link>
                </Button>
                <Button variant="outline" asChild className="justify-start">
                  <Link href="/categories" className="flex items-center gap-2">
                    <RiHashtag className="h-4 w-4" />
                    {t("exploreCategories")}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
