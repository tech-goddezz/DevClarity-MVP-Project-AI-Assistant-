// Skeleton loading placeholder — shown while the AI
// is analyzing code, so the right panel doesn't feel empty.
// Simple English: instead of a blank white space while
// waiting, the user sees animated grey blocks that show
// where the content will appear. Feels much more polished.

type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`skeleton ${className}`}
      role="status"
      aria-label="Loading..."
    />
  );
}

// A pre-built layout that looks like the analysis result
// card while it's loading.
// Simple English: this shows a fake version of the result
// card with animated placeholders while the real data loads.
export function AnalysisSkeleton() {
  return (
    <div className="glass-card p-6" aria-live="polite" aria-label="Analyzing your code, please wait">
      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-3 w-20" />
        </div>
        {/* Score ring placeholder */}
        <Skeleton className="w-24 h-24 rounded-full" />
      </div>

      {/* Summary lines */}
      <div className="mb-6 space-y-2">
        <Skeleton className="h-3 w-16 mb-3" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
        <Skeleton className="h-3 w-3/5" />
      </div>

      {/* Issues placeholder */}
      <div className="mb-6">
        <Skeleton className="h-3 w-20 mb-3" />
        <Skeleton className="h-12 w-full rounded-xl mb-2" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>

      {/* Suggestions placeholder */}
      <div>
        <Skeleton className="h-3 w-24 mb-3" />
        <Skeleton className="h-12 w-full rounded-xl mb-2" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    </div>
  );
}