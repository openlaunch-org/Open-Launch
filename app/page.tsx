import { headers } from "next/headers"
import Link from "next/link"

import { Megaphone } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { auth } from "@/lib/auth"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { PremiumCard } from "@/components/home/premium-card"
import { ProjectSection } from "@/components/home/project-section"
import { SponsorCard } from "@/components/home/sponsor-card"
import { WelcomeBanner } from "@/components/home/welcome-banner"
import {
  getFeaturedPremiumProjects,
  getMonthBestProjects,
  getTodayProjects,
  getYesterdayProjects,
} from "@/app/actions/home"
import { getLast7DaysVisitors } from "@/app/actions/plausible"
import { getTopCategories } from "@/app/actions/projects"

export default async function Home() {
  const t = await getTranslations("home")
  const tc = await getTranslations("common")

  // Récupérer les données réelles
  const todayProjects = await getTodayProjects()
  const yesterdayProjects = await getYesterdayProjects()
  const monthProjects = await getMonthBestProjects()
  const topCategories = await getTopCategories(5)
  const featuredPremiumProjects = await getFeaturedPremiumProjects()

  const visitorsLast7Days = await getLast7DaysVisitors()

  // // Get session
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  // Stats rapides
  const ongoingLaunches = todayProjects.filter(
    (project) => project.launchStatus === "ongoing",
  ).length

  return (
    <main className="bg-secondary/20 min-h-screen">
      <div className="container mx-auto max-w-6xl px-4 pt-8 pb-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:items-start">
          {/* Contenu principal */}
          <div className="space-y-6 sm:space-y-8 lg:col-span-2">
            <div className="space-y-4">
              <WelcomeBanner />

              {/* Featured Premium Plus Projects */}
              {featuredPremiumProjects.length > 0 && (
                <PremiumCard projects={featuredPremiumProjects} />
              )}
            </div>

            <ProjectSection
              title={t("todayProjects")}
              projects={todayProjects}
              sortByUpvotes={true}
              isAuthenticated={!!session?.user}
            />

            <ProjectSection
              title={t("yesterdayProjects")}
              projects={yesterdayProjects}
              moreHref="/trending?filter=yesterday"
              sortByUpvotes={true}
              isAuthenticated={!!session?.user}
            />

            <ProjectSection
              title={t("monthProjects")}
              projects={monthProjects}
              moreHref="/trending?filter=month"
              sortByUpvotes={true}
              isAuthenticated={!!session?.user}
            />
          </div>

          {/* Sidebar */}
          <div className="top-24">
            {/* Quick Stats */}
            <div className="space-y-3 py-5 pt-0">
              <h3 className="flex items-center gap-2 font-semibold">{t("liveNow")}</h3>
              <Link
                href="/trending"
                className="bg-secondary/30 hover:bg-secondary/50 border-primary block rounded-md border-l-4 px-5 py-2 shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="text-primary text-2xl font-bold">{ongoingLaunches}</div>
                  <div className="text-sm font-medium">{tc("activeLaunches")}</div>
                </div>
              </Link>

              {/* Last 7 Days Visitors Stat */}
              {visitorsLast7Days !== null && (
                <div className="bg-secondary/30 hover:bg-secondary/50 block rounded-md border-l-4 border-green-500 px-5 py-2 shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl font-bold text-green-600">{visitorsLast7Days}</div>
                    <div className="text-sm font-medium">{t("visitorsLast7Days")}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Featured Sponsor */}
            <div className="py-5">
              <h3 className="flex items-center gap-2 font-semibold">{t("featuredSponsor")}</h3>
              <SponsorCard
                name="ClawCloud Run"
                description="In a Jiffy. Build, Deploy and Run."
                url="https://run.claw.cloud?ref=open-launch"
                imageUrl="https://yxucdfr9f5.ufs.sh/f/M3RHr0TmpHk58nC2t7bg1XPzV7Kxo25HAvNtwa6hLcRpjB0T"
              />
              <SponsorCard
                name={t("sponsorTitle")}
                description={t("sponsorDescription")}
                url={
                  "mailto:" +
                  process.env.NEXT_PUBLIC_CONTACT_EMAIL +
                  "?subject=Sponsoring%20Inquiry"
                }
                icon={<Megaphone size={18} className="text-muted-foreground" />}
              />
            </div>

            {/* Categories */}
            <div className="space-y-3 py-5">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-semibold">{t("topCategories")}</h3>
                <Button variant="ghost" size="sm" className="text-sm" asChild>
                  <Link href="/categories" className="flex items-center gap-1">
                    {tc("viewAll", { gender: "other" })}
                  </Link>
                </Button>
              </div>
              <div className="space-y-2">
                {topCategories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/categories?category=${category.id}`}
                    className={cn(
                      "-mx-2 flex items-center justify-between rounded-md p-2",
                      category.id === "all" ? "bg-muted font-medium" : "hover:bg-muted/40",
                    )}
                  >
                    <span className="text-sm">{category.name}</span>
                    <span className="text-muted-foreground bg-secondary rounded-full px-2 py-0.5 text-xs">
                      {category.count} projects
                    </span>
                  </Link>
                ))}
              </div>
            </div>
            {/* Podium
            {yesterdayProjects.length > 0 && (
              <div className="p-5 pt-0 space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  Yesterday&apos;s Top Launches
                </h3>
                <TopLaunchesPodium topProjects={yesterdayProjects} />
              </div>
            )} */}

            {/* Quick Links */}
            <div className="space-y-3 py-5">
              <h3 className="flex items-center gap-2 font-semibold">{t("quickStats")}</h3>
              <div className="space-y-2">
                {session?.user && (
                  <Link
                    href="/dashboard"
                    className="-mx-2 flex items-center gap-2 rounded-md p-2 text-sm transition-colors hover:underline"
                  >
                    {tc("dashboard")}
                  </Link>
                )}
                <Link
                  href="/trending"
                  className="-mx-2 flex items-center gap-2 rounded-md p-2 text-sm transition-colors hover:underline"
                >
                  {t("trendingNow")}
                </Link>
                <Link
                  href="/winners"
                  className="-mx-2 flex items-center gap-2 rounded-md p-2 text-sm transition-colors hover:underline"
                >
                  {t("dailyWinners")}
                </Link>
                <Link
                  href="/trending?filter=month"
                  className="-mx-2 flex items-center gap-2 rounded-md p-2 text-sm transition-colors hover:underline"
                >
                  {t("bestOfMonth")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
