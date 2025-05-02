export default function ProjectLoading() {
  return (
    <div className="bg-secondary/20">
      {/* Placeholder pour la bannière */}
      <div className="w-full bg-secondary/10">
        <div className="max-w-6xl mx-auto px-4 relative">
          <div className="relative w-full pt-[21.5%] md:pt-[16.5%] overflow-hidden rounded-b-lg bg-muted animate-pulse"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 pb-12 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:items-start">
          {/* Content */}
          <div className="md:col-span-2 space-y-8">
            {/* Skeleton pour l'en-tête */}
            <div className="bg-background border dark:border-zinc-800 rounded-xl p-6 shadow-sm -mt-4 md:-mt-4">
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Première ligne - visible uniquement sur desktop */}
                <div className="hidden md:flex flex-row items-center gap-4 mb-6">
                  {/* Logo */}
                  <div className="relative h-28 w-28 -mt-16 flex-shrink-0 ring-4 ring-background rounded-md bg-muted animate-pulse"></div>
                </div>

                {/* Version mobile - image seule */}
                <div className="md:hidden flex justify-start mb-4">
                  {/* Logo Mobile */}
                  <div className="relative h-24 w-24 -mt-12 flex-shrink-0 ring-4 ring-background rounded-md bg-muted animate-pulse"></div>
                </div>

                {/* Project Info */}
                <div className="flex-grow min-w-0">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="h-7 w-3/4 bg-muted animate-pulse rounded-md"></div>
                      <div className="h-6 w-24 bg-muted animate-pulse rounded-full"></div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-1">
                      <div className="h-5 w-16 bg-muted animate-pulse rounded-full"></div>
                      <div className="h-5 w-20 bg-muted animate-pulse rounded-full"></div>
                      <div className="h-5 w-14 bg-muted animate-pulse rounded-full"></div>
                    </div>
                  </div>

                  {/* Project Quick Stats */}
                  <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
                    <div className="h-4 w-32 bg-muted animate-pulse rounded-md"></div>
                    <div className="h-4 w-20 bg-muted animate-pulse rounded-md"></div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6 border-t pt-4 dark:border-zinc-800">
                <div className="space-y-2 mb-6">
                  <div className="h-4 w-full bg-muted animate-pulse rounded-md"></div>
                  <div className="h-4 w-full bg-muted animate-pulse rounded-md"></div>
                  <div className="h-4 w-3/4 bg-muted animate-pulse rounded-md"></div>
                  <div className="h-4 w-5/6 bg-muted animate-pulse rounded-md"></div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <div className="h-9 w-28 bg-muted animate-pulse rounded-md"></div>
                  <div className="h-9 w-32 bg-muted animate-pulse rounded-md"></div>
                </div>
              </div>
            </div>

            {/* Skeleton pour les commentaires */}
            <div className="bg-background border dark:border-zinc-800 rounded-xl p-6 shadow-sm">
              <div className="h-7 w-32 bg-muted animate-pulse rounded-md mb-6"></div>

              {/* Commentaire 1 */}
              <div className="flex gap-4 mb-6">
                <div className="h-10 w-10 rounded-full bg-muted animate-pulse"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-5 w-40 bg-muted animate-pulse rounded-md"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-muted animate-pulse rounded-md"></div>
                    <div className="h-4 w-5/6 bg-muted animate-pulse rounded-md"></div>
                  </div>
                </div>
              </div>

              {/* Commentaire 2 */}
              <div className="flex gap-4 mb-6">
                <div className="h-10 w-10 rounded-full bg-muted animate-pulse"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-5 w-32 bg-muted animate-pulse rounded-md"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-muted animate-pulse rounded-md"></div>
                    <div className="h-4 w-3/4 bg-muted animate-pulse rounded-md"></div>
                  </div>
                </div>
              </div>

              {/* Placeholder pour le champ de commentaire */}
              <div className="mt-8">
                <div className="h-24 w-full bg-muted/50 animate-pulse rounded-md"></div>
              </div>
            </div>
          </div>

          {/* Sidebar skeleton */}
          <div className="md:sticky md:top-24 md:col-span-1 md:-mt-4">
            <div className="bg-background border dark:border-zinc-800 rounded-xl p-5 space-y-5 shadow-sm">
              {/* Creator info */}
              <div className="space-y-3">
                <div className="h-5 w-24 bg-muted animate-pulse rounded-md"></div>
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-muted animate-pulse"></div>
                  <div className="h-4 w-24 bg-muted animate-pulse rounded-md"></div>
                </div>
                <div className="h-3 w-20 bg-muted animate-pulse rounded-md"></div>
              </div>

              {/* Project info */}
              <div className="border-t dark:border-zinc-800 pt-4 space-y-3">
                <div className="h-5 w-28 bg-muted animate-pulse rounded-md"></div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-20 bg-muted animate-pulse rounded-md"></div>
                    <div className="h-4 w-16 bg-muted animate-pulse rounded-md"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-16 bg-muted animate-pulse rounded-md"></div>
                    <div className="h-4 w-12 bg-muted animate-pulse rounded-md"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-14 bg-muted animate-pulse rounded-md"></div>
                    <div className="h-4 w-24 bg-muted animate-pulse rounded-md"></div>
                  </div>
                </div>
              </div>

              {/* Share */}
              <div className="border-t dark:border-zinc-800 pt-4 space-y-3">
                <div className="h-5 w-16 bg-muted animate-pulse rounded-md"></div>
                <div className="h-9 w-full bg-muted animate-pulse rounded-md"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
