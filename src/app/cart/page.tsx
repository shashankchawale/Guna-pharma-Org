'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ChevronRight,
  Loader2,
  Minus,
  Plus,
  Trash2,
  CheckCircle2,
  MessageCircle,
  Building2,
  CreditCard,
  Link as LinkIcon,
  Coins,
  Truck,
  Upload,
} from 'lucide-react';
import { useCartStore } from '@/store/cart';
import { useFormatPrice } from '@/store/locale';
import { generateOrderId } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { useOrdersStore, generateTrackingSteps } from '@/store/orders';
import { brandConfig } from '@/lib/config';

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, clearCart, getSubtotal } = useCartStore();
  const formatPrice = useFormatPrice();

  const [loading, setLoading] = React.useState(false);
  const [placed, setPlaced] = React.useState(false);
  const [orderNumber, setOrderNumber] = React.useState('');

  // Customer Details Form State
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [address1, setAddress1] = React.useState('');
  const [address2, setAddress2] = React.useState('');
  const [city, setCity] = React.useState('');
  const [zipCode, setZipCode] = React.useState('');
  const [stateProv, setStateProv] = React.useState('');
  const [country, setCountry] = React.useState('India');
  const [paymentMethod, setPaymentMethod] = React.useState('wise');
  const [notes, setNotes] = React.useState('');
  const [prescription, setPrescription] = React.useState<File | null>(null);
  const [formError, setFormError] = React.useState('');

  const subtotal = getSubtotal();
  const shippingFee = subtotal >= 499 ? 0 : items.length ? 49 : 0;
  const grandTotal = subtotal + shippingFee;
  const requiresPrescription = items.some((i) => i.product.requires_prescription);

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (requiresPrescription && !prescription) {
      setFormError('Please upload a valid prescription for prescription-only items in your cart.');
      return;
    }

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
          payment_status: 'pending',
          payment_method: paymentMethod,
          subtotal,
          discount_amount: 0,
          shipping_amount: shippingFee,
          total_amount: grandTotal,
          shipping_address: {
            full_name: fullName,
            phone,
            email,
            address: `${address1}${address2 ? ', ' + address2 : ''}`,
            city,
            state: stateProv,
            pincode: zipCode,
            country,
            notes,
          },
        })
        .select()
        .single();

      if (orderError) {
        console.warn('Supabase order save note:', orderError.message);
      }

      // 2. Save items
      const newOrderId = orderData?.id;
      if (newOrderId && items.length > 0) {
        const itemsPayload = items.map((item) => ({
          order_id: newOrderId,
          product_name: item.product.name,
          quantity: item.quantity,
          unit_price: item.product.selling_price,
          requires_prescription: item.product.requires_prescription || false,
        }));
        await supabase.from('order_items').insert(itemsPayload);
      }

      // 3. Add to local orders store for immediate tracking
      const orderIsoTime = new Date().toISOString();
      useOrdersStore.getState().addOrder({
        id: newOrderId || `ord-${generatedId.toLowerCase()}`,
        order_number: generatedId,
        guest_email: email,
        status: 'processing',
        payment_status: 'pending',
        payment_method: paymentMethod as import('@/types').PaymentMethod,
        subtotal,
        discount_amount: 0,
        shipping_amount: shippingFee,
        tax_amount: 0,
        total_amount: grandTotal,
        currency: 'INR',
        carrier: 'BlueDart Express Air',
        tracking_number: `BD-${generatedId.replace(/\D/g, '').slice(-6) || '982145'}`,
        estimated_delivery: '3-4 Business Days',
        created_at: orderIsoTime,
        updated_at: orderIsoTime,
        shipping_address: {
          id: `addr-${generatedId.toLowerCase()}`,
          user_id: 'guest',
          type: 'shipping',
          full_name: fullName,
          phone,
          address_line_1: address1,
          address_line_2: address2,
          city,
          state: stateProv,
          postal_code: zipCode,
          country,
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

      // Prepare WhatsApp order text
      const orderSummaryText = items
        .map((i) => `• ${i.product.name} (x${i.quantity}) - ${formatPrice(i.product.selling_price * i.quantity)}`)
        .join('\n');

      const waMessage = `*NEW GUNA PHARMA ORDER #${generatedId}*\n\n` +
        `*Customer:* ${fullName}\n` +
        `*Phone:* ${phone}\n` +
        `*Email:* ${email}\n` +
        `*Delivery Address:* ${address1}, ${city}, ${stateProv} ${zipCode}, ${country}\n\n` +
        `*Order Items:*\n${orderSummaryText}\n\n` +
        `*Subtotal:* ${formatPrice(subtotal)}\n` +
        `*Shipping:* ${shippingFee ? formatPrice(shippingFee) : 'FREE'}\n` +
        `*Total:* ${formatPrice(grandTotal)}\n` +
        `*Payment Method:* ${paymentMethod.toUpperCase()}\n` +
        (notes ? `*Notes:* ${notes}\n` : '');

      const waUrl = `https://wa.me/${brandConfig.contact.whatsapp}?text=${encodeURIComponent(waMessage)}`;

      clearCart();
      setPlaced(true);

      // Open WhatsApp in new tab
      window.open(waUrl, '_blank');
    } catch (err) {
      console.error('Order checkout error:', err);
      clearCart();
      setPlaced(true);
    } finally {
      setLoading(false);
    }
  };

  if (placed) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="h-12 w-12" />
        </div>
        <h1 className="mt-6 text-3xl font-extrabold text-navy">Order Placed Successfully!</h1>
        <p className="mt-2 text-base text-gray-600">
          Thank you, <strong className="text-navy">{fullName || 'valued customer'}</strong>. Your order ID is{' '}
          <span className="font-mono font-bold text-primary">{orderNumber}</span>.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          We have directed your order details to WhatsApp and recorded it in our system. You can track your shipment anytime.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href={`/track-order?id=${orderNumber}`}
            className="rounded-xl bg-primary px-6 py-3 font-semibold text-white shadow-soft hover:bg-primary-hover transition-colors"
          >
            Track Order Status
          </Link>
          <Link
            href="/catalog"
            className="rounded-xl border border-border bg-white px-6 py-3 font-semibold text-navy hover:bg-gray-50 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-1.5 text-xs text-gray-500">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-semibold text-navy">My Cart</span>
      </nav>

      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-navy tracking-tight">My Cart</h1>
        <p className="mt-1 text-sm text-gray-500">Review your items and complete your order.</p>
      </div>

      {!items.length ? (
        <div className="rounded-3xl border border-dashed border-border bg-white p-12 text-center shadow-xs">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-blue-50 text-2xl text-primary mb-4">
            🛒
          </div>
          <h2 className="text-xl font-bold text-navy">Your cart is empty</h2>
          <p className="mt-1 text-sm text-gray-500">Browse our quality medicines, skincare, and wellness products.</p>
          <Link
            href="/catalog"
            className="mt-6 inline-flex rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-soft hover:bg-primary-hover transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <form onSubmit={handleOrderSubmit} className="space-y-8">
          {/* Section 1: Cart Items */}
          <div className="rounded-3xl border border-border/80 bg-white p-6 shadow-soft">
            <h2 className="text-base font-bold text-navy mb-4">Cart Items ({items.length})</h2>

            <div className="divide-y divide-border/60">
              {items.map((item) => {
                const imgUrl = item.product.thumbnail_url || item.product.images?.[0];
                return (
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-white border border-border/80 shadow-xs">
                        {imgUrl ? (
                          <Image
                            src={imgUrl}
                            alt={item.product.name}
                            fill
                            sizes="64px"
                            className="object-contain p-1.5"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="grid h-full w-full place-items-center bg-slate-50 text-2xl">
                            {item.product.category_id === 'skincare' ? '🧴' : item.product.category_id === 'vitamins' ? '💊' : '🌿'}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-navy text-sm sm:text-base leading-snug line-clamp-2">
                        {item.product.name}
                      </h3>
                      <div className="mt-1 flex items-center gap-2 text-xs text-emerald-600 font-semibold">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <span>In Stock</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
                    <span className="font-extrabold text-navy text-base">
                      {formatPrice(item.product.selling_price * item.quantity)}
                    </span>

                    {/* Quantity controls */}
                    <div className="flex items-center rounded-xl border border-border bg-slate-50/80 p-0.5">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                        className="grid h-8 w-8 place-items-center rounded-lg text-gray-600 hover:bg-white transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-navy">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                        className="grid h-8 w-8 place-items-center rounded-lg text-gray-600 hover:bg-white transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => removeItem(item.product_id)}
                      className="text-gray-400 hover:text-rose-600 transition-colors p-1"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
            </div>
          </div>

          {/* Section 2: Order Summary Card */}
          <div className="rounded-3xl border border-border/80 bg-white p-6 shadow-soft">
            <h2 className="text-base font-bold text-navy mb-4">Order Summary</h2>

            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-navy">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <span>Shipping</span>
                  <p className="text-[11px] text-gray-400">Shipping starts at {formatPrice(49)} (Free over {formatPrice(499)})</p>
                </div>
                <span className="font-bold text-navy">{shippingFee ? formatPrice(shippingFee) : 'Free'}</span>
              </div>

              <div className="border-t border-border/80 pt-3 flex justify-between items-center text-base">
                <span className="font-extrabold text-navy">Total</span>
                <span className="font-extrabold text-[#005AD2] text-xl">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 text-center border-t border-border/40">
              <button
                type="button"
                onClick={clearCart}
                className="text-xs font-medium text-gray-400 hover:text-rose-600 transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Section 3: Customer Details Form */}
          <div className="rounded-3xl border border-border/80 bg-white p-6 sm:p-8 shadow-soft">
            <h2 className="text-lg font-extrabold text-navy mb-5">Customer Details</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-11 rounded-xl border border-border px-4 text-sm text-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 rounded-xl border border-border px-4 text-sm text-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-11 rounded-xl border border-border px-4 text-sm text-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Address Line 1 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Address Line 1"
                  value={address1}
                  onChange={(e) => setAddress1(e.target.value)}
                  className="w-full h-11 rounded-xl border border-border px-4 text-sm text-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Address Line 2 (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Address Line 2 (Optional)"
                  value={address2}
                  onChange={(e) => setAddress2(e.target.value)}
                  className="w-full h-11 rounded-xl border border-border px-4 text-sm text-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    City <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full h-11 rounded-xl border border-border px-4 text-sm text-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    ZIP Code <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ZIP Code"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="w-full h-11 rounded-xl border border-border px-4 text-sm text-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    State / Province <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="State / Province"
                    value={stateProv}
                    onChange={(e) => setStateProv(e.target.value)}
                    className="w-full h-11 rounded-xl border border-border px-4 text-sm text-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Country <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full h-11 rounded-xl border border-border px-4 text-sm text-navy bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="Singapore">Singapore</option>
                    <option value="Germany">Germany</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Optional Prescription Upload */}
            {requiresPrescription && (
              <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
                <h3 className="text-xs font-extrabold uppercase text-amber-900 tracking-wider">
                  Prescription Upload Required
                </h3>
                <p className="mt-1 text-xs text-amber-800 leading-relaxed">
                  Your cart contains prescription items. Please upload a doctor&apos;s prescription for pharmacist review.
                </p>
                <label className="mt-3 flex h-20 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-amber-300 bg-white text-xs font-bold text-amber-800 hover:bg-amber-100/50 transition-colors">
                  <Upload className="h-4 w-4" />
                  {prescription ? prescription.name : 'Choose Prescription Image or PDF'}
                  <input
                    type="file"
                    required
                    accept="image/*,.pdf"
                    className="sr-only"
                    onChange={(e) => setPrescription(e.target.files?.[0] || null)}
                  />
                </label>
              </div>
            )}

            {/* Section 4: Payment Method */}
            <div className="mt-8">
              <h2 className="text-base font-extrabold text-navy mb-4">Payment Method</h2>

              <div className="space-y-3">
                {[
                  {
                    id: 'wise',
                    title: 'Bank Transfer (Wise)',
                    desc: 'Transfer directly to our account using the Wise app.',
                    icon: Building2,
                  },
                  {
                    id: 'ach',
                    title: 'Local ACH Transfer',
                    desc: 'Transfer directly to our account using local ACH.',
                    icon: CreditCard,
                  },
                  {
                    id: 'link',
                    title: 'Secure Payment Link',
                    desc: "Pay securely using a payment link we'll send you.",
                    icon: LinkIcon,
                  },
                  {
                    id: 'btc',
                    title: 'Bitcoin',
                    desc: 'Pay with Bitcoin (BTC).',
                    icon: Coins,
                  },
                  {
                    id: 'cod',
                    title: 'Cash on Delivery',
                    desc: 'Pay in cash upon physical doorstep delivery.',
                    icon: Truck,
                  },
                ].map((pm) => {
                  const Icon = pm.icon;
                  const isSelected = paymentMethod === pm.id;
                  return (
                    <label
                      key={pm.id}
                      onClick={() => setPaymentMethod(pm.id)}
                      className={`flex items-start gap-3 rounded-2xl border p-4 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-primary bg-blue-50/50 ring-1 ring-primary/30 shadow-xs'
                          : 'border-border bg-white hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment_method"
                        checked={isSelected}
                        onChange={() => setPaymentMethod(pm.id)}
                        className="mt-1 h-4 w-4 text-primary focus:ring-primary"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-primary" />
                          <span className="text-sm font-bold text-navy">{pm.title}</span>
                        </div>
                        <p className="mt-0.5 text-xs text-gray-500">{pm.desc}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Section 5: Additional Notes */}
            <div className="mt-6">
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Additional Notes (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Special delivery instructions or order notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-xl border border-border p-3 text-sm text-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Section 6: Shipping Summary & Full WhatsApp Order Button */}
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm font-semibold text-gray-700 px-2">
              <span>Shipping</span>
              <span className="font-extrabold text-navy">{shippingFee ? formatPrice(shippingFee) : 'Free'}</span>
            </div>
            <p className="text-xs text-gray-400 px-2 leading-relaxed">
              Shipping is an estimate — the final cost can vary based on order quantity and delivery address.
            </p>

            {formError && (
              <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-bold text-rose-700">
                {formError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-2xl bg-[#25D366] text-white font-extrabold text-base shadow-lg hover:bg-[#20bd5c] transition-all flex items-center justify-center gap-2.5 disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Processing Order...</span>
                </>
              ) : (
                <>
                  <MessageCircle className="h-6 w-6 fill-current" />
                  <span>Order via WhatsApp</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
