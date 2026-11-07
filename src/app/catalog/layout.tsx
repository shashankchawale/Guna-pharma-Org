import type { Metadata } from 'next';
import { getAppBaseUrl, buildCollectionPageSchema, buildBreadcrumbSchema } from '@/lib/seo';

const baseUrl = getAppBaseUrl();

export const metadata: Metadata = {
  title: 'Medicines, Beauty & Healthcare Products Catalog | GUNA PHARMA',
  description:
    'Explore our catalog of certified prescription medicines, luxury beauty cosmetics, pain relief balms, derma skincare, and wellness essentials shipped worldwide.',
  keywords: [
    'online pharmacy catalog',
    'buy medicines online',
    'luxury cosmetics',
    'pain relief balms',
    'fever cold medicines',
    'clinical skincare',
    'wellness vitamins',
    'guna pharma catalog',
  ],
  alternates: {
    canonical: `${baseUrl}/catalog`,
  },
  openGraph: {
    title: 'Medicines, Beauty & Healthcare Products Catalog | GUNA PHARMA',
    description:
      'Certified authentic medicines, premium cosmetics, pain & fever therapeutics, and wellness products with worldwide delivery.',
    url: `${baseUrl}/catalog`,
    type: 'website',
    siteName: 'GUNA PHARMA',
    images: [
      {
        url: `${baseUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'GUNA PHARMA - Medicines, Beauty & Healthcare Catalog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Medicines, Beauty & Healthcare Products Catalog | GUNA PHARMA',
    description:
      'Explore certified prescription medicines, luxury beauty cosmetics, and clinical wellness essentials.',
    images: [`${baseUrl}/og-image.jpg`],
  },
};

export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const collectionSchema = buildCollectionPageSchema({
    title: 'Medicines, Beauty & Healthcare Catalog',
    description:
      'Complete catalog of certified prescription medicines, luxury cosmetics, pain relief balms, skincare, and wellness essentials.',
    url: `${baseUrl}/catalog`,
    items: [
      {
        name: 'Medicines & Pharmaceuticals',
        url: `${baseUrl}/catalog?category=medicines`,
        description: 'Certified medicines across 13 specialized categories including ED, Steroids, Antibiotics, and more.',
      },
      {
        name: 'Erectile Dysfunction',
        url: `${baseUrl}/catalog?category=erectile-dysfunction`,
        description: 'Certified PDE-5 therapies and vitality formulations.',
      },
      {
        name: 'Steroids & Corticoids',
        url: `${baseUrl}/catalog?category=steroids`,
        description: 'Quality-assured anti-inflammatory and hormonal therapies.',
      },
      {
        name: 'Anti Anxiety',
        url: `${baseUrl}/catalog?category=anti-anxiety`,
        description: 'Certified anxiolytic therapies for stress and anxiety care.',
      },
      {
        name: 'Pain Killers',
        url: `${baseUrl}/catalog?category=pain-killers`,
        description: 'Effective analgesic pain relief formulations.',
      },
      {
        name: 'Antibiotics',
        url: `${baseUrl}/catalog?category=antibiotics`,
        description: 'Broad-spectrum antimicrobials and infection treatments.',
      },
      {
        name: 'Weight Loss & Metabolic',
        url: `${baseUrl}/catalog?category=weight-loss`,
        description: 'Clinically verified metabolic and weight management therapies.',
      },
      {
        name: 'Clinical Skincare & Derma',
        url: `${baseUrl}/catalog?category=skincare`,
        description: 'Dermatologist-recommended serums, barrier repair creams, and skin topicals.',
      },
      {
        name: 'Beauty Care & Cosmetics',
        url: `${baseUrl}/catalog?category=beauty`,
        description: 'Premium cosmetic essentials, glam skincare, and luxury beauty items.',
      },
      {
        name: 'Wellness & Daily Health',
        url: `${baseUrl}/catalog?category=wellness`,
        description: 'Daily multivitamins, antioxidants, omega fatty acids, and vitality essentials.',
      },
    ],
  });

  const breadcrumbSchema = buildBreadcrumbSchema(
    [
      { name: 'Home', path: '/' },
      { name: 'Healthcare & Beauty Catalog', path: '/catalog' },
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
