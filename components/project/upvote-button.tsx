"use client"

import { useEffect, useOptimistic, useState, useTransition } from "react"
import { useRouter } from "next/navigation"

import { RiThumbUpFill, RiThumbUpLine } from "@remixicon/react"
import { toast } from "sonner"

import { UPVOTE_LIMITS } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { toggleUpvote } from "@/app/actions/projects"

interface UpvoteButtonProps {
  projectId: string
  initialUpvoted: boolean
  upvoteCount: number
  isAuthenticated: boolean
  variant?: "default" | "compact"
  className?: string
}

export function UpvoteButton({
  projectId,
  initialUpvoted,
  upvoteCount,
  isAuthenticated,
  variant = "default",
  className,
}: UpvoteButtonProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isDebouncing, setIsDebouncing] = useState(false)
  const [optimisticState, updateOptimisticState] = useOptimistic(
    { upvoted: initialUpvoted, count: upvoteCount },
    (state, newUpvoted: boolean) => ({
      upvoted: newUpvoted,
      count: state.count + (newUpvoted ? 1 : -1),
    }),
  )

  // Réinitialiser l'état de debounce après le temps défini dans les constantes
  useEffect(() => {
    if (isDebouncing) {
      const timer = setTimeout(() => {
        setIsDebouncing(false)
      }, UPVOTE_LIMITS.DEBOUNCE_TIME_MS)
      return () => clearTimeout(timer)
    }
  }, [isDebouncing])

  const handleUpvote = async () => {
    if (!isAuthenticated) {
      router.push("/sign-in")
      return
    }

    // Si déjà en cours de traitement ou en debounce, ignorer le clic
    if (isPending || isDebouncing) {
      return
    }

    // Activer le debounce
    setIsDebouncing(true)

    startTransition(async () => {
      updateOptimisticState(!optimisticState.upvoted)

      const response = await toggleUpvote(projectId)

      if (!response.success) {
        // Annuler la mise à jour optimiste en cas d'erreur
        updateOptimisticState(optimisticState.upvoted)
        toast.error(response.message)
      }
    })
  }

  if (variant === "compact") {
    return (
      <button
        onClick={handleUpvote}
        disabled={isPending}
        className={cn(
          "hover:border-primary dark:hover:border-primary flex h-12 w-12 cursor-pointer flex-col items-center justify-center rounded-xl border-2 transition-all duration-300",
          optimisticState.upvoted && "border-primary",
          className,
        )}
      >
        {optimisticState.upvoted ? (
          <RiThumbUpFill className="text-primary h-3.5 w-3.5" />
        ) : (
          <RiThumbUpLine className="h-3.5 w-3.5 text-gray-700 dark:text-gray-300" />
        )}
        <span
          className={cn(
            "mt-1 text-sm leading-none font-semibold",
            optimisticState.upvoted ? "text-primary" : "text-gray-700 dark:text-gray-300",
          )}
        >
          {optimisticState.count}
        </span>
      </button>
    )
  }

  return (
    <button
      onClick={handleUpvote}
      disabled={isPending}
      className={cn(
        "bg-background inline-flex h-9 cursor-pointer items-center gap-2 rounded-md border px-3 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800",
        optimisticState.upvoted
          ? "border-primary text-primary hover:border-primary hover:bg-primary/5"
          : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700",
        !isAuthenticated && "cursor-not-allowed opacity-75",
        className,
      )}
    >
      {optimisticState.upvoted ? (
        <RiThumbUpFill className="h-4 w-4" />
      ) : (
        <RiThumbUpLine className="h-4 w-4" />
      )}
      <span className="text-sm">
        {optimisticState.count} {optimisticState.count === 1 ? "upvote" : "upvotes"}
      </span>
    </button>
  )
}
