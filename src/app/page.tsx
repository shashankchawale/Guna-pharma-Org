import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ClipboardCheck, FileText, Globe2, PackageCheck, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { cookies } from 'next/headers';
import { getServerProducts } from '@/lib/server-catalog';
import { HeroSlider } from '@/components/home/hero-slider';
import { CustomerTestimonials } from '@/components/home/customer-testimonials';
import { FeaturedProducts } from '@/components/home/featured-products';

export const dynamic = 'force-dynamic';

const concerns = ['Acne', 'Hair Fall', 'Pigmentation', 'Immunity', 'Digestion', 'Pain Relief', 'Cold & Cough'];
const exportServices = [
  { icon: Globe2, title: 'International enquiries', text: 'Tell us your destination before ordering.' },
  { icon: PackageCheck, title: 'Careful packing', text: 'Products are packed for safe transit.' },
  { icon: FileText, title: 'Product information', text: 'Request available product documentation.' },
  { icon: ClipboardCheck, title: 'Destination review', text: 'Orders remain subject to local rules.' },
];

export default async function HomePage() {
  const cookieStore = await cookies();
  const deletedCookie = cookieStore.get('guna_deleted_ids')?.value;
  let cookieDeletedIds: string[] = [];
  if (deletedCookie) {
    try {
      const parsed = JSON.parse(decodeURIComponent(deletedCookie));
      if (Array.isArray(parsed)) cookieDeletedIds = parsed;
    } catch {}
  }
  const initialProducts = getServerProducts(cookieDeletedIds);
  return <>
    {/* Hero Poster Banner - Reference Style */}
    <section className="relative overflow-hidden bg-gradient-to-r from-[#005AD2] via-[#0066E8] to-[#004BB8] text-white">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-300/20 via-transparent to-transparent pointer-events-none" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 sm:px-6 md:grid-cols-12 md:py-16 lg:py-20">
        {/* Left Column: Heading, Subheading & Buttons */}
        <div className="space-y-6 md:col-span-7 lg:col-span-6 z-10">
          <div className="inline-flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-blue-200">
              TRUSTED HEALTHCARE & COSMETICS
            </span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.08]">
            Your Health.<br />
            Our Priority.
          </h1>

          <p className="max-w-xl text-base sm:text-lg leading-relaxed text-blue-100">
            Discover quality medicines, premium cosmetic products, and healthcare essentials from a trusted pharmaceutical exporter shipping worldwide.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/medicines"
              prefetch={true}
              className="inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-bold text-[#005AD2] shadow-lg transition-all duration-200 hover:bg-blue-50 hover:shadow-xl hover:scale-105"
            >
              Shop Medicines
            </Link>

            <Link
              href="/catalog?category=skincare"
              prefetch={true}
              className="inline-flex h-12 items-center justify-center rounded-full border-2 border-white/80 bg-transparent px-8 text-sm font-bold text-white transition-all duration-200 hover:bg-white/15 hover:border-white hover:scale-105"
            >
              Shop Cosmetics
            </Link>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-blue-100 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" /> 100% Genuine Medicines
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-amber-300" /> Premium Cosmetics & Skincare
            </span>
            <span className="flex items-center gap-1.5">
              <Truck className="h-4 w-4 text-blue-200" /> Worldwide Shipping
            </span>
          </div>
        </div>

        {/* Right Column: Sliding Showcase of Cosmetics & Medicines */}
        <div className="relative md:col-span-5 lg:col-span-6 flex justify-center md:justify-end">
          <HeroSlider />
        </div>
      </div>
    </section>
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Medicines Card */}
        <Link
          href="/medicines"
          prefetch={true}
          className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-[#005AD2] via-[#0066E8] to-[#004BB8] p-6 sm:p-8 text-white shadow-card transition-all duration-300 hover:shadow-elevated hover:-translate-y-1"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-2xl shadow-md ring-2 ring-white/20">
              <Image
                src="/category-medicines.jpg"
                alt="Medicines & Pharmaceutical Products"
                fill
                sizes="(max-width: 640px) 80px, 96px"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <span className="rounded-full bg-white/15 px-3.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              Rx & Healthcare
            </span>
          </div>

          <div className="mt-6">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Medicines</h2>
            <p className="mt-2 text-sm leading-relaxed text-blue-100">
              Explore healthcare essentials, prescription tablets, capsules & medical information.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-white transition-all group-hover:gap-3">
              Browse medicines <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </Link>

        {/* Wellness & Supplements Card */}
        <Link
          href="/wellness"
          prefetch={true}
          className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-[#1E58E2] to-[#1242C2] p-6 sm:p-8 text-white shadow-card transition-all duration-300 hover:shadow-elevated hover:-translate-y-1"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-2xl shadow-md ring-2 ring-white/15">
              <Image
                src="/category-wellness.jpg"
                alt="Wellness, Supplements & Botanical Skincare"
                fill
                sizes="(max-width: 640px) 80px, 96px"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <span className="rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-blue-100 backdrop-blur-sm">
              Natural & Wellness
            </span>
          </div>

          <div className="mt-6">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Wellness & supplements</h2>
            <p className="mt-2 text-sm leading-relaxed text-blue-100/90">
              Everyday wellbeing, vitamins, botanical extracts and skincare essentials.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-white transition-all group-hover:gap-3">
              Explore wellness <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </Link>
      </div>
    </section>
    <FeaturedProducts initialProducts={initialProducts} />
    <section className="bg-primary-light/60 py-12"><div className="mx-auto max-w-7xl px-4 sm:px-6"><p className="text-sm font-bold text-primary">GLOBAL HEALTHCARE</p><h2 className="mt-1 max-w-2xl text-2xl font-bold text-navy">A clearer way to source healthcare essentials internationally.</h2><p className="mt-3 max-w-2xl leading-7 text-gray-600">We support customers and trade buyers with clear product information, destination-aware ordering and a team ready to help with product availability.</p><div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{exportServices.map(({ icon: Icon, title, text }) => <div className="rounded-2xl bg-white p-5 shadow-soft" key={title}><Icon className="h-6 w-6 text-primary"/><h3 className="mt-4 font-semibold text-navy">{title}</h3><p className="mt-1 text-sm leading-6 text-gray-600">{text}</p></div>)}</div></div></section>
    <CustomerTestimonials />
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6"><div className="grid gap-6 rounded-3xl border border-border bg-white p-6 shadow-card md:grid-cols-[1.3fr_1fr] md:p-10"><div><p className="text-sm font-bold text-primary">WHOLESALE & BULK ORDERS</p><h2 className="mt-1 text-3xl font-bold text-navy">Stock your pharmacy, clinic or wellness business.</h2><p className="mt-3 max-w-xl leading-7 text-gray-600">Send our team your product list, quantities and destination. We’ll help you check availability and prepare a tailored quotation.</p><ul className="mt-5 grid gap-2 text-sm text-gray-700 sm:grid-cols-2"><li>✓ Product availability support</li><li>✓ Destination-specific enquiry</li><li>✓ Dedicated order assistance</li><li>✓ Documentation guidance</li></ul></div><div className="rounded-2xl bg-navy p-6 text-white"><h3 className="text-xl font-bold">Need a tailored quote?</h3><p className="mt-2 text-sm leading-6 text-blue-100">For bulk or repeat supply, tell us what you need and where it’s going.</p><Link href="/get-a-quote" className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-white px-4 text-sm font-bold text-primary">Get a quote <ArrowRight className="h-4 w-4"/></Link></div></div></section>
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6"><div className="rounded-3xl bg-navy px-6 py-8 text-white sm:px-10"><p className="text-sm font-bold text-blue-200">SHOP BY CONCERN</p><h2 className="mt-1 text-2xl font-bold">Find care made for you.</h2><div className="mt-5 flex flex-wrap gap-2">{concerns.map((concern) => <Link key={concern} href={`/catalog?search=${encodeURIComponent(concern)}`} className="rounded-xl border border-white/30 px-3 py-2 text-sm hover:bg-white hover:text-navy">{concern}</Link>)}</div></div></section>
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6"><div className="grid gap-6 lg:grid-cols-2"><div><p className="text-sm font-bold text-primary">BUYER EXPERIENCE</p><h2 className="mt-1 text-2xl font-bold text-navy">What international buyers need from us</h2><div className="mt-5 space-y-3">{[['Clear product pages','Useful product and prescription information before you order.'],['Responsive support','Help with products, orders and general availability questions.'],['Order visibility','A straightforward process from enquiry through delivery.']].map(([title,text]) => <div className="rounded-2xl border border-border p-4" key={title}><h3 className="font-semibold text-navy">{title}</h3><p className="mt-1 text-sm text-gray-600">{text}</p></div>)}</div></div><div><p className="text-sm font-bold text-primary">HELP CENTRE</p><h2 className="mt-1 text-2xl font-bold text-navy">Everything you need to know</h2><div className="mt-5 space-y-3">{[['Can I order internationally?','Availability depends on the destination, product and applicable rules. Contact us before ordering.'],['How do I find a product?','Browse the medicine and wellness categories or use the search bar.'],['How can I speak to support?','Use the contact page or WhatsApp link in the footer for product and order assistance.']].map(([question,answer]) => <details className="rounded-2xl border border-border p-4" key={question}><summary className="cursor-pointer font-semibold text-navy">{question}</summary><p className="mt-3 text-sm leading-6 text-gray-600">{answer}</p></details>)}</div><Link href="/contact" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary">Contact support <ArrowRight className="h-4 w-4"/></Link></div></div></section>
  </>;
}
