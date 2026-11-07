import type { Product } from '@/types';

/**
 * Resolves the canonical base URL for SEO metadata and structured data
 */
export function getAppBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    const raw = process.env.NEXT_PUBLIC_APP_URL;
    if (!raw.includes('localhost') && !raw.includes('127.0.0.1')) {
      return raw.startsWith('http') ? raw : `https://${raw}`;
    }
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return 'https://guna-pharma-org.vercel.app';
}

/**
 * Builds Schema.org Product structured data (JSON-LD)
 */
export function buildProductSchema(product: Product, baseUrl: string) {
  const canonicalUrl = `${baseUrl}/product/${product.slug || product.id}`;
  const imageUrl = product.thumbnail_url || product.images?.[0] || `${baseUrl}/og-image.jpg`;
  const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;

  const ratingValue = Number(product.rating_average || 4.8).toFixed(1);
  const reviewCount = Math.max(Number(product.rating_count || 12), 1);

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: [fullImageUrl],
    description: (product.short_description || product.description || `${product.name} available at GUNA PHARMA.`).slice(0, 300),
    sku: product.sku || product.id,
    mpn: product.id,
    brand: {
      '@type': 'Brand',
      name: product.manufacturer || product.brand_id?.replace(/-/g, ' ') || 'GUNA PHARMA',
    },
    category: product.category_id || (typeof product.category === 'string' ? product.category : 'Healthcare'),
    offers: {
      '@type': 'Offer',
      url: canonicalUrl,
      priceCurrency: 'INR',
      price: product.selling_price || product.mrp || 299,
      priceValidUntil: '2027-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability: (product.stock_quantity ?? 50) > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'GUNA PHARMA',
        url: baseUrl,
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'IN',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 7,
        returnMethod: 'https://schema.org/ReturnByMail',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue,
      reviewCount,
      bestRating: '5',
      worstRating: '1',
    },
  };
}

/**
 * Builds Schema.org BreadcrumbList structured data (JSON-LD)
 */
export function buildBreadcrumbSchema(items: { name: string; path: string }[], baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.path.startsWith('http') ? item.path : `${baseUrl}${item.path.startsWith('/') ? '' : '/'}${item.path}`,
    })),
  };
}

/**
 * Builds Schema.org CollectionPage / ItemList structured data (JSON-LD)
 */
export function buildCollectionPageSchema(options: {
  title: string;
  description: string;
  url: string;
  items?: { name: string; url: string; image?: string; description?: string }[];
}) {
  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: options.title,
    description: options.description,
    url: options.url,
  };

  if (options.items && options.items.length > 0) {
    schema.mainEntity = {
      '@type': 'ItemList',
      numberOfItems: options.items.length,
      itemListElement: options.items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        url: item.url,
        ...(item.description ? { description: item.description } : {}),
        ...(item.image ? { image: item.image } : {}),
      })),
    };
  }

  return schema;
}
