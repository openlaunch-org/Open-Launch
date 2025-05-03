import { db } from "@/drizzle/db"
import { fumaComments, fumaRates, fumaRoles, user } from "@/drizzle/db/schema"
import { createBetterAuthAdapter } from "@fuma-comment/server/adapters/better-auth"
import { createDrizzleAdapter } from "@fuma-comment/server/adapters/drizzle"

import { auth } from "@/lib/auth"

// Création des adaptateurs pour Fuma Comment
export const commentAuth = createBetterAuthAdapter(auth)

export const commentStorage = createDrizzleAdapter({
  db,
  auth: "better-auth",
  schemas: {
    comments: fumaComments,
    rates: fumaRates,
    roles: fumaRoles,
    user,
  },
})
