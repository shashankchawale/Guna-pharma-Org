import * as React from 'react';

export default function AboutLoading() {
  return (
    <div className="animate-pulse">
      {/* Hero Banner Skeleton */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800 py-16 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl grid gap-8 md:grid-cols-12 items-center">
          <div className="md:col-span-7 space-y-4">
            <div className="h-4 w-32 rounded bg-white/20" />
            <div className="h-10 w-4/5 rounded-2xl bg-white/20" />
            <div className="h-4 w-full max-w-md rounded bg-white/15" />
          </div>
          <div className="md:col-span-5">
            <div className="aspect-[4/3] w-full rounded-3xl bg-white/10" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 space-y-6">
        <div className="h-6 w-48 rounded bg-slate-200" />
        <div className="grid gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-slate-100 p-6 space-y-3">
              <div className="h-8 w-8 rounded-full bg-slate-200" />
              <div className="h-4 w-32 rounded bg-slate-200" />
              <div className="h-3 w-full rounded bg-slate-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
