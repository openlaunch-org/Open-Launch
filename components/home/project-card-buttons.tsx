"use client";

import { RiMessage2Line, RiThumbUpLine } from "@remixicon/react";
import Link from "next/link";
import { UpvoteButton } from "@/components/project/upvote-button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { launchStatus as launchStatusEnum } from "@/drizzle/db/schema";

interface ProjectCardButtonsProps {
  projectPageUrl: string;
  commentCount: number;
  projectId: string;
  upvoteCount: number;
  isAuthenticated: boolean;
  hasUpvoted: boolean;
  launchStatus: string;
  projectName: string;
}

export function ProjectCardButtons({
  projectPageUrl,
  commentCount,
  projectId,
  upvoteCount,
  isAuthenticated,
  hasUpvoted,
  launchStatus,
  projectName,
}: ProjectCardButtonsProps) {
  const isActiveLaunch = launchStatus === launchStatusEnum.ONGOING;

  return (
    <div className="flex flex-col sm:flex-row items-end sm:items-start gap-2">
      <Link
        href={`${projectPageUrl}#comments`}
        className="hidden sm:flex flex-col items-center justify-center h-12 w-12 rounded-xl border-2 hover:border-primary dark:hover:border-primary transition-all duration-300 group"
        aria-label={`View comments for ${projectName}`}
      >
        <RiMessage2Line className="h-3.5 w-3.5 text-gray-700 dark:text-gray-300" />
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 leading-none mt-1">
          {commentCount}
        </span>
      </Link>
      {isActiveLaunch ? (
        <UpvoteButton
          projectId={projectId}
          initialUpvoted={hasUpvoted}
          upvoteCount={upvoteCount}
          isAuthenticated={isAuthenticated}
          variant="compact"
        />
      ) : (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex flex-col items-center justify-center h-12 w-12 rounded-xl border-2 border-dashed">
                <RiThumbUpLine className="h-3.5 w-3.5 text-gray-700 dark:text-gray-300" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 leading-none mt-1">
                  {upvoteCount}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs z-100">
              Upvoting closed
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}
