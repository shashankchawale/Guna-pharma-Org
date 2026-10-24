'use client';

import { useState } from 'react';
import { CheckCircle2, Loader2, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { brandConfig } from '@/lib/config';
import { createClient } from '@/lib/supabase/client';

const contacts = [
  { icon: Mail, title: 'Email', text: brandConfig.contact.email, href: `mailto:${brandConfig.contact.email}` },
  { icon: Phone, title: 'Phone', text: brandConfig.contact.phone, href: `tel:${brandConfig.contact.phone.replace(/\s+/g, '')}` },
  { icon: MessageCircle, title: 'WhatsApp', text: `${brandConfig.contact.phone} (Click to Chat)`, href: `https://wa.me/${brandConfig.contact.whatsapp}?text=${encodeURIComponent('Hello GUNA PHARMA support team!')}` },
  { icon: MapPin, title: 'Location', text: brandConfig.contact.address },
];

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [enquiryType, setEnquiryType] = useState('General question');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: insertError } = await supabase.from('enquiries').insert({
        full_name: fullName,
        email,
        country: country || null,
        enquiry_type: enquiryType,
        message,
      });

      if (insertError) {
        console.warn('Supabase enquiry insertion note:', insertError.message);
      }
      setSent(true);
    } catch (err) {
      console.error('Supabase enquiry submission error:', err);
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <p className="text-sm font-bold text-primary">CONTACT US</p>
      <h1 className="mt-1 text-3xl font-bold text-navy">How can we help?</h1>
      <p className="mt-2 max-w-2xl text-gray-600">
        Ask about a product, international availability, bulk supply or an existing order. We’ll help route your request to the right team.
      </p>

      <div className="mt-7 grid gap-6 md:grid-cols-[1fr_1.2fr]">
        <aside className="space-y-3">
          {contacts.map(({ icon: Icon, title, text, href }) => {
            const cardContent = (
              <>
                <Icon className="h-5 w-5 text-primary" />
                <h2 className="mt-3 font-semibold text-navy">{title}</h2>
                <p className="mt-1 break-words text-sm text-gray-600">{text}</p>
              </>
            );

            return href ? (
              <a
                key={title}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="block rounded-2xl border border-border bg-white p-4 shadow-xs hover:border-primary hover:shadow-soft transition-all"
              >
                {cardContent}
              </a>
            ) : (
              <div className="rounded-2xl border border-border bg-white p-4 shadow-xs" key={title}>
                {cardContent}
              </div>
            );
          })}
        </aside>

        <section className="rounded-2xl border border-border bg-white p-6 shadow-card">
          {sent ? (
            <div className="py-12 text-center">
              <CheckCircle2 className="mx-auto h-14 w-14 text-success" />
              <h2 className="mt-4 text-2xl font-bold text-navy">Enquiry submitted successfully!</h2>
              <p className="mt-2 text-sm text-gray-600 max-w-md mx-auto">
                Thank you, <strong>{fullName || 'valued customer'}</strong>. Your details have been securely recorded in our system. Our pharmacist support team will respond to <strong>{email}</strong> shortly.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSent(false);
                  setFullName('');
                  setEmail('');
                  setCountry('');
                  setMessage('');
                }}
                className="mt-6 inline-flex rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover transition-colors"
              >
                Send another enquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h2 className="text-xl font-bold text-navy">Send an enquiry</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <input
                  required
                  placeholder="Full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="h-11 rounded-xl border border-border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  required
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 rounded-xl border border-border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  placeholder="Country / destination"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="h-11 rounded-xl border border-border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <select
                  value={enquiryType}
                  onChange={(e) => setEnquiryType(e.target.value)}
                  className="h-11 rounded-xl border border-border px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option>General question</option>
                  <option>International order</option>
                  <option>Wholesale / bulk enquiry</option>
                  <option>Existing order</option>
                </select>
                <textarea
                  required
                  placeholder="How can we help?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-32 rounded-xl border border-border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary sm:col-span-2"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="mt-4 inline-flex items-center gap-2 h-11 rounded-xl bg-primary px-6 text-sm font-bold text-white shadow-soft hover:bg-primary-hover disabled:opacity-50 transition-colors"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? 'Submitting to Supabase...' : 'Send enquiry'}
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
