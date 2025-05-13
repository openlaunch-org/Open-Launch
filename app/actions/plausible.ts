"use server"

interface PlausibleApiResponse {
  results: {
    metrics: number[]
    dimensions: unknown[]
  }[]
}

export async function getLast24hVisitors(): Promise<number | null> {
  const PLAUSIBLE_URL = process.env.NEXT_PUBLIC_PLAUSIBLE_URL
  const PLAUSIBLE_API_KEY = process.env.PLAUSIBLE_API_KEY
  const PLAUSIBLE_SITE_ID = process.env.PLAUSIBLE_SITE_ID

  if (!PLAUSIBLE_API_KEY) {
    console.error("Plausible API key (PLAUSIBLE_API_KEY) is not configured.")
    return null
  }
  if (!PLAUSIBLE_SITE_ID) {
    console.error(
      "Plausible Site ID (PLAUSIBLE_SITE_ID) for server-side API calls is not configured.",
    )
    return null
  }

  const now = new Date()
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)

  try {
    const response = await fetch(`${PLAUSIBLE_URL}/api/v2/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PLAUSIBLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        site_id: PLAUSIBLE_SITE_ID,
        metrics: ["visitors"],
        date_range: [yesterday.toISOString(), now.toISOString()],
      }),
      next: { revalidate: 600 }, // 10 min cache
    })

    if (!response.ok) {
      console.error(
        `Error fetching Plausible stats: ${response.status} ${response.statusText}`,
        await response.text(),
      )
      return null
    }

    const data = (await response.json()) as PlausibleApiResponse

    if (
      Array.isArray(data.results) &&
      data.results.length > 0 &&
      data.results[0].metrics &&
      Array.isArray(data.results[0].metrics) &&
      typeof data.results[0].metrics[0] === "number"
    ) {
      return data.results[0].metrics[0]
    }

    console.error(
      "Unexpected Plausible API response structure or empty results:",
      JSON.stringify(data, null, 2),
    )
    return null
  } catch (error) {
    console.error("Error connecting to Plausible API:", error)
    return null
  }
}

export async function getLast7DaysVisitors(): Promise<number | null> {
  const PLAUSIBLE_URL = process.env.NEXT_PUBLIC_PLAUSIBLE_URL
  const PLAUSIBLE_API_KEY = process.env.PLAUSIBLE_API_KEY
  const PLAUSIBLE_SITE_ID = process.env.PLAUSIBLE_SITE_ID

  if (!PLAUSIBLE_API_KEY) {
    console.error("Plausible API key (PLAUSIBLE_API_KEY) is not configured.")
    return null
  }
  if (!PLAUSIBLE_SITE_ID) {
    console.error(
      "Plausible Site ID (PLAUSIBLE_SITE_ID) for server-side API calls is not configured.",
    )
    return null
  }

  try {
    const response = await fetch(`${PLAUSIBLE_URL}/api/v2/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PLAUSIBLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        site_id: PLAUSIBLE_SITE_ID,
        metrics: ["visitors"],
        date_range: "7d",
      }),
      next: { revalidate: 3600 }, // Mise en cache pour 1 heure
    })

    if (!response.ok) {
      console.error(
        `Error fetching Plausible stats (7 days): ${response.status} ${response.statusText}`,
        await response.text(),
      )
      return null
    }

    const data = (await response.json()) as PlausibleApiResponse

    if (
      Array.isArray(data.results) &&
      data.results.length > 0 &&
      data.results[0].metrics &&
      Array.isArray(data.results[0].metrics) &&
      typeof data.results[0].metrics[0] === "number"
    ) {
      return data.results[0].metrics[0]
    }

    console.error(
      "Unexpected Plausible API response structure for 7-day query:",
      JSON.stringify(data, null, 2),
    )
    return null
  } catch (error) {
    console.error("Error connecting to Plausible API (7 days):", error)
    return null
  }
}

export async function getLast30DaysVisitors(): Promise<number | null> {
  const PLAUSIBLE_URL = process.env.NEXT_PUBLIC_PLAUSIBLE_URL
  const PLAUSIBLE_API_KEY = process.env.PLAUSIBLE_API_KEY
  const PLAUSIBLE_SITE_ID = process.env.PLAUSIBLE_SITE_ID

  if (!PLAUSIBLE_API_KEY) {
    console.error("Plausible API key (PLAUSIBLE_API_KEY) is not configured.")
    return null
  }
  if (!PLAUSIBLE_SITE_ID) {
    console.error(
      "Plausible Site ID (PLAUSIBLE_SITE_ID) for server-side API calls is not configured.",
    )
    return null
  }

  try {
    const response = await fetch(`${PLAUSIBLE_URL}/api/v2/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PLAUSIBLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        site_id: PLAUSIBLE_SITE_ID,
        metrics: ["visitors"],
        date_range: "30d",
      }),
      next: { revalidate: 21600 }, // Mise en cache pour 6 heures
    })

    if (!response.ok) {
      console.error(
        `Error fetching Plausible stats (30 days): ${response.status} ${response.statusText}`,
        await response.text(),
      )
      return null
    }

    const data = (await response.json()) as PlausibleApiResponse

    if (
      Array.isArray(data.results) &&
      data.results.length > 0 &&
      data.results[0].metrics &&
      Array.isArray(data.results[0].metrics) &&
      typeof data.results[0].metrics[0] === "number"
    ) {
      return data.results[0].metrics[0]
    }

    console.error(
      "Unexpected Plausible API response structure for 30-day query:",
      JSON.stringify(data, null, 2),
    )
    return null
  } catch (error) {
    console.error("Error connecting to Plausible API (30 days):", error)
    return null
  }
}
