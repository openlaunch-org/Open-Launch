"use client"

import Image from "next/image"
import Link from "next/link"

interface ProjectPodiumItem {
  id: string
  name: string
  slug: string
  logoUrl: string
  dailyRanking: number | null
}

interface TopLaunchesPodiumProps {
  topProjects: ProjectPodiumItem[]
}

export default function TopLaunchesPodium({ topProjects }: TopLaunchesPodiumProps) {
  if (!topProjects || topProjects.length === 0) {
    return (
      <div className="text-muted-foreground py-4 text-center text-sm">No launches yesterday</div>
    )
  }

  const sortedProjects = [...topProjects]
    .filter((project) => project.dailyRanking !== null)
    .sort((a, b) => (a.dailyRanking || 0) - (b.dailyRanking || 0))

  return (
    <div className="w-full">
      <div className="flex justify-evenly">
        {sortedProjects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.slug}`}
            className="group relative block"
            title={project.name}
          >
            <div className="relative aspect-square h-12 w-12 sm:h-14 sm:w-14">
              <Image
                src={project.logoUrl || "/placeholder.svg"}
                alt={project.name}
                fill
                className="rounded-md object-cover transition-opacity group-hover:opacity-90"
              />
              <div
                className={`bg-primary text-primary-foreground absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#FDFDFD] dark:border-[#1D1D1D]`}
              >
                <span className="text-[10px] font-semibold">{project.dailyRanking}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
