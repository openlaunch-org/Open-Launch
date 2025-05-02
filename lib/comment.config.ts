import { createBetterAuthAdapter } from "@fuma-comment/server/adapters/better-auth";
import { createDrizzleAdapter } from "@fuma-comment/server/adapters/drizzle";
import { auth } from "@/lib/auth";
import { db } from "@/drizzle/db";
import { user, fumaComments, fumaRates, fumaRoles } from "@/drizzle/db/schema";

// Création des adaptateurs pour Fuma Comment
export const commentAuth = createBetterAuthAdapter(auth);

export const commentStorage = createDrizzleAdapter({
  db,
  auth: "better-auth",
  schemas: {
    comments: fumaComments,
    rates: fumaRates,
    roles: fumaRoles,
    user,
  },
});
