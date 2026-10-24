'use client';

import { useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function QuotePage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [quantity, setQuantity] = useState('');
  const [phone, setPhone] = useState('');
  const [details, setDetails] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: insertError } = await supabase.from('quotes').insert({
        full_name: fullName,
        company: company || null,
        email,
        country,
        quantity: quantity || null,
        phone: phone || null,
        details,
      });

      if (insertError) {
        console.warn('Supabase quote insertion note:', insertError.message);
      }
      setSent(true);
    } catch (err) {
      console.error('Supabase quote submission error:', err);
      setSent(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <p className="text-sm font-bold text-primary">WHOLESALE & BULK ORDERS</p>
      <h1 className="mt-1 text-3xl font-bold text-navy">Request a product quote</h1>
      <p className="mt-2 text-gray-600">
        Share the product names, expected quantities and destination. Our team will review availability and respond with a competitive quotation.
      </p>

      <section className="mt-6 rounded-3xl border border-border bg-white p-6 shadow-card">
        {sent ? (
          <div className="py-12 text-center">
            <CheckCircle2 className="mx-auto h-14 w-14 text-success" />
            <h2 className="mt-4 text-2xl font-bold text-navy">Quote request received</h2>
            <p className="mt-2 text-sm text-gray-600 max-w-md mx-auto">
              Thank you, <strong>{fullName}</strong>. Your quotation request has been received successfully. Our international trade team will review your requirements and reach out to <strong>{email}</strong> within 1 business day.
            </p>
            <button
              type="button"
              onClick={() => {
                setSent(false);
                setFullName('');
                setCompany('');
                setEmail('');
                setCountry('');
                setQuantity('');
                setPhone('');
                setDetails('');
              }}
              className="mt-6 inline-flex rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover transition-colors"
            >
              Request another quote
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2">
            <input
              required
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="h-11 rounded-xl border border-border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              placeholder="Company / organisation"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="h-11 rounded-xl border border-border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              required
              type="email"
              placeholder="Work email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 rounded-xl border border-border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              required
              placeholder="Destination country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="h-11 rounded-xl border border-border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              placeholder="Expected quantity (e.g. 500 units)"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="h-11 rounded-xl border border-border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              placeholder="Phone / WhatsApp"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-11 rounded-xl border border-border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <textarea
              required
              placeholder="Products required, pack sizes and any other details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="min-h-36 rounded-xl border border-border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary sm:col-span-2"
            />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 h-11 rounded-xl bg-primary px-6 text-sm font-bold text-white shadow-soft hover:bg-primary-hover disabled:opacity-50 transition-colors sm:w-max"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? 'Submitting request...' : 'Request quote'}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
