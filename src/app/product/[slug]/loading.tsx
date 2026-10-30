export default function ProductLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="mb-6 flex items-center gap-2">
        <div className="h-3 w-12 rounded bg-slate-200" />
        <div className="h-3 w-3 rounded bg-slate-200" />
        <div className="h-3 w-12 rounded bg-slate-200" />
        <div className="h-3 w-3 rounded bg-slate-200" />
        <div className="h-3 w-32 rounded bg-slate-200" />
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Image Skeleton */}
        <div className="relative aspect-square w-full rounded-3xl bg-slate-100 border border-slate-200/60 flex items-center justify-center p-6">
          <div className="h-48 w-48 rounded-2xl bg-slate-200/70" />
        </div>

        {/* Product Info Skeleton */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="h-3.5 w-24 rounded bg-blue-100" />
            <div className="h-8 w-4/5 rounded-xl bg-slate-200" />
            <div className="flex items-center gap-3">
              <div className="h-6 w-16 rounded-lg bg-emerald-100" />
              <div className="h-4 w-32 rounded bg-slate-200" />
            </div>

            <div className="pt-2 flex items-baseline gap-3">
              <div className="h-10 w-28 rounded-xl bg-slate-200" />
              <div className="h-6 w-20 rounded bg-slate-200" />
              <div className="h-6 w-16 rounded bg-emerald-100" />
            </div>

            <div className="h-4 w-44 rounded bg-emerald-100" />

            {/* Actions Skeleton */}
            <div className="pt-4 flex flex-wrap gap-3">
              <div className="h-12 w-28 rounded-xl bg-slate-200" />
              <div className="h-12 flex-1 min-w-[140px] rounded-xl bg-[#0066E8]/30" />
              <div className="h-12 w-28 rounded-xl bg-slate-200" />
              <div className="h-12 w-12 rounded-xl bg-slate-200" />
            </div>
          </div>

          {/* Badges Skeleton */}
          <div className="grid grid-cols-3 gap-3 border-y border-slate-200 py-4">
            <div className="h-12 rounded-xl bg-slate-100" />
            <div className="h-12 rounded-xl bg-slate-100" />
            <div className="h-12 rounded-xl bg-slate-100" />
          </div>
        </div>
      </div>

      {/* Details Skeleton */}
      <div className="mt-12 max-w-4xl space-y-3">
        <div className="h-6 w-48 rounded-lg bg-slate-200 mb-4" />
        <div className="h-14 rounded-2xl bg-slate-100 border border-slate-200/60" />
        <div className="h-14 rounded-2xl bg-slate-100 border border-slate-200/60" />
        <div className="h-14 rounded-2xl bg-slate-100 border border-slate-200/60" />
      </div>
    </div>
  );
}
