'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Grid, Search, ShoppingCart, User } from 'lucide-react';
import { cn, useIsMounted } from '@/lib/utils';
import { useCartStore } from '@/store/cart';
import { useTranslation } from '@/store/locale';

export function BottomTabBar() {
  const pathname = usePathname();
  const { getItemCount } = useCartStore();
  const { t } = useTranslation();
  const mounted = useIsMounted();
  const cartCount = mounted ? getItemCount() : 0;
  const [navigatingHref, setNavigatingHref] = React.useState<string | null>(null);

  const [prevPathname, setPrevPathname] = React.useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setNavigatingHref(null);
  }

  const tabs = [
    { href: '/', label: t('home', 'Home'), icon: Home, match: '/' },
    { href: '/catalog', label: t('medicines', 'Categories'), icon: Grid, match: '/catalog' },
    { href: '/catalog', label: 'Search', icon: Search, match: '/catalog' },
    { href: '/cart', label: t('cart', 'Cart'), icon: ShoppingCart, match: '/cart' },
    { href: '/account', label: t('account', 'Account'), icon: User, match: '/account' },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 md:hidden border-t border-border bg-white/95 backdrop-blur-sm"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="grid grid-cols-5">
        {tabs.map((tab, index) => {
          const isActive = pathname === tab.match || (tab.match !== '/' && pathname.startsWith(tab.match + '/'));
          const isPending = navigatingHref === tab.href && !isActive;
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href + '-' + index}
              href={tab.href}
              prefetch={true}
              onClick={() => {
                if (!isActive) setNavigatingHref(tab.href);
              }}
              className={cn(
                'relative flex flex-col items-center justify-center gap-1 px-2 py-2.5 text-xs font-medium transition-colors',
                isActive
                  ? 'text-primary'
                  : isPending
                  ? 'text-primary'
                  : 'text-gray-600 active:text-gray-900'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative flex h-6 w-6 items-center justify-center">
                <Icon className="h-5 w-5" aria-hidden="true" />
                {tab.label === t('cart', 'Cart') && cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-error px-1 text-[9px] font-bold text-white">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </div>
              <span className="truncate max-w-[60px] text-center">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}