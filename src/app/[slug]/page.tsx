import Link from 'next/link';
import { notFound } from 'next/navigation';

const pages: Record<string, { title: string; text: string }> = {
  about: {
    title: 'About GUNA PHARMA',
    text: 'We make everyday health and beauty shopping clearer, more convenient, and more trustworthy with genuine pharmaceutical formulations and verified skincare essentials.',
  },
  contact: {
    title: 'Contact us',
    text: 'Our support team and pharmacist support desk are here to help with product and order questions.',
  },
  faq: {
    title: 'Frequently asked questions',
    text: 'Find answers about deliveries, returns, prescriptions, international transit, and ordering with GUNA PHARMA. For specific dosage or clinical inquiries, our licensed pharmacists are on standby.',
  },
  'privacy-policy': {
    title: 'Privacy policy',
    text: 'We collect only the information needed to operate your account, process orders, and provide secure support. Prescription documents are stored privately and are accessible only to you and authorised pharmacy staff.',
  },
  terms: {
    title: 'Terms of service',
    text: 'By using this site, you agree to provide accurate order and prescription information and to follow the product instructions supplied with your purchases.',
  },
  'medical-disclaimer': {
    title: 'Medical disclaimer',
    text: 'Information on this site is for general awareness only and does not replace a doctor’s advice, diagnosis, or treatment. Always consult a qualified healthcare professional for medical concerns.',
  },
  'shipping-policy': {
    title: 'Shipping policy',
    text: 'Orders are generally dispatched in 1–2 business days in secure, tamper-evident packaging. Delivery timing varies by serviceable destination and local postal customs.',
  },
  'refund-policy': {
    title: 'Return & refund policy',
    text: 'Eligible non-prescription products may be returned within 7 days in accordance with our returns policy. Prescription therapeutics cannot be returned once supplied.',
  },
  'cookie-policy': {
    title: 'Cookie policy',
    text: 'GUNA PHARMA uses essential and preference cookies to retain your shopping basket, remember your regional currency, and ensure a secure browsing experience.',
  },
  licenses: {
    title: 'Licenses & certifications',
    text: 'GUNA PHARMA operates in strict compliance with certified Good Distribution Practice (GDP) standards, licensed drug distribution permits, and verified supplier certifications.',
  },
  careers: {
    title: 'Careers at GUNA PHARMA',
    text: 'Join our rapidly growing international healthcare distribution network. We are always looking for passionate pharmacists, supply-chain specialists, and digital healthcare engineers.',
  },
  sustainability: {
    title: 'Sustainability & ethical sourcing',
    text: 'We are committed to reducing environmental impact through eco-friendly recyclable packaging, temperature-efficient logistics, and ethically sourced botanical and cosmetic ingredients.',
  },
  blog: {
    title: 'Healthcare & wellness insights',
    text: 'Read our latest clinical updates, dermatological tips, seasonal wellness routines, and pharmacist-reviewed health guides.',
  },
  affiliate: {
    title: 'Affiliate & partner program',
    text: 'Partner with GUNA PHARMA to provide your patients, clients, or readers with access to authentic healthcare formulations and verified skincare products.',
  },
  'size-guide': {
    title: 'Product dosage & size guide',
    text: 'Refer to product packaging for specific volume and milligram potencies. For personalized dosage recommendations, always consult your physician or speak with our pharmacist desk.',
  },
  press: {
    title: 'Press & media resources',
    text: 'For press enquiries, corporate announcements, and media kits regarding GUNA PHARMA international operations, please reach out to our media relations desk at press@gunapharma.com.',
  },
  offers: {
    title: 'Special offers & seasonal promotions',
    text: 'Explore our latest bundle savings, introductory discounts on new wellness formulations, and exclusive seasonal healthcare deals.',
  },
};

export function generateStaticParams() {
  return Object.keys(pages).map((slug) => ({ slug }));
}

export default async function ContentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = pages[slug];
  if (!page) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <p className="text-sm font-bold text-primary">GUNA PHARMA</p>
      <h1 className="mt-2 text-3xl font-bold text-navy">{page.title}</h1>
      <p className="mt-6 text-base leading-8 text-gray-700">{page.text}</p>
      <Link
        href="/contact"
        prefetch={true}
        className="mt-8 inline-flex rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white"
      >
        Contact support
      </Link>
    </article>
  );
}
