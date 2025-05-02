"use client";

import Image from "next/image";
import Link from "next/link";
import { RiStarSFill } from "@remixicon/react";

interface Project {
  id: string;
  slug: string;
  name: string;
  logoUrl: string;
  description?: string | null;
  launchStatus: string;
}

interface PremiumCardProps {
  projects: Project[];
}

export function PremiumCard({ projects }: PremiumCardProps) {
  const displayItems = [...projects];
  const placeholdersNeeded = Math.max(0, 3 - projects.length);

  for (let i = 0; i < placeholdersNeeded; i++) {
    displayItems.push({
      id: `placeholder-${i}`,
      slug: "",
      name: "Available Slot",
      logoUrl: "",
      description: "Premium Plus Spot",
      launchStatus: "placeholder",
    });
  }

  return (
    <section className="space-y-3 sm:space-y-4">
      <div className="flex items-center justify-between px-3 sm:px-4">
        <h2 className="text-xl sm:text-2xl font-bold">Featured Premium Plus</h2>
      </div>
      <div className="grid grid-cols-3 gap-2 p-4 bg-background rounded-xl">
        {displayItems.map((item) =>
          item.launchStatus === "placeholder" ? (
            <div key={item.id} className="flex flex-col items-center">
              <Link
                href="/pricing"
                className="group flex flex-col items-center text-center sm:text-left sm:items-center  gap-3 p-2 hover:bg-muted/50 rounded-lg transition-colors"
              >
                <div className="relative cursor-pointer w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                  <div className="w-full h-full rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center">
                    <span className="text-xs text-zinc-400 dark:text-zinc-500">
                      +
                    </span>
                  </div>
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-base font-medium text-center line-clamp-2 group-hover:text-primary transition-colors">
                    Premium Plus Spot
                  </h4>
                </div>
              </Link>
            </div>
          ) : (
            <Link
              key={item.id}
              href={`/projects/${item.slug}`}
              className="group flex flex-col items-center text-center sm:text-left sm:items-center  gap-3 p-2 hover:bg-muted/50 rounded-lg transition-colors"
            >
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex-shrink-0 bg-muted">
                {item.logoUrl ? (
                  <Image
                    src={item.logoUrl}
                    alt={item.name}
                    fill
                    className="object-contain rounded-md p-1"
                  />
                ) : (
                  <span className="flex items-center justify-center h-full w-full text-xl font-bold text-muted-foreground">
                    {item.name.charAt(0)}
                  </span>
                )}
                <div className="absolute -top-2 z-10 -right-2 bg-primary rounded-full w-5 h-5 flex items-center justify-center border-2 border-background">
                  <RiStarSFill className="w-3 h-3 text-white" />
                </div>
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-base font-medium line-clamp-2 group-hover:text-primary transition-colors">
                  {item.name}
                </h4>
              </div>
            </Link>
          )
        )}
      </div>
    </section>
  );
}
