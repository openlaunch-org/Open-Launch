"use client";

import Image from "next/image";
import Link from "next/link";
import { RiExternalLinkLine } from "@remixicon/react";
import { ProjectCardButtons } from "./project-card-buttons";

interface Category {
  id: string;
  name: string;
}

interface ProjectCardProps {
  id: string;
  slug: string;
  name: string;
  description: string;
  logoUrl: string;
  upvoteCount: number;
  commentCount: number;
  launchStatus: string;
  index?: number;
  userHasUpvoted: boolean;
  categories: Category[];
  isAuthenticated: boolean;
  websiteUrl?: string;
}

export function ProjectCard({
  id,
  slug,
  name,
  description,
  logoUrl,
  upvoteCount,
  commentCount,
  launchStatus,
  index,
  userHasUpvoted,
  categories,
  isAuthenticated,
  websiteUrl,
}: ProjectCardProps) {
  const projectPageUrl = `/projects/${slug}`;

  return (
    <div className="py-3 sm:py-4 px-3 sm:px-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors rounded-xl">
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="flex-shrink-0">
          <Link href={projectPageUrl}>
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-md overflow-hidden">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={`${name} logo`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 48px, 56px"
                />
              ) : (
                <span className="flex items-center justify-center h-full w-full text-xl font-bold text-muted-foreground">
                  {name.charAt(0)}
                </span>
              )}
            </div>
          </Link>
        </div>

        <div className="flex-grow min-w-0">
          <div className="flex flex-col">
            <div className="flex items-center gap-1 group">
              <Link href={projectPageUrl}>
                <h3 className="text-sm sm:text-base font-medium line-clamp-1 group-hover:text-primary transition-colors">
                  {typeof index === "number" ? `${index + 1}. ` : ""}
                  {name}
                </h3>
              </Link>
              {websiteUrl && (
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary transition-opacity inline-flex items-center"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  title={`Visit ${name} website`}
                >
                  <RiExternalLinkLine className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity hidden md:inline-block" />
                </a>
              )}
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-1 mb-1">
              {description}
            </p>

            {categories.length > 0 && (
              <div className="hidden sm:flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground mt-1">
                {categories.slice(0, 3).map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/categories?category=${cat.id}`}
                    className="inline-flex items-center gap-1 text-xs bg-secondary px-2 py-0.5 rounded-full hover:bg-secondary/80 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <ProjectCardButtons
          projectPageUrl={projectPageUrl}
          commentCount={commentCount}
          projectId={id}
          upvoteCount={upvoteCount}
          isAuthenticated={isAuthenticated}
          hasUpvoted={userHasUpvoted}
          launchStatus={launchStatus}
          projectName={name}
        />
      </div>
    </div>
  );
}
