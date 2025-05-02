"use client";

import { useState, useEffect, useRef } from "react";
import { SearchResult } from "@/app/api/search/route";

interface UseSearchOptions {
  debounceMs?: number;
  minLength?: number;
}

interface UseSearchResult {
  query: string;
  setQuery: (query: string) => void;
  results: SearchResult[];
  isLoading: boolean;
  error: string | null;
}

// Interface pour la validation des résultats
interface ResultValidation {
  id: string;
  name: string;
  type: string;
  [key: string]: unknown;
}

// Interface pour les erreurs API
interface ApiError {
  error: string;
  message: string;
  reset?: number;
}

export function useSearch({
  debounceMs = 300,
  minLength = 2,
}: UseSearchOptions = {}): UseSearchResult {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Référence pour le timeout de debounce
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Annuler le timeout précédent
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Réinitialiser les résultats si la requête est trop courte
    if (!query || query.length < minLength) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    // Définir un nouveau timeout pour le debounce
    setIsLoading(true);
    timeoutRef.current = setTimeout(async () => {
      try {
        console.log(`[useSearch] Searching for: "${query}"`);

        // Appeler l'API de recherche
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(query)}`
        );

        const data = await response.json();

        if (!response.ok) {
          // Gérer les erreurs API de manière structurée
          const apiError = data as ApiError;

          if (response.status === 429) {
            // Rate limit - ce n'est pas une erreur critique, juste une limitation
            console.log(`[useSearch] Rate limit reached: ${apiError.message}`);
            setError(
              apiError.message ||
                `Too many requests. Please wait before trying again.`
            );
          } else {
            // Autres erreurs
            throw new Error(
              apiError.message || `Search request failed (${response.status})`
            );
          }

          setResults([]);
          return;
        }

        console.log("[useSearch] Results received:", data);

        if (data && data.results && Array.isArray(data.results)) {
          console.log(`[useSearch] ${data.results.length} results found`);

          // Vérifier que chaque résultat a les propriétés requises
          const validResults = data.results.filter(
            (result: ResultValidation) =>
              result &&
              typeof result === "object" &&
              "id" in result &&
              "name" in result &&
              "type" in result
          );

          console.log(
            `[useSearch] ${validResults.length} valid results after filtering`
          );
          setResults(validResults as SearchResult[]);
          setError(null);
        } else {
          console.warn("[useSearch] Results are not an array:", data);
          setResults([]);
        }
      } catch (err) {
        console.error("[useSearch] Search error:", err);
        // Afficher le message d'erreur spécifique ou un message générique
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred while searching. Please try again later."
        );
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, debounceMs);

    // Nettoyer le timeout lors du démontage
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [query, debounceMs, minLength]);

  return {
    query,
    setQuery,
    results,
    isLoading,
    error,
  };
}
