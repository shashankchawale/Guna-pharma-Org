import Link from 'next/link';
import { ArrowLeft, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-3xl font-black text-primary shadow-soft">
          404
        </div>
        <div>
          <h1 className="text-2xl font-black text-navy sm:text-3xl">Page Not Found</h1>
          <p className="mt-2 text-sm text-gray-500 leading-relaxed">
            The page or medicine you are looking for does not exist or may have been relocated.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-soft hover:bg-primary-hover transition-colors"
          >
            <Home className="h-4 w-4" />
            <span>Return Home</span>
          </Link>
          <Link
            href="/catalog"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-white px-5 py-3 text-sm font-bold text-navy hover:bg-gray-50 transition-colors"
          >
            <Search className="h-4 w-4 text-primary" />
            <span>Search Catalog</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
