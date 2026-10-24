import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { AlertTriangle, Check, ChevronRight, ShieldCheck, Star, Truck } from 'lucide-react';
import { getProduct, getAllProducts } from '@/lib/catalog';
import { ProductCard } from '@/components/product/product-card';
import { ProductPrice } from '@/components/product/product-price';
import { AddToCart } from './purchase-actions';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const all = getAllProducts();
  const related = all
    .filter((item) => item.category_id === product.category_id && item.id !== product.id)
    .slice(0, 4);

  const imageUrl = product.thumbnail_url || product.images?.[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-xs text-gray-500">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/catalog" className="hover:text-primary transition-colors">Shop</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-semibold text-navy truncate">{product.name}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Product Image Presentation */}
        <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-[#F4F6F9] border border-slate-100 shadow-soft flex items-center justify-center p-6">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain p-6"
              priority
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="text-8xl">
              {product.category_id === 'vitamins' ? '💊' : product.category_id === 'hair-care' ? '🫧' : '🧴'}
            </span>
          )}

          {product.discount_percent > 0 && (
            <span className="absolute left-4 top-4 rounded-xl bg-white/95 backdrop-blur-xs px-3 py-1 text-xs font-black text-primary shadow-xs">
              {product.discount_percent}% OFF
            </span>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-primary">
              {product.manufacturer || product.brand_id.replace(/-/g, ' ')}
            </p>
            <h1 className="mt-1.5 text-2xl sm:text-3xl font-extrabold tracking-tight text-navy">
              {product.name}
            </h1>

            <div className="mt-3 flex items-center gap-3 text-sm">
              <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 font-bold text-emerald-700 border border-emerald-200 text-xs">
                <Star className="h-3.5 w-3.5 fill-current" /> {product.rating_average.toFixed(1)}
              </span>
              <span className="text-xs text-gray-500 font-medium">
                {product.rating_count} verified buyer ratings
              </span>
            </div>

            <div className="mt-4">
              <ProductPrice
                sellingPrice={product.selling_price}
                mrp={product.mrp}
                discountPercent={product.discount_percent}
              />
            </div>

            <p className="mt-2 text-xs font-bold text-emerald-600 flex items-center gap-1.5">
              <Check className="h-4 w-4" /> In stock · usually dispatched within 24 hours
            </p>

            {product.requires_prescription && (
              <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
                <p className="flex items-center gap-2 font-bold text-amber-900 text-xs uppercase tracking-wider">
                  <AlertTriangle className="h-4 w-4 text-amber-600" /> Prescription Required
                </p>
                <p className="mt-1 text-xs text-amber-800 leading-relaxed">
                  Upload a valid doctor&apos;s prescription at checkout. This item will be verified by a licensed pharmacist before dispatch.
                </p>
              </div>
            )}

            <div className="mt-6">
              <AddToCart product={product} />
            </div>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3 border-y border-border py-4 text-center text-xs text-gray-600">
            <div>
              <Truck className="mx-auto mb-1 h-5 w-5 text-primary" />
              <span className="font-semibold text-navy block">Fast Delivery</span>
              <span className="text-[10px] text-gray-400">Doorstep dispatch</span>
            </div>
            <div>
              <ShieldCheck className="mx-auto mb-1 h-5 w-5 text-primary" />
              <span className="font-semibold text-navy block">100% Genuine</span>
              <span className="text-[10px] text-gray-400">Batch verified</span>
            </div>
            <div>
              <Check className="mx-auto mb-1 h-5 w-5 text-primary" />
              <span className="font-semibold text-navy block">Secure Checkout</span>
              <span className="text-[10px] text-gray-400">Encrypted payment</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Section */}
      <section className="mt-12 max-w-4xl space-y-3">
        <h2 className="text-xl font-extrabold text-navy mb-4">Product Details & Clinical Information</h2>
        {[
          ['Description', product.description],
          ['Ingredients & Active Composition', product.composition],
          ['Directions for Use', product.usage_instructions],
          ['Warnings & Precautions', product.warnings],
          ['Storage Instructions', product.storage_instructions],
          ['Manufacturer / Brand Details', product.manufacturer],
        ].map(([title, content]) => (
          <details key={title} className="rounded-2xl border border-border bg-white p-4.5 shadow-xs" open={title === 'Description'}>
            <summary className="cursor-pointer font-bold text-sm text-navy hover:text-primary transition-colors">
              {title}
            </summary>
            <p className="mt-3 text-xs leading-relaxed text-gray-600">{content}</p>
          </details>
        ))}
      </section>

      {/* Related Products */}
      <section className="mt-16">
        <h2 className="text-2xl font-extrabold text-navy">Customers Also Bought</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {related.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
