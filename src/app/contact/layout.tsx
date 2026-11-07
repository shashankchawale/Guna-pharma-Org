import type { Metadata } from 'next';
import { getAppBaseUrl, buildBreadcrumbSchema } from '@/lib/seo';

const baseUrl = getAppBaseUrl();

export const metadata: Metadata = {
  title: 'Contact Us & Pharmacist Support Desk | GUNA PHARMA',
  description:
    'Contact GUNA PHARMA support desk for product inquiries, international prescription verification, bulk wholesale quotes, or customer assistance.',
  alternates: {
    canonical: `${baseUrl}/contact`,
  },
  openGraph: {
    title: 'Contact Us & Pharmacist Support Desk | GUNA PHARMA',
    description:
      'Speak with licensed pharmacists and customer support at GUNA PHARMA for prescription verification, orders, and worldwide delivery assistance.',
    url: `${baseUrl}/contact`,
    type: 'website',
    siteName: 'GUNA PHARMA',
    images: [
      {
        url: `${baseUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Contact GUNA PHARMA',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us & Pharmacist Support Desk | GUNA PHARMA',
    description:
      'Get in touch with GUNA PHARMA for clinical assistance, bulk quotes, and worldwide delivery.',
    images: [`${baseUrl}/og-image.jpg`],
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbSchema = buildBreadcrumbSchema(
    [
      { name: 'Home', path: '/' },
      { name: 'Contact Us', path: '/contact' },
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
