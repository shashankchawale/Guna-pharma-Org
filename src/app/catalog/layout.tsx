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
        name: 'Medicines (Rx & OTC)',
        url: `${baseUrl}/catalog?category=medicines`,
        description: 'Quality-assured prescription pharmaceuticals and generic therapeutics.',
      },
      {
        name: 'Beauty Care & Cosmetics',
        url: `${baseUrl}/catalog?category=beauty`,
        description: 'Premium cosmetic essentials, glam skincare, and luxury beauty items.',
      },
      {
        name: 'Pain Relief & Balms',
        url: `${baseUrl}/catalog?category=pain-relief`,
        description: 'Fast-acting analgesic sprays, herbal balms, and pain relief ointments.',
      },
      {
        name: 'Fever & Cold Care',
        url: `${baseUrl}/catalog?category=fever`,
        description: 'Clinical antipyretics, cough syrups, inhalers, and cold recovery formulations.',
      },
      {
        name: 'Clinical Skincare & Derma',
        url: `${baseUrl}/catalog?category=skincare`,
        description: 'Dermatologist-recommended serums, barrier repair creams, and cleansers.',
      },
      {
        name: 'Wellness & Daily Health',
        url: `${baseUrl}/catalog?category=wellness`,
        description: 'Daily multivitamins, antioxidants, omega fatty acids, and immunity boosters.',
      },
      {
        name: 'Hair Care & Scalp Therapy',
        url: `${baseUrl}/catalog?category=hair-care`,
        description: 'Clinical minoxidil solutions, follicle nourishment serums, and scalp care.',
      },
      {
        name: 'Digestive & Gut Health',
        url: `${baseUrl}/catalog?category=digestive-health`,
        description: 'Fast antacids, prebiotic gut support, and digestive enzyme syrups.',
      },
      {
        name: 'First Aid & Wound Care',
        url: `${baseUrl}/catalog?category=first-aid`,
        description: 'Antiseptic solutions, bandages, surgical tapes, and wound care kits.',
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
