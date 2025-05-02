"use server";

import { db } from "@/drizzle/db";
import {
  project as projectTable,
  upvote,
  fumaComments,
  launchStatus,
  launchType,
  category as categoryTable,
  projectToCategory,
} from "@/drizzle/db/schema";
import { and, eq, desc, sql } from "drizzle-orm";
import { startOfMonth, endOfMonth } from "date-fns";
import { PROJECT_LIMITS_VARIABLES } from "@/lib/constants";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

async function getCurrentUserId() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user?.id ?? null;
}

async function enrichProjectsWithUserData<T extends { id: string }>(
  projects: T[],
  userId: string | null
): Promise<
  (T & {
    userHasUpvoted: boolean;
    categories: { id: string; name: string }[];
  })[]
> {
  if (!projects.length) return [];

  const projectIds = projects.map((p) => p.id);

  const categoriesData = await db
    .select({
      projectId: projectToCategory.projectId,
      categoryId: categoryTable.id,
      categoryName: categoryTable.name,
    })
    .from(projectToCategory)
    .innerJoin(
      categoryTable,
      eq(categoryTable.id, projectToCategory.categoryId)
    )
    .where(sql`${projectToCategory.projectId} IN ${projectIds}`);

  const categoriesByProjectId = categoriesData.reduce(
    (acc, row) => {
      if (!acc[row.projectId]) {
        acc[row.projectId] = [];
      }
      acc[row.projectId].push({ id: row.categoryId, name: row.categoryName });
      return acc;
    },
    {} as Record<string, { id: string; name: string }[]>
  );

  let userUpvotedProjectIds = new Set<string>();
  if (userId) {
    const userUpvotes = await db
      .select({ projectId: upvote.projectId })
      .from(upvote)
      .where(
        and(
          eq(upvote.userId, userId),
          sql`${upvote.projectId} IN ${projectIds}`
        )
      );
    userUpvotedProjectIds = new Set(userUpvotes.map((uv) => uv.projectId));
  }

  return projects.map((project) => ({
    ...project,
    userHasUpvoted: userUpvotedProjectIds.has(project.id),
    categories: categoriesByProjectId[project.id] || [],
  }));
}

export async function getTodayProjects(
  limit: number = PROJECT_LIMITS_VARIABLES.TODAY_LIMIT
) {
  const userId = await getCurrentUserId();
  const todayProjectsBase = await db
    .select({
      id: projectTable.id,
      name: projectTable.name,
      slug: projectTable.slug,
      description: projectTable.description,
      logoUrl: projectTable.logoUrl,
      websiteUrl: projectTable.websiteUrl,
      launchStatus: projectTable.launchStatus,
      scheduledLaunchDate: projectTable.scheduledLaunchDate,
      createdAt: projectTable.createdAt,
      upvoteCount:
        sql<number>`cast(count(distinct ${upvote.id}) as int)`.mapWith(Number),
      commentCount:
        sql<number>`cast(count(distinct ${fumaComments.id}) as int)`.mapWith(
          Number
        ),
    })
    .from(projectTable)
    .leftJoin(upvote, eq(upvote.projectId, projectTable.id))
    .leftJoin(
      fumaComments,
      sql`"fuma_comments"."page"::text = ${projectTable.id}`
    )
    .where(eq(projectTable.launchStatus, launchStatus.ONGOING))
    .groupBy(projectTable.id)
    .orderBy(desc(projectTable.createdAt))
    .limit(limit);

  return enrichProjectsWithUserData(todayProjectsBase, userId);
}

export async function getYesterdayProjects(
  limit: number = PROJECT_LIMITS_VARIABLES.YESTERDAY_LIMIT
) {
  const userId = await getCurrentUserId();
  const now = new Date();
  const isBeforeLaunchTime = now.getUTCHours() < 8;
  const yesterdayStart = new Date(now);
  yesterdayStart.setUTCHours(8, 0, 0, 0);
  if (isBeforeLaunchTime) {
    yesterdayStart.setDate(yesterdayStart.getDate() - 2);
  } else {
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
  }
  const yesterdayEnd = new Date(yesterdayStart);
  yesterdayEnd.setDate(yesterdayEnd.getDate() + 1);

  const yesterdayProjectsBase = await db
    .select({
      id: projectTable.id,
      name: projectTable.name,
      slug: projectTable.slug,
      description: projectTable.description,
      logoUrl: projectTable.logoUrl,
      websiteUrl: projectTable.websiteUrl,
      launchStatus: projectTable.launchStatus,
      scheduledLaunchDate: projectTable.scheduledLaunchDate,
      createdAt: projectTable.createdAt,
      upvoteCount:
        sql<number>`cast(count(distinct ${upvote.id}) as int)`.mapWith(Number),
      commentCount:
        sql<number>`cast(count(distinct ${fumaComments.id}) as int)`.mapWith(
          Number
        ),
      dailyRanking: projectTable.dailyRanking,
    })
    .from(projectTable)
    .leftJoin(upvote, eq(upvote.projectId, projectTable.id))
    .leftJoin(
      fumaComments,
      sql`"fuma_comments"."page"::text = ${projectTable.id}`
    )
    .where(
      and(
        eq(projectTable.launchStatus, launchStatus.LAUNCHED),
        sql`${projectTable.scheduledLaunchDate} >= ${yesterdayStart.toISOString()}`,
        sql`${projectTable.scheduledLaunchDate} < ${yesterdayEnd.toISOString()}`
      )
    )
    .groupBy(projectTable.id)
    .orderBy(desc(sql`count(distinct ${upvote.id})`))
    .limit(limit);

  return enrichProjectsWithUserData(yesterdayProjectsBase, userId);
}

export async function getMonthBestProjects(
  limit: number = PROJECT_LIMITS_VARIABLES.MONTH_LIMIT
) {
  const userId = await getCurrentUserId();
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const monthProjectsBase = await db
    .select({
      id: projectTable.id,
      name: projectTable.name,
      slug: projectTable.slug,
      description: projectTable.description,
      logoUrl: projectTable.logoUrl,
      websiteUrl: projectTable.websiteUrl,
      launchStatus: projectTable.launchStatus,
      scheduledLaunchDate: projectTable.scheduledLaunchDate,
      createdAt: projectTable.createdAt,
      upvoteCount:
        sql<number>`cast(count(distinct ${upvote.id}) as int)`.mapWith(Number),
      commentCount:
        sql<number>`cast(count(distinct ${fumaComments.id}) as int)`.mapWith(
          Number
        ),
    })
    .from(projectTable)
    .leftJoin(upvote, eq(upvote.projectId, projectTable.id))
    .leftJoin(
      fumaComments,
      sql`"fuma_comments"."page"::text = ${projectTable.id}`
    )
    .where(
      and(
        eq(projectTable.launchStatus, launchStatus.LAUNCHED),
        sql`${projectTable.scheduledLaunchDate} >= ${monthStart.toISOString()}`,
        sql`${projectTable.scheduledLaunchDate} <= ${monthEnd.toISOString()}`
      )
    )
    .groupBy(projectTable.id)
    .orderBy(desc(sql`count(distinct ${upvote.id})`))
    .limit(limit);

  return enrichProjectsWithUserData(monthProjectsBase, userId);
}

export async function getFeaturedPremiumProjects() {
  const projects = await db.query.project.findMany({
    where: and(
      eq(projectTable.featuredOnHomepage, true),
      eq(projectTable.launchType, launchType.PREMIUM_PLUS),
      eq(projectTable.launchStatus, launchStatus.ONGOING)
    ),
    columns: {
      id: true,
      name: true,
      slug: true,
      description: true,
      logoUrl: true,
      websiteUrl: true,
      launchStatus: true,
    },
    limit: 3,
    orderBy: [desc(projectTable.createdAt)],
  });
  return projects;
}

export async function getYesterdayTopProjects() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  const yesterdayEnd = new Date(yesterday);
  yesterdayEnd.setHours(23, 59, 59, 999);

  const topProjects = await db
    .select({
      id: projectTable.id,
      name: projectTable.name,
      slug: projectTable.slug,
      logoUrl: projectTable.logoUrl,
      dailyRanking: projectTable.dailyRanking,
    })
    .from(projectTable)
    .where(
      and(
        eq(projectTable.launchStatus, launchStatus.LAUNCHED),
        sql`${projectTable.dailyRanking} IS NOT NULL`,
        sql`${projectTable.scheduledLaunchDate} >= ${yesterday.toISOString()}`,
        sql`${projectTable.scheduledLaunchDate} <= ${yesterdayEnd.toISOString()}`
      )
    )
    .orderBy(projectTable.dailyRanking)
    .limit(3);

  return topProjects;
}

export async function getWinnersByDate(date: Date) {
  const userId = await getCurrentUserId();
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  const winnersBase = await db
    .select({
      id: projectTable.id,
      name: projectTable.name,
      slug: projectTable.slug,
      description: projectTable.description,
      logoUrl: projectTable.logoUrl,
      websiteUrl: projectTable.websiteUrl,
      dailyRanking: projectTable.dailyRanking,
      launchStatus: projectTable.launchStatus,
      scheduledLaunchDate: projectTable.scheduledLaunchDate,
      createdAt: projectTable.createdAt,
      upvoteCount:
        sql<number>`cast(count(distinct ${upvote.id}) as int)`.mapWith(Number),
      commentCount:
        sql<number>`cast(count(distinct ${fumaComments.id}) as int)`.mapWith(
          Number
        ),
    })
    .from(projectTable)
    .leftJoin(upvote, eq(upvote.projectId, projectTable.id))
    .leftJoin(
      fumaComments,
      sql`"fuma_comments"."page"::text = ${projectTable.id}`
    )
    .where(
      and(
        eq(projectTable.launchStatus, launchStatus.LAUNCHED),
        sql`${projectTable.dailyRanking} IS NOT NULL`,
        sql`${projectTable.scheduledLaunchDate} >= ${dayStart.toISOString()}`,
        sql`${projectTable.scheduledLaunchDate} <= ${dayEnd.toISOString()}`
      )
    )
    .groupBy(projectTable.id)
    .orderBy(projectTable.dailyRanking)
    .limit(3);

  return enrichProjectsWithUserData(winnersBase, userId);
}
