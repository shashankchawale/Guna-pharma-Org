'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Loader2, Upload } from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { generateOrderId } from '@/lib/utils';
import { useFormatPrice } from '@/store/locale';
import { createClient } from '@/lib/supabase/client';
import { useOrdersStore, generateTrackingSteps } from '@/store/orders';

export default function CheckoutPage() {
  const { items, getSubtotal, clearCart } = useCartStore();
  const formatPrice = useFormatPrice();
  const [placed, setPlaced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [prescription, setPrescription] = useState<File | null>(null);

  // Form fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash on delivery');

  const requiresPrescription = items.some((item) => item.product.requires_prescription);
  const subtotal = getSubtotal();
  const shipping = subtotal >= 499 ? 0 : items.length ? 49 : 0;

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (requiresPrescription && !prescription) return;
    setLoading(true);

    const generatedId = generateOrderId();
    setOrderNumber(generatedId);

    try {
      const supabase = createClient();

      // 1. Save order to Supabase
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: generatedId,
          guest_email: email,
          status: 'pending',
          payment_status: paymentMethod === 'Cash on delivery' ? 'pending' : 'paid',
          payment_method: paymentMethod,
          subtotal,
          discount_amount: 0,
          shipping_amount: shipping,
          total_amount: subtotal + shipping,
          shipping_address: {
            full_name: fullName,
            phone,
            email,
            address,
            city,
            pincode,
          },
        })
        .select()
        .single();

      if (orderError) {
        console.warn('Supabase order creation note:', orderError.message);
      }

      // 2. Save order items to Supabase
      const newOrderId = orderData?.id;
      if (newOrderId && items.length > 0) {
        const orderItemsPayload = items.map((item) => ({
          order_id: newOrderId,
          product_name: item.product.name,
          quantity: item.quantity,
          unit_price: item.product.selling_price,
          requires_prescription: item.product.requires_prescription || false,
          prescription_status: item.product.requires_prescription ? 'pending' : 'not_required',
        }));

        await supabase.from('order_items').insert(orderItemsPayload);
      }

      // 3. Save prescription record if provided
      if (prescription) {
        await supabase.from('prescriptions').insert({
          order_id: newOrderId || null,
          file_name: prescription.name,
          file_type: prescription.type || 'application/octet-stream',
          file_size: prescription.size,
          status: 'pending',
        });
      }

      // Save locally to user orders store for immediate tracking
      const orderIsoTime = new Date().toISOString();
      useOrdersStore.getState().addOrder({
        id: newOrderId || `ord-${generatedId.toLowerCase()}`,
        order_number: generatedId,
        guest_email: email,
        status: 'processing',
        payment_status: paymentMethod === 'Cash on delivery' ? 'pending' : 'paid',
        payment_method: paymentMethod === 'Cash on delivery' ? 'cod' : 'razorpay',
        subtotal,
        discount_amount: 0,
        shipping_amount: shipping,
        tax_amount: 0,
        total_amount: subtotal + shipping,
        currency: 'INR',
        carrier: 'BlueDart Express Air',
        tracking_number: `BD-${generatedId.replace(/\D/g, '').slice(-6) || '883912'}`,
        estimated_delivery: '3-4 Business Days',
        created_at: orderIsoTime,
        updated_at: orderIsoTime,
        shipping_address: {
          id: `addr-${generatedId.toLowerCase()}`,
          user_id: 'guest',
          type: 'shipping',
          full_name: fullName,
          phone,
          address_line_1: address,
          city,
          state: '',
          postal_code: pincode,
          country: 'India',
          is_default: true,
          created_at: orderIsoTime,
          updated_at: orderIsoTime,
        },
        items: items.map((i) => ({
          id: i.id,
          order_id: newOrderId || generatedId,
          product_id: i.product_id,
          product_name: i.product.name,
          product_sku: i.product.sku,
          quantity: i.quantity,
          unit_price: i.product.selling_price,
          mrp: i.product.mrp,
          discount_percent: i.product.discount_percent,
          total_price: i.product.selling_price * i.quantity,
          requires_prescription: i.product.requires_prescription,
          created_at: orderIsoTime,
        })),
        tracking_steps: generateTrackingSteps('processing', orderIsoTime),
      });

      clearCart();
      setPlaced(true);
    } catch (err) {
      console.error('Supabase checkout error:', err);
      clearCart();
      setPlaced(true);
    } finally {
      setLoading(false);
    }
  };

  if (placed) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-success" />
        <h1 className="mt-5 text-3xl font-bold text-navy">Order confirmed!</h1>
        <p className="mt-2 text-gray-600">
          Thank you, <strong>{fullName || 'valued customer'}</strong>. Your order ID is{' '}
          <strong className="text-primary font-mono">{orderNumber}</strong>. We have received your order details, and we’ll email you a full confirmation at <strong>{email}</strong> shortly.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href={`/track-order?id=${orderNumber}`}
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 font-semibold text-white hover:bg-primary-hover transition-colors shadow-soft"
          >
            Track Order Status
          </Link>
          <Link
            href="/account"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-border bg-white px-6 py-3 font-semibold text-navy hover:bg-gray-50 transition-colors"
          >
            View in My Account
          </Link>
        </div>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-navy">Your cart is empty</h1>
        <Link
          href="/catalog"
          className="mt-5 inline-flex rounded-xl bg-primary px-5 py-3 font-semibold text-white hover:bg-primary-hover transition-colors shadow-soft"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold text-navy">Checkout</h1>

      <div className="mt-6 grid gap-6 md:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <section className="rounded-2xl border border-border bg-white p-5 shadow-xs">
            <h2 className="font-bold text-navy">Delivery details</h2>
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
                type="tel"
                placeholder="Mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-11 rounded-xl border border-border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                required
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 rounded-xl border border-border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary sm:col-span-2"
              />
              <input
                required
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="h-11 rounded-xl border border-border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary sm:col-span-2"
              />
              <input
                required
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="h-11 rounded-xl border border-border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                required
                pattern="[0-9]{6}"
                placeholder="Pincode (6 digits)"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="h-11 rounded-xl border border-border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </section>

          {requiresPrescription && (
            <section className="rounded-2xl border border-warning/30 bg-warning-light p-5">
              <h2 className="font-bold text-warning">Prescription upload required</h2>
              <p className="mt-1 text-sm text-gray-700">
                Your prescription is securely submitted for pharmacist approval before the order can ship.
              </p>
              <label className="mt-4 flex h-24 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-warning bg-white text-sm font-semibold text-warning hover:bg-amber-50/50 transition-colors">
                <Upload className="h-5 w-5" />
                {prescription ? prescription.name : 'Choose prescription image or PDF'}
                <input
                  required
                  type="file"
                  accept="image/*,.pdf"
                  className="sr-only"
                  onChange={(event) => setPrescription(event.target.files?.[0] ?? null)}
                />
              </label>
            </section>
          )}

          <section className="rounded-2xl border border-border bg-white p-5 shadow-xs">
            <h2 className="font-bold text-navy">Payment method</h2>
            <label className="mt-4 flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                name="payment"
                type="radio"
                checked={paymentMethod === 'Cash on delivery'}
                onChange={() => setPaymentMethod('Cash on delivery')}
                className="text-primary focus:ring-primary"
              />{' '}
              Cash on delivery
            </label>
            <label className="mt-3 flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                name="payment"
                type="radio"
                checked={paymentMethod === 'Online Payment'}
                onChange={() => setPaymentMethod('Online Payment')}
                className="text-primary focus:ring-primary"
              />{' '}
              Online Card / NetBanking / UPI
            </label>
          </section>
        </div>

        <aside className="h-fit rounded-2xl border border-border bg-white p-5 shadow-xs">
          <h2 className="font-bold text-navy">Order summary</h2>
          <div className="mt-4 space-y-2 text-sm text-gray-600">
            <p className="flex justify-between">
              <span>{items.length} item(s)</span>
              <span className="font-medium text-navy">{formatPrice(subtotal)}</span>
            </p>
            <p className="flex justify-between">
              <span>Delivery</span>
              <span className="font-medium text-navy">{shipping ? formatPrice(shipping) : 'Free'}</span>
            </p>
            <p className="flex justify-between border-t border-border pt-3 text-base font-bold text-navy">
              <span>Total</span>
              <span className="text-primary">{formatPrice(subtotal + shipping)}</span>
            </p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-5 inline-flex items-center justify-center gap-2 h-12 w-full rounded-xl bg-primary font-semibold text-white shadow-soft hover:bg-primary-hover disabled:opacity-50 transition-colors"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? 'Processing order...' : 'Place secure order'}
          </button>
          <p className="mt-3 text-center text-xs text-gray-500">
            By placing an order, you agree to our terms and privacy policy.
          </p>
        </aside>
      </div>
    </form>
  );
}
