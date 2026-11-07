import type { Metadata } from 'next';
import { getAppBaseUrl, buildCollectionPageSchema, buildBreadcrumbSchema } from '@/lib/seo';

import { MEDICINE_CATEGORIES } from '@/lib/medicine-categories';

const baseUrl = getAppBaseUrl();

export const metadata: Metadata = {
  title: 'Clinical Medicines & Therapeutics | GUNA PHARMA',
  description:
    'Order genuine prescription therapeutics across 13 clinical categories including Erectile Dysfunction, Steroids, Anti Anxiety, Pain Killers, Weight Loss, and Antibiotics verified by licensed pharmacists.',
  keywords: [
    'prescription medicines',
    'erectile dysfunction',
    'steroids',
    'anti anxiety',
    'anti parasitic',
    'pain killers',
    'sleeping pills',
    'weight loss',
    'antibiotics',
    'anti diabetics',
    'antihypertensive',
    'human growth hormones',
    'skin cream',
    'antiemetics',
    'pharmacy exporter',
    'guna pharma medicines',
  ],
  alternates: {
    canonical: `${baseUrl}/medicines`,
  },
  openGraph: {
    title: 'Clinical Medicines & Therapeutics | GUNA PHARMA',
    description:
      'Order authentic pharmaceutical therapeutics across 13 specialized clinical categories verified by licensed pharmacists.',
    url: `${baseUrl}/medicines`,
    type: 'website',
    siteName: 'GUNA PHARMA',
    images: [
      {
        url: `${baseUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'GUNA PHARMA - Clinical Medicines & Therapeutics',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Clinical Medicines & Therapeutics | GUNA PHARMA',
    description:
      'Order authentic prescription therapeutics verified by licensed pharmacists across 13 clinical categories.',
    images: [`${baseUrl}/og-image.jpg`],
  },
};

export default function MedicinesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const collectionSchema = buildCollectionPageSchema({
    title: 'Clinical Medicines & Therapeutics Department',
    description:
      'Certified pharmaceutical formulations across 13 specialized clinical categories verified by licensed pharmacists.',
    url: `${baseUrl}/medicines`,
    items: MEDICINE_CATEGORIES.map((cat) => ({
      name: cat.name,
      url: `${baseUrl}/medicines?filter=${cat.id}`,
      description: cat.shortDesc,
    })),
  });

  const breadcrumbSchema = buildBreadcrumbSchema(
    [
      { name: 'Home', path: '/' },
      { name: 'Medicines Department', path: '/medicines' },
    ],
    baseUrl
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionSchema),
        }}
      />
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
