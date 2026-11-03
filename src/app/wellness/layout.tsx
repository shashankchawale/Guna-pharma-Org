import type { Metadata } from 'next';
import { getAppBaseUrl, buildCollectionPageSchema, buildBreadcrumbSchema } from '@/lib/seo';

const baseUrl = getAppBaseUrl();

export const metadata: Metadata = {
  title: 'Wellness, Vitamins & Health Supplements | GUNA PHARMA',
  description:
    'Shop clinical-grade daily multivitamins, immunity boosters, omega fish oils, antioxidants, and wellness nutrition with guaranteed purity and worldwide dispatch.',
  keywords: [
    'wellness products',
    'vitamins supplements',
    'daily multivitamin',
    'immunity booster',
    'omega fish oil',
    'glutathione antioxidant',
    'health nutrition',
    'guna pharma wellness',
  ],
  alternates: {
    canonical: `${baseUrl}/wellness`,
  },
  openGraph: {
    title: 'Wellness, Vitamins & Health Supplements | GUNA PHARMA',
    description:
      'Explore clinical-grade multivitamins, vital nutrients, and daily wellness formulations shipped worldwide.',
    url: `${baseUrl}/wellness`,
    type: 'website',
    siteName: 'GUNA PHARMA',
    images: [
      {
        url: `${baseUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'GUNA PHARMA - Wellness & Supplements',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wellness, Vitamins & Health Supplements | GUNA PHARMA',
    description:
      'Explore clinical-grade multivitamins, vital nutrients, and daily wellness formulations.',
    images: [`${baseUrl}/og-image.jpg`],
  },
};

export default function WellnessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const collectionSchema = buildCollectionPageSchema({
    title: 'Wellness, Vitamins & Nutritional Supplements',
    description:
      'Curated clinical-grade vitamins, dietary supplements, antioxidants, and daily immunity essentials.',
    url: `${baseUrl}/wellness`,
    items: [
      {
        name: 'Daily Multivitamins & Minerals',
        url: `${baseUrl}/wellness?search=multivitamin`,
        description: 'Comprehensive daily vitamin profiles supporting cellular energy and vitality.',
      },
      {
        name: 'Omega-3 Fatty Acids & Heart Support',
        url: `${baseUrl}/wellness?search=omega`,
        description: 'Ultra-pure EPA/DHA marine oils supporting cardiovascular and brain health.',
      },
      {
        name: 'Immunity & Antioxidants',
        url: `${baseUrl}/wellness?search=immunity`,
        description: 'High-potency Vitamin C, Zinc, and Glutathione formulations for cellular defence.',
      },
      {
        name: 'Herbal & Ayurvedic Extracts',
        url: `${baseUrl}/wellness?search=herbal`,
        description: 'Standardized botanicals and adaptogenic herbs for restorative daily balance.',
      },
    ],
  });

  const breadcrumbSchema = buildBreadcrumbSchema(
    [
      { name: 'Home', path: '/' },
      { name: 'Wellness & Nutrition', path: '/wellness' },
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
