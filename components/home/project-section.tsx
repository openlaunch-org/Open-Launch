"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RiArrowRightLine } from "@remixicon/react";
import { ProjectCard } from "./project-card";

interface Project {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  logoUrl: string;
  websiteUrl?: string | null;
  upvoteCount: number;
  commentCount?: number | null;
  launchStatus: string;
  scheduledLaunchDate?: Date | string | null;
  createdAt: Date | string;
  userHasUpvoted?: boolean;
  categories?: { id: string; name: string }[];
  dailyRanking?: number | null;
}

interface ProjectSectionProps {
  title: string;
  projects: Project[];
  moreHref?: string;
  sortByUpvotes?: boolean;
  isAuthenticated: boolean;
}

export function ProjectSection({
  title,
  projects,
  moreHref,
  sortByUpvotes = false,
  isAuthenticated,
}: ProjectSectionProps) {
  const sortedProjects = sortByUpvotes
    ? [...projects].sort((a, b) => (b.upvoteCount ?? 0) - (a.upvoteCount ?? 0))
    : projects;

  const ViewAllButton = () => (
    <Button
      variant="ghost"
      size="sm"
      className={"text-sm w-full sm:w-auto justify-center"}
      asChild
    >
      <Link href={moreHref!} className="flex items-center gap-1">
        View all <RiArrowRightLine className="h-4 w-4" />
      </Link>
    </Button>
  );

  const ViewAllButtonMobile = () => (
    <Button
      variant="ghost"
      size="sm"
      className={"text-sm w-full sm:w-auto justify-center bg-secondary"}
      asChild
    >
      <Link href={moreHref!} className="flex items-center gap-1">
        View all <RiArrowRightLine className="h-4 w-4" />
      </Link>
    </Button>
  );

  return (
    <section className="space-y-3 sm:space-y-4">
      <div className="flex items-center justify-between px-3 sm:px-4">
        <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
        {moreHref && (
          <div className="hidden sm:block">
            <ViewAllButton />
          </div>
        )}
      </div>

      <div className="overflow-hidden">
        {sortedProjects.length > 0 ? (
          <div className="flex flex-col">
            {sortedProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                id={project.id}
                name={project.name}
                slug={project.slug}
                description={project.description || ""}
                logoUrl={project.logoUrl}
                upvoteCount={project.upvoteCount ?? 0}
                commentCount={project.commentCount ?? 0}
                launchStatus={project.launchStatus}
                userHasUpvoted={project.userHasUpvoted ?? false}
                categories={project.categories ?? []}
                isAuthenticated={isAuthenticated}
                index={index}
                websiteUrl={project.websiteUrl ?? undefined}
              />
            ))}
          </div>
        ) : (
          <div className="px-3 sm:px-4">
            <div className="text-center text-sm text-muted-foreground border border-dashed border-border bg-card rounded-lg py-8">
              {'No projects found for "' + title + '"'}
            </div>
          </div>
        )}

        {moreHref && (
          <div className="sm:hidden px-3 pt-3">
            <ViewAllButtonMobile />
          </div>
        )}
      </div>
    </section>
  );
}
