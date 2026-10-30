import * as React from 'react';

export default function ContactLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 animate-pulse">
      <div className="h-4 w-28 rounded bg-slate-200 mb-2" />
      <div className="h-9 w-64 rounded-2xl bg-slate-200 mb-2" />
      <div className="h-4 w-full max-w-xl rounded bg-slate-100 mb-8" />

      <div className="grid gap-6 md:grid-cols-[1fr_1.2fr]">
        <aside className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 rounded-2xl border border-slate-100 bg-white p-4" />
          ))}
        </aside>
        <div className="rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 space-y-4">
          <div className="h-6 w-32 rounded bg-slate-200" />
          <div className="h-10 w-full rounded-2xl bg-slate-100" />
          <div className="h-10 w-full rounded-2xl bg-slate-100" />
          <div className="h-28 w-full rounded-2xl bg-slate-100" />
          <div className="h-11 w-32 rounded-xl bg-blue-200" />
        </div>
      </div>
    </div>
  );
}
