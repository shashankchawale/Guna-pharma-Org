import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Globe2, HeartPulse, ShieldCheck, Sparkles } from 'lucide-react';

const principles = [
  { icon: HeartPulse, title: 'Care-first experience', text: 'Support designed around real health and wellness needs.' },
  { icon: ShieldCheck, title: 'Responsible ordering', text: 'Prescription and destination checks where required.' },
  { icon: Globe2, title: 'Global enquiries', text: 'Help for customers and trade buyers around the world.' },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero Banner with Blue Theme & Photo */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#005AD2] via-[#0066E8] to-[#004BB8] text-white">
        {/* Background ambient lighting */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-300/20 via-transparent to-transparent pointer-events-none" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-12 md:py-20">
          {/* Left Column: Heading & Mission */}
          <div className="space-y-6 md:col-span-7 z-10">
            <div className="inline-flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-[0.22em] text-blue-200">
                ABOUT GUNA PHARMA
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
              Healthcare access should feel clear, considerate and dependable.
            </h1>

            <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-blue-100">
              GUNA PHARMA brings skincare, wellness and healthcare essentials together in one easy-to-navigate place—serving individual customers and international trade enquiries with clinical excellence and personalized care.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-blue-100 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Quality-Assured Medicines
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-amber-300" /> Premium Skincare & Cosmetics
              </span>
              <span className="flex items-center gap-1.5">
                <Globe2 className="h-4 w-4 text-blue-200" /> Worldwide Trade & Support
              </span>
            </div>
          </div>

          {/* Right Column: Laboratory & Quality Assurance Photo */}
          <div className="relative md:col-span-5 flex justify-center md:justify-end">
            <div className="relative w-full max-w-md lg:max-w-lg overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/20 group">
              <Image
                src="/about-healthcare-lab.jpg"
                alt="Modern pharmaceutical laboratory with scientist verifying medicine quality and clinical care"
                width={800}
                height={600}
                priority
                className="w-full h-auto object-cover transform transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#002E6E]/50 via-transparent to-transparent pointer-events-none" />

              {/* Badge overlay on photo */}
              <div className="absolute bottom-4 left-4 rounded-full bg-white/95 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-navy shadow-lg flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Certified Clinical Quality & Safety</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Principles and details */}
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-navy">Our approach</h2>
            <p className="mt-4 leading-7 text-gray-600">
              We focus on useful product information, secure ordering and responsive human support. For international orders, availability is always checked against the destination and applicable requirements.
            </p>
            <p className="mt-4 leading-7 text-gray-600">
              Prescription-only items require a valid prescription and pharmacist review before dispatch. Product information is general in nature and never replaces medical advice.
            </p>
          </div>
          <div className="grid gap-3">
            {principles.map(({ icon: Icon, title, text }) => (
              <div className="rounded-2xl border border-border p-5 bg-white shadow-soft" key={title}>
                <Icon className="h-6 w-6 text-primary" />
                <h3 className="mt-3 font-semibold text-navy">{title}</h3>
                <p className="mt-1 text-sm leading-6 text-gray-600">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 rounded-3xl bg-gradient-to-r from-navy to-[#0F285A] p-7 text-white shadow-card">
          <h2 className="text-2xl font-bold">Let’s make healthcare sourcing simpler.</h2>
          <p className="mt-2 max-w-2xl text-blue-100">
            Speak with our team about a product, an international order or a trade enquiry.
          </p>
          <Link
            href="/contact"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-primary shadow-soft hover:bg-blue-50 transition-colors"
          >
            Contact us <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
