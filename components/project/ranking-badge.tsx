import { Badge } from "@/components/ui/badge"
import { BronzeMedal, GoldMedal, SilverMedal } from "@/components/icons/medal-icons"

interface RankingBadgeProps {
  ranking: number
}

export function RankingBadge({ ranking }: RankingBadgeProps) {
  // Determine medal icon based on ranking
  const getMedalIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <GoldMedal className="h-8 w-8" />
      case 2:
        return <SilverMedal className="h-8 w-8" />
      case 3:
        return <BronzeMedal className="h-8 w-8" />
      default:
        return <GoldMedal className="h-8 w-8" />
    }
  }

  const medalIcon = getMedalIcon(ranking)

  return (
    <Badge
      variant="outline"
      className="dark:bg-muted border-primary/90 text-primary flex items-center overflow-visible rounded-lg bg-white px-3 py-1.5 shadow-sm dark:border-zinc-800 dark:text-zinc-200"
      title={`Top ${ranking} Project`}
    >
      <div className="flex items-center">
        <div className="mr-1 -ml-1 flex h-9 w-9 flex-shrink-0 items-center justify-center">
          {medalIcon}
        </div>
        <div className="flex flex-col">
          <span className="text-primary text-[10px] font-bold tracking-wide uppercase dark:text-zinc-400">
            Open-Launch
          </span>
          <span className="text-primary -mt-0.5 text-sm font-bold dark:text-zinc-200">
            #{ranking} Project of the Day
          </span>
        </div>
      </div>
    </Badge>
  )
}
