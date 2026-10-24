'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('cookie-consent') === 'accepted';
    if (!accepted) {
      queueMicrotask(() => setVisible(true));
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-20 left-3 right-3 z-[55] mx-auto max-w-lg rounded-2xl border border-border bg-white p-4 shadow-elevated md:bottom-4">
      <p className="text-sm text-gray-700">
        We use essential cookies to keep your cart and checkout working. See our{' '}
        <Link className="font-semibold text-primary underline" href="/privacy-policy">
          privacy policy
        </Link>
        .
      </p>
      <div className="mt-3 flex justify-end gap-2">
        <button
          className="h-10 rounded-xl border border-border px-3 text-sm font-semibold text-navy hover:bg-gray-50"
          onClick={() => setVisible(false)}
        >
          Later
        </button>
        <button
          className="h-10 rounded-xl bg-primary px-3 text-sm font-semibold text-white hover:bg-primary-hover"
          onClick={() => {
            localStorage.setItem('cookie-consent', 'accepted');
            setVisible(false);
          }}
        >
          Accept
        </button>
      </div>
    </div>
  );
}
