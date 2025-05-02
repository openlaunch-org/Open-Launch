/* eslint-disable @next/next/no-img-element */
import { format } from "date-fns";
import Image from "next/image";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  RiCalendarLine,
  RiCheckLine,
  RiFireLine,
  RiUser3Line,
  RiHashtag,
  RiInformationLine,
  RiGithubFill,
  RiTwitterFill,
  RiGlobalLine,
  RiCodeBoxFill,
  RiComputerLine,
  RiMoneyDollarCircleLine,
} from "@remixicon/react";
import {
  getProjectBySlug,
  hasUserUpvoted,
} from "@/app/actions/project-details";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ShareButton } from "@/components/project/share-button";
import { UpvoteButton } from "@/components/project/upvote-button";
import { ProjectComments } from "@/components/project/project-comments";
import { RankingBadge } from "@/components/project/ranking-badge";
import { EditButton } from "@/components/project/edit-button";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

// Types
interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata(
  { params }: ProjectPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const projectData = await getProjectBySlug(slug);

  if (!projectData) {
    return {
      title: "Project Not Found",
    };
  }

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${projectData.name} | Open-Launch`,
    description: projectData.description,
    openGraph: {
      title: `${projectData.name} on Open-Launch`,
      description: projectData.description,
      images: [
        projectData.coverImageUrl || projectData.logoUrl,
        ...previousImages,
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${projectData.name} on Open-Launch`,
      description: projectData.description,
      images: [projectData.coverImageUrl || projectData.logoUrl],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const projectData = await getProjectBySlug(slug);

  if (!projectData) {
    notFound();
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const hasUpvoted = session?.user
    ? await hasUserUpvoted(projectData.id)
    : false;

  const timeAgo = formatDistanceToNow(new Date(projectData.createdAt), {
    addSuffix: true,
  });

  const scheduledDate = projectData.scheduledLaunchDate
    ? new Date(projectData.scheduledLaunchDate)
    : null;

  const isActiveLaunch = projectData.launchStatus === "ongoing";

  const isScheduled = projectData.launchStatus === "scheduled";

  const isOwner = session?.user?.id === projectData.createdBy;

  let statusDisplay = null;
  if (projectData.launchStatus === "scheduled") {
    statusDisplay = (
      <Badge
        variant="outline"
        className="bg-blue-50 text-blue-800 border-blue-300"
      >
        <RiCalendarLine className="mr-1 h-3 w-3" />
        Scheduled for{" "}
        {scheduledDate ? format(scheduledDate, "MMM d, yyyy") : "launch"}
      </Badge>
    );
  } else if (projectData.launchStatus === "ongoing") {
    statusDisplay = (
      <Badge
        variant="outline"
        className="bg-blue-50 text-blue-800 border-blue-300"
      >
        <RiFireLine className="mr-1 h-3 w-3" />
        Featured Today
      </Badge>
    );
  } else if (projectData.launchStatus === "launched") {
    statusDisplay = (
      <Badge
        variant="outline"
        className="bg-gray-50 text-gray-800 border-gray-300"
      >
        <RiCheckLine className="mr-1 h-3 w-3" />
        Previously Featured
      </Badge>
    );
  }

  return (
    <div className="bg-secondary/20">
      <div className="w-full bg-secondary/10">
        <div className="max-w-6xl mx-auto px-4 relative">
          {projectData.coverImageUrl ? (
            <div className="relative w-full pt-[21.5%] md:pt-[16.5%] overflow-hidden rounded-b-lg">
              <Image
                src={projectData.coverImageUrl}
                alt={`${projectData.name} Cover Image`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 1200px, 2560px"
                className="object-cover object-center absolute top-0 left-0"
                quality={90}
                priority
              />
            </div>
          ) : (
            <div className="relative w-full pt-[15.5%] md:pt-[6.5%]">
              <div className="absolute inset-0 bg-gradient-to-b from-muted/50 to-transparent"></div>
            </div>
          )}
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 pb-12 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:items-start">
          <div className="md:col-span-2 space-y-8">
            <div className="bg-background border dark:border-zinc-800 rounded-xl p-6 shadow-sm -mt-4 md:-mt-4">
              <div className="hidden md:flex flex-row items-center gap-4 mb-6">
                <div className="relative h-28 w-28 -mt-16 flex-shrink-0 ring-4 ring-background rounded-md">
                  <Image
                    src={projectData.logoUrl}
                    alt={`${projectData.name} Logo`}
                    fill
                    sizes="112px"
                    className="object-cover rounded-md bg-white dark:bg-zinc-800"
                    priority
                  />
                </div>

                <h1 className="text-2xl font-bold font-heading break-words flex-grow">
                  {projectData.name}
                </h1>

                <div className="flex-shrink-0">
                  {projectData.launchStatus === "launched" &&
                    (projectData.dailyRanking ? (
                      <RankingBadge ranking={projectData.dailyRanking} />
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-gray-50 text-gray-800 border-gray-300 dark:bg-muted dark:text-zinc-200 dark:border-zinc-800"
                      >
                        <RiCheckLine className="mr-1 h-3 w-3" />
                        Previously Featured
                      </Badge>
                    ))}
                  {statusDisplay &&
                    projectData.launchStatus !== "launched" &&
                    statusDisplay}
                </div>
              </div>

              <div className="sm:hidden flex justify-start mb-4">
                <div className="relative h-28 w-28 -mt-16 flex-shrink-0 ring-4 ring-background rounded-md">
                  <Image
                    src={projectData.logoUrl}
                    alt={`${projectData.name} Logo`}
                    fill
                    sizes="112px"
                    className="object-cover rounded-md bg-white dark:bg-zinc-800"
                    priority
                  />
                </div>
              </div>

              <div className="sm:hidden mb-3">
                <h1 className="text-xl font-bold font-heading text-start">
                  {projectData.name}
                </h1>
              </div>

              <div className="sm:hidden flex justify-start mb-4">
                {projectData.launchStatus === "launched" &&
                  (projectData.dailyRanking ? (
                    <RankingBadge ranking={projectData.dailyRanking} />
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-gray-50 text-gray-800 border-gray-300 dark:bg-muted dark:text-zinc-200 dark:border-zinc-800"
                    >
                      <RiCheckLine className="mr-1 h-3 w-3" />
                      Previously Featured
                    </Badge>
                  ))}
                {statusDisplay &&
                  projectData.launchStatus !== "launched" &&
                  statusDisplay}
              </div>

              <div className="flex flex-wrap gap-2 mb-3 justify-start md:justify-start">
                {projectData.categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/categories?category=${category.id}`}
                    className="inline-flex items-center gap-1 text-xs bg-secondary px-2 py-1 rounded-full hover:bg-secondary/80 transition-colors"
                  >
                    <RiHashtag className="h-3 w-3" />
                    {category.name}
                  </Link>
                ))}
              </div>

              <div className="mt-6 border-t pt-4 dark:border-zinc-800">
                <p className="text-sm whitespace-pre-line mb-6">
                  {projectData.description}
                </p>

                <div className="flex flex-wrap gap-3">
                  {isActiveLaunch ? (
                    <UpvoteButton
                      projectId={projectData.id}
                      upvoteCount={projectData.upvoteCount}
                      initialUpvoted={hasUpvoted}
                      isAuthenticated={Boolean(session?.user)}
                      variant="default"
                    />
                  ) : (
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="bg-secondary/50 text-secondary-foreground px-3 py-2 rounded-md font-medium">
                        {projectData.upvoteCount} upvotes
                      </span>
                    </div>
                  )}

                  {projectData.websiteUrl && (
                    <Button variant="outline" asChild className="h-9">
                      <a
                        href={projectData.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <RiGlobalLine className="h-4 w-4" />
                        Visit Website
                      </a>
                    </Button>
                  )}

                  {isOwner && (
                    <EditButton
                      projectId={projectData.id}
                      initialDescription={projectData.description}
                      initialCategories={projectData.categories}
                      isOwner={isOwner}
                      isScheduled={isScheduled}
                    />
                  )}
                </div>
              </div>
            </div>

            {projectData.launchStatus === "scheduled" && (
              <div className="p-4 border rounded-lg bg-blue-50 text-blue-800 border-blue-200 flex items-start gap-2">
                <RiInformationLine className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div className="flex-grow">
                  <p className="font-medium">
                    This project is scheduled for launch! You can edit the
                    description and categories until the launch day.
                  </p>
                  <p className="text-sm mt-1">
                    {scheduledDate
                      ? `It will be featured on ${format(
                          scheduledDate,
                          "MMMM d, yyyy"
                        )}.`
                      : "The launch date will be announced soon."}
                  </p>
                </div>
              </div>
            )}

            {projectData.launchStatus === "ongoing" ||
            projectData.launchStatus === "launched" ? (
              <div id="comments">
                <ProjectComments projectId={projectData.id} />
              </div>
            ) : (
              <div className="bg-background border dark:border-zinc-800 rounded-xl p-6 shadow-sm text-center">
                <h2
                  className="text-xl font-bold font-heading mb-2"
                  id="comments"
                >
                  Comments
                </h2>
                <p className="text-muted-foreground">
                  Comments will be available once the project is launched.
                </p>
              </div>
            )}
          </div>

          <div className="md:sticky md:top-24 md:col-span-1 md:-mt-4">
            <div className="bg-background border dark:border-zinc-800 rounded-xl p-5 space-y-5 sticky top-24 shadow-sm">
              <div className="space-y-1">
                <h3 className="font-semibold">Added by</h3>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    {projectData.creator ? (
                      <>
                        {projectData.creator.image ? (
                          <img
                            src={projectData.creator.image}
                            alt={projectData.creator.name || "Creator avatar"}
                            className="h-5 w-5 rounded-full"
                          />
                        ) : (
                          <RiUser3Line className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span>{projectData.creator.name}</span>
                      </>
                    ) : (
                      <span className="text-muted-foreground italic">
                        Unknown
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Added {timeAgo}
                </div>
              </div>

              <div className="border-t dark:border-zinc-800 pt-4 space-y-3">
                <h3 className="font-semibold">Project details</h3>
                {(projectData.githubUrl || projectData.twitterUrl) && (
                  <div className="flex items-center gap-3">
                    {projectData.githubUrl && (
                      <a
                        href={projectData.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="GitHub Link"
                      >
                        <RiGithubFill className="h-5 w-5" />
                      </a>
                    )}
                    {projectData.twitterUrl && (
                      <a
                        href={projectData.twitterUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Twitter Link"
                      >
                        <RiTwitterFill className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                )}
                {projectData.techStack && projectData.techStack.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-sm font-medium text-muted-foreground inline-flex items-center gap-1.5">
                      <RiCodeBoxFill className="h-4 w-4" /> Tech Stack
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {projectData.techStack.map((tech) => (
                        <Badge
                          key={tech}
                          variant="secondary"
                          className="font-normal text-xs"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {projectData.platforms && projectData.platforms.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-sm font-medium text-muted-foreground inline-flex items-center gap-1.5">
                      <RiComputerLine className="h-4 w-4" /> Platforms
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {projectData.platforms.map((platform) => (
                        <Badge
                          key={platform}
                          variant="secondary"
                          className="capitalize font-normal text-xs"
                        >
                          {platform}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {projectData.pricing && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground inline-flex items-center gap-1.5">
                      <RiMoneyDollarCircleLine className="h-4 w-4" /> Pricing
                    </span>
                    <Badge
                      variant="outline"
                      className="capitalize text-xs font-normal"
                    >
                      {projectData.pricing}
                    </Badge>
                  </div>
                )}
                {scheduledDate && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground inline-flex items-center gap-1.5">
                      <RiCalendarLine className="h-4 w-4" />
                      {projectData.launchStatus === "launched"
                        ? "Launched on"
                        : "Launch date"}
                    </span>
                    <span className="text-foreground font-medium">
                      {format(scheduledDate, "MMM d, yyyy")}
                    </span>
                  </div>
                )}
              </div>

              <div className="border-t dark:border-zinc-800 pt-4 space-y-2">
                <h3 className="font-semibold">Share</h3>
                <ShareButton
                  name={projectData.name}
                  slug={projectData.slug}
                  variant="fullWidth"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
