"use client";

import { Comments } from "@fuma-comment/react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface ProjectCommentsProps {
  projectId: string;
  className?: string;
}

export function ProjectComments({
  projectId,
  className,
}: ProjectCommentsProps) {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const signIn = () => {
    router.push("/sign-in");
  };

  if (!isClient) {
    return (
      <div className={cn("mt-8 animate-pulse", className)}>
        <div className="h-6 w-32 bg-gray-200 rounded dark:bg-gray-700 mb-4"></div>
        <div className="h-24 bg-gray-200 rounded dark:bg-gray-700 mb-2.5"></div>
        <div className="h-10 w-20 bg-gray-200 rounded dark:bg-gray-700"></div>
      </div>
    );
  }

  return (
    <div
      className={cn("mt-8 relative z-10", className)}
      data-fuma-comment-container="true"
      data-fuma-comment-button="true"
    >
      <Comments
        page={projectId}
        className="w-full bg-background"
        auth={{
          type: "api",
          signIn,
        }}
      />
    </div>
  );
}
