'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  ExternalLink,
  Package,
  Search,
  ShieldCheck,
  Truck,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';
import { useOrdersStore, type DetailedOrder } from '@/store/orders';
import { useFormatPrice } from '@/store/locale';

function OrderTrackerContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get('id') || '';
  const [searchId, setSearchId] = React.useState(initialId);
  const [activeQuery, setActiveQuery] = React.useState(initialId);
  const [copied, setCopied] = React.useState(false);

  const { orders, findOrderByNumber, syncWithSupabase } = useOrdersStore();
  const formatPrice = useFormatPrice();

  React.useEffect(() => {
    syncWithSupabase();
  }, [syncWithSupabase]);

  // Derived order without triggering cascading renders
  const currentOrder = React.useMemo<DetailedOrder | null>(() => {
    const query = (activeQuery || initialId).trim();
    if (query) {
      const match = findOrderByNumber(query);
      if (match) return match;
      const found = orders.find((o) => o.order_number.toLowerCase().includes(query.toLowerCase()));
      return found || null;
    }
    return orders.length > 0 ? orders[0] : null;
  }, [activeQuery, initialId, orders, findOrderByNumber]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    setActiveQuery(searchId.trim());
  };

  const copyTracking = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return { label: 'Delivered', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'shipped':
        return { label: 'In Transit', color: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'packed':
        return { label: 'Packed & Dispatched', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      case 'processing':
        return { label: 'Pharmacist Review', color: 'bg-amber-50 text-amber-700 border-amber-200' };
      default:
        return { label: 'Order Confirmed', color: 'bg-sky-50 text-sky-700 border-sky-200' };
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/account"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-navy transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Account
        </Link>
        <span className="text-xs font-semibold text-primary uppercase tracking-wider">
          Live Shipment Status
        </span>
      </div>

      <div className="mb-8 rounded-3xl border border-border bg-white p-6 shadow-card">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy">Track Your Order</h1>
        <p className="mt-1.5 text-sm text-gray-600">
          Enter your GUNA PHARMA order ID to view real-time delivery status, courier airway bill, and pharmacist verification.
        </p>

        <form onSubmit={handleSearch} className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="e.g. GP-849201 or order number"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="w-full h-12 rounded-xl border border-border pl-11 pr-4 text-sm text-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary uppercase tracking-wider font-medium"
            />
          </div>
          <button
            type="submit"
            className="h-12 rounded-xl bg-primary px-8 text-sm font-semibold text-white shadow-soft hover:bg-primary-hover transition-colors"
          >
            Track Status
          </button>
        </form>

        {/* Quick Sample Links */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-500">
          <span>Quick check:</span>
          {orders.slice(0, 3).map((o) => (
            <button
              key={o.order_number}
              type="button"
              onClick={() => {
                setSearchId(o.order_number);
                setActiveQuery(o.order_number);
              }}
              className="rounded-lg bg-gray-100 hover:bg-primary-light hover:text-primary px-2.5 py-1 font-mono transition-colors"
            >
              {o.order_number} ({o.status})
            </button>
          ))}
        </div>
      </div>

      {currentOrder ? (
        <div className="space-y-6">
          {/* Order Header Card */}
          <div className="rounded-3xl border border-border bg-white p-6 shadow-soft">
            <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-border">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl sm:text-2xl font-bold text-navy font-mono">
                    {currentOrder.order_number}
                  </h2>
                  {(() => {
                    const badge = getStatusBadge(currentOrder.status);
                    return (
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${badge.color}`}
                      >
                        <span className="h-2 w-2 rounded-full bg-current animate-pulse" />
                        {badge.label}
                      </span>
                    );
                  })()}
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Placed on {new Date(currentOrder.created_at).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs text-gray-500 block">Total Amount</span>
                <span className="text-xl font-extrabold text-navy">
                  {formatPrice(currentOrder.total_amount)}
                </span>
              </div>
            </div>

            {/* Courier & ETA Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              <div className="rounded-2xl bg-slate-50 p-4 border border-border/60">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <Clock className="h-4 w-4 text-primary" />
                  Estimated Delivery
                </div>
                <p className="mt-1.5 text-sm font-bold text-navy">
                  {currentOrder.status === 'delivered' ? 'Delivered' : currentOrder.estimated_delivery || '3-4 Business Days'}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 border border-border/60">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <Truck className="h-4 w-4 text-primary" />
                  Carrier Partner
                </div>
                <p className="mt-1.5 text-sm font-bold text-navy">
                  {currentOrder.carrier || 'BlueDart Express Air'}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 border border-border/60">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <Package className="h-4 w-4 text-primary" />
                  Tracking AWB
                </div>
                <div className="mt-1.5 flex items-center justify-between">
                  <span className="text-sm font-mono font-bold text-navy">
                    {currentOrder.tracking_number || 'BD-77821034'}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyTracking(currentOrder.tracking_number || 'BD-77821034')}
                    className="p-1 rounded text-gray-400 hover:text-primary transition-colors"
                    title="Copy Tracking Number"
                  >
                    {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Tracking Milestones Timeline */}
          <div className="rounded-3xl border border-border bg-white p-6 shadow-soft">
            <h3 className="text-lg font-bold text-navy mb-6">Delivery Progress</h3>

            <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-gray-200">
              {(currentOrder.tracking_steps || []).map((step, idx) => (
                <div key={idx} className="relative flex items-start gap-4">
                  {/* Step Icon Indicator */}
                  <div
                    className={`absolute -left-6 sm:-left-8 flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full ring-4 ring-white ${
                      step.completed
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : step.current
                        ? 'bg-primary text-white shadow-md animate-bounce'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {step.completed ? (
                      <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 stroke-[3]" />
                    ) : (
                      <span className="h-2 w-2 rounded-full bg-white" />
                    )}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h4
                        className={`text-sm sm:text-base font-bold ${
                          step.completed || step.current ? 'text-navy' : 'text-gray-400'
                        }`}
                      >
                        {step.title}
                      </h4>
                      <span className="text-xs text-gray-500 font-medium">{step.timestamp}</span>
                    </div>
                    <p className="mt-1 text-xs sm:text-sm text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Items & Shipping Address Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Items Ordered */}
            <div className="rounded-3xl border border-border bg-white p-6 shadow-soft">
              <h3 className="text-lg font-bold text-navy mb-4">Items Ordered</h3>
              <div className="divide-y divide-border/60">
                {(currentOrder.items || []).map((item) => (
                  <div key={item.id} className="py-3.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-blue-50 text-xl">
                        🧴
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-navy line-clamp-1">
                          {item.product_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity} · {formatPrice(item.unit_price)} each
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-navy shrink-0">
                      {formatPrice(item.unit_price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address & Pharmacist Stamp */}
            <div className="space-y-6">
              <div className="rounded-3xl border border-border bg-white p-6 shadow-soft">
                <h3 className="text-lg font-bold text-navy mb-3">Delivery Address</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p className="font-bold text-navy">{currentOrder.shipping_address?.full_name}</p>
                  <p>{currentOrder.shipping_address?.address_line_1}</p>
                  <p>
                    {currentOrder.shipping_address?.city}, {currentOrder.shipping_address?.postal_code}
                  </p>
                  <p>{currentOrder.shipping_address?.country || 'India'}</p>
                  <p className="pt-2 text-xs text-gray-500">
                    Phone: {currentOrder.shipping_address?.phone}
                  </p>
                </div>
              </div>

              {/* Quality & Pharmacist Verification Seal */}
              <div className="rounded-3xl border border-blue-100 bg-blue-50/60 p-5 flex items-center gap-4">
                <ShieldCheck className="h-10 w-10 text-primary shrink-0" />
                <div className="text-xs text-gray-700">
                  <p className="font-bold text-navy">Quality & Clinical Verification</p>
                  <p className="mt-0.5 leading-relaxed">
                    This order is verified by a registered pharmacist under strict GDP & pharmaceutical packaging guidelines.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : activeQuery ? (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-amber-500" />
          <h2 className="mt-4 text-xl font-bold text-navy">No order found with ID &quot;{searchId}&quot;</h2>
          <p className="mt-2 text-sm text-gray-600 max-w-md mx-auto">
            Please check your order confirmation email or SMS for the correct order number (e.g. GP-849201).
          </p>
          <button
            type="button"
            onClick={() => {
              if (orders.length > 0) {
                setSearchId(orders[0].order_number);
                setActiveQuery(orders[0].order_number);
              }
            }}
            className="mt-6 inline-flex rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover transition-colors"
          >
            View Sample Order GP-849201
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <React.Suspense
      fallback={
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <p className="text-gray-500">Loading order tracker...</p>
        </div>
      }
    >
      <OrderTrackerContent />
    </React.Suspense>
  );
}
