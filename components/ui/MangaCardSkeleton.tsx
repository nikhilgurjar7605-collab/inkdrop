import React from 'react';

export function MangaCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <div className="aspect-[3/4] w-full rounded-md skeleton-shimmer" />
      <div className="flex flex-col gap-2">
        <div className="h-4 w-full rounded-sm skeleton-shimmer" />
        <div className="h-4 w-2/3 rounded-sm skeleton-shimmer" />
        <div className="flex gap-2 mt-1">
          <div className="h-4 w-16 rounded-sm skeleton-shimmer" />
          <div className="h-4 w-12 rounded-sm skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
}
