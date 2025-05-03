export default function ProjectLoading() {
  return (
    <div className="bg-secondary/20">
      {/* Placeholder pour la bannière */}
      <div className="bg-secondary/10 w-full">
        <div className="relative mx-auto max-w-6xl px-4">
          <div className="bg-muted relative w-full animate-pulse overflow-hidden rounded-b-lg pt-[21.5%] md:pt-[16.5%]"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative mx-auto max-w-6xl px-4 pb-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:items-start">
          {/* Content */}
          <div className="space-y-8 md:col-span-2">
            {/* Skeleton pour l'en-tête */}
            <div className="bg-background -mt-4 rounded-xl border p-6 shadow-sm md:-mt-4 dark:border-zinc-800">
              <div className="flex flex-col gap-6 sm:flex-row">
                {/* Première ligne - visible uniquement sur desktop */}
                <div className="mb-6 hidden flex-row items-center gap-4 md:flex">
                  {/* Logo */}
                  <div className="ring-background bg-muted relative -mt-16 h-28 w-28 flex-shrink-0 animate-pulse rounded-md ring-4"></div>
                </div>

                {/* Version mobile - image seule */}
                <div className="mb-4 flex justify-start md:hidden">
                  {/* Logo Mobile */}
                  <div className="ring-background bg-muted relative -mt-12 h-24 w-24 flex-shrink-0 animate-pulse rounded-md ring-4"></div>
                </div>

                {/* Project Info */}
                <div className="min-w-0 flex-grow">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="bg-muted h-7 w-3/4 animate-pulse rounded-md"></div>
                      <div className="bg-muted h-6 w-24 animate-pulse rounded-full"></div>
                    </div>

                    <div className="mb-1 flex flex-wrap gap-2">
                      <div className="bg-muted h-5 w-16 animate-pulse rounded-full"></div>
                      <div className="bg-muted h-5 w-20 animate-pulse rounded-full"></div>
                      <div className="bg-muted h-5 w-14 animate-pulse rounded-full"></div>
                    </div>
                  </div>

                  {/* Project Quick Stats */}
                  <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                    <div className="bg-muted h-4 w-32 animate-pulse rounded-md"></div>
                    <div className="bg-muted h-4 w-20 animate-pulse rounded-md"></div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6 border-t pt-4 dark:border-zinc-800">
                <div className="mb-6 space-y-2">
                  <div className="bg-muted h-4 w-full animate-pulse rounded-md"></div>
                  <div className="bg-muted h-4 w-full animate-pulse rounded-md"></div>
                  <div className="bg-muted h-4 w-3/4 animate-pulse rounded-md"></div>
                  <div className="bg-muted h-4 w-5/6 animate-pulse rounded-md"></div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <div className="bg-muted h-9 w-28 animate-pulse rounded-md"></div>
                  <div className="bg-muted h-9 w-32 animate-pulse rounded-md"></div>
                </div>
              </div>
            </div>

            {/* Skeleton pour les commentaires */}
            <div className="bg-background rounded-xl border p-6 shadow-sm dark:border-zinc-800">
              <div className="bg-muted mb-6 h-7 w-32 animate-pulse rounded-md"></div>

              {/* Commentaire 1 */}
              <div className="mb-6 flex gap-4">
                <div className="bg-muted h-10 w-10 animate-pulse rounded-full"></div>
                <div className="flex-1 space-y-3">
                  <div className="bg-muted h-5 w-40 animate-pulse rounded-md"></div>
                  <div className="space-y-2">
                    <div className="bg-muted h-4 w-full animate-pulse rounded-md"></div>
                    <div className="bg-muted h-4 w-5/6 animate-pulse rounded-md"></div>
                  </div>
                </div>
              </div>

              {/* Commentaire 2 */}
              <div className="mb-6 flex gap-4">
                <div className="bg-muted h-10 w-10 animate-pulse rounded-full"></div>
                <div className="flex-1 space-y-3">
                  <div className="bg-muted h-5 w-32 animate-pulse rounded-md"></div>
                  <div className="space-y-2">
                    <div className="bg-muted h-4 w-full animate-pulse rounded-md"></div>
                    <div className="bg-muted h-4 w-3/4 animate-pulse rounded-md"></div>
                  </div>
                </div>
              </div>

              {/* Placeholder pour le champ de commentaire */}
              <div className="mt-8">
                <div className="bg-muted/50 h-24 w-full animate-pulse rounded-md"></div>
              </div>
            </div>
          </div>

          {/* Sidebar skeleton */}
          <div className="md:sticky md:top-24 md:col-span-1 md:-mt-4">
            <div className="bg-background space-y-5 rounded-xl border p-5 shadow-sm dark:border-zinc-800">
              {/* Creator info */}
              <div className="space-y-3">
                <div className="bg-muted h-5 w-24 animate-pulse rounded-md"></div>
                <div className="flex items-center gap-2">
                  <div className="bg-muted h-5 w-5 animate-pulse rounded-full"></div>
                  <div className="bg-muted h-4 w-24 animate-pulse rounded-md"></div>
                </div>
                <div className="bg-muted h-3 w-20 animate-pulse rounded-md"></div>
              </div>

              {/* Project info */}
              <div className="space-y-3 border-t pt-4 dark:border-zinc-800">
                <div className="bg-muted h-5 w-28 animate-pulse rounded-md"></div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="bg-muted h-4 w-20 animate-pulse rounded-md"></div>
                    <div className="bg-muted h-4 w-16 animate-pulse rounded-md"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="bg-muted h-4 w-16 animate-pulse rounded-md"></div>
                    <div className="bg-muted h-4 w-12 animate-pulse rounded-md"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="bg-muted h-4 w-14 animate-pulse rounded-md"></div>
                    <div className="bg-muted h-4 w-24 animate-pulse rounded-md"></div>
                  </div>
                </div>
              </div>

              {/* Share */}
              <div className="space-y-3 border-t pt-4 dark:border-zinc-800">
                <div className="bg-muted h-5 w-16 animate-pulse rounded-md"></div>
                <div className="bg-muted h-9 w-full animate-pulse rounded-md"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
