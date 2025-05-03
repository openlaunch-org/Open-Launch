"use server"

import { revalidatePath } from "next/cache"

import { db } from "@/drizzle/db"
import {
  launchQuota,
  launchStatus,
  LaunchStatus,
  launchType,
  LaunchType,
  project as projectTable,
} from "@/drizzle/db/schema"
import { addDays, format, isBefore, parse } from "date-fns"
import { and, eq, gte, lt, sql } from "drizzle-orm"

import { DATE_FORMAT, LAUNCH_LIMITS, LAUNCH_SETTINGS, LAUNCH_TYPES } from "@/lib/constants"

export interface LaunchAvailability {
  date: string
  freeSlots: number
  premiumSlots: number
  premiumPlusSlots: number
  totalSlots: number
}

// Fonction pour obtenir la disponibilité des lancements pour une date spécifique
export async function getLaunchAvailability(date: string): Promise<LaunchAvailability> {
  // Vérifier si la date est au format correct
  const parsedDate = parse(date, DATE_FORMAT.API, new Date())
  const formattedDate = format(parsedDate, DATE_FORMAT.API)

  // Obtenir le nombre de lancements déjà programmés pour cette date
  const scheduledLaunches = await db
    .select({
      freeCount: sql<number>`count(*) filter (where ${projectTable.launchType} = ${launchType.FREE})`,
      premiumCount: sql<number>`count(*) filter (where ${projectTable.launchType} = ${launchType.PREMIUM})`,
      premiumPlusCount: sql<number>`count(*) filter (where ${projectTable.launchType} = ${launchType.PREMIUM_PLUS})`,
      totalCount: sql<number>`count(*)`,
    })
    .from(projectTable)
    .where(
      and(
        gte(projectTable.scheduledLaunchDate, parsedDate),
        lt(projectTable.scheduledLaunchDate, addDays(parsedDate, 1)),
        // Ne compter que les chaînes programmées (pas celles en attente de paiement)
        eq(projectTable.launchStatus, launchStatus.SCHEDULED),
      ),
    )

  // Calculer les places disponibles
  const freeCount = scheduledLaunches[0]?.freeCount || 0
  const premiumCount = scheduledLaunches[0]?.premiumCount || 0
  const premiumPlusCount = scheduledLaunches[0]?.premiumPlusCount || 0
  const totalCount = scheduledLaunches[0]?.totalCount || 0

  const freeSlots = Math.max(0, LAUNCH_LIMITS.FREE_DAILY_LIMIT - freeCount)
  const premiumSlots = Math.max(0, LAUNCH_LIMITS.PREMIUM_DAILY_LIMIT - premiumCount)
  const premiumPlusSlots = Math.max(0, LAUNCH_LIMITS.PREMIUM_PLUS_DAILY_LIMIT - premiumPlusCount)
  const totalSlots = Math.max(0, LAUNCH_LIMITS.TOTAL_DAILY_LIMIT - totalCount)

  // Retourner la disponibilité
  return {
    date: formattedDate,
    freeSlots,
    premiumSlots,
    premiumPlusSlots,
    totalSlots,
  }
}

// Fonction pour obtenir la disponibilité des lancements pour une plage de dates
export async function getLaunchAvailabilityRange(
  startDate: string,
  endDate: string,
  launchTypeValue: (typeof LAUNCH_TYPES)[keyof typeof LAUNCH_TYPES] = LAUNCH_TYPES.FREE,
): Promise<LaunchAvailability[]> {
  // Déterminer la date minimale de planification en fonction du type de lancement
  const today = new Date()
  let minDaysAhead = LAUNCH_SETTINGS.MIN_DAYS_AHEAD
  let maxDaysAhead: number = LAUNCH_SETTINGS.MAX_DAYS_AHEAD

  if (launchTypeValue === LAUNCH_TYPES.PREMIUM) {
    minDaysAhead = LAUNCH_SETTINGS.PREMIUM_MIN_DAYS_AHEAD
    maxDaysAhead = LAUNCH_SETTINGS.PREMIUM_MAX_DAYS_AHEAD
  } else if (launchTypeValue === LAUNCH_TYPES.PREMIUM_PLUS) {
    minDaysAhead = LAUNCH_SETTINGS.PREMIUM_PLUS_MIN_DAYS_AHEAD
    maxDaysAhead = LAUNCH_SETTINGS.PREMIUM_PLUS_MAX_DAYS_AHEAD
  }

  // Calculer la date minimale (au moins le lendemain)
  const minDate = addDays(today, minDaysAhead)
  const maxDate = addDays(today, maxDaysAhead)

  // Vérifier si les dates sont au format correct
  const parsedStartDate = parse(startDate, DATE_FORMAT.API, new Date())
  const parsedEndDate = parse(endDate, DATE_FORMAT.API, new Date())

  // Ajuster la date de début si elle est avant la date minimale
  const adjustedStartDate = isBefore(parsedStartDate, minDate) ? minDate : parsedStartDate

  // Ajuster la date de fin si elle est après la date maximale
  const adjustedEndDate = isBefore(maxDate, parsedEndDate) ? maxDate : parsedEndDate

  // Générer toutes les dates dans la plage
  const dates: Date[] = []
  let currentDate = adjustedStartDate
  while (currentDate <= adjustedEndDate) {
    dates.push(new Date(currentDate))
    currentDate = addDays(currentDate, 1)
  }

  // Obtenir la disponibilité pour chaque date
  const availabilityPromises = dates.map((date) =>
    getLaunchAvailability(format(date, DATE_FORMAT.API)),
  )
  const availabilityResults = await Promise.all(availabilityPromises)

  return availabilityResults
}

// Fonction pour planifier un lancement
export async function scheduleLaunch(
  projectId: string,
  date: string,
  launchTypeValue: (typeof LAUNCH_TYPES)[keyof typeof LAUNCH_TYPES],
): Promise<boolean> {
  try {
    // Vérifier si la date est au format correct et la convertir en Date
    let parsedDate: Date

    try {
      // Essayer d'abord le format standard
      parsedDate = parse(date, DATE_FORMAT.API, new Date())

      // Vérifier si la date est valide
      if (isNaN(parsedDate.getTime())) {
        throw new Error("Date invalide après parsing")
      }
    } catch {
      // Si le parsing échoue, essayer de créer une Date directement
      parsedDate = new Date(date)

      // Vérifier si la date est valide
      if (isNaN(parsedDate.getTime())) {
        throw new Error(`Format de date invalide: ${date}`)
      }
    }

    // Normaliser les dates pour comparer uniquement les jours (sans les heures)
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Réinitialiser l'heure à minuit

    let minDaysAhead = LAUNCH_SETTINGS.MIN_DAYS_AHEAD
    let maxDaysAhead: number = LAUNCH_SETTINGS.MAX_DAYS_AHEAD

    if (launchTypeValue === LAUNCH_TYPES.PREMIUM) {
      minDaysAhead = LAUNCH_SETTINGS.PREMIUM_MIN_DAYS_AHEAD
      maxDaysAhead = LAUNCH_SETTINGS.PREMIUM_MAX_DAYS_AHEAD
    } else if (launchTypeValue === LAUNCH_TYPES.PREMIUM_PLUS) {
      minDaysAhead = LAUNCH_SETTINGS.PREMIUM_PLUS_MIN_DAYS_AHEAD
      maxDaysAhead = LAUNCH_SETTINGS.PREMIUM_PLUS_MAX_DAYS_AHEAD
    }

    // Calculer la date minimale à minuit
    const minDate = addDays(today, minDaysAhead)
    const maxDate = addDays(today, maxDaysAhead)

    // Normaliser parsedDate à minuit également pour la comparaison
    const normalizedParsedDate = new Date(parsedDate)
    normalizedParsedDate.setHours(0, 0, 0, 0)

    // Comparer les dates normalisées
    if (normalizedParsedDate < minDate) {
      throw new Error(`La date de lancement doit être au moins ${minDaysAhead} jour(s) à l'avance`)
    }

    if (normalizedParsedDate > maxDate) {
      throw new Error(
        `La date de lancement ne peut pas être plus de ${maxDaysAhead} jours à l'avance pour ce type de lancement`,
      )
    }

    // Vérifier la disponibilité
    const availability = await getLaunchAvailability(format(parsedDate, DATE_FORMAT.API))

    let hasAvailability = false

    if (launchTypeValue === LAUNCH_TYPES.FREE) {
      hasAvailability = availability.freeSlots > 0
    } else if (launchTypeValue === LAUNCH_TYPES.PREMIUM) {
      hasAvailability = availability.premiumSlots > 0
    } else if (launchTypeValue === LAUNCH_TYPES.PREMIUM_PLUS) {
      hasAvailability = availability.premiumPlusSlots > 0
    }

    if (!hasAvailability) {
      throw new Error("No availability for the selected date and launch type")
    }

    // CORRECTION: Créer une date UTC correcte pour le jour sélectionné à 8h UTC
    // Extraire l'année, le mois et le jour de parsedDate
    const year = parsedDate.getFullYear()
    const month = parsedDate.getMonth()
    const day = parsedDate.getDate()

    // Créer une nouvelle date UTC avec ces composants et l'heure à 8h UTC
    const launchDate = new Date(
      Date.UTC(year, month, day, LAUNCH_SETTINGS.LAUNCH_HOUR_UTC, 0, 0, 0),
    )

    // Déterminer le statut initial en fonction du type de lancement
    let initialStatus: LaunchStatus = launchStatus.SCHEDULED

    // Pour les lancements premium, définir le statut à PAYMENT_PENDING
    if (launchTypeValue === LAUNCH_TYPES.PREMIUM || launchTypeValue === LAUNCH_TYPES.PREMIUM_PLUS) {
      initialStatus = launchStatus.PAYMENT_PENDING
    }

    // Mettre à jour le projet avec la date de lancement et le type
    const updateResult = await db
      .update(projectTable)
      .set({
        scheduledLaunchDate: launchDate, // Utiliser la date UTC correcte
        launchType: launchTypeValue as LaunchType,
        launchStatus: initialStatus, // Définir le statut initial en fonction du type de lancement
        featuredOnHomepage: launchTypeValue === LAUNCH_TYPES.PREMIUM_PLUS,
        updatedAt: new Date(),
      })
      .where(eq(projectTable.id, projectId))

    // Vérifier si la mise à jour a réussi
    if (!updateResult) {
      throw new Error("Failed to update project schedule")
    }

    // Ne mettre à jour les quotas que pour les lancements gratuits
    // Pour les lancements premium, les quotas seront mis à jour après le paiement
    if (launchTypeValue === LAUNCH_TYPES.FREE) {
      // Mettre à jour ou créer le quota pour cette date
      const quotaResult = await db
        .select()
        .from(launchQuota)
        .where(eq(launchQuota.date, launchDate))
        .limit(1)

      if (quotaResult.length === 0) {
        // Créer un nouveau quota
        await db.insert(launchQuota).values({
          id: crypto.randomUUID(),
          date: launchDate, // Utiliser la date avec l'heure correcte
          freeCount: 1,
          premiumCount: 0,
          premiumPlusCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      } else {
        // Mettre à jour le quota existant
        await db
          .update(launchQuota)
          .set({
            freeCount: sql`${launchQuota.freeCount} + 1`,
            updatedAt: new Date(),
          })
          .where(eq(launchQuota.id, quotaResult[0].id))
      }
    }

    // Revalider les chemins
    revalidatePath("/")
    revalidatePath("/dashboard")
    revalidatePath(`/projects/${projectId}`)

    return true
  } catch (error) {
    console.error("Error scheduling launch:", error)
    throw error // Propager l'erreur au lieu de retourner false
  }
}

// Mettre à jour le statut des chaînes dont la date de lancement est aujourd'hui
export async function updateProjectStatusToOngoing() {
  const todayStart = new Date()
  // Utiliser l'heure de lancement définie dans les constantes
  todayStart.setUTCHours(LAUNCH_SETTINGS.LAUNCH_HOUR_UTC, 0, 0, 0)

  // Trouver les chaînes programmées pour aujourd'hui
  // Ne mettre à jour que les chaînes avec le statut SCHEDULED (pas PAYMENT_PENDING)
  const result = await db
    .update(projectTable)
    .set({
      launchStatus: launchStatus.ONGOING,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(projectTable.launchStatus, launchStatus.SCHEDULED),
        gte(projectTable.scheduledLaunchDate, todayStart),
        lt(projectTable.scheduledLaunchDate, addDays(todayStart, 1)),
      ),
    )

  console.log(`Updated ${result.rowCount} projects to ONGOING`)
  return { success: true, updatedCount: result.rowCount }
}

// Mettre à jour le statut des chaînes dont la date de lancement était hier
export async function updateProjectStatusToLaunched() {
  const today = new Date()
  const yesterdayStart = new Date(today)
  yesterdayStart.setDate(yesterdayStart.getDate() - 1)
  // Utiliser l'heure de lancement définie dans les constantes
  yesterdayStart.setUTCHours(LAUNCH_SETTINGS.LAUNCH_HOUR_UTC, 0, 0, 0)

  // Trouver les chaînes en cours de lancement depuis hier
  // Ne mettre à jour que les chaînes avec le statut ONGOING
  const result = await db
    .update(projectTable)
    .set({
      launchStatus: launchStatus.LAUNCHED,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(projectTable.launchStatus, launchStatus.ONGOING),
        gte(projectTable.scheduledLaunchDate, yesterdayStart),
        lt(projectTable.scheduledLaunchDate, addDays(yesterdayStart, 1)),
      ),
    )

  console.log(`Updated ${result.rowCount} projects to LAUNCHED`)
  return { success: true, updatedCount: result.rowCount }
}
