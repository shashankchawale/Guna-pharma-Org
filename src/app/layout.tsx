import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { BottomTabBar } from '@/components/layout/bottom-tab-bar';
import { CartDrawer } from '@/components/cart/cart-drawer';
import { Toaster } from '@/components/ui/toaster';
import { CookieConsent } from '@/components/common/cookie-consent';
import { WhatsAppButton } from '@/components/common/whatsapp-button';
import { ScrollToTop } from '@/components/common/scroll-to-top';
import { NavigationProgressBar } from '@/components/common/navigation-progress';
import { Suspense } from 'react';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'GUNA PHARMA - Skincare, Medicines & Wellness Products',
    template: '%s | GUNA PHARMA',
  },
  description: 'Premium skincare, cosmetics, medicines & wellness products delivered to your doorstep. Free delivery above ₹499. 100% genuine products.',
  keywords: ['skincare', 'cosmetics', 'medicines', 'wellness', 'vitamins', 'supplements', 'pharmacy', 'online pharmacy'],
  authors: [{ name: 'GUNA PHARMA' }],
  creator: 'GUNA PHARMA',
  publisher: 'GUNA PHARMA',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://gunapharma.com',
    siteName: 'GUNA PHARMA',
    title: 'GUNA PHARMA - Your Trusted Health & Beauty Partner',
    description: 'Premium skincare, cosmetics, medicines & wellness products delivered to your doorstep.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'GUNA PHARMA',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GUNA PHARMA - Skincare, Medicines & Wellness',
    description: 'Premium skincare, cosmetics, medicines & wellness products delivered to your doorstep.',
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  themeColor: '#2563EB',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="antialiased scrollbar-none" suppressHydrationWarning>
      <body className="min-h-screen w-full max-w-full overflow-x-hidden bg-white text-navy flex flex-col scrollbar-none" suppressHydrationWarning>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-primary text-white rounded-xl"
        >
          Skip to main content
        </a>
        <Suspense fallback={null}>
          <NavigationProgressBar />
        </Suspense>
        <Header />
        <main id="main-content" className="flex-1 pb-24 md:pb-0">
          {children}
        </main>
        <Footer />
        <BottomTabBar />
        <CartDrawer />
        <ScrollToTop />
        <CookieConsent />
        <WhatsAppButton />
        <Toaster />
      </body>
    </html>
  );
}
