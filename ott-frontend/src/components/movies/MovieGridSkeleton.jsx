import { Skeleton } from "../feedback/Skeleton";

export function MovieGridSkeleton({ count = 12 }) {
  return (
    <div
      className="grid min-w-0 grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-4 md:grid-cols-3 md:gap-x-5 md:gap-y-8 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6"
      aria-label="Loading movies"
    >
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="rounded-lg border border-border/50 bg-surface/55 p-2 pb-4"
        >
          <Skeleton className="aspect-[2/3]" />
          <Skeleton className="mx-1.5 mt-3 h-5 w-4/5" />
          <Skeleton className="mx-1.5 mt-2 h-4 w-3/5" />
        </div>
      ))}
    </div>
  );
}
