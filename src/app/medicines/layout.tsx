import type { Metadata } from 'next';
import { getAppBaseUrl, buildCollectionPageSchema, buildBreadcrumbSchema } from '@/lib/seo';

const baseUrl = getAppBaseUrl();

export const metadata: Metadata = {
  title: 'Prescription & OTC Medicines | GUNA PHARMA',
  description:
    'Order genuine prescription therapeutics, fever & pain relief tablets, cough syrups, and first-aid supplies verified by licensed pharmacists with global shipping.',
  keywords: [
    'prescription medicines',
    'buy medicines online',
    'otc medicines',
    'pain relief tablets',
    'fever syrup',
    'cough cold medicines',
    'pharmacy exporter',
    'guna pharma medicines',
  ],
  alternates: {
    canonical: `${baseUrl}/medicines`,
  },
  openGraph: {
    title: 'Prescription & OTC Medicines | GUNA PHARMA',
    description:
      'Order authentic pharmaceutical medicines, pain relief formulations, and first-aid supplies verified by licensed pharmacists.',
    url: `${baseUrl}/medicines`,
    type: 'website',
    siteName: 'GUNA PHARMA',
    images: [
      {
        url: `${baseUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'GUNA PHARMA - Prescription & OTC Medicines',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prescription & OTC Medicines | GUNA PHARMA',
    description:
      'Order authentic prescription therapeutics and OTC medicines verified by licensed pharmacists.',
    images: [`${baseUrl}/og-image.jpg`],
  },
};

export default function MedicinesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const collectionSchema = buildCollectionPageSchema({
    title: 'Prescription & OTC Medicines Department',
    description:
      'Certified pharmaceutical formulations, pain relief tablets, cold recovery syrups, and first-aid therapeutics.',
    url: `${baseUrl}/medicines`,
    items: [
      {
        name: 'General Pharmaceutical Medicines',
        url: `${baseUrl}/medicines?filter=medicines`,
        description: 'Certified daily therapeutics, generic formulations, and clinical tablets.',
      },
      {
        name: 'Pain Relief & Fever Therapeutics',
        url: `${baseUrl}/medicines?filter=pain-relief`,
        description: 'Analgesics, fever reducers, anti-inflammatory tablets, and soothing balms.',
      },
      {
        name: 'Cold, Cough & Flu Care',
        url: `${baseUrl}/medicines?filter=cold-flu`,
        description: 'Decongestants, expectorant syrups, vapor inhalers, and throat lozenges.',
      },
      {
        name: 'Digestive & Stomach Care',
        url: `${baseUrl}/medicines?filter=digestive-health`,
        description: 'Antacids, acid reflux relief, digestive enzymes, and bowel stabilizers.',
      },
      {
        name: 'First Aid & Wound Dressings',
        url: `${baseUrl}/medicines?filter=first-aid`,
        description: 'Antiseptic washes, gauze dressings, bandage wraps, and medical adhesives.',
      },
      {
        name: 'Prescription Medicines (Rx)',
        url: `${baseUrl}/medicines?filter=prescription`,
        description: 'Doctor-prescribed clinical therapeutics verified by licensed pharmacists.',
      },
    ],
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
