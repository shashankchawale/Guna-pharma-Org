'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ClipboardList,
  Clock,
  ExternalLink,
  MapPin,
  Package,
  Plus,
  RotateCcw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Truck,
  User,
  CheckCircle2,
  FileText,
  LogIn,
  LogOut,
} from 'lucide-react';
import { useOrdersStore, type DetailedOrder } from '@/store/orders';
import { useFormatPrice } from '@/store/locale';
import { useCartStore } from '@/store/cart';
import { useAuthStore } from '@/store/auth';
import { products } from '@/lib/catalog';

type Tab = 'orders' | 'addresses' | 'prescriptions' | 'profile';

export default function AccountPage() {
  const [activeTab, setActiveTab] = React.useState<Tab>('orders');
  const [statusFilter, setStatusFilter] = React.useState<'all' | 'active' | 'delivered'>('all');
  const [searchQuery, setSearchQuery] = React.useState('');

  const { orders, syncWithSupabase } = useOrdersStore();
  const formatPrice = useFormatPrice();
  const { addItem, openCart } = useCartStore();
  const { user, signOut, initAuth } = useAuthStore();

  React.useEffect(() => {
    initAuth();
    syncWithSupabase();
  }, [initAuth, syncWithSupabase]);

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    // Status filter
    if (statusFilter === 'active' && order.status === 'delivered') return false;
    if (statusFilter === 'delivered' && order.status !== 'delivered') return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNumber = order.order_number.toLowerCase().includes(q);
      const matchItem = (order.items || []).some((i) => i.product_name.toLowerCase().includes(q));
      return matchNumber || matchItem;
    }
    return true;
  });

  const handleReorder = (order: DetailedOrder) => {
    // Add items from this order to cart
    (order.items || []).forEach((item) => {
      const catalogProduct = products.find((p) => p.name.toLowerCase() === item.product_name.toLowerCase()) || products[0];
      addItem(catalogProduct);
    });
    openCart();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return { label: 'Delivered', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
      case 'shipped':
        return { label: 'In Transit', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
      case 'packed':
        return { label: 'Packed', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' };
      case 'processing':
        return { label: 'Pharmacist Review', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
      default:
        return { label: 'Confirmed', bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' };
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Account Profile Header */}
      <div className="mb-8 rounded-3xl border border-border bg-white p-6 shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-blue-50 text-2xl font-bold text-primary ring-2 ring-blue-100">
            {user ? '👤' : '🏥'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-navy">
                {user?.user_metadata?.full_name || (user ? 'Account' : 'My Account')}
              </h1>
              {user ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="h-3 w-3" />
                  Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600 border border-border">
                  Guest
                </span>
              )}
            </div>
            <p className="mt-0.5 text-sm text-gray-500">
              {user?.email || 'Signed in as Guest · Link your account for full access'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {user ? (
            <button
              type="button"
              onClick={() => signOut()}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50/50 px-4 py-2.5 text-sm font-semibold text-rose-700 hover:bg-rose-100 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          ) : (
            <Link
              href="/login"
              prefetch={true}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover shadow-soft transition-colors"
            >
              <LogIn className="h-4 w-4" />
              Sign In with Supabase
            </Link>
          )}

          <Link
            href="/track-order"
            prefetch={true}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 rounded-xl bg-primary-light px-4 py-2.5 text-sm font-semibold text-primary hover:bg-blue-100 transition-colors"
          >
            <Truck className="h-4 w-4" />
            Track Order
          </Link>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-6 flex overflow-x-auto no-scrollbar border-b border-border gap-2 sm:gap-6">
        {[
          { id: 'orders', label: 'Order History & Tracking', count: orders.length, icon: ClipboardList },
          { id: 'addresses', label: 'Saved Addresses', count: 1, icon: MapPin },
          { id: 'prescriptions', label: 'Prescriptions', count: 2, icon: FileText },
          { id: 'profile', label: 'Profile Settings', icon: User },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex items-center gap-2 whitespace-nowrap border-b-2 pb-3 text-sm font-semibold transition-colors ${
                isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-navy'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                    isActive ? 'bg-primary-light text-primary' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab: Order History */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Order Filters & Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Status pills */}
            <div className="flex items-center gap-2">
              {[
                { id: 'all', label: 'All Orders' },
                { id: 'active', label: 'In Progress' },
                { id: 'delivered', label: 'Delivered' },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setStatusFilter(pill.id as 'all' | 'active' | 'delivered')}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                    statusFilter === pill.id
                      ? 'bg-navy text-white shadow-xs'
                      : 'bg-white border border-border text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by order or product..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 rounded-xl border border-border pl-9 pr-3 text-xs text-navy focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-bold text-navy">No orders found</h3>
              <p className="mt-1 text-sm text-gray-500">
                You haven&apos;t placed any orders matching the current filter.
              </p>
              <Link
                href="/catalog"
                className="mt-5 inline-flex rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover transition-colors"
              >
                Browse Medicines & Wellness
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const badge = getStatusBadge(order.status);
                return (
                  <article
                    key={order.id}
                    className="rounded-3xl border border-border bg-white p-5 sm:p-6 shadow-soft transition-all hover:shadow-card"
                  >
                    {/* Order Top Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-base sm:text-lg font-bold text-navy">
                            {order.order_number}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold ${badge.bg} ${badge.text} ${badge.border}`}
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
                            {badge.label}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-gray-500">
                          Placed on{' '}
                          {new Date(order.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-gray-500 block">Total</span>
                        <span className="text-base sm:text-lg font-extrabold text-navy">
                          {formatPrice(order.total_amount)}
                        </span>
                      </div>
                    </div>

                    {/* Visual Progress Steps Preview */}
                    <div className="py-4 border-b border-border">
                      <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-2">
                        <span className="flex items-center gap-1.5 text-primary">
                          <Truck className="h-3.5 w-3.5" />
                          {order.carrier || 'BlueDart Express'} · {order.tracking_number}
                        </span>
                        <span>
                          {order.status === 'delivered'
                            ? 'Delivered'
                            : `Est. Delivery: ${order.estimated_delivery || '3-4 Days'}`}
                        </span>
                      </div>

                      {/* Step Progress Bar */}
                      <div className="grid grid-cols-4 gap-2 pt-1">
                        {[
                          { title: 'Confirmed', isDone: true },
                          { title: 'Pharmacist Review', isDone: order.status !== 'pending' },
                          { title: 'In Transit', isDone: order.status === 'shipped' || order.status === 'delivered' },
                          { title: 'Delivered', isDone: order.status === 'delivered' },
                        ].map((s, idx) => (
                          <div key={idx} className="flex flex-col gap-1">
                            <div
                              className={`h-2 rounded-full transition-all duration-500 ${
                                s.isDone ? 'bg-primary' : 'bg-gray-100'
                              }`}
                            />
                            <span
                              className={`text-[10px] truncate ${
                                s.isDone ? 'font-bold text-navy' : 'text-gray-400'
                              }`}
                            >
                              {s.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="py-4 divide-y divide-border/60">
                      {(order.items || []).map((item) => (
                        <div key={item.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-xl">
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

                    {/* Order Action Buttons */}
                    <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border">
                      <div className="text-xs text-gray-500">
                        Shipping to: <span className="font-semibold text-navy">{order.shipping_address?.full_name}</span> ({order.shipping_address?.city})
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleReorder(order)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-navy transition-colors"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          Reorder
                        </button>
                        <Link
                          href={`/track-order?id=${order.order_number}`}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-hover shadow-soft transition-colors"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          Live Tracking Details
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab: Saved Addresses */}
      {activeTab === 'addresses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-navy">Delivery Addresses</h2>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-xl border border-primary text-primary px-3.5 py-1.5 text-xs font-semibold hover:bg-primary-light transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Add New Address
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border-2 border-primary/30 bg-blue-50/20 p-5 relative">
              <span className="absolute top-4 right-4 rounded-full bg-primary-light text-primary px-2.5 py-0.5 text-[10px] font-bold">
                Default Address
              </span>
              <p className="font-bold text-navy text-base">Dr. Rahul Sharma</p>
              <p className="mt-1 text-xs text-gray-600">Flat 402, Sunshine Heights, Juhu Lane</p>
              <p className="text-xs text-gray-600">Mumbai, Maharashtra - 400049</p>
              <p className="text-xs text-gray-600">India</p>
              <p className="mt-3 text-xs font-medium text-gray-500">Phone: +91 98201 44521</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Prescriptions */}
      {activeTab === 'prescriptions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-navy">Uploaded Medical Prescriptions</h2>
            <Link
              href="/catalog"
              className="inline-flex items-center gap-1.5 rounded-xl border border-primary text-primary px-3.5 py-1.5 text-xs font-semibold hover:bg-primary-light transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Upload New Prescription
            </Link>
          </div>

          <div className="space-y-3">
            {[
              {
                id: 'rx-1',
                file: 'Dermatology_Prescription_Oct2026.pdf',
                date: 'Oct 21, 2026',
                status: 'Approved',
                doctor: 'Dr. Meera Iyer (Reg: MPC-48912)',
              },
              {
                id: 'rx-2',
                file: 'Dental_Clinic_Antibiotic_Rx.pdf',
                date: 'Oct 14, 2026',
                status: 'Approved',
                doctor: 'Dr. Amit Trivedi (Reg: DDC-19824)',
              },
            ].map((rx) => (
              <div
                key={rx.id}
                className="rounded-2xl border border-border bg-white p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-light text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-navy">{rx.file}</p>
                    <p className="text-xs text-gray-500">
                      Uploaded on {rx.date} · Verified by {rx.doctor}
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 text-xs font-bold border border-emerald-200">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {rx.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Profile */}
      {activeTab === 'profile' && (
        <div className="rounded-3xl border border-border bg-white p-6 shadow-soft space-y-5 max-w-2xl">
          <h2 className="text-lg font-bold text-navy">Personal Details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                defaultValue="Dr. Rahul Sharma"
                className="mt-1 h-11 w-full rounded-xl border border-border px-3 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Mobile Number</label>
              <input
                type="text"
                defaultValue="+91 98201 44521"
                className="mt-1 h-11 w-full rounded-xl border border-border px-3 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                defaultValue="gunapharma.customer@gmail.com"
                className="mt-1 h-11 w-full rounded-xl border border-border px-3 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <button
            type="button"
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover transition-colors"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
}
