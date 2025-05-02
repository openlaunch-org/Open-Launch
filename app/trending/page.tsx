import {
  // Importer les bonnes fonctions depuis home.ts
  getTodayProjects,
  getYesterdayProjects,
  getMonthBestProjects,
} from "@/app/actions/home";
import { getTopCategories } from "@/app/actions/projects";
import Link from "next/link";
// import { RiFilterLine, RiArrowDownSLine } from "@remixicon/react";
import { ProjectCard } from "@/components/home/project-card";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";

// Importer le type Project si possible, sinon définir une interface locale
// Pour l'instant, utilisons une interface locale simplifiée
interface ProjectSummary {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  logoUrl: string;
  websiteUrl?: string | null;
  upvoteCount: number;
  commentCount?: number | null;
  launchStatus: string;
  scheduledLaunchDate?: Date | string | null;
  createdAt: Date | string;
}

export const metadata = {
  title: "Trending - Open-Launch",
  description: "Discover trending tech products on Open-Launch",
};

// Composant Skeleton principal
function TrendingDataSkeleton() {
  // Mettre ici le contenu JSX du skeleton (actuellement manquant)
  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="px-3 sm:px-4">
        <div className="h-8 w-64 bg-muted rounded animate-pulse"></div>
      </div>
      <div className="space-y-1">
        {Array(5)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="py-3 sm:py-4 px-3 sm:px-4 flex gap-3 sm:gap-4 animate-pulse mx-3 sm:mx-4 bg-white/70 dark:bg-secondary/20 border border-zinc-100 dark:border-zinc-800/50 rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-muted"></div>
              </div>
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/3 bg-muted rounded"></div>
                <div className="h-3 w-2/3 bg-muted rounded"></div>
              </div>
              <div className="flex-shrink-0 flex flex-col items-end justify-between">
                <div className="h-5 w-14 bg-muted rounded-full"></div>
                <div className="h-4 w-10 bg-muted rounded"></div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

// Composant pour afficher les données
async function TrendingData({ filter }: { filter: string }) {
  let projects: ProjectSummary[] = []; // Utiliser le type défini
  let title;

  // Appeler les bonnes fonctions
  if (filter === "today") {
    projects = await getTodayProjects();
    title = "Today's Launches";
  } else if (filter === "yesterday") {
    projects = await getYesterdayProjects();
    title = "Yesterday's Launches";
  } else {
    projects = await getMonthBestProjects();
    title = "Best of the Month";
  }

  const sortedProjects = [...projects];
  if (filter === "month") {
    sortedProjects.sort((a, b) => b.upvoteCount - a.upvoteCount);
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
          {title}
        </h2>
        {/* Retirer le dropdown de tri qui n'était pas utilisé */}
      </div>

      {sortedProjects.length === 0 ? (
        <div className="bg-white/70 dark:bg-secondary/20 border border-zinc-100 dark:border-zinc-800/50 rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-6 text-center mx-3 sm:mx-4">
          <p className="text-muted-foreground">
            No projects found for this period.
          </p>
          {/* Retirer le message de chargement désactivé */}
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
              index={index + 1}
              userHasUpvoted={false}
              categories={[]}
              isAuthenticated={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default async function TrendingPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const params = await searchParams;
  const filter = params.filter || "today";
  const topCategories = await getTopCategories(5);

  // Appeler la bonne fonction pour les stats rapides
  const todayProjects = await getTodayProjects();
  const ongoingLaunches = todayProjects.filter(
    (project) => project.launchStatus === "ongoing"
  ).length;

  return (
    <main className="bg-secondary/20">
      <div className="container max-w-6xl mx-auto px-4 pt-8 pb-12 min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:items-start">
          {/* Contenu principal */}
          <div className="md:col-span-2">
            <Suspense fallback={<TrendingDataSkeleton />}>
              <TrendingData filter={filter} />
            </Suspense>
          </div>

          {/* Sidebar */}
          <div className="space-y-3">
            {/* Quick Stats */}
            <div className="p-5 pt-0 space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                Live Now
              </h3>
              <Link
                href="/trending"
                className="bg-secondary/30 hover:bg-secondary/50 px-5 py-2 rounded-md block transition-colors border-l-4 border-primary shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
              >
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold text-primary">
                    {ongoingLaunches}
                  </div>
                  <div className="text-sm font-medium">Active Launches</div>
                </div>
              </Link>
            </div>

            {/* Time Filters */}
            <div className="p-5 space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                Time Range
              </h3>
              <div className="space-y-2">
                <Link
                  href="/trending?filter=today"
                  className={`flex items-center gap-2 text-sm p-2 rounded-md transition-colors ${
                    filter === "today"
                      ? "bg-muted font-medium"
                      : "hover:bg-muted/40"
                  }`}
                >
                  Today&apos;s Launches
                </Link>
                <Link
                  href="/trending?filter=yesterday"
                  className={`flex items-center gap-2 text-sm p-2 rounded-md transition-colors ${
                    filter === "yesterday"
                      ? "bg-muted font-medium"
                      : "hover:bg-muted/40"
                  }`}
                >
                  Yesterday&apos;s Launches
                </Link>
                <Link
                  href="/trending?filter=month"
                  className={`flex items-center gap-2 text-sm p-2 rounded-md transition-colors ${
                    filter === "month"
                      ? "bg-muted font-medium"
                      : "hover:bg-muted/40"
                  }`}
                >
                  This Month&apos;s Best
                </Link>
              </div>
            </div>
            {/* Quick Access */}
            <div className="p-5 space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                Quick Access
              </h3>
              <div className="space-y-2">
                <Link
                  href="/winners"
                  className="flex items-center gap-2 text-sm p-2 hover:underline rounded-md transition-colors"
                >
                  Daily Winners
                </Link>
                <Link
                  href="/categories"
                  className="flex items-center gap-2 text-sm p-2 hover:underline rounded-md transition-colors"
                >
                  Browse Categories
                </Link>
              </div>
            </div>

            {/* Categories */}
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                  Top Categories
                </h3>
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
                    className="flex items-center justify-between rounded-md p-2 hover:bg-muted/40"
                  >
                    <span className="text-sm hover:underline">
                      {category.name}
                    </span>
                    {/* Adapter le texte */}
                    <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
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
  );
}
