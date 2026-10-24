import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AlertTriangle, Check, ChevronRight, ShieldCheck, Star, Truck } from 'lucide-react';
import { getProduct, products } from '@/lib/catalog';
import { formatCurrency } from '@/lib/utils';
import { ProductCard } from '@/components/product/product-card';
import { ProductPrice } from '@/components/product/product-price';
import { AddToCart } from './purchase-actions';

export function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const related = products.filter((item) => item.category_id === product.category_id && item.id !== product.id).slice(0, 4);
  return <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6"><nav className="mb-5 flex items-center gap-1 text-xs text-gray-500"><Link href="/">Home</Link><ChevronRight className="h-3 w-3"/><Link href="/catalog">Shop</Link><ChevronRight className="h-3 w-3"/><span className="truncate">{product.name}</span></nav><div className="grid gap-7 md:grid-cols-2"><div className="flex aspect-square items-center justify-center rounded-3xl bg-primary-light text-8xl">{product.category_id === 'vitamins' ? '💊' : product.category_id === 'hair-care' ? '🫧' : '🧴'}</div><div><p className="text-sm font-semibold capitalize text-primary">{product.brand_id.replace(/-/g, ' ')}</p><h1 className="mt-1 text-3xl font-bold tracking-tight text-navy">{product.name}</h1><div className="mt-3 flex items-center gap-2 text-sm"><span className="inline-flex items-center gap-1 rounded-lg bg-success-light px-2 py-1 font-semibold text-success"><Star className="h-3.5 w-3.5 fill-current" /> {product.rating_average.toFixed(1)}</span><span className="text-gray-500">{product.rating_count} verified ratings</span></div><ProductPrice sellingPrice={product.selling_price} mrp={product.mrp} discountPercent={product.discount_percent} /><p className="mt-2 text-sm font-medium text-success"><Check className="mr-1 inline h-4 w-4" /> In stock · usually dispatched in 24 hours</p>{product.requires_prescription && <div className="mt-5 rounded-2xl border border-warning/30 bg-warning-light p-4"><p className="flex items-center gap-2 font-bold text-warning"><AlertTriangle className="h-5 w-5" /> Prescription required</p><p className="mt-1 text-sm text-gray-700">Upload a valid prescription at checkout. This item can only be dispatched after pharmacist approval.</p></div>}<AddToCart product={product} /><div className="mt-6 grid grid-cols-3 gap-3 border-y border-border py-4 text-center text-xs text-gray-600"><span><Truck className="mx-auto mb-1 h-5 w-5 text-primary" />Fast delivery</span><span><ShieldCheck className="mx-auto mb-1 h-5 w-5 text-primary" />Genuine products</span><span><Check className="mx-auto mb-1 h-5 w-5 text-primary" />Secure payments</span></div></div></div><section className="mt-10 max-w-3xl space-y-3"><h2 className="text-xl font-bold text-navy">Product details</h2>{[['Description', product.description], ['Ingredients / Composition', product.composition], ['How to use', product.usage_instructions], ['Warnings & side effects', product.warnings], ['Storage', product.storage_instructions], ['Manufacturer', product.manufacturer]].map(([title, content]) => <details key={title} className="rounded-2xl border border-border p-4" open={title === 'Description'}><summary className="cursor-pointer font-semibold text-navy">{title}</summary><p className="mt-3 text-sm leading-6 text-gray-600">{content}</p></details>)}</section><section className="mt-12"><h2 className="text-2xl font-bold text-navy">You may also like</h2><div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">{related.map((item) => <ProductCard key={item.id} product={item} />)}</div></section></div>;
}
