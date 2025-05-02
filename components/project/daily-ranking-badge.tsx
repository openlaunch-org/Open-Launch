import { cn } from "@/lib/utils";

interface DailyRankingBadgeProps {
  ranking: number | null;
  className?: string;
  size?: "sm" | "md"; // md pour des affichages plus grands
}

export function DailyRankingBadge({
  ranking,
  className,
  size = "sm",
}: DailyRankingBadgeProps) {
  if (!ranking || ranking > 3) return null;

  // Configurer les badges selon le classement
  const badges = {
    1: {
      bgColor: "bg-primary",
    },
    2: {
      bgColor: "bg-primary",
    },
    3: {
      bgColor: "bg-primary",
    },
  };

  const badge = badges[ranking as 1 | 2 | 3];

  const sizeClasses = {
    sm: "w-5 h-5 -top-2 -right-2",
    md: "w-6 h-6 -top-2 -right-2",
  };

  return (
    <div
      className={cn(
        "absolute z-10 rounded-full flex items-center justify-center border-2 border-[#FDFDFD] dark:border-[#1D1D1D]",
        badge.bgColor,
        sizeClasses[size],
        className
      )}
      title={`Top ${ranking}`}
    >
      <span className="text-white text-xs font-bold">{ranking}</span>
    </div>
  );
}
