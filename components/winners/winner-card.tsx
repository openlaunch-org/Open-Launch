"use client"

import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"

import { BronzeMedal, GoldMedal, SilverMedal } from "../icons/medal-icons"
import { Badge } from "../ui/badge"

interface WinnerCardProps {
  name: string
  slug: string
  description: string
  thumbnail: string
  dailyRanking: number | null
  upvoteCount: number
  commentCount: number
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
        return <GoldMedal className="h-12 w-12" />
      case 2:
        return <SilverMedal className="h-12 w-12" />
      case 3:
        return <BronzeMedal className="h-12 w-12" />
      default:
        return null
    }
  }

  const getRankingText = () => {
    switch (dailyRanking) {
      case 1:
        return "#1 Project of the day"
      case 2:
        return "#2 Second place"
      case 3:
        return "#3 Third place"
      default:
        return ""
    }
  }

  return (
    <div className="dark:bg-secondary/20 overflow-hidden rounded-lg border border-zinc-100 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)] dark:border-zinc-800/50">
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="relative h-20 w-20 shadow-sm">
              <Image
                src={thumbnail || "/placeholder.svg"}
                alt={name}
                fill
                sizes="(max-width: 640px) 64px, 80px"
                className="rounded-md object-cover"
              />
              <div className="absolute -top-4 -left-4 z-10">{getRankingIcon()}</div>
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-1">
              <h3 className="truncate text-xl font-semibold">{name}</h3>
              <Badge variant="secondary">{getRankingText()}</Badge>
              <p className="text-muted-foreground line-clamp-2 text-sm">{description}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3 dark:border-zinc-800/50">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-sm">
              <span className="text-foreground font-medium">{upvoteCount}</span>{" "}
              <span className="text-muted-foreground">upvotes</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <span className="text-foreground font-medium">{commentCount}</span>{" "}
              <span className="text-muted-foreground">comments</span>
            </div>
          </div>
          <Button asChild size="sm" variant="outline">
            <Link href={`/projects/${slug}`}>Visit Project</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
