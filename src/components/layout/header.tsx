'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, Search, ShoppingCart, X, User, ShieldCheck, Heart, ArrowRight } from 'lucide-react';
import { cn, useIsMounted } from '@/lib/utils';
import { brandConfig } from '@/lib/config';
import { Avatar } from '@/components/ui/avatar';
import { useCartStore } from '@/store/cart';
import { useWishlistStore } from '@/store/wishlist';
import { LocaleSwitcher } from '@/components/layout/locale-switcher';
import { useTranslation, useFormatPrice } from '@/store/locale';
import { useAuthStore } from '@/store/auth';
import { useProductsStore } from '@/store/products';

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();
  const formatPrice = useFormatPrice();
  const { openCart, getItemCount } = useCartStore();
  const { getItemCount: getWishlistCount } = useWishlistStore();
  const { products } = useProductsStore();

  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);
  const [navigatingHref, setNavigatingHref] = React.useState<string | null>(null);
  const searchContainerRef = React.useRef<HTMLDivElement>(null);

  const [prevPathname, setPrevPathname] = React.useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setNavigatingHref(null);
  }

  const mounted = useIsMounted();
  const cartCount = mounted ? getItemCount() : 0;
  const wishlistCount = mounted ? getWishlistCount() : 0;
  const { user, initAuth } = useAuthStore();

  React.useEffect(() => {
    initAuth();
  }, [initAuth]);

  // Sync search query from URL when on /catalog
  React.useEffect(() => {
    if (typeof window !== 'undefined' && pathname === '/catalog') {
      const timer = setTimeout(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const urlSearch = urlParams.get('search');
        if (urlSearch) {
          setSearchQuery(urlSearch);
        }
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  // Close live dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Compute live instant search results
  const liveResults = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];
    const words = query.split(/\s+/).filter(Boolean);

    return products
      .filter((p) => {
        const textBlob = [
          p.name,
          p.composition || '',
          ...(p.tags || []),
          p.category_id,
          p.manufacturer || '',
          p.brand_id || '',
          p.short_description || '',
          p.sku || '',
        ]
          .join(' ')
          .toLowerCase();

        return words.every((w) => textBlob.includes(w));
      })
      .slice(0, 6);
  }, [searchQuery, products]);

  const handleDesktopSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      router.push(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-border transition-all">
      {/* Top Banner / Announcement */}
      <div className="bg-primary text-white text-[11px] sm:text-xs py-1.5 px-4 text-center font-semibold tracking-wide flex items-center justify-center gap-2 flex-wrap">
        <span>Trusted Pharmaceutical Exporter Shipping Worldwide &bull; 100% Genuine Healthcare Products</span>
      </div>

      <div className="mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between gap-2 px-4 sm:px-6">
        {/* Left: Mobile Menu Trigger + Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 -ml-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Open navigation menu"
            type="button"
          >
            <Menu className="h-6 w-6" />
          </button>

          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white p-0.5 shadow-soft ring-1 ring-blue-100 transition-transform duration-fast group-hover:scale-105">
              <Image
                src="/logo.png"
                alt="GUNA PHARMA Logo"
                width={44}
                height={44}
                priority
                className="h-full w-full object-contain"
              />
            </div>
            <span className="font-extrabold text-navy text-lg sm:text-xl tracking-tight">
              {brandConfig.name}
            </span>
          </Link>
        </div>

        {/* Center: Desktop Search with Instant Autocomplete */}
        <div
          ref={searchContainerRef}
          className={cn(
            'flex-1 max-w-xl mx-2 sm:mx-4 hidden sm:block relative',
            isSearchOpen && 'md:max-w-2xl'
          )}
        >
          <form
            className="relative"
            role="search"
            onSubmit={handleDesktopSearchSubmit}
          >
            <label htmlFor="header-search" className="sr-only">Search products</label>
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" aria-hidden="true" />
              <input
                id="header-search"
                type="search"
                placeholder={t('searchPlaceholder', 'Search medicines, skincare, wellness...')}
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                }}
                className="w-full h-11 md:h-10 rounded-2xl border border-border bg-white pl-10 pr-20 py-2 text-xs sm:text-sm text-navy placeholder:text-gray-400 transition-all duration-fast focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-2xs"
                autoComplete="off"
              />
              <div className="absolute right-1.5 flex items-center gap-1">
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setIsSearchFocused(false);
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
                    aria-label="Clear search"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  type="submit"
                  className="h-7 px-2.5 rounded-xl bg-primary text-[11px] font-bold text-white hover:bg-primary-hover transition-colors shadow-2xs"
                >
                  Search
                </button>
              </div>
            </div>
          </form>

          {/* Instant Search Dropdown */}
          {isSearchFocused && searchQuery.trim().length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl bg-white border border-border shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="p-2.5 border-b border-border/60 bg-slate-50/80 flex items-center justify-between text-xs text-gray-500 font-semibold px-3.5">
                <span>Products matching &ldquo;{searchQuery.trim()}&rdquo;</span>
                <span className="text-primary font-bold">{liveResults.length} found</span>
              </div>

              {liveResults.length > 0 ? (
                <div className="divide-y divide-border/40 max-h-80 overflow-y-auto">
                  {liveResults.map((product) => (
                    <button
                      key={product.id || product.slug}
                      type="button"
                      onClick={() => {
                        setIsSearchFocused(false);
                        router.push(`/product/${product.slug}`);
                      }}
                      className="w-full p-2.5 sm:p-3 flex items-center gap-3 text-left hover:bg-blue-50/70 transition-colors group cursor-pointer"
                    >
                      <div className="relative h-10 w-10 shrink-0 rounded-xl overflow-hidden border border-border/80 bg-white p-0.5 shadow-2xs">
                        {product.thumbnail_url || product.images?.[0] ? (
                          <img
                            src={product.thumbnail_url || product.images?.[0]}
                            alt={product.name}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <div className="grid h-full w-full place-items-center bg-primary-light text-xs font-bold text-primary">
                            Rx
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-navy truncate group-hover:text-primary transition-colors">
                          {product.name}
                        </p>
                        <p className="text-[11px] text-gray-400 truncate">
                          {product.composition || product.manufacturer || product.category_id}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-extrabold text-navy">{formatPrice(product.selling_price)}</p>
                        {product.requires_prescription && (
                          <span className="text-[9px] font-bold text-blue-700 bg-blue-50 px-1 py-0.5 rounded border border-blue-200">
                            Rx
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSearchFocused(false);
                      router.push(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
                    }}
                    className="w-full py-2.5 px-3 text-center text-xs font-bold text-primary hover:bg-primary-light transition-colors block bg-slate-50/60"
                  >
                    View all matching results in catalog &rarr;
                  </button>
                </div>
              ) : (
                <div className="p-5 text-center">
                  <p className="text-xs text-gray-500 font-medium">
                    No products found matching &ldquo;{searchQuery}&rdquo;
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSearchFocused(false);
                      router.push(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
                    }}
                    className="mt-2 text-xs font-bold text-primary hover:underline"
                  >
                    Search in full catalog &rarr;
                  </button>
                </div>
              )}
            </div>
          )}
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

          {/* Wishlist */}
          <Link
            href="/wishlist"
            prefetch={true}
            className="relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl text-gray-600 hover:text-rose-600 hover:bg-rose-50/70 transition-colors"
            aria-label={`Wishlist${wishlistCount > 0 ? `, ${wishlistCount} items` : ''}`}
          >
            <Heart className="h-5 w-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 sm:h-5 sm:min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] sm:text-[10px] font-bold text-white shadow-xs">
                {wishlistCount > 99 ? '99+' : wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <button
            type="button"
            onClick={openCart}
            className="relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl text-gray-600 hover:text-primary hover:bg-blue-50 transition-colors"
            aria-label={`Shopping cart, ${cartCount} items`}
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 sm:h-5 sm:min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[9px] sm:text-[10px] font-bold text-white shadow-xs">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </button>

          {/* Desktop User Account / Sign In */}
          <div className="hidden sm:block">
            {mounted && user ? (
              <Link
                href="/account"
                className="flex items-center gap-2 rounded-xl p-1.5 text-navy hover:bg-gray-100 transition-colors"
              >
                <Avatar email={user.email} size="sm" />
                <span className="text-xs font-bold max-w-24 truncate hidden md:inline">
                  {user.email?.split('@')[0]}
                </span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3.5 py-2 text-xs font-bold text-navy hover:bg-gray-50 transition-colors"
              >
                <User className="h-3.5 w-3.5 text-gray-500" />
                <span>Sign in</span>
              </Link>
            )}
          </div>

          {/* Currency / Language Switcher */}
          <div className="hidden md:block">
            <LocaleSwitcher />
          </div>
        </div>
      </div>

      {/* Desktop Main Navigation Bar */}
      <nav className="hidden md:block border-t border-border/60 bg-white" aria-label="Main navigation">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          <ul className="flex items-center gap-1 py-1">
            {navItems.map((item) => {
              const active = isActive(item.href);
              const isPending = navigatingHref === item.href && !active;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    prefetch={true}
                    onClick={() => {
                      if (!active) setNavigatingHref(item.href);
                    }}
                    className={cn(
                      'relative inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors duration-fast',
                      active
                        ? 'text-primary bg-blue-50/80 font-bold'
                        : isPending
                        ? 'text-primary bg-blue-50/60 font-semibold'
                        : 'text-gray-600 hover:text-navy hover:bg-gray-50'
                    )}
                  >
                    <span>{item.label}</span>
                    {isPending && (
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-3 text-xs font-semibold text-gray-500">
            <span className="flex items-center gap-1 text-emerald-600">
              <ShieldCheck className="h-4 w-4" />
              Licensed Pharmacy
            </span>
            <Link
              href="/catalog"
              className="text-primary hover:underline font-bold flex items-center gap-1"
            >
              Browse All Products
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Search Overlay — Portal mounted to document.body */}
      {isSearchOpen && mounted && createPortal(
        <div
          className="fixed inset-0 z-[100] md:hidden bg-white flex flex-col animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-label="Search products"
        >
          <div className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-3 bg-white">
            <button
              onClick={() => setIsSearchOpen(false)}
              className="p-2 text-gray-600 hover:text-navy rounded-xl"
              aria-label="Close search"
              type="button"
            >
              <X className="h-6 w-6" />
            </button>
            <form
              className="flex-1 flex items-center gap-2"
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
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" aria-hidden="true" />
                <input
                  id="mobile-search"
                  type="search"
                  placeholder={t('searchPlaceholder', 'Search medicines, skincare, wellness...')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 rounded-xl border border-border bg-white pl-9 pr-8 py-2 text-sm text-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  autoComplete="off"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="h-11 px-3.5 rounded-xl bg-primary text-xs font-bold text-white shadow-soft shrink-0"
              >
                Search
              </button>
            </form>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {searchQuery.trim().length > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-gray-500 font-semibold">
                  <span>Results for &ldquo;{searchQuery.trim()}&rdquo;</span>
                  <span className="text-primary font-bold">{liveResults.length} matches</span>
                </div>

                {liveResults.length > 0 ? (
                  <div className="divide-y divide-border/60 border border-border rounded-2xl overflow-hidden bg-white shadow-soft">
                    {liveResults.map((product) => (
                      <button
                        key={product.id || product.slug}
                        type="button"
                        onClick={() => {
                          setIsSearchOpen(false);
                          router.push(`/product/${product.slug}`);
                        }}
                        className="w-full p-3 flex items-center gap-3 text-left hover:bg-blue-50/60 transition-colors"
                      >
                        <div className="relative h-12 w-12 shrink-0 rounded-xl overflow-hidden border border-border/80 bg-white p-0.5">
                          {product.thumbnail_url || product.images?.[0] ? (
                            <img
                              src={product.thumbnail_url || product.images?.[0]}
                              alt={product.name}
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <div className="grid h-full w-full place-items-center bg-primary-light text-xs font-bold text-primary">
                              Rx
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-navy truncate">{product.name}</p>
                          <p className="text-[11px] text-gray-400 truncate">
                            {product.composition || product.manufacturer || product.category_id}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs font-black text-navy">{formatPrice(product.selling_price)}</p>
                          {product.requires_prescription && (
                            <span className="text-[9px] font-bold text-blue-700 bg-blue-50 px-1 py-0.5 rounded border border-blue-200">
                              Rx
                            </span>
                          )}
                        </div>
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() => {
                        setIsSearchOpen(false);
                        router.push(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
                      }}
                      className="w-full py-3 px-3 text-center text-xs font-bold text-primary bg-slate-50 hover:bg-blue-50 transition-colors block"
                    >
                      See all matching products in catalog &rarr;
                    </button>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-border p-6 text-center text-xs text-gray-500">
                    No products found matching &ldquo;{searchQuery}&rdquo;. Try another name or keyword.
                  </div>
                )}
              </div>
            ) : null}

            {/* Popular searches */}
            <div className="space-y-2">
              <p className="text-xs font-bold tracking-wider uppercase text-gray-500">Popular searches</p>
              <div className="flex flex-wrap gap-2">
                {['Tata Omega 3', 'Ketocip Shampoo', 'Paracetamol 650', 'Vitamin C Serum', 'Sunscreen SPF 50', 'Bontress Hair Serum'].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      setSearchQuery(term);
                      setIsSearchOpen(false);
                      router.push(`/catalog?search=${encodeURIComponent(term)}`);
                    }}
                    className="rounded-xl border border-border px-3.5 py-2 text-xs font-medium text-gray-700 hover:bg-primary-light hover:border-primary hover:text-primary transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
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
                { href: '/wishlist', label: `Wishlist ${wishlistCount > 0 ? `(${wishlistCount})` : ''}` },
                { href: '/about', label: t('aboutUs', 'About us') },
                { href: '/contact', label: t('contact', 'Contact') },
                { href: user ? '/account' : '/login', label: user ? t('account', 'Account') : 'Sign In / Register' },
              ].map((item) => {
                const active = isActive(item.href);
                const isPending = navigatingHref === item.href && !active;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch={true}
                    onClick={() => {
                      if (!active) setNavigatingHref(item.href);
                      setIsMobileMenuOpen(false);
                    }}
                    className={cn(
                      'flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition-colors',
                      active
                        ? 'bg-blue-50 text-primary font-semibold'
                        : isPending
                        ? 'bg-blue-50/60 text-primary font-semibold'
                        : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'
                    )}
                  >
                    <span>{item.label}</span>
                    {isPending && (
                      <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
                    )}
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
