import Link from 'next/link';
import { notFound } from 'next/navigation';

const pages: Record<string, { title: string; text: string }> = {
  about: {
    title: 'About GUNA PHARMA',
    text: 'We make everyday health and beauty shopping clearer, more convenient, and more trustworthy.',
  },
  contact: {
    title: 'Contact us',
    text: 'Our support team and pharmacist support desk are here to help with product and order questions.',
  },
  faq: {
    title: 'Frequently asked questions',
    text: 'Find answers about deliveries, returns, prescriptions, and ordering with GUNA PHARMA.',
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
    text: 'Orders are generally dispatched in 1–2 business days. Delivery timing varies by serviceable pincode.',
  },
  'refund-policy': {
    title: 'Return & refund policy',
    text: 'Eligible non-prescription products may be returned within 7 days in accordance with our returns policy. Prescription products cannot be returned once supplied.',
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
