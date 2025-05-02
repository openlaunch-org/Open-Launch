export const LAUNCH_LIMITS = {
  FREE_DAILY_LIMIT: 5,
  PREMIUM_DAILY_LIMIT: 12,
  PREMIUM_PLUS_DAILY_LIMIT: 3,
  TOTAL_DAILY_LIMIT: 20,
} as const;

export const PROJECT_LIMITS_VARIABLES = {
  TODAY_LIMIT: 20, // par defaut
  YESTERDAY_LIMIT: 5, // par defaut
  MONTH_LIMIT: 5, // par defaut
  VIEW_ALL_PAGE_TODAY_YESTERDAY_LIMIT: 20, // Nombre de lancements max par jour
  VIEW_ALL_PAGE_MONTH_LIMIT: 20,
} as const;

export const LAUNCH_SETTINGS = {
  PREMIUM_PRICE: 10, // USD
  PREMIUM_PLUS_PRICE: 25, // USD
  MIN_DAYS_AHEAD: 1, // Minimum days ahead for scheduling (starting from tomorrow)
  MAX_DAYS_AHEAD: 90, // Maximum days ahead for scheduling (3 months)
  PREMIUM_MIN_DAYS_AHEAD: 1, // Premium users can schedule sooner
  PREMIUM_MAX_DAYS_AHEAD: 30, // Premium users have a shorter window
  PREMIUM_PLUS_MIN_DAYS_AHEAD: 1, // Premium Plus users can schedule even sooner
  PREMIUM_PLUS_MAX_DAYS_AHEAD: 14, // Premium Plus users have the shortest window
  DAYS_PER_PAGE: 7, // Nombre de jours à afficher par page
  LAUNCH_HOUR_UTC: 8, // All launches happen at 8 AM UTC
} as const;

export const LAUNCH_TYPES = {
  FREE: "free",
  PREMIUM: "premium",
  PREMIUM_PLUS: "premium_plus",
} as const;

export const DATE_FORMAT = {
  DISPLAY: "EEE, MMM d, yyyy", // Format: Mon, Jan 1, 2024
  DISPLAY_MONTH: "MMMM yyyy", // Format: January 2024
  DISPLAY_DAY: "EEE d", // Format: Mon 1
  API: "yyyy-MM-dd",
  FULL: "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", // Full ISO format with time
} as const;

// Rate limits spécifiques pour différentes API
export const API_RATE_LIMITS = {
  SEARCH: {
    REQUESTS: 15, // 15 requêtes
    WINDOW: 60 * 1000, // par minute
  },
  DEFAULT: {
    REQUESTS: 10, // 10 requêtes
    WINDOW: 60 * 1000, // par minute
  },
} as const;

// Limites pour les upvotes
export const UPVOTE_LIMITS = {
  ACTIONS_PER_WINDOW: 100, // Nombre maximal d'actions d'upvote par fenêtre de temps
  TIME_WINDOW_MS: 5 * 60 * 1000, // Fenêtre de temps pour le rate limit (5 minutes)
  TIME_WINDOW_MINUTES: 5, // Fenêtre de temps pour le rate limit (5 minutes)
  MIN_TIME_BETWEEN_ACTIONS_MS: 2000, // Temps minimum entre deux actions sur le même projet (2 secondes)
  MIN_TIME_BETWEEN_ACTIONS_SECONDS: 2, // Temps minimum entre deux actions sur le même projet (2 secondes)
  DEBOUNCE_TIME_MS: 500, // Temps de debounce côté client (500ms)
} as const;

export const PREMIUM_PAYMENT_LINK =
  process.env.NEXT_PUBLIC_PREMIUM_PAYMENT_LINK!;
export const PREMIUM_PLUS_PAYMENT_LINK =
  process.env.NEXT_PUBLIC_PREMIUM_PLUS_PAYMENT_LINK!;
