import Redis from "ioredis"

// Créer un client Redis
const redis = new Redis(process.env.REDIS_URL || "")

export async function checkRateLimit(
  identifier: string,
  limit: number,
  window: number,
): Promise<{
  success: boolean
  remaining: number
  reset: number
}> {
  const key = `rate-limit:${identifier}`
  const now = Date.now()
  const windowStart = now - window

  try {
    // Nettoyer les anciennes requêtes
    await redis.zremrangebyscore(key, 0, windowStart)

    // Obtenir le nombre de requêtes dans la fenêtre actuelle
    const requestCount = await redis.zcard(key)

    if (requestCount >= limit) {
      // Obtenir la requête la plus ancienne avec son score
      const oldestRequest = await redis.zrange(key, 0, 0, "WITHSCORES")
      const reset = oldestRequest.length ? parseInt(oldestRequest[1]) + window : now + window

      return {
        success: false,
        remaining: 0,
        reset: Math.ceil((reset - now) / 1000), // Temps restant en secondes
      }
    }

    // Ajouter la nouvelle requête
    await redis.zadd(key, now, now.toString())

    // Définir l'expiration de la clé
    await redis.expire(key, Math.ceil(window / 1000))

    return {
      success: true,
      remaining: limit - requestCount - 1,
      reset: Math.ceil(window / 1000),
    }
  } catch (error) {
    console.error("Redis error:", error)
    // En cas d'erreur Redis, on laisse passer la requête
    return {
      success: true,
      remaining: 1,
      reset: 0,
    }
  }
}
