"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "../ui/badge";
import { GoldMedal, SilverMedal, BronzeMedal } from "../icons/medal-icons";

interface WinnerCardProps {
  name: string;
  slug: string;
  description: string;
  thumbnail: string;
  dailyRanking: number | null;
  upvoteCount: number;
  commentCount: number;
}

export function WinnerCard({
  name,
  slug,
  description,
  thumbnail,
  dailyRanking,
  upvoteCount,
  commentCount,
}: WinnerCardProps) {
  const getRankingIcon = () => {
    switch (dailyRanking) {
      case 1:
        return <GoldMedal className="h-12 w-12" />;
      case 2:
        return <SilverMedal className="h-12 w-12" />;
      case 3:
        return <BronzeMedal className="h-12 w-12" />;
      default:
        return null;
    }
  };

  const getRankingText = () => {
    switch (dailyRanking) {
      case 1:
        return "#1 Project of the day";
      case 2:
        return "#2 Second place";
      case 3:
        return "#3 Third place";
      default:
        return "";
    }
  };

  return (
    <div className="bg-white dark:bg-secondary/20 border border-zinc-100 dark:border-zinc-800/50 rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden">
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="relative w-20 h-20 shadow-sm">
              <Image
                src={thumbnail || "/placeholder.svg"}
                alt={name}
                fill
                sizes="(max-width: 640px) 64px, 80px"
                className="object-cover rounded-md"
              />
              <div className="absolute -top-4 -left-4 z-10">
                {getRankingIcon()}
              </div>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col gap-1">
              <h3 className="text-xl font-semibold truncate">{name}</h3>
              <Badge variant="secondary">{getRankingText()}</Badge>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {description}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-sm">
              <span className="font-medium text-foreground">{upvoteCount}</span>{" "}
              <span className="text-muted-foreground">upvotes</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <span className="font-medium text-foreground">
                {commentCount}
              </span>{" "}
              <span className="text-muted-foreground">comments</span>
            </div>
          </div>
          <Button asChild size="sm" variant="outline">
            <Link href={`/projects/${slug}`}>Visit Project</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
