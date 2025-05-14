import Image from "next/image"
import Link from "next/link"

import { ExternalLink } from "lucide-react"

import { cn } from "@/lib/utils"

interface SponsorCardProps {
  name: string
  description: string
  url: string
  imageUrl?: string
  icon?: React.ReactNode
  className?: string
}

export function SponsorCard({
  name,
  description,
  url,
  imageUrl,
  icon,
  className,
}: SponsorCardProps) {
  const isMailto = url.startsWith("mailto:")

  return (
    <Link
      href={url}
      target={isMailto ? undefined : "_blank"}
      rel={isMailto ? undefined : "noopener"}
      className={cn(
        "hover:bg-muted/40 -mx-3 flex items-center gap-4 rounded-md p-3 transition-colors", // Always apply hover effect
        className,
      )}
    >
      {icon ? (
        <div className="bg-muted/30 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg border">
          {icon}
        </div>
      ) : imageUrl ? (
        <Image
          src={imageUrl}
          alt={`${name} logo`}
          width={48}
          height={48}
          className="flex-shrink-0 rounded-lg border"
        />
      ) : null}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 truncate text-sm font-semibold">
          {name}
          {!isMailto && <ExternalLink size={12} className="text-muted-foreground flex-shrink-0" />}
        </div>
        <p className="text-muted-foreground truncate text-xs">{description}</p>
      </div>
    </Link>
  )
}
