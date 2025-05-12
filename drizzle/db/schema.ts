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
  varchar,
} from "drizzle-orm/pg-core"

// Launch status enum
export const launchStatus = {
  PAYMENT_PENDING: "payment_pending",
  PAYMENT_FAILED: "payment_failed",
  SCHEDULED: "scheduled",
  ONGOING: "ongoing",
  LAUNCHED: "launched",
} as const

export type LaunchStatus = (typeof launchStatus)[keyof typeof launchStatus]

// Launch type enum
export const launchType = {
  FREE: "free",
  PREMIUM: "premium",
  PREMIUM_PLUS: "premium_plus",
} as const

export type LaunchType = (typeof launchType)[keyof typeof launchType]

// Ajouter de nouveaux enums pour les projets tech
export const pricingType = {
  FREE: "free",
  FREEMIUM: "freemium",
  PAID: "paid",
} as const

export const platformType = {
  WEB: "web",
  MOBILE: "mobile",
  DESKTOP: "desktop",
  API: "api",
  WHATSAPP: "whatsapp",
  TELEGRAM: "telegram",
  OTHER: "other",
} as const

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  discordUserId: text("discord_user_id"),
  discordUsername: text("discord_username"),
  role: text("role"),
  banned: boolean("banned"),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
})

export const session = pgTable("session", {
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
})

export const account = pgTable("account", {
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
})

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
})

export const project = pgTable(
  "project",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description").notNull(),
    websiteUrl: text("website_url").notNull(),
    logoUrl: text("logo_url").notNull(),
    coverImageUrl: text("cover_image_url").notNull(),
    githubUrl: text("github_url"),
    twitterUrl: text("twitter_url"),
    linkedinUrl: text("linkedin_url"),
    techStack: text("tech_stack").array(),
    pricing: text("pricing").notNull().default(pricingType.FREE),
    platforms: text("platforms").array(),
    launchStatus: text("launch_status").notNull().default(launchStatus.SCHEDULED),
    scheduledLaunchDate: timestamp("scheduled_launch_date"),
    launchType: text("launch_type").default(launchType.FREE),
    featuredOnHomepage: boolean("featured_on_homepage").default(false),
    dailyRanking: integer("daily_ranking"),
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
  premiumCount: integer("premium_count").notNull().default(0),
  premiumPlusCount: integer("premium_plus_count").notNull().default(0),
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
