import {
  getAllCategories,
  getProjectsByCategory,
  getCategoryById,
  getTopCategories,
} from "@/app/actions/projects";
import Link from "next/link";
import { RiFilterLine, RiArrowDownSLine } from "@remixicon/react";
import { Suspense } from "react";
import { ProjectCard } from "@/components/home/project-card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MobileCategorySelector } from "@/components/categories/mobile-category-selector";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const metadata = {
  title: "Categories - Open-Launch",
  description: "Browse tech products by category on Open-Launch",
};

// Composant Skeleton pour le chargement des chaînes
function ProjectCardSkeleton() {
  return (
    <div className="py-3 sm:py-4 px-3 sm:px-4 flex gap-3 sm:gap-4 animate-pulse mx-3 sm:mx-4 bg-white/70 dark:bg-secondary/20 border border-zinc-100 dark:border-zinc-800/50 rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
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
  );
}

// Composant Skeleton pour l'en-tête de catégorie
function CategoryHeaderSkeleton() {
  return (
    <div className="flex items-center justify-between px-3 sm:px-4">
      <div className="h-8 w-48 bg-muted rounded animate-pulse"></div>
      <div className="h-8 w-24 bg-muted rounded animate-pulse"></div>
    </div>
  );
}

// Composant Skeleton pour l'ensemble de la section
function CategoryDataSkeleton() {
  return (
    <div className="space-y-3 sm:space-y-4">
      <CategoryHeaderSkeleton />
      <div className="space-y-1">
        {Array(5)
          .fill(0)
          .map((_, index) => (
            <ProjectCardSkeleton key={index} />
          ))}
      </div>
    </div>
  );
}

// Composant pour charger les données de la catégorie et afficher les projets
async function CategoryData({
  categoryId,
  sort = "recent",
}: {
  categoryId: string;
  sort?: string;
}) {
  // Récupérer les projets ET la session utilisateur en parallèle
  const [projects, category, session] = await Promise.all([
    getProjectsByCategory(categoryId),
    getCategoryById(categoryId),
    auth.api.getSession({ headers: await headers() }), // Obtenir la session
  ]);

  // Déterminer si l'utilisateur est authentifié
  const isAuthenticated = Boolean(session?.user);

  if (!category) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Category not found.</p>
      </div>
    );
  }

  // Trier les projets
  const sortedProjects = [...projects].sort((a, b) => {
    switch (sort) {
      case "upvotes":
        // Assurer que upvoteCount est un nombre
        return (b.upvoteCount ?? 0) - (a.upvoteCount ?? 0);
      case "alphabetical":
        return a.name.localeCompare(b.name);
      case "recent":
      default:
        // Assurer que createdAt est une Date valide
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
    }
  });

  // Obtenir le label à afficher pour le tri actuel
  const getSortLabel = () => {
    switch (sort) {
      case "upvotes":
        return "Most Upvotes";
      case "alphabetical":
        return "A-Z";
      case "recent":
      default:
        return "Most Recent";
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
          {category.name}
        </h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 gap-1.5">
              <RiFilterLine className="h-3.5 w-3.5" />
              <span className="hidden md:block">{getSortLabel()}</span>
              <RiArrowDownSLine className="h-3.5 w-3.5 text-muted-foreground ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem asChild>
              <Link
                href={`/categories?category=${categoryId}&sort=recent`}
                className={
                  sort === "recent" || !sort ? "bg-muted/50 font-medium" : ""
                }
              >
                Most Recent
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={`/categories?category=${categoryId}&sort=upvotes`}
                className={sort === "upvotes" ? "bg-muted/50 font-medium" : ""}
              >
                Most Upvotes
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={`/categories?category=${categoryId}&sort=alphabetical`}
                className={
                  sort === "alphabetical" ? "bg-muted/50 font-medium" : ""
                }
              >
                Alphabetical
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {sortedProjects.length === 0 ? (
        <div className="bg-white/70 dark:bg-secondary/20 border border-zinc-100 dark:border-zinc-800/50 rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.05)] p-6 text-center mx-3 sm:mx-4">
          <p className="text-muted-foreground">
            No projects in this category yet.
          </p>
          <p className="text-sm mt-2">
            Check other categories or come back later.
          </p>
        </div>
      ) : (
        <div className="flex flex-col">
          {sortedProjects.map((project, index) => (
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
              index={index}
              isAuthenticated={isAuthenticated}
              userHasUpvoted={project.userHasUpvoted ?? false}
              categories={project.categories ?? []}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string }>;
}) {
  // Récupérer toutes les catégories avec leur nombre de projets
  const categoriesWithCount = await getTopCategories(100); // On demande un grand nombre pour avoir toutes les catégories
  const categories = await getAllCategories();

  // Utiliser la première catégorie par défaut si aucune n'est spécifiée
  const params = await searchParams;
  const selectedCategoryId =
    params.category || (categories.length > 0 ? categories[0].id : "");
  const sortParam = params.sort || "recent";

  // Créer un mapping pour accéder facilement au nombre de projets par catégorie
  const countMap = new Map();
  categoriesWithCount.forEach((cat) => {
    countMap.set(cat.id, cat.count);
  });

  return (
    <main className="bg-secondary/20">
      <div className="container max-w-6xl mx-auto px-4 pt-8 pb-12 min-h-screen">
        <div className="flex flex-col mb-6">
          <h1 className="text-2xl font-bold ">Categories</h1>

          {/* Sélecteur de catégorie pour mobile */}
          <MobileCategorySelector
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            sortParam={sortParam}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:items-start">
          {/* Contenu principal - Projets de la catégorie sélectionnée */}
          <div className="md:col-span-2">
            <Suspense fallback={<CategoryDataSkeleton />}>
              {selectedCategoryId && (
                <CategoryData
                  categoryId={selectedCategoryId}
                  sort={sortParam}
                />
              )}
            </Suspense>
          </div>

          {/* Sidebar - Sélecteur de catégories (visible uniquement sur desktop) */}
          <div className="hidden md:block space-y-3">
            {/* Categories Box */}
            <div className="p-5 pt-0 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                  Browse Categories
                </h3>
              </div>
              <div className="space-y-2 max-h-[520px] overflow-y-auto pr-2">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/categories?category=${category.id}${
                      sortParam ? `&sort=${sortParam}` : ""
                    }`}
                    className={`flex items-center justify-between rounded-md p-2 ${
                      category.id === selectedCategoryId
                        ? "bg-muted font-medium"
                        : "hover:bg-muted/40"
                    }`}
                  >
                    <span className="text-sm hover:underline">
                      {category.name}
                    </span>
                    <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                      {countMap.get(category.id) || 0} projects
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Links Box */}
            <div className="p-5 space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                Quick Access
              </h3>
              <div className="space-y-2">
                <Link
                  href="/trending"
                  className="flex items-center gap-2 text-sm p-2 hover:underline rounded-md transition-colors"
                >
                  Trending Now
                </Link>
                <Link
                  href="/trending?filter=month"
                  className="flex items-center gap-2 text-sm p-2 hover:underline rounded-md transition-colors"
                >
                  Best of Month
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
