'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, Search, ShoppingCart, X, User } from 'lucide-react';
import { cn, useIsMounted } from '@/lib/utils';
import { brandConfig } from '@/lib/config';
import { Avatar } from '@/components/ui/avatar';
import { useCartStore } from '@/store/cart';
import { LocaleSwitcher } from '@/components/layout/locale-switcher';
import { useTranslation } from '@/store/locale';
import { useAuthStore } from '@/store/auth';

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();
  const { openCart, getItemCount } = useCartStore();
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const mounted = useIsMounted();
  const cartCount = mounted ? getItemCount() : 0;
  const { user, initAuth } = useAuthStore();

  React.useEffect(() => {
    initAuth();
  }, [initAuth]);

  const navItems = [
    { href: '/', label: t('home', 'Home') },
    { href: '/medicines', label: t('medicines', 'Medicines') },
    { href: '/wellness', label: t('wellness', 'Wellness') },
    { href: '/about', label: t('aboutUs', 'About us') },
    { href: '/contact', label: t('contact', 'Contact') },
  ];

  // Prevent background scroll when mobile menu or search is open
  React.useEffect(() => {
    if (isMobileMenuOpen || isSearchOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isMobileMenuOpen, isSearchOpen]);

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    const basePath = path.split('?')[0];
    return pathname === basePath || (basePath !== '/' && pathname.startsWith(basePath + '/'));
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-white shadow-xs">
      {/* Main Header Top Row */}
      <div className="flex h-16 md:h-14 items-center justify-between px-3 md:px-6 gap-3">
        {/* Left: Mobile Menu Button & Brand Logo */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors"
            aria-label="Open menu"
            type="button"
          >
            <Menu className="h-6 w-6" />
          </button>

          <Link href="/" prefetch={true} className="flex items-center gap-2.5 group" aria-label={brandConfig.name}>
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-0.5 shadow-sm ring-1 ring-blue-100 transition-transform duration-200 group-hover:scale-105">
              <Image
                src="/logo.png"
                alt="GUNA PHARMA"
                width={40}
                height={40}
                priority
                className="h-full w-full object-contain"
              />
            </div>
            <span className="font-bold text-navy text-lg sm:text-xl tracking-tight">
              {brandConfig.name}
            </span>
          </Link>
        </div>

        {/* Center: Desktop Search */}
        <div className={cn(
          'flex-1 max-w-xl mx-2 sm:mx-4 hidden sm:block',
          isSearchOpen && 'md:max-w-2xl'
        )}>
          <form
            className="relative"
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                router.push(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
              }
            }}
          >
            <label htmlFor="header-search" className="sr-only">Search products</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" aria-hidden="true" />
              <input
                id="header-search"
                type="search"
                placeholder={t('searchPlaceholder', 'Search medicines, skincare, wellness...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 md:h-10 rounded-xl border border-border bg-white pl-10 pr-12 py-2 text-sm text-navy placeholder:text-gray-400 transition-all duration-fast focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                autoComplete="off"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Mobile search toggle */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="sm:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Search products"
            type="button"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Cart */}
          <button
            onClick={openCart}
            className="relative flex h-11 w-11 md:h-10 md:w-10 items-center justify-center rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label={`Cart${cartCount > 0 ? `, ${cartCount} items` : ''}`}
            type="button"
          >
            <ShoppingCart className="h-5 w-5 md:h-5.5 md:w-5.5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-error px-1.5 text-[10px] font-bold text-white">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </button>

          {/* User/Account */}
          <Link
            href={user ? '/account' : '/login'}
            prefetch={true}
            className="hidden md:flex items-center gap-1.5 rounded-xl border border-border/80 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-navy hover:border-primary/40 transition-all"
            aria-label="Account"
          >
            <User className="h-4 w-4 text-primary" />
            <span className="max-w-[110px] truncate">
              {user ? (user.user_metadata?.full_name?.split(' ')[0] || 'Account') : 'Sign In'}
            </span>
          </Link>

          <div className="hidden lg:block">
            <LocaleSwitcher compact />
          </div>

          <Link href={user ? '/account' : '/login'} prefetch={true} className="md:hidden" aria-label="Account">
            <Avatar fallback={user?.user_metadata?.full_name?.[0] || 'U'} size="sm" />
          </Link>
        </div>
      </div>

      {/* Navigation Links Bar — placed directly below GUNA PHARMA header */}
      <div className="border-t border-border/70 bg-white">
        <div className="px-3 md:px-6">
          <nav
            className="flex items-center gap-2 sm:gap-7 py-2 overflow-x-auto no-scrollbar scroll-smooth"
            aria-label="Primary navigation"
          >
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={true}
                  className={cn(
                    'whitespace-nowrap px-4 py-1.5 text-sm sm:text-[15px] transition-all duration-150',
                    active
                      ? 'rounded-xl bg-[#EDF5FF] text-primary font-semibold'
                      : 'rounded-xl text-[#334155] font-medium hover:text-navy hover:bg-gray-50'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Search Overlay — Portal mounted to document.body */}
      {isSearchOpen && mounted && createPortal(
        <div
          className="fixed inset-0 z-[100] md:hidden bg-white flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label="Search products"
        >
          <div className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-3">
            <button
              onClick={() => setIsSearchOpen(false)}
              className="p-2 text-gray-600 hover:text-navy rounded-xl"
              aria-label="Close search"
              type="button"
            >
              <X className="h-6 w-6" />
            </button>
            <form
              className="flex-1"
              role="search"
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  setIsSearchOpen(false);
                  router.push(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
                }
              }}
            >
              <label htmlFor="mobile-search" className="sr-only">Search products</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                <input
                  id="mobile-search"
                  type="search"
                  placeholder={t('searchPlaceholder', 'Search medicines, skincare, wellness...')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 rounded-xl border border-border bg-white pl-10 pr-4 py-2 text-base text-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  autoComplete="off"
                  autoFocus
                />
              </div>
            </form>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <p className="text-xs font-bold tracking-wider uppercase text-gray-500">Popular searches</p>
            <div className="flex flex-wrap gap-2">
              {['Vitamin C', 'Sunscreen SPF 50', 'Paracetamol', 'Hair Serum', 'Protein Powder', 'Face Wash'].map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => {
                    setSearchQuery(term);
                    setIsSearchOpen(false);
                    router.push(`/catalog?search=${encodeURIComponent(term)}`);
                  }}
                  className="rounded-xl border border-border px-4 py-2 text-sm text-gray-700 hover:bg-primary-light hover:border-primary hover:text-primary transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Mobile Menu Drawer — Portal mounted to document.body */}
      {isMobileMenuOpen && mounted && createPortal(
        <div
          className="fixed inset-0 z-[100] md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          {/* Dimmed backdrop */}
          <div
            className="fixed inset-0 bg-navy/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Solid drawer panel */}
          <div className="relative z-10 flex h-full w-[85%] max-w-sm flex-col bg-white shadow-2xl">
            {/* Drawer header */}
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4">
              <div className="flex items-center gap-2.5">
                <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-0.5 shadow-xs ring-1 ring-blue-100">
                  <Image
                    src="/logo.png"
                    alt="GUNA PHARMA"
                    width={36}
                    height={36}
                    priority
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-navy text-base tracking-tight leading-tight">
                    {brandConfig.name}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-primary">
                    Health & Beauty
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 hover:text-navy transition-colors"
                aria-label="Close menu"
                type="button"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable navigation links */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-1.5" aria-label="Mobile navigation links">
              {[
                { href: '/', label: t('home', 'Home') },
                { href: '/medicines', label: t('medicines', 'Medicines') },
                { href: '/wellness', label: t('wellness', 'Wellness') },
                { href: '/about', label: t('aboutUs', 'About us') },
                { href: '/contact', label: t('contact', 'Contact') },
                { href: user ? '/account' : '/login', label: user ? t('account', 'Account') : 'Sign In / Register' },
              ].map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch={true}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center rounded-xl px-4 py-3 text-base font-medium transition-colors',
                      active
                        ? 'bg-blue-50 text-primary font-semibold'
                        : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'
                    )}
                  >
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Shopping preferences footer */}
            <div className="shrink-0 border-t border-border bg-slate-50/80 p-4">
              <p className="mb-2 text-xs font-bold tracking-wider uppercase text-gray-500">
                Shopping Preferences
              </p>
              <LocaleSwitcher dropup />
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
}
