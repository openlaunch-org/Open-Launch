"use server"

import { revalidatePath } from "next/cache"
import { headers } from "next/headers"

import { db } from "@/drizzle/db"
import {
  category,
  launchStatus,
  project,
  projectToCategory,
  upvote,
  user,
} from "@/drizzle/db/schema"
import { and, eq, ne, sql } from "drizzle-orm"

import { auth } from "@/lib/auth"

// Get session helper
async function getSession() {
  return auth.api.getSession({
    headers: await headers(),
  })
}

// Get project by slug
export async function getProjectBySlug(slug: string) {
  // Get project details - Exclure les projets avec le statut payment_pending
  const [projectData] = await db
    .select()
    .from(project)
    .where(and(eq(project.slug, slug), ne(project.launchStatus, launchStatus.PAYMENT_PENDING)))
    .limit(1)

  if (!projectData) {
    return null
  }

  // Get creator information if available
  let creator = null
  if (projectData.createdBy) {
    const [creatorData] = await db
      .select()
      .from(user)
      .where(eq(user.id, projectData.createdBy))
      .limit(1)
    creator = creatorData
  }

  // Get categories
  const categories = await db
    .select({
      id: category.id,
      name: category.name,
    })
    .from(category)
    .innerJoin(projectToCategory, eq(category.id, projectToCategory.categoryId))
    .where(eq(projectToCategory.projectId, projectData.id))

  // Get upvote count
  const [upvoteCount] = await db
    .select({
      count: sql`count(*)`,
    })
    .from(upvote)
    .where(eq(upvote.projectId, projectData.id))

  // Ne plus récupérer les commentaires ici car ils seront gérés par Fuma Comment

  return {
    ...projectData,
    categories,
    upvoteCount: Number(upvoteCount?.count || 0),
    creator,
    // Ne plus inclure les commentaires dans l'objet retourné
  }
}

// Check if a user has upvoted a project
export async function hasUserUpvoted(projectId: string) {
  const session = await getSession()

  if (!session?.user?.id) {
    return false
  }

  const userUpvotes = await db
    .select()
    .from(upvote)
    .where(and(eq(upvote.userId, session.user.id), eq(upvote.projectId, projectId)))
    .limit(1)

  return userUpvotes.length > 0
}

// Update project description and categories
// Only allowed for project owners and only if project is in "scheduled" status
export async function updateProject(
  projectId: string,
  data: {
    description: string
    categories: string[]
  },
) {
  const session = await getSession()

  if (!session?.user?.id) {
    return { success: false, error: "Authentication required" }
  }

  try {
    // Get project to check ownership and status
    const [projectData] = await db.select().from(project).where(eq(project.id, projectId)).limit(1)

    if (!projectData) {
      return { success: false, error: "Project not found" }
    }

    // Check if user is the owner
    if (projectData.createdBy !== session.user.id) {
      return {
        success: false,
        error: "You don't have permission to edit this project",
      }
    }

    // Check if project is in scheduled status
    if (projectData.launchStatus !== "scheduled") {
      return {
        success: false,
        error: "You can only edit projects that are scheduled for launch",
      }
    }

    // Update description
    await db
      .update(project)
      .set({
        description: data.description,
        updatedAt: new Date(),
      })
      .where(eq(project.id, projectId))

    // Update categories (remove old ones and add new ones)
    // First, delete existing categories
    await db.delete(projectToCategory).where(eq(projectToCategory.projectId, projectId))

    // Then add new categories
    if (data.categories.length > 0) {
      await db.insert(projectToCategory).values(
        data.categories.map((categoryId) => ({
          projectId: projectId,
          categoryId,
        })),
      )
    }

    // Revalidate the project page
    revalidatePath(`/projects/${projectData.slug}`)

    return {
      success: true,
      message: "Project updated successfully",
    }
  } catch (error) {
    console.error("Error updating project:", error)
    return {
      success: false,
      error: "Failed to update project",
    }
  }
}
