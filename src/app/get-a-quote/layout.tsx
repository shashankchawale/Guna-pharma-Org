import type { Metadata } from 'next';
import { getAppBaseUrl, buildBreadcrumbSchema } from '@/lib/seo';

const baseUrl = getAppBaseUrl();

export const metadata: Metadata = {
  title: 'Request a Wholesale & Bulk Quote | GUNA PHARMA',
  description:
    'Stock your pharmacy, clinic, or wellness business with genuine pharmaceutical therapeutics and luxury skincare. Request a tailored wholesale export quotation.',
  alternates: {
    canonical: `${baseUrl}/get-a-quote`,
  },
  openGraph: {
    title: 'Request a Wholesale & Bulk Quote | GUNA PHARMA',
    description:
      'Bulk and trade export enquiries for pharmacies, hospitals, and wellness retailers worldwide.',
    url: `${baseUrl}/get-a-quote`,
    type: 'website',
    siteName: 'GUNA PHARMA',
    images: [
      {
        url: `${baseUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Wholesale & Bulk Quotes GUNA PHARMA',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Request a Wholesale & Bulk Quote | GUNA PHARMA',
    description:
      'Bulk pharmaceutical export and trade quotations for clinics and retailers worldwide.',
    images: [`${baseUrl}/og-image.jpg`],
  },
};

export default function QuoteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbSchema = buildBreadcrumbSchema(
    [
      { name: 'Home', path: '/' },
      { name: 'Get a Quote', path: '/get-a-quote' },
    ],
    baseUrl
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      {children}
    </>
  );
}
