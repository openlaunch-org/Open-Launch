import { NextRequest, NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { db } from "@/drizzle/db";
import { category, project } from "@/drizzle/db/schema";
import { ilike, sql } from "drizzle-orm";
import { checkRateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";
import { API_RATE_LIMITS } from "@/lib/constants";

// Définir le type de retour pour la recherche
export interface SearchResult {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  logoUrl: string | null;
  type: "project" | "category";
}

// Fonction de recherche avec mise en cache
const getSearchResults = unstable_cache(
  async (query: string, limit: number = 10): Promise<SearchResult[]> => {
    console.log(`[Search API] Searching for: "${query}"`);

    // Vérifier si la requête est valide
    if (!query || query.length < 2) {
      return [];
    }

    try {
      // Rechercher dans les projets
      const projects = await db
        .select({
          id: project.id,
          name: project.name,
          slug: project.slug,
          description: project.description,
          logoUrl: project.logoUrl,
          type: sql<"project">`'project'`.as("type"),
        })
        .from(project)
        .where(ilike(project.name, `%${query}%`))
        .limit(limit);

      // Rechercher dans les catégories
      const categories = await db
        .select({
          id: category.id,
          name: category.name,
          slug: sql<string | null>`null`.as("slug"),
          description: sql<string | null>`null`.as("description"),
          logoUrl: sql<string | null>`null`.as("logoUrl"),
          type: sql<"category">`'category'`.as("type"),
        })
        .from(category)
        .where(ilike(category.name, `%${query}%`))
        .limit(limit);

      // Formater les résultats
      const formattedProjects: SearchResult[] = projects.map((proj) => ({
        id: proj.id,
        name: proj.name,
        slug: proj.slug,
        description: proj.description,
        logoUrl: proj.logoUrl,
        type: "project" as const,
      }));

      const formattedCategories: SearchResult[] = categories.map(
        (category) => ({
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description,
          logoUrl: category.logoUrl,
          type: "category" as const,
        })
      );

      // Combiner et limiter les résultats
      const combinedResults = [
        ...formattedProjects,
        ...formattedCategories,
      ].slice(0, limit);

      console.log(`[Search API] Found ${combinedResults.length} results`);
      return combinedResults;
    } catch (error) {
      console.error("[Search API] Error searching:", error);
      return [];
    }
  },
  ["search-results"],
  { revalidate: 60 } // Revalider le cache toutes les 60 secondes
);

export async function GET(request: NextRequest) {
  try {
    // Obtenir l'IP du client
    const headersList = await headers();
    const forwardedFor = headersList.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    // Vérifier la limite de taux avec les constantes spécifiques pour la recherche
    const rateLimitResult = await checkRateLimit(
      `search-api:${ip}`,
      API_RATE_LIMITS.SEARCH.REQUESTS,
      API_RATE_LIMITS.SEARCH.WINDOW
    );

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: "rate_limit_exceeded",
          message: `Too many requests. Please wait ${rateLimitResult.reset} seconds before trying again.`,
          reset: rateLimitResult.reset,
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": API_RATE_LIMITS.SEARCH.REQUESTS.toString(),
            "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
            "X-RateLimit-Reset": rateLimitResult.reset.toString(),
          },
        }
      );
    }

    // Récupérer les paramètres de recherche
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") || "";
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    // Obtenir les résultats de recherche
    const results = await getSearchResults(query, limit);

    // Retourner les résultats avec les en-têtes de rate limit
    return NextResponse.json(
      { results },
      {
        headers: {
          "X-RateLimit-Limit": API_RATE_LIMITS.SEARCH.REQUESTS.toString(),
          "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
          "X-RateLimit-Reset": rateLimitResult.reset.toString(),
        },
      }
    );
  } catch (error) {
    console.error("[Search API] Error processing request:", error);
    return NextResponse.json(
      {
        error: "search_failed",
        message:
          "An error occurred while processing your search request. Please try again later.",
      },
      { status: 500 }
    );
  }
}
