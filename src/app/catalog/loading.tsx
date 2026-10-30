import * as React from 'react';

export default function CatalogLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 animate-pulse">
      {/* Title Skeleton */}
      <div className="mb-6 space-y-2">
        <div className="h-8 w-60 rounded-2xl bg-slate-200" />
        <div className="h-4 w-96 max-w-full rounded bg-slate-100" />
      </div>

      {/* Categories Bar Skeleton */}
      <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div key={i} className="h-9 w-28 shrink-0 rounded-xl bg-slate-200" />
        ))}
      </div>

      {/* Filter and Search Bar Skeleton */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="h-4 w-40 rounded bg-slate-200" />
        <div className="h-10 w-full sm:w-80 rounded-2xl bg-slate-200" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            className="flex flex-col rounded-3xl border border-slate-100 bg-white p-3.5 shadow-xs"
          >
            <div className="aspect-square w-full rounded-2xl bg-slate-100 mb-3" />
            <div className="h-3 w-1/3 rounded bg-blue-100 mb-2" />
            <div className="h-4 w-4/5 rounded bg-slate-200 mb-3" />
            <div className="mt-auto pt-2 flex items-center justify-between border-t border-slate-100">
              <div className="h-5 w-16 rounded bg-slate-200" />
              <div className="h-9 w-9 rounded-full bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
