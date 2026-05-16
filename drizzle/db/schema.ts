import {
  boolean,
  index,
  integer,
  json,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"

import { launchStatus, pricingType } from "@/lib/project-enums"

// Launch status enum lives in `lib/project-enums.ts` so client
// components can import without dragging the schema graph into the
// browser bundle. Re-export for server-side compatibility.
export { launchStatus } from "@/lib/project-enums"

export type LaunchStatus = (typeof launchStatus)[keyof typeof launchStatus]

// Launch type enum
export const launchType = {
  FREE: "free",
  FREE_WITH_BADGE: "free_with_badge",
  PREMIUM: "premium",
  PREMIUM_PLUS: "premium_plus",
} as const

export type LaunchType = (typeof launchType)[keyof typeof launchType]

// Pure-data enums live in `lib/project-enums.ts` so client forms
// can import them without dragging the drizzle/schema graph into
// the browser bundle. Re-export here to keep the existing
// `import { platformType, ... } from "@/drizzle/db/schema"`
// call sites working on the server side.
export { pricingType, platformType } from "@/lib/project-enums"

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  role: text("role"),
  banned: boolean("banned"),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
  isBot: boolean("is_bot").default(false),
})

// `session_userId_idx`, `account_userId_idx`, `verification_identifier_idx`
// are required by Better Auth 1.6+ for query performance (the BA schema
// generator emits them inline). Applied via 0022_better_auth_1_6_indexes.sql.
export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    impersonatedBy: text("impersonated_by"),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
)

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
)

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at"),
    updatedAt: timestamp("updated_at"),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
)

export const project = pgTable(
  "project",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description").notNull(),
    websiteUrl: text("website_url").notNull().unique(),
    logoUrl: text("logo_url").notNull(),
    coverImageUrl: text("cover_image_url"),
    productImage: text("product_image"),
    githubUrl: text("github_url"),
    twitterUrl: text("twitter_url"),
    techStack: text("tech_stack").array(), // Array des technologies
    pricing: text("pricing").notNull().default(pricingType.FREE),
    platforms: text("platforms").array(), // Array des plateformes supportées
    launchStatus: text("launch_status").notNull().default(launchStatus.SCHEDULED),
    scheduledLaunchDate: timestamp("scheduled_launch_date"),
    launchType: text("launch_type").default(launchType.FREE),
    featuredOnHomepage: boolean("featured_on_homepage").default(false),
    dailyRanking: integer("daily_ranking"),
    hasBadgeVerified: boolean("has_badge_verified").default(false),
    badgeVerifiedAt: timestamp("badge_verified_at"),
    sourceLocale: text("source_locale").notNull().default("en"),
    relatedAttemptedAt: timestamp("related_attempted_at"),
    alternativesAttemptedAt: timestamp("alternatives_attempted_at"),
    isLowQuality: boolean("is_low_quality").notNull().default(false),
    qualityCheckedAt: timestamp("quality_checked_at"),
    qualityScore: integer("quality_score"),
    qualityReason: text("quality_reason"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    createdBy: text("created_by").references(() => user.id, {
      onDelete: "set null",
    }),
  },
  (table) => {
    return {
      nameIdx: index("project_name_idx").on(table.name),
    }
  },
)

// ─── Project translations (description per locale) ───────────────────────────
export const projectTranslation = pgTable(
  "project_translation",
  {
    projectId: text("project_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    locale: text("locale").notNull(),
    description: text("description").notNull(),
    isSource: boolean("is_source").notNull().default(false),
    aiGenerated: boolean("ai_generated").notNull().default(false),
    generatedAt: timestamp("generated_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    longDescription: text("long_description"),
    longDescriptionGeneratedAt: timestamp("long_description_generated_at"),
    // Failure-tracking trio for the enrich-projects cron. Stamped on
    // every attempt; the candidate query skips rows attempted in the
    // last 24h, and the auto-low-quality logic kicks in after N
    // consecutive failures.
    longDescriptionAttemptedAt: timestamp("long_description_attempted_at"),
    longDescriptionAttemptCount: integer("long_description_attempt_count").notNull().default(0),
    longDescriptionLastError: text("long_description_last_error"),
    // Optional one-line marketing summary (≤60 chars). Source-locale
    // row is set on submit; other locales are filled by
    // translate-projects cron (uses tagline_generated_at to skip
    // already-translated rows).
    tagline: text("tagline"),
    taglineGeneratedAt: timestamp("tagline_generated_at"),
  },
  (table) => {
    return {
      pk: primaryKey(table.projectId, table.locale),
      projectIdIdx: index("project_translation_project_id_idx").on(table.projectId),
      localeIdx: index("project_translation_locale_idx").on(table.locale),
      longDescAttemptIdx: index("project_translation_long_desc_attempt_idx").on(
        table.longDescriptionAttemptedAt,
      ),
    }
  },
)

// AI-picked related/alternative products, regenerated by the relate-projects cron.
// (project_id, rank) is unique — concurrent runs trying to insert duplicate
// ranks will fail and the catch handler in the cron logs + skips.
export const projectRelated = pgTable(
  "project_related",
  {
    projectId: text("project_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    relatedProjectId: text("related_project_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    rank: integer("rank").notNull(),
    generatedAt: timestamp("generated_at").notNull().defaultNow(),
  },
  (table) => {
    return {
      pk: primaryKey(table.projectId, table.relatedProjectId),
      projectIdIdx: index("project_related_project_id_idx").on(table.projectId),
      projectRankUniq: uniqueIndex("project_related_project_rank_uniq").on(
        table.projectId,
        table.rank,
      ),
    }
  },
)

export const category = pgTable(
  "category",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull().unique(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => {
    return {
      nameIdx: index("category_name_idx").on(table.name),
    }
  },
)

// Junction table for many-to-many relationship between projects and categories
export const projectToCategory = pgTable(
  "project_to_category",
  {
    projectId: text("project_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    categoryId: text("category_id")
      .notNull()
      .references(() => category.id, { onDelete: "cascade" }),
  },
  (table) => {
    return {
      pk: primaryKey(table.projectId, table.categoryId),
    }
  },
)

// Interactions
export const upvote = pgTable("upvote", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  projectId: text("project_id")
    .notNull()
    .references(() => project.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

// Tables pour Fuma Comment
export const fumaRoles = pgTable("fuma_roles", {
  userId: varchar("user_id", { length: 256 }).primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  canDelete: boolean("can_delete").notNull(),
})

export const fumaComments = pgTable("fuma_comments", {
  id: serial("id").primaryKey().notNull(),
  page: varchar("page", { length: 256 }).notNull(),
  thread: integer("thread"),
  author: varchar("author", { length: 256 }).notNull(),
  content: json("content").notNull(),
  timestamp: timestamp("timestamp", { withTimezone: true }).defaultNow().notNull(),
})

export const fumaRates = pgTable(
  "fuma_rates",
  {
    userId: varchar("user_id", { length: 256 }).notNull(),
    commentId: integer("comment_id").notNull(),
    like: boolean("like").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.commentId] }),
    index("comment_idx").on(table.commentId),
  ],
)

// New table for tracking daily launches
export const launchQuota = pgTable("launch_quota", {
  id: text("id").primaryKey(),
  date: timestamp("date").notNull().unique(),
  freeCount: integer("free_count").notNull().default(0),
  badgeCount: integer("badge_count").notNull().default(0),
  premiumCount: integer("premium_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

// New table for tracking project submissions during coming soon phase
export const waitlistSubmission = pgTable("waitlist_submission", {
  id: text("id").primaryKey(),
  projectUrl: text("project_url").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
})

export const seoArticle = pgTable(
  "seo_article",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    content: text("content").notNull(), // Contenu MDX complet
    image: text("image"), // URL de l'image principale
    metaTitle: text("meta_title"),
    metaDescription: text("meta_description"),
    publishedAt: timestamp("published_at").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => {
    return {
      slugIdx: index("seo_article_slug_idx").on(table.slug),
    }
  },
)

export const blogArticle = pgTable(
  "blog_article",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    content: text("content").notNull(), // Contenu MDX complet
    image: text("image"), // URL de l'image principale
    tags: text("tags").array(), // Array des tags
    author: text("author").notNull().default("Open Launch Team"),
    metaTitle: text("meta_title"),
    metaDescription: text("meta_description"),
    publishedAt: timestamp("published_at").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => {
    return {
      slugIdx: index("blog_article_slug_idx").on(table.slug),
      publishedAtIdx: index("blog_article_published_at_idx").on(table.publishedAt),
    }
  },
)

/**
 * @deprecated since 2026-05-10
 *
 * Promo code feature was removed in Phase 5 alongside the
 * Premium-Launch price bump ($2.99 → $6.99). The tables are
 * retained for historical data only — no application code reads
 * or writes these rows. Do NOT use as a template for new
 * features (the feature was decoupled from any active flow).
 *
 * Drop with a follow-up migration once the data is no longer
 * needed for support / refund history (typical retention: 1-2
 * billing cycles).
 */
export const promoCode = pgTable(
  "promo_code",
  {
    id: text("id").primaryKey(),
    code: text("code").notNull().unique(),
    discountAmount: text("discount_amount").notNull().default("2.99"),
    usageLimit: integer("usage_limit"), // NULL means unlimited
    usedCount: integer("used_count").notNull().default(0),
    expiresAt: timestamp("expires_at").notNull(),
    isActive: boolean("is_active").notNull().default(true),
    createdBy: text("created_by").references(() => user.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => {
    return {
      codeIdx: index("promo_code_code_idx").on(table.code),
      expiresAtIdx: index("promo_code_expires_at_idx").on(table.expiresAt),
    }
  },
)

/** @deprecated since 2026-05-10 — see `promoCode` deprecation note. */
export const promoCodeUsage = pgTable(
  "promo_code_usage",
  {
    id: text("id").primaryKey(),
    promoCodeId: text("promo_code_id")
      .notNull()
      .references(() => promoCode.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    projectId: text("project_id").references(() => project.id, { onDelete: "set null" }),
    usedAt: timestamp("used_at").notNull().defaultNow(),
  },
  (table) => {
    return {
      userIdIdx: index("promo_code_usage_user_id_idx").on(table.userId),
      promoCodeIdIdx: index("promo_code_usage_promo_code_id_idx").on(table.promoCodeId),
    }
  },
)

// ProductHunt import tracking table
export const productHuntImport = pgTable(
  "product_hunt_import",
  {
    id: text("id").primaryKey(),
    productHuntId: text("product_hunt_id").notNull().unique(),
    productHuntUrl: text("product_hunt_url").notNull(),
    projectId: text("project_id").references(() => project.id, { onDelete: "set null" }),
    votesCount: integer("votes_count"),
    rank: integer("rank"), // 当日排名 1-5
    importedAt: timestamp("imported_at").notNull().defaultNow(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => {
    return {
      productHuntIdIdx: index("product_hunt_import_ph_id_idx").on(table.productHuntId),
      projectIdIdx: index("product_hunt_import_project_id_idx").on(table.projectId),
    }
  },
)

// ─── Tag moderation status ───────────────────────────────────────────────────
export const tagModerationStatus = {
  APPROVED: "approved",
  PENDING: "pending",
  FLAGGED: "flagged",
  DELETED: "deleted",
} as const

export type TagModerationStatus = (typeof tagModerationStatus)[keyof typeof tagModerationStatus]

// ─── Tags ────────────────────────────────────────────────────────────────────
export const tag = pgTable(
  "tag",
  {
    id: text("id").primaryKey(), // slugified, e.g. "machine-learning"
    name: text("name").notNull().unique(),
    slug: text("slug").notNull().unique(),
    moderationStatus: text("moderation_status").notNull().default(tagModerationStatus.APPROVED),
    moderationNote: text("moderation_note"),
    projectCount: integer("project_count").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => {
    return {
      slugIdx: index("tag_slug_idx").on(table.slug),
      moderationStatusIdx: index("tag_moderation_status_idx").on(table.moderationStatus),
    }
  },
)

export const projectToTag = pgTable(
  "project_to_tag",
  {
    projectId: text("project_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    tagId: text("tag_id")
      .notNull()
      .references(() => tag.id, { onDelete: "cascade" }),
  },
  (table) => {
    return {
      pk: primaryKey(table.projectId, table.tagId),
      tagIdIdx: index("project_to_tag_tag_id_idx").on(table.tagId),
    }
  },
)

// ─── Crawl cache ─────────────────────────────────────────────────────────────
export const crawledData = pgTable(
  "crawled_data",
  {
    id: text("id").primaryKey(),
    url: text("url").notNull().unique(),
    projectId: text("project_id").references(() => project.id, {
      onDelete: "set null",
    }),
    content: text("content").notNull(),
    contentHash: text("content_hash"),
    crawledAt: timestamp("crawled_at").notNull().defaultNow(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => {
    return {
      urlIdx: index("crawled_data_url_idx").on(table.url),
      projectIdIdx: index("crawled_data_project_id_idx").on(table.projectId),
      expiresAtIdx: index("crawled_data_expires_at_idx").on(table.expiresAt),
    }
  },
)

// ─── Comparison pages ────────────────────────────────────────────────────────
export const comparisonPage = pgTable(
  "comparison_page",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    projectAId: text("project_a_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    projectBId: text("project_b_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    categoryId: text("category_id").references(() => category.id, {
      onDelete: "set null",
    }),
    title: text("title").notNull(),
    metaTitle: text("meta_title"),
    metaDescription: text("meta_description"),
    content: text("content").notNull(),
    structuredData: json("structured_data"),
    generatedAt: timestamp("generated_at").notNull().defaultNow(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => {
    return {
      slugIdx: index("comparison_page_slug_idx").on(table.slug),
      projectAIdx: index("comparison_page_project_a_idx").on(table.projectAId),
      projectBIdx: index("comparison_page_project_b_idx").on(table.projectBId),
    }
  },
)

// Cooldown tracker so the comparison cron doesn't retry the same broken
// pair every 30 min when the underlying crawl / AI call fails. See
// app/api/cron/generate-comparisons/route.ts for the 24h skip window.
export const comparisonAttempt = pgTable(
  "comparison_attempt",
  {
    slug: text("slug").primaryKey(),
    lastFailedAt: timestamp("last_failed_at").notNull().defaultNow(),
    attemptCount: integer("attempt_count").notNull().default(1),
    error: text("error"),
  },
  (table) => {
    return {
      lastFailedAtIdx: index("comparison_attempt_last_failed_at_idx").on(table.lastFailedAt),
    }
  },
)

// ─── Alternative pages ───────────────────────────────────────────────────────
export const alternativePage = pgTable(
  "alternative_page",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    subjectProjectId: text("subject_project_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    metaTitle: text("meta_title"),
    metaDescription: text("meta_description"),
    content: text("content").notNull(),
    generatedAt: timestamp("generated_at").notNull().defaultNow(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => {
    return {
      slugIdx: index("alternative_page_slug_idx").on(table.slug),
      subjectProjectIdIdx: index("alternative_page_subject_project_id_idx").on(
        table.subjectProjectId,
      ),
    }
  },
)

export const alternativePageToProject = pgTable(
  "alternative_page_to_project",
  {
    alternativePageId: text("alternative_page_id")
      .notNull()
      .references(() => alternativePage.id, { onDelete: "cascade" }),
    projectId: text("project_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    aiScore: integer("ai_score"),
    prosConsJson: json("pros_cons_json"),
    useCases: text("use_cases"),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => {
    return {
      pk: primaryKey(table.alternativePageId, table.projectId),
      pageIdIdx: index("alt_page_to_project_page_id_idx").on(table.alternativePageId),
      projectIdIdx: index("alt_page_to_project_project_id_idx").on(table.projectId),
    }
  },
)

// ─── Cron schedule + run log ─────────────────────────────────────────────────
// Schedule rows are read by /api/cron/dispatch every minute to decide which
// tasks to fire. Editable from /admin/cron-runs without redeploying.
export const cronSchedule = pgTable("cron_schedule", {
  id: serial("id").primaryKey(),
  path: text("path").notNull().unique(),
  displayName: text("display_name").notNull(),
  cronExpression: text("cron_expression").notNull(),
  enabled: boolean("enabled").notNull().default(true),
  expectedDurationMs: integer("expected_duration_ms"),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

// One row per task per dispatcher tick where the task was due.
export const cronRunLog = pgTable(
  "cron_run_log",
  {
    id: serial("id").primaryKey(),
    dispatchedAt: timestamp("dispatched_at").notNull().defaultNow(),
    taskPath: text("task_path").notNull(),
    statusCode: integer("status_code").notNull(),
    durationMs: integer("duration_ms").notNull(),
    error: text("error"),
  },
  (table) => {
    return {
      dispatchedIdx: index("cron_run_log_dispatched_idx").on(table.dispatchedAt),
      taskIdx: index("cron_run_log_task_idx").on(table.taskPath, table.dispatchedAt),
    }
  },
)

// ─── AI usage log ────────────────────────────────────────────────────────────
// One row per successful DeepSeek call so the admin dashboard can show
// token spend over time, broken down by which library function made the call.
export const aiUsageLog = pgTable(
  "ai_usage_log",
  {
    id: serial("id").primaryKey(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    functionName: text("function_name").notNull(),
    model: text("model").notNull(),
    promptTokens: integer("prompt_tokens").notNull().default(0),
    completionTokens: integer("completion_tokens").notNull().default(0),
    totalTokens: integer("total_tokens").notNull().default(0),
  },
  (table) => {
    return {
      createdAtIdx: index("ai_usage_created_at_idx").on(table.createdAt),
      functionNameIdx: index("ai_usage_function_name_idx").on(table.functionName),
    }
  },
)

// ─── Admin audit log ─────────────────────────────────────────────────────────
export const adminAuditLog = pgTable(
  "admin_audit_log",
  {
    id: text("id").primaryKey(),
    adminUserId: text("admin_user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    action: text("action").notNull(),
    targetType: text("target_type"),
    targetId: text("target_id"),
    metadata: json("metadata"),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => {
    return {
      adminUserIdIdx: index("admin_audit_log_admin_user_id_idx").on(table.adminUserId),
      actionIdx: index("admin_audit_log_action_idx").on(table.action),
      createdAtIdx: index("admin_audit_log_created_at_idx").on(table.createdAt),
    }
  },
)

// ─── DR (Ahrefs Domain Rating) cache ─────────────────────────────────────────
// Refreshed every 3 days by /api/cron/refresh-dr. Pricing pages read
// straight from this table — never call Ahrefs at request time.
export const domainDrCache = pgTable(
  "domain_dr_cache",
  {
    domain: text("domain").primaryKey(),
    dr: integer("dr"),
    fetchedAt: timestamp("fetched_at"),
    source: text("source"),
    httpStatus: integer("http_status"),
    rawResponse: json("raw_response"),
    lastAttemptAt: timestamp("last_attempt_at"),
    lastError: text("last_error"),
  },
  (table) => {
    return {
      fetchedAtIdx: index("domain_dr_cache_fetched_at_idx").on(table.fetchedAt),
    }
  },
)

// Per-provider monthly call counter. The cron checks this before each
// call and routes to the next provider once usage crosses 80% of the
// known limit. PK is (provider, month) so we keep historical buckets
// for cost analysis.
export const ahrefsProviderQuota = pgTable(
  "ahrefs_provider_quota",
  {
    provider: text("provider").notNull(),
    month: text("month").notNull(),
    callsUsed: integer("calls_used").notNull().default(0),
    callsLimit: integer("calls_limit"),
    lastUpdated: timestamp("last_updated").notNull().defaultNow(),
  },
  (table) => ({
    pk: primaryKey(table.provider, table.month),
  }),
)

// One row per directory-listing purchase. Plus / Pro are one-off
// payments that need manual fulfilment by admin; Ultra is a Stripe
// subscription. See drizzle/migrations/0021_directory_order.sql.
export const directoryOrder = pgTable(
  "directory_order",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: text("project_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    // Allowed values are enforced via a CHECK constraint in the
    // migration (drizzle/migrations/0021_directory_order.sql). Keep
    // the comment in sync when extending the set.
    tier: text("tier").notNull(), // 'basic' | 'plus' | 'pro' | 'ultra'
    url: text("url").notNull(),
    // Buyer's UI locale (next-intl) at checkout. Captured so the
    // post-payment confirmation email can land on the same-locale
    // dashboard instead of always English.
    locale: text("locale"),
    status: text("status").notNull().default("pending"), // 'pending' | 'paid' | 'fulfilled' | 'refunded' | 'failed' | 'canceled'
    amountCents: integer("amount_cents"),
    currency: text("currency").default("usd"),
    stripeSessionId: text("stripe_session_id").unique(),
    stripeSubscriptionId: text("stripe_subscription_id"),
    stripeCustomerId: text("stripe_customer_id"),
    paidAt: timestamp("paid_at"),
    fulfilledAt: timestamp("fulfilled_at"),
    fulfilledBy: text("fulfilled_by").references(() => user.id, { onDelete: "set null" }),
    adminNotes: text("admin_notes"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    statusIdx: index("directory_order_status_idx").on(table.status, table.paidAt),
    projectIdx: index("directory_order_project_idx").on(table.projectId),
  }),
)
