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

const rawAppUrl = process.env.NEXT_PUBLIC_APP_URL || '';
const isLocalhost = !rawAppUrl || rawAppUrl.includes('localhost') || rawAppUrl.includes('127.0.0.1');

const appBaseUrl = isLocalhost
  ? (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : 'https://guna-pharma-org.vercel.app')
  : rawAppUrl;

export const metadata: Metadata = {
  metadataBase: new URL(appBaseUrl),
  title: {
    default: 'GUNA PHARMA - Global Healthcare, Medicines & Luxury Cosmetics',
    template: '%s | GUNA PHARMA',
  },
  description: 'Trusted exporter of authentic prescription medicines, wellness essentials, and luxury cosmetic skincare shipping worldwide. 100% genuine guaranteed.',
  keywords: ['skincare', 'cosmetics', 'medicines', 'wellness', 'vitamins', 'supplements', 'pharmacy', 'online pharmacy', 'pharmaceutical exporter'],
  authors: [{ name: 'GUNA PHARMA' }],
  creator: 'GUNA PHARMA',
  publisher: 'GUNA PHARMA',
  robots: 'index, follow',
  alternates: {
    canonical: appBaseUrl,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: appBaseUrl,
    siteName: 'GUNA PHARMA',
    title: 'GUNA PHARMA - Your Health. Our Priority.',
    description: 'Trusted exporter of authentic prescription medicines, wellness essentials, and luxury cosmetic skincare shipping worldwide. 100% genuine guaranteed.',
    images: [
      {
        url: `${appBaseUrl}/og-image.jpg`,
        secureUrl: `${appBaseUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'GUNA PHARMA - Trusted Healthcare & Medicines',
        type: 'image/jpeg',
      },
      {
        url: `${appBaseUrl}/hero-poster-medicines.jpg`,
        secureUrl: `${appBaseUrl}/hero-poster-medicines.jpg`,
        width: 1200,
        height: 896,
        alt: 'GUNA PHARMA - Healthcare & Medicines',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GUNA PHARMA - Global Healthcare, Medicines & Luxury Cosmetics',
    description: 'Discover quality medicines, premium cosmetics, and wellness essentials shipped worldwide.',
    images: [`${appBaseUrl}/og-image.jpg`],
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
      <head>
        <meta property="og:image" content={`${appBaseUrl}/og-image.jpg`} />
        <meta property="og:image:secure_url" content={`${appBaseUrl}/og-image.jpg`} />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="GUNA PHARMA - Trusted Healthcare & Medicines" />
        <link rel="image_src" href={`${appBaseUrl}/og-image.jpg`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={`${appBaseUrl}/og-image.jpg`} />
      </head>
      <body className="min-h-screen w-full max-w-full overflow-x-hidden bg-white text-navy flex flex-col scrollbar-none" suppressHydrationWarning>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-primary text-white rounded-xl"
        >
          Skip to main content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Pharmacy',
              name: 'GUNA PHARMA',
              url: 'https://gunapharma.com',
              logo: 'https://gunapharma.com/logo.png',
              image: 'https://gunapharma.com/og-image.jpg',
              description:
                'Trusted exporter of authentic prescription medicines, wellness essentials, and luxury cosmetic skincare shipping worldwide. 100% genuine guaranteed.',
              currenciesAccepted: 'USD, EUR, GBP, AED, SAR',
              priceRange: '$$',
            }),
          }}
        />
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
