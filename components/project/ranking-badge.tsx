import { Badge } from "@/components/ui/badge";
import {
  GoldMedal,
  SilverMedal,
  BronzeMedal,
} from "@/components/icons/medal-icons";

interface RankingBadgeProps {
  ranking: number;
}

export function RankingBadge({ ranking }: RankingBadgeProps) {
  // Determine medal icon based on ranking
  const getMedalIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <GoldMedal className="w-8 h-8" />;
      case 2:
        return <SilverMedal className="w-8 h-8" />;
      case 3:
        return <BronzeMedal className="w-8 h-8" />;
      default:
        return <GoldMedal className="w-8 h-8" />;
    }
  };

  const medalIcon = getMedalIcon(ranking);

  return (
    <Badge
      variant="outline"
      className="flex items-center overflow-visible px-3 py-1.5 
      bg-white dark:bg-muted
      border-primary/90 dark:border-zinc-800
      text-primary dark:text-zinc-200
      rounded-lg shadow-sm"
      title={`Top ${ranking} Project`}
    >
      <div className="flex items-center">
        <div className="w-9 h-9 -ml-1 mr-1 flex-shrink-0 flex items-center justify-center">
          {medalIcon}
        </div>
        <div className="flex flex-col">
          <span className="uppercase text-[10px] tracking-wide font-bold text-primary dark:text-zinc-400">
            Open-Launch
          </span>
          <span className="font-bold text-primary dark:text-zinc-200 text-sm -mt-0.5">
            #{ranking} Project of the Day
          </span>
        </div>
      </div>
    </Badge>
  );
}
