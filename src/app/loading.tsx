export default function RootLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      {/* Top subtle progress line */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gradient-to-r from-blue-400 via-primary to-indigo-600 animate-pulse" />

      {/* Hero skeleton */}
      <div className="space-y-6">
        <div className="h-4 w-36 rounded bg-slate-200 animate-pulse" />
        <div className="h-10 w-2/3 max-w-lg rounded-2xl bg-slate-200 animate-pulse" />
        <div className="h-4 w-1/2 max-w-md rounded bg-slate-100 animate-pulse" />

        {/* Product grid skeleton */}
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="flex flex-col rounded-3xl border border-slate-100 bg-white p-3.5 shadow-xs animate-pulse">
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
    </div>
  );
}
