"use client";

import Image from "next/image";
import Link from "next/link";
import { formatDistance } from "date-fns";
import { RiCalendarLine, RiMessage2Line, RiCheckLine } from "@remixicon/react";

// Interface pour les props du composant
interface DashboardProjectCardProps {
  name: string;
  slug: string;
  logoUrl: string;
  description: string;
  launchStatus: string;
  scheduledLaunchDate?: string | Date | null;
  createdAt: string | Date;
  commentCount?: number | string | null; // Ajouter commentCount
  // On n'a pas besoin de websiteUrl ou autres ici pour la version simplifiée
}

export function DashboardProjectCard({
  name,
  slug,
  logoUrl,
  description,
  launchStatus,
  scheduledLaunchDate,
  createdAt,
  commentCount,
}: DashboardProjectCardProps) {
  const projectPageUrl = `/projects/${slug}`;

  const renderStatusBadge = () => {
    if (launchStatus === "scheduled" && scheduledLaunchDate) {
      return (
        <span className="flex items-center gap-1 text-blue-600">
          <RiCalendarLine className="h-3.5 w-3.5" />
          Scheduled: {new Date(scheduledLaunchDate).toLocaleDateString()}
        </span>
      );
    } else if (launchStatus === "ongoing") {
      // For ongoing, we'll display upvotes/comments separately
      return (
        <span className="flex items-center gap-1 text-green-600">
          Active Launch
        </span>
      );
    } else if (launchStatus === "launched") {
      return (
        <span className="flex items-center gap-1 text-muted-foreground">
          <RiCheckLine className="h-3.5 w-3.5" />
          Launched:{" "}
          {formatDistance(new Date(createdAt), new Date(), { addSuffix: true })}
        </span>
      );
    }
    return null;
  };

  return (
    <Link
      href={projectPageUrl}
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/40 transition-colors border dark:border-zinc-800/50"
    >
      <Image
        src={logoUrl || "/placeholder.svg"} // Fallback si pas de logo
        alt={name}
        width={48}
        height={48}
        className="rounded-md object-contain bg-white dark:bg-zinc-800 p-0.5 flex-shrink-0"
      />
      <div className="flex-grow min-w-0">
        <h4 className="font-medium truncate text-sm sm:text-base">{name}</h4>
        <p className="text-xs sm:text-sm text-muted-foreground truncate mb-1">
          {description}
        </p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {/* Display the main status/date badge */}
          {renderStatusBadge()}

          {/* Display Comments for ongoing and launched */}
          {(launchStatus === "ongoing" || launchStatus === "launched") &&
            commentCount != null && (
              <span className="flex items-center gap-1">
                <RiMessage2Line className="h-3.5 w-3.5" />
                {commentCount ?? 0}
              </span>
            )}
        </div>
      </div>
      {/* On peut ajouter un badge de statut ici si besoin */}
      {/* <Badge variant=\"outline\" className=\"text-xs ml-auto\">{launchStatus}</Badge> */}
    </Link>
  );
}
