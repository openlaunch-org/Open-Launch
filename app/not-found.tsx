import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RiArrowLeftLine, RiFireLine } from "@remixicon/react";

export default function NotFound() {
  return (
    <div className="bg-secondary/20 min-h-[80vh] flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="bg-background border dark:border-zinc-800 rounded-xl p-8 shadow-sm">
          {/* Icon */}
          <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-500">404</span>
            </div>
          </div>

          {/* Title and description */}
          <h1 className="text-3xl font-bold font-heading mb-3">
            Page Not Found
          </h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or may have been
            moved. Please check the URL or try navigating to another section of
            the site.
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="outline" className="gap-2">
              <Link href="/">
                <RiArrowLeftLine className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <Button asChild className="gap-2">
              <Link href="/trending" className="flex items-center gap-2">
                <RiFireLine className="h-4 w-4" />
                Trending Projects
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
