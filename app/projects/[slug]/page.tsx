/* eslint-disable @next/next/no-img-element */
import { Metadata, ResolvingMetadata } from "next"
import { headers } from "next/headers"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

import {
  RiCalendarLine,
  RiCheckLine,
  RiCodeBoxFill,
  RiComputerLine,
  RiFireLine,
  RiGithubFill,
  RiGlobalLine,
  RiHashtag,
  RiInformationLine,
  RiMoneyDollarCircleLine,
  RiTwitterFill,
  RiUser3Line,
  RiVipCrownLine,
} from "@remixicon/react"
import { format, formatDistanceToNow } from "date-fns"

import { auth } from "@/lib/auth"
import { getProjectWebsiteRelAttribute } from "@/lib/link-utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EditButton } from "@/components/project/edit-button"
import { ProjectComments } from "@/components/project/project-comments"
import { ShareButton } from "@/components/project/share-button"
import { UpvoteButton } from "@/components/project/upvote-button"
import { getProjectBySlug, hasUserUpvoted } from "@/app/actions/project-details"

// Types
interface ProjectPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata(
  { params }: ProjectPageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = await params
  const projectData = await getProjectBySlug(slug)

  if (!projectData) {
    return {
      title: "Project Not Found",
    }
  }

  const previousImages = (await parent).openGraph?.images || []

  return {
    title: `${projectData.name} | ${process.env.NEXT_PUBLIC_APP_NAME}`,
    description: projectData.description,
    openGraph: {
      title: `${projectData.name} on ${process.env.NEXT_PUBLIC_APP_NAME}`,
      description: projectData.description,
      images: [projectData.coverImageUrl || projectData.logoUrl, ...previousImages],
    },
    twitter: {
      card: "summary_large_image",
      title: `${projectData.name} on ${process.env.NEXT_PUBLIC_APP_NAME}`,
      description: projectData.description,
      images: [projectData.coverImageUrl || projectData.logoUrl],
    },
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const projectData = await getProjectBySlug(slug)

  if (!projectData) {
    notFound()
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  })

  const hasUpvoted = session?.user ? await hasUserUpvoted(projectData.id) : false

  const timeAgo = formatDistanceToNow(new Date(projectData.createdAt), {
    addSuffix: true,
  })

  const scheduledDate = projectData.scheduledLaunchDate
    ? new Date(projectData.scheduledLaunchDate)
    : null

  const isActiveLaunch = projectData.launchStatus === "ongoing"

  const isScheduled = projectData.launchStatus === "scheduled"

  const isOwner = session?.user?.id === projectData.createdBy

  const websiteRelAttribute = getProjectWebsiteRelAttribute({
    launchStatus: projectData.launchStatus,
    launchType: projectData.launchType,
    dailyRanking: projectData.dailyRanking,
  })

  let statusDisplay = null
  if (projectData.launchStatus === "scheduled") {
    statusDisplay = (
      <Badge variant="outline" className="border-blue-300 bg-blue-50 text-blue-800">
        <RiCalendarLine className="mr-1 h-3 w-3" />
        Scheduled for {scheduledDate ? format(scheduledDate, "MMM d, yyyy") : "launch"}
      </Badge>
    )
  } else if (projectData.launchStatus === "ongoing") {
    statusDisplay = (
      <Badge variant="outline" className="border-blue-300 bg-blue-50 text-blue-800">
        <RiFireLine className="mr-1 h-3 w-3" />
        Featured Today
      </Badge>
    )
  } else if (projectData.launchStatus === "launched") {
    statusDisplay = (
      <Badge variant="outline" className="border-gray-300 bg-gray-50 text-gray-800">
        <RiCheckLine className="mr-1 h-3 w-3" />
        Previously Featured
      </Badge>
    )
  }

  return (
    <div className="bg-secondary/20">
      <div className="bg-secondary/10 w-full">
        <div className="relative mx-auto max-w-6xl px-4">
          {projectData.coverImageUrl ? (
            <div className="relative w-full overflow-hidden rounded-b-lg pt-[21.5%] md:pt-[16.5%]">
              <Image
                src={projectData.coverImageUrl}
                alt={`${projectData.name} Cover Image`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 1200px, 2560px"
                className="absolute top-0 left-0 object-cover object-center"
                quality={90}
                priority
              />
            </div>
          ) : (
            <div className="relative w-full pt-[15.5%] md:pt-[6.5%]">
              <div className="from-muted/50 absolute inset-0 bg-gradient-to-b to-transparent"></div>
            </div>
          )}
        </div>
      </div>
      <div className="relative mx-auto max-w-6xl px-4 pb-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:items-start">
          <div className="space-y-8 md:col-span-2">
            <div className="bg-background -mt-4 rounded-xl border p-6 md:-mt-4 dark:border-zinc-800">
              <div className="mb-6 hidden flex-row items-center gap-4 md:flex">
                <div className="ring-background relative -mt-16 h-28 w-28 flex-shrink-0 rounded-md ring-4">
                  <Image
                    src={projectData.logoUrl}
                    alt={`${projectData.name} Logo`}
                    fill
                    sizes="112px"
                    className="rounded-md bg-white object-cover dark:bg-zinc-800"
                    priority
                  />
                </div>

                <h1 className="font-heading flex-grow text-2xl font-bold break-words">
                  {projectData.name}
                </h1>

                <div className="flex-shrink-0">
                  {projectData.launchStatus === "launched" &&
                    (projectData.dailyRanking ? (
                      <a
                        href={`/projects/${projectData.slug}`}
                        target="_blank"
                        title={`${process.env.NEXT_PUBLIC_APP_NAME} Top ${projectData.dailyRanking} Daily Winner`}
                      >
                        <img
                          src={`/images/badges/top${projectData.dailyRanking}-light.svg`}
                          alt={`${process.env.NEXT_PUBLIC_APP_NAME} Top ${projectData.dailyRanking} Daily Winner`}
                          className="h-auto w-[195px] dark:hidden"
                        />
                        <img
                          src={`/images/badges/top${projectData.dailyRanking}-dark.svg`}
                          alt={`${process.env.NEXT_PUBLIC_APP_NAME} Top ${projectData.dailyRanking} Daily Winner`}
                          className="hidden h-auto w-[195px] dark:block"
                        />
                      </a>
                    ) : (
                      <Badge
                        variant="outline"
                        className="dark:bg-muted border-gray-300 bg-gray-50 text-gray-800 dark:border-zinc-800 dark:text-zinc-200"
                      >
                        <RiCheckLine className="mr-1 h-3 w-3" />
                        Previously Featured
                      </Badge>
                    ))}
                  {statusDisplay && projectData.launchStatus !== "launched" && statusDisplay}
                </div>
              </div>

              <div className="mb-4 flex justify-start sm:hidden">
                <div className="ring-background relative -mt-16 h-28 w-28 flex-shrink-0 rounded-md ring-4">
                  <Image
                    src={projectData.logoUrl}
                    alt={`${projectData.name} Logo`}
                    fill
                    sizes="112px"
                    className="rounded-md bg-white object-cover dark:bg-zinc-800"
                    priority
                  />
                </div>
              </div>

              <div className="mb-3 sm:hidden">
                <h1 className="font-heading text-start text-xl font-bold">{projectData.name}</h1>
              </div>

              <div className="mb-4 flex justify-start sm:hidden">
                {projectData.launchStatus === "launched" &&
                  (projectData.dailyRanking ? (
                    <a
                      href={`/projects/${projectData.slug}`}
                      target="_blank"
                      title={
                        process.env.NEXT_PUBLIC_APP_NAME +
                        ` Top ${projectData.dailyRanking} Daily Winner`
                      }
                    >
                      <img
                        src={`/images/badges/top${projectData.dailyRanking}-light.svg`}
                        alt={
                          process.env.NEXT_PUBLIC_APP_NAME +
                          ` Top ${projectData.dailyRanking} Daily Winner`
                        }
                        className="h-auto w-[195px] dark:hidden"
                      />
                      <img
                        src={`/images/badges/top${projectData.dailyRanking}-dark.svg`}
                        alt={
                          process.env.NEXT_PUBLIC_APP_NAME +
                          ` Top ${projectData.dailyRanking} Daily Winner`
                        }
                        className="hidden h-auto w-[195px] dark:block"
                      />
                    </a>
                  ) : (
                    <Badge
                      variant="outline"
                      className="dark:bg-muted border-gray-300 bg-gray-50 text-gray-800 dark:border-zinc-800 dark:text-zinc-200"
                    >
                      <RiCheckLine className="mr-1 h-3 w-3" />
                      Previously Featured
                    </Badge>
                  ))}
                {statusDisplay && projectData.launchStatus !== "launched" && statusDisplay}
              </div>

              <div className="mb-3 flex flex-wrap justify-start gap-2 md:justify-start">
                {projectData.categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/categories?category=${category.id}`}
                    className="bg-secondary hover:bg-secondary/80 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs transition-colors"
                  >
                    <RiHashtag className="h-3 w-3" />
                    {category.name}
                  </Link>
                ))}
              </div>

              <div className="mt-6 border-t pt-4 dark:border-zinc-800">
                <p className="mb-6 text-sm whitespace-pre-line">{projectData.description}</p>

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
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                      <span className="bg-secondary/50 text-secondary-foreground rounded-md px-3 py-2 font-medium">
                        {projectData.upvoteCount} upvotes
                      </span>
                    </div>
                  )}

                  {projectData.websiteUrl && (
                    <Button variant="outline" asChild className="h-9">
                      <a
                        href={projectData.websiteUrl}
                        target="_blank"
                        rel={websiteRelAttribute}
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

            {isOwner &&
              projectData.launchStatus === "launched" &&
              projectData.dailyRanking &&
              projectData.dailyRanking <= 3 && (
                <div className="border-primary/30 bg-primary/10 text-primary mb-4 flex flex-col items-center gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:gap-3 sm:text-left">
                  <div className="flex w-full flex-col items-center gap-2 text-center sm:flex-row sm:items-center sm:justify-between sm:gap-2 sm:text-left">
                    <span className="text-sm font-medium">
                      Congratulations! You earned a badge for your ranking.
                    </span>
                    <Button
                      asChild
                      variant="default"
                      size="sm"
                      className="flex h-8 w-full items-center gap-2 px-4 text-sm font-semibold sm:ml-2 sm:w-auto sm:justify-end"
                      title="See your earned badges"
                    >
                      <Link href={`/projects/${projectData.slug}/badges`}>
                        <RiVipCrownLine className="h-4 w-4" />
                        Badges
                      </Link>
                    </Button>
                  </div>
                </div>
              )}

            {projectData.launchStatus === "scheduled" && (
              <div className="flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 p-4 text-blue-800">
                <RiInformationLine className="mt-0.5 h-5 w-5 flex-shrink-0" />
                <div className="flex-grow">
                  <p className="font-medium">
                    This project is scheduled for launch! You can edit the description and
                    categories until the launch day.
                  </p>
                  <p className="mt-1 text-sm">
                    {scheduledDate
                      ? `It will be featured on ${format(scheduledDate, "MMMM d, yyyy")}.`
                      : "The launch date will be announced soon."}
                  </p>
                </div>
              </div>
            )}

            {projectData.launchStatus === "ongoing" || projectData.launchStatus === "launched" ? (
              <div id="comments">
                <ProjectComments projectId={projectData.id} />
              </div>
            ) : (
              <div className="bg-background rounded-xl border p-6 text-center dark:border-zinc-800">
                <h2 className="font-heading mb-2 text-xl font-bold" id="comments">
                  Comments
                </h2>
                <p className="text-muted-foreground">
                  Comments will be available once the project is launched.
                </p>
              </div>
            )}
          </div>

          <div className="md:sticky md:top-24 md:col-span-1 md:-mt-4">
            <div className="bg-background sticky top-24 space-y-5 rounded-xl border p-5 dark:border-zinc-800">
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
                          <RiUser3Line className="text-muted-foreground h-4 w-4" />
                        )}
                        <span>{projectData.creator.name}</span>
                      </>
                    ) : (
                      <span className="text-muted-foreground italic">Unknown</span>
                    )}
                  </div>
                </div>
                <div className="text-muted-foreground mt-1 text-xs">Added {timeAgo}</div>
              </div>

              <div className="space-y-3 border-t pt-4 dark:border-zinc-800">
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
                    <span className="text-muted-foreground inline-flex items-center gap-1.5 text-sm font-medium">
                      <RiCodeBoxFill className="h-4 w-4" /> Tech Stack
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {projectData.techStack.map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs font-normal">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {projectData.platforms && projectData.platforms.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-muted-foreground inline-flex items-center gap-1.5 text-sm font-medium">
                      <RiComputerLine className="h-4 w-4" /> Platforms
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {projectData.platforms.map((platform) => (
                        <Badge
                          key={platform}
                          variant="secondary"
                          className="text-xs font-normal capitalize"
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
                    <Badge variant="outline" className="text-xs font-normal capitalize">
                      {projectData.pricing}
                    </Badge>
                  </div>
                )}
                {scheduledDate && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground inline-flex items-center gap-1.5">
                      <RiCalendarLine className="h-4 w-4" />
                      {projectData.launchStatus === "launched" ? "Launched on" : "Launch date"}
                    </span>
                    <span className="text-foreground font-medium">
                      {format(scheduledDate, "MMM d, yyyy")}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-2 border-t pt-4 dark:border-zinc-800">
                <h3 className="font-semibold">Share</h3>
                <ShareButton name={projectData.name} slug={projectData.slug} variant="fullWidth" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
