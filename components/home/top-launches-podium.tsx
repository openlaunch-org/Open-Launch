"use client";

import Image from "next/image";
import Link from "next/link";

interface ProjectPodiumItem {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  dailyRanking: number | null;
}

interface TopLaunchesPodiumProps {
  topProjects: ProjectPodiumItem[];
}

export default function TopLaunchesPodium({
  topProjects,
}: TopLaunchesPodiumProps) {
  if (!topProjects || topProjects.length === 0) {
    return (
      <div className="text-center text-sm text-muted-foreground py-4">
        No launches yesterday
      </div>
    );
  }

  const sortedProjects = [...topProjects]
    .filter((project) => project.dailyRanking !== null)
    .sort((a, b) => (a.dailyRanking || 0) - (b.dailyRanking || 0));

  return (
    <div className="w-full">
      <div className="flex justify-evenly">
        {sortedProjects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.slug}`}
            className="group block relative"
            title={project.name}
          >
            <div className="aspect-square relative w-12 h-12 sm:w-14 sm:h-14">
              <Image
                src={project.logoUrl || "/placeholder.svg"}
                alt={project.name}
                fill
                className="object-cover rounded-md group-hover:opacity-90 transition-opacity"
              />
              <div
                className={`absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#FDFDFD] dark:border-[#1D1D1D] bg-primary text-primary-foreground `}
              >
                <span className="text-[10px] font-semibold">
                  {project.dailyRanking}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
