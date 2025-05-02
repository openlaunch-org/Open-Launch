import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RiArrowLeftLine, RiQuestionLine } from "@remixicon/react";

export default function ProjectNotFound() {
  return (
    <div className="bg-secondary/20 min-h-[80vh] flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="bg-background border dark:border-zinc-800 rounded-xl p-8 shadow-sm">
          {/* Icon */}
          <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 flex items-center justify-center">
              <RiQuestionLine className="h-8 w-8 text-red-500" />
            </div>
          </div>

          {/* Title and description */}
          <h1 className="text-3xl font-bold font-heading mb-3">
            Project Not Found
          </h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            The project you&apos;re looking for doesn&apos;t exist or may have
            been removed. It might be a project that was abandoned during the
            payment process.
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="outline" className="gap-2">
              <Link
                href="/"
                className="text-primary underline hover:text-primary/80"
              >
                <RiArrowLeftLine className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <Button asChild className="gap-2">
              <Link href="/projects/submit">Submit a Project</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
