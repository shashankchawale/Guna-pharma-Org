'use client';

import * as React from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function NavigationProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

  // Complete navigation when pathname or searchParams change
  React.useEffect(() => {
    const startTimer = setTimeout(() => {
      setProgress((prev) => (prev > 0 ? 100 : 0));
      const finishTimer = setTimeout(() => {
        setIsNavigating(false);
        setProgress(0);
      }, 200);
      return () => clearTimeout(finishTimer);
    }, 10);

    return () => clearTimeout(startTimer);
  }, [pathname, searchParams]);

  const startProgress = React.useCallback(() => {
    setIsNavigating(true);
    setProgress(20);

    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 90;
        }
        // Accelerate then slow down asymptotically
        const remaining = 90 - prev;
        return prev + Math.max(1, Math.floor(remaining * 0.15));
      });
    }, 120);

    // Safety fallback: auto-finish after 8 seconds
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsNavigating(false);
      setProgress(0);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }, 8000);
  }, []);

  // Global click listener to intercept navigation link clicks and trigger immediate visual feedback (0ms)
  React.useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      // Find closest anchor tag
      const anchor = (e.target as HTMLElement)?.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      // Ignore external links, hash anchors, mailto, tel, target="_blank", or modifier clicks
      if (
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('#') ||
        anchor.target === '_blank' ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey ||
        e.defaultPrevented
      ) {
        return;
      }

      // Check if navigating to the exact same URL
      const currentUrl = window.location.pathname + window.location.search;
      if (href === currentUrl) return;

      // Start instant navigation feedback
      startProgress();
    };

    const handleCustomStart = () => startProgress();
    const handleCustomEnd = () => {
      setProgress(100);
      setTimeout(() => {
        setIsNavigating(false);
        setProgress(0);
      }, 200);
    };

    window.addEventListener('click', handleDocumentClick, { capture: true });
    window.addEventListener('guna-nav-start', handleCustomStart);
    window.addEventListener('guna-nav-end', handleCustomEnd);

    return () => {
      window.removeEventListener('click', handleDocumentClick, { capture: true });
      window.removeEventListener('guna-nav-start', handleCustomStart);
      window.removeEventListener('guna-nav-end', handleCustomEnd);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startProgress]);

  if (!isNavigating && progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none h-1 bg-transparent overflow-hidden"
      aria-hidden="true"
    >
      <div
        className="h-full bg-gradient-to-r from-[#005AD2] via-[#0066E8] to-[#38BDF8] shadow-[0_0_10px_rgba(0,102,232,0.6)] transition-all duration-200 ease-out"
        style={{
          width: `${progress}%`,
          opacity: progress === 100 ? 0 : 1,
          transitionProperty: 'width, opacity',
        }}
      />
    </div>
  );
}
