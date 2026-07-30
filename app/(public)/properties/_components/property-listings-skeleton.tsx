export function PropertyListingsSkeleton() {
  return (
    <div className="flex-1 flex flex-col gap-6 animate-pulse">
      {/* Skeleton Page Info */}
      <div className="h-4 w-48 bg-muted rounded-md mb-2" />

      {/* Grid of Skeleton Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card shadow-sm h-[390px]"
          >
            {/* Image aspect-video Placeholder */}
            <div className="aspect-video w-full bg-muted relative" />

            {/* Content Placeholders */}
            <div className="flex-1 p-5 flex flex-col justify-between">
              <div className="space-y-3">
                {/* Title */}
                <div className="h-5 bg-muted rounded-md w-3/4" />
                {/* Location */}
                <div className="h-3.5 bg-muted rounded-md w-1/2" />
                {/* Description */}
                <div className="space-y-2 pt-2">
                  <div className="h-3 bg-muted rounded-md w-full" />
                  <div className="h-3 bg-muted rounded-md w-5/6" />
                </div>
              </div>

              {/* Stats Footer */}
              <div className="grid grid-cols-3 gap-2 border-t border-border/60 mt-4 pt-3.5">
                <div className="h-4 bg-muted rounded-md w-3/4" />
                <div className="h-4 bg-muted rounded-md w-3/4" />
                <div className="h-4 bg-muted rounded-md w-3/4 justify-self-end" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
