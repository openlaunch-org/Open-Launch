"use client";

import { RiAddCircleFill } from "@remixicon/react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export function WelcomeBanner() {
  const router = useRouter();

  return (
    <div className="bg-white/70 dark:bg-secondary/20 border border-zinc-100 dark:border-zinc-800/50 p-5 rounded-md shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
      <div className="flex items-start md:items-center justify-between">
        <div className="flex items-start md:items-center gap-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-1">
              Welcome to Open-Launch!
            </h2>
            <p className="text-muted-foreground text-sm max-w-xl mb-3">
              Discover and support the best new tech products. Explore daily
              launches and upvote your favorite projects.
            </p>
            <Button
              onClick={() => router.push("/projects/submit")}
              variant="outline"
            >
              Submit a Project
              <RiAddCircleFill className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
