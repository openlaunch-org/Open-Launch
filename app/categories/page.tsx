import { Suspense } from "react"
import Link from "next/link"

import { RiArrowDownSLine, RiFilterLine } from "@remixicon/react"
import { getTranslations } from "next-intl/server"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MobileCategorySelector } from "@/components/categories/mobile-category-selector"
import { ProjectCard } from "@/components/home/project-card"
import {
  getAllCategories,
  getCategoryById,
  getProjectsByCategory,
  getTopCategories,
} from "@/app/actions/projects"

export async function generateMetadata() {
  const t = await getTranslations("categories")

  return {
    title: `${t("title")} - ${process.env.NEXT_PUBLIC_APP_NAME}`,
    description: t("description"),
  }
}

// Composant Skeleton pour le chargement des chaînes
function ProjectCardSkeleton() {
  return (
    <div className="mx-3 animate-pulse rounded-xl border border-zinc-100 bg-white/70 p-3 shadow-sm sm:mx-4 sm:p-4 dark:border-zinc-800/50 dark:bg-zinc-900/30">
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
  )
}

// Composant Skeleton pour l'en-tête de catégorie
function CategoryHeaderSkeleton() {
  return (
    <div className="flex items-center justify-between">
      <div className="bg-muted h-8 w-48 animate-pulse rounded"></div>
      <div className="bg-muted h-8 w-24 animate-pulse rounded"></div>
    </div>
  )
}

function CategoryDataSkeleton() {
  return (
    <div className="space-y-3 sm:space-y-4">
      <CategoryHeaderSkeleton />
      <div className="-mx-3 flex flex-col sm:-mx-4">
        {Array(5)
          .fill(0)
          .map((_, index) => (
            <ProjectCardSkeleton key={index} />
          ))}
      </div>
    </div>
  )
}

async function CategoryData({
  categoryId,
  sort = "recent",
  page = 1,
  t,
}: {
  categoryId: string
  sort?: string
  page?: number
  t: (msg: string) => string
}) {
  const ITEMS_PER_PAGE = 10
  const currentPage = Math.max(1, page)

  const { projects: paginatedProjects, totalCount } = await getProjectsByCategory(
    categoryId,
    currentPage,
    ITEMS_PER_PAGE,
    sort,
  )

  const isAuthenticated =
    paginatedProjects.length > 0 ? typeof paginatedProjects[0].userHasUpvoted === "boolean" : false

  const categoryData = await getCategoryById(categoryId)
  if (!categoryData) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">{t("categoryNotFound")}</p>
      </div>
    )
  }

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  const getSortLabel = () => {
    switch (sort) {
      case "upvotes":
        return t("mostUpvotes")
      case "alphabetical":
        return "A-Z"
      case "recent":
      default:
        return t("mostRecent")
    }
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold sm:text-2xl">{categoryData.name}</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-1.5">
              <RiFilterLine className="h-3.5 w-3.5" />
              <span className="hidden md:block">{getSortLabel()}</span>
              <RiArrowDownSLine className="text-muted-foreground ml-1 h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem asChild>
              <Link
                href={`/categories?category=${categoryId}&sort=recent&page=1`}
                className={sort === "recent" || !sort ? "bg-muted/50 font-medium" : ""}
              >
                {t("mostRecent")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={`/categories?category=${categoryId}&sort=upvotes&page=1`}
                className={sort === "upvotes" ? "bg-muted/50 font-medium" : ""}
              >
                {t("mostUpvotes")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={`/categories?category=${categoryId}&sort=alphabetical&page=1`}
                className={sort === "alphabetical" ? "bg-muted/50 font-medium" : ""}
              >
                {t("alphabetical")}
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {totalCount === 0 ? (
        <div className="text-muted-foreground border-border bg-card rounded-lg border border-dashed py-8 text-center text-sm">
          {t("noProjects")}
          <p className="mt-2">{t("checkOtherCategories")}</p>
        </div>
      ) : (
        <div className="-mx-3 flex flex-col sm:-mx-4">
          {paginatedProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              slug={project.slug}
              name={project.name}
              description={project.description || ""}
              logoUrl={project.logoUrl || ""}
              websiteUrl={project.websiteUrl ?? undefined}
              upvoteCount={project.upvoteCount ?? 0}
              commentCount={project.commentCount ?? 0}
              launchStatus={project.launchStatus}
              launchType={project.launchType}
              dailyRanking={project.dailyRanking}
              index={index}
              isAuthenticated={isAuthenticated}
              userHasUpvoted={project.userHasUpvoted ?? false}
              categories={project.categories ?? []}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center space-x-4 border-t pt-4">
          <Button asChild variant="outline" size="sm" disabled={currentPage <= 1}>
            <Link
              href={`/categories?category=${categoryId}${sort ? `&sort=${sort}` : ""}&page=${currentPage - 1}`}
              aria-disabled={currentPage <= 1}
              className={` ${
                currentPage <= 1
                  ? "text-muted-foreground hover:text-muted-foreground pointer-events-none cursor-not-allowed opacity-50"
                  : ""
              } `}
            >
              Previous
            </Link>
          </Button>
          <span className="text-muted-foreground text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button asChild variant="outline" size="sm" disabled={currentPage >= totalPages}>
            <Link
              href={`/categories?category=${categoryId}${sort ? `&sort=${sort}` : ""}&page=${currentPage + 1}`}
              aria-disabled={currentPage >= totalPages}
              className={` ${
                currentPage >= totalPages
                  ? "text-muted-foreground hover:text-muted-foreground pointer-events-none cursor-not-allowed opacity-50"
                  : ""
              } `}
            >
              Next
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string; page?: string }>
}) {
  const t = await getTranslations("categories")
  const categories = await getAllCategories()
  const categoriesWithCount = await getTopCategories(100)

  const params = await searchParams
  const selectedCategoryId = params.category || (categories.length > 0 ? categories[0].id : "")
  const sortParam = params.sort || "recent"
  const pageParam = parseInt(params.page || "1", 10)

  const countMap = new Map()
  categoriesWithCount.forEach((cat) => {
    countMap.set(cat.id, cat.count)
  })

  return (
    <main className="bg-secondary/20">
      <div className="container mx-auto min-h-screen max-w-6xl px-4 pt-8 pb-12">
        <div className="mb-6 flex flex-col">
          <h1 className="text-2xl font-bold">{t("title")}</h1>

          <MobileCategorySelector
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            sortParam={sortParam}
          />
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:items-start">
          <div className="space-y-6 sm:space-y-8 lg:col-span-2">
            <Suspense fallback={<CategoryDataSkeleton />}>
              {selectedCategoryId ? (
                <CategoryData
                  categoryId={selectedCategoryId}
                  sort={sortParam}
                  page={pageParam}
                  t={t}
                />
              ) : (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">{t("selectCategory")}</p>
                </div>
              )}
            </Suspense>
          </div>

          <div className="top-24 hidden lg:block">
            <div className="space-y-3 py-5 pt-0">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-semibold">{t("browseCategories")}</h3>
              </div>
              <div className="-mx-2 max-h-[520px] space-y-2 overflow-y-auto pr-2">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/categories?category=${category.id}${sortParam ? `&sort=${sortParam}` : ""}&page=1`}
                    className={`flex items-center justify-between rounded-md p-2 ${
                      category.id === selectedCategoryId
                        ? "bg-muted font-medium"
                        : "hover:bg-muted/40"
                    }`}
                  >
                    <span className="text-sm">{category.name}</span>
                    <span className="text-muted-foreground bg-secondary rounded-full px-2 py-0.5 text-xs">
                      {t("projectsCount", { count: countMap.get(category.id) || 0 })}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-3 py-5">
              <h3 className="flex items-center gap-2 font-semibold">{t("quickAccess")}</h3>
              <div className="space-y-2">
                <Link
                  href="/trending"
                  className="-mx-2 flex items-center gap-2 rounded-md p-2 text-sm transition-colors hover:underline"
                >
                  {t("trendingNow")}
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
