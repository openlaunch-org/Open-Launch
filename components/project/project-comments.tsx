"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { Comments } from "@fuma-comment/react"

import { cn } from "@/lib/utils"

interface ProjectCommentsProps {
  projectId: string
  className?: string
}

export function ProjectComments({ projectId, className }: ProjectCommentsProps) {
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
  }, [])

  const signIn = () => {
    router.push("/sign-in")
  }

  if (!isClient) {
    return (
      <div className={cn("mt-8 animate-pulse", className)}>
        <div className="mb-4 h-6 w-32 rounded bg-gray-200 dark:bg-gray-700"></div>
        <div className="mb-2.5 h-24 rounded bg-gray-200 dark:bg-gray-700"></div>
        <div className="h-10 w-20 rounded bg-gray-200 dark:bg-gray-700"></div>
      </div>
    )
  }

  return (
    <div
      className={cn("relative z-10 mt-8", className)}
      data-fuma-comment-container="true"
      data-fuma-comment-button="true"
    >
      <Comments
        page={projectId}
        className="bg-background w-full"
        auth={{
          type: "api",
          signIn,
        }}
      />
    </div>
  )
}
