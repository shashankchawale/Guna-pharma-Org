import * as React from 'react';

export default function MedicinesLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="mb-4 flex items-center gap-2">
        <div className="h-3 w-10 rounded bg-slate-200" />
        <div className="h-3 w-3 rounded bg-slate-200" />
        <div className="h-3 w-16 rounded bg-slate-200" />
      </div>

      {/* Hero Banner Skeleton */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 p-6 sm:p-8 text-white shadow-card mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl space-y-3">
            <div className="h-8 sm:h-10 w-72 sm:w-96 rounded-2xl bg-white/20" />
          </div>
          <div className="w-full md:w-72 lg:w-80 h-44 sm:h-48 md:h-40 rounded-2xl bg-white/20 shrink-0" />
        </div>
      </div>

      {/* Subcategory Filter Tabs Skeleton */}
      <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-9 w-28 shrink-0 rounded-xl bg-slate-200" />
        ))}
      </div>

      {/* Search and Products Counter Bar Skeleton */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="h-4 w-40 rounded bg-slate-200" />
        <div className="h-10 w-full sm:w-80 rounded-2xl bg-slate-200" />
      </div>

      {/* Products Grid Skeleton */}
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
