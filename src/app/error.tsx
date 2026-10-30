'use client';

import * as React from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error('Application error caught by App Router boundary:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-50 text-rose-600 shadow-soft">
          <AlertCircle className="h-10 w-10" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-navy sm:text-3xl">Something went wrong</h1>
          <p className="mt-2 text-sm text-gray-500 leading-relaxed">
            An unexpected error occurred while loading this view. You can reload or return to the main catalog.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-soft hover:bg-primary-hover transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-white px-5 py-3 text-sm font-bold text-navy hover:bg-gray-50 transition-colors"
          >
            <Home className="h-4 w-4 text-primary" />
            <span>Go Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
