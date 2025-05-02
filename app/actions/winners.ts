"use server";

import { db } from "@/drizzle/db";
import { project as projectTable, launchStatus } from "@/drizzle/db/schema";
import { and, eq, sql } from "drizzle-orm";

// Récupérer les projets gagnants pour une date spécifique
export async function getWinnersByDate(date: Date) {
  // Créer le début et la fin de la journée
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);

  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  const winners = await db
    .select({
      id: projectTable.id,
      name: projectTable.name,
      slug: projectTable.slug,
      logoUrl: projectTable.logoUrl,
      description: projectTable.description,
      dailyRanking: projectTable.dailyRanking,
      scheduledLaunchDate: projectTable.scheduledLaunchDate,
    })
    .from(projectTable)
    .where(
      and(
        eq(projectTable.launchStatus, launchStatus.LAUNCHED),
        sql`${projectTable.dailyRanking} IS NOT NULL`,
        sql`${projectTable.scheduledLaunchDate} >= ${dayStart.toISOString()}`,
        sql`${projectTable.scheduledLaunchDate} <= ${dayEnd.toISOString()}`
      )
    )
    .orderBy(projectTable.dailyRanking);

  return winners;
}

// Vérifier si une date a des gagnants
export async function dateHasWinners(date: Date) {
  // Créer le début et la fin de la journée
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);

  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  const result = await db
    .select({
      count: sql<number>`count(*)`.mapWith(Number),
    })
    .from(projectTable)
    .where(
      and(
        eq(projectTable.launchStatus, launchStatus.LAUNCHED),
        sql`${projectTable.dailyRanking} IS NOT NULL`,
        sql`${projectTable.scheduledLaunchDate} >= ${dayStart.toISOString()}`,
        sql`${projectTable.scheduledLaunchDate} <= ${dayEnd.toISOString()}`
      )
    );

  return result?.[0]?.count > 0;
}
