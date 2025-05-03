"use client"

import { useEffect, useId, useRef, useState } from "react"

import {
  RiCodeFill,
  RiFacebookFill,
  RiMailLine,
  RiShareLine,
  RiTwitterXFill,
} from "@remixicon/react"
import { CheckIcon, CopyIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ShareButtonProps {
  name: string
  slug: string
  variant?: "default" | "fullWidth"
  className?: string
}

export function ShareButton({ name, slug, variant = "default", className }: ShareButtonProps) {
  const id = useId()
  const [copied, setCopied] = useState<boolean>(false)
  const [shareUrl, setShareUrl] = useState<string>("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const baseUrl = window.location.origin
    setShareUrl(`${baseUrl}/projects/${slug}`)
  }, [slug])

  const handleCopy = () => {
    if (inputRef.current) {
      navigator.clipboard.writeText(inputRef.current.value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }

  const shareOnSocial = (platform: string) => {
    const url = shareUrl
    const title = `Check out ${name} on Open-Launch`

    let socialShareUrl = ""
    switch (platform) {
      case "twitter":
        socialShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          url,
        )}&text=${encodeURIComponent(title)}`
        break
      case "facebook":
        socialShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        break
      case "email":
        socialShareUrl = `mailto:?subject=${encodeURIComponent(
          title,
        )}&body=${encodeURIComponent(url)}`
        break
      case "embed":
        navigator.clipboard.writeText(
          `<iframe src="${url}" width="100%" height="400" frameborder="0" title="${name} Embed"></iframe>`,
        )
        return
    }

    if (socialShareUrl) {
      window.open(socialShareUrl, "_blank")
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size={variant === "fullWidth" ? "default" : "sm"}
          className={cn(
            className,
            "flex items-center",
            variant === "fullWidth" ? "w-full justify-center" : "",
          )}
        >
          <RiShareLine className="h-4 w-4" />
          <span className={cn("ml-2", variant === "fullWidth" ? "" : "hidden sm:inline")}>
            Share
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <div className="flex flex-col gap-3 text-center">
          <div className="text-sm font-medium">Share {name}</div>
          <div className="flex flex-wrap justify-center gap-2">
            <Button
              size="icon"
              variant="outline"
              aria-label="Embed"
              onClick={() => shareOnSocial("embed")}
            >
              <RiCodeFill size={16} aria-hidden="true" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              aria-label="Share on Twitter"
              onClick={() => shareOnSocial("twitter")}
            >
              <RiTwitterXFill size={16} aria-hidden="true" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              aria-label="Share on Facebook"
              onClick={() => shareOnSocial("facebook")}
            >
              <RiFacebookFill size={16} aria-hidden="true" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              aria-label="Share via email"
              onClick={() => shareOnSocial("email")}
            >
              <RiMailLine size={16} aria-hidden="true" />
            </Button>
          </div>
          <div className="space-y-2">
            <div className="relative">
              <Input
                ref={inputRef}
                id={id}
                className="pe-9"
                type="text"
                value={shareUrl}
                aria-label="Share link"
                readOnly
              />
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={handleCopy}
                      className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 cursor-pointer items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed"
                      aria-label={copied ? "Copied" : "Copy to clipboard"}
                      disabled={copied}
                    >
                      <div
                        className={cn(
                          "transition-all",
                          copied ? "scale-100 opacity-100" : "scale-0 opacity-0",
                        )}
                      >
                        <CheckIcon className="stroke-emerald-500" size={16} aria-hidden="true" />
                      </div>
                      <div
                        className={cn(
                          "absolute transition-all",
                          copied ? "scale-0 opacity-0" : "scale-100 opacity-100",
                        )}
                      >
                        <CopyIcon size={16} aria-hidden="true" />
                      </div>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="px-2 py-1 text-xs">Copy to clipboard</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
