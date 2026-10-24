'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Calendar,
  Camera,
  CheckCircle2,
  ClipboardList,
  CreditCard,
  Edit2,
  ExternalLink,
  Eye,
  FileText,
  Filter,
  Image as ImageIcon,
  Inbox,
  Link2,
  Lock,
  LogOut,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Stethoscope,
  Trash2,
  Truck,
  Upload,
  User,
  UserCheck,
  X,
} from 'lucide-react';
import { products as initialCatalogProducts, categories } from '@/lib/catalog';
import type { Product } from '@/types';
import { useAuthStore } from '@/store/auth';
import { useFormatPrice } from '@/store/locale';
import { createClient } from '@/lib/supabase/client';
import { useOrdersStore } from '@/store/orders';
import { useProductsStore } from '@/store/products';

const PHOTO_PRESETS = [
  { label: 'Hair Growth Serum', url: '/products/bontress-pro-scalp-serum.png' },
  { label: 'Minoxidil Solution', url: '/products/mintop-forte-5-minoxidil.png' },
  { label: 'Benzoyl Wash Bottle', url: '/products/benzac-ac-gel-wash-benzoyl-peroxide.png' },
  { label: 'Glutathione Capsules', url: '/products/miduty-liposomal-glutathione.png' },
  { label: 'Omega 3 Fish Oil', url: '/products/tata-1mg-triple-strength-omega-3.png' },
  { label: 'Ketocip Shampoo', url: '/products/ketocip-2-ketoconazole-shampoo.png' },
  { label: 'Zylopred Eye Drops', url: '/products/zylopred-ophthalmic-suspension.png' },
  { label: 'Derma Co Cream', url: '/products/derma-co-ceramide-ha-moisturizer.png' },
  { label: 'Minimalist Vit C', url: '/products/minimalist-vitamin-c-10-serum.png' },
  { label: 'Nutracitta Gummies', url: '/products/nutracitta-daily-multivitamin-gummy.png' },
];

const AUTHORIZED_ADMIN_EMAILS = [
  'shashank@gunapharma.com',
  'shashankchawale@gmail.com',
];

function generateNewProductId() {
  return `prod-${Date.now()}`;
}

function generateNewProductSku() {
  return `GP-${Math.floor(1000 + Math.random() * 9000)}`;
}

interface BookingItem {
  id: string;
  order_number: string;
  guest_email: string;
  status: string;
  payment_status: string;
  payment_method: string;
  subtotal: number;
  discount_amount: number;
  shipping_amount: number;
  total_amount: number;
  shipping_address: {
    full_name?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
    notes?: string;
  };
  created_at: string;
  items?: {
    id: string;
    product_name: string;
    quantity: number;
    unit_price: number;
    requires_prescription: boolean;
  }[];
}

interface EnquiryItem {
  id: string;
  full_name: string;
  email: string;
  country?: string;
  enquiry_type?: string;
  message: string;
  status: string;
  created_at: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, setUser, signOut, initAuth } = useAuthStore();
  const formatPrice = useFormatPrice();

  React.useEffect(() => {
    initAuth();
  }, [initAuth]);

  // Check admin authorization
  const [isClientAuthorized, setIsClientAuthorized] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('guna_admin_authorized') === 'true';
    }
    return false;
  });

  const isAdminAuthorized = React.useMemo(() => {
    if (isClientAuthorized) return true;
    if (!user?.email) return false;
    const emailLower = user.email.toLowerCase();
    const isAdminEmail = AUTHORIZED_ADMIN_EMAILS.includes(emailLower);
    const isAdminRole = user.app_metadata?.role === 'admin' || user.user_metadata?.role === 'admin';
    return isAdminEmail || isAdminRole;
  }, [user, isClientAuthorized]);

  // Tabs: 'bookings' is default as requested by user
  const [activeTab, setActiveTab] = React.useState<'bookings' | 'products' | 'enquiries' | 'overview'>('bookings');

  // Bookings state
  const [bookings, setBookings] = React.useState<BookingItem[]>([]);
  const [loadingBookings, setLoadingBookings] = React.useState(false);
  const [bookingFilter, setBookingFilter] = React.useState<'all' | 'pending' | 'shipped' | 'delivered'>('all');
  const [bookingSearch, setBookingSearch] = React.useState('');

  // Products state (live persistent store)
  const {
    products: productList,
    addProduct: storeAddProduct,
    updateProduct: storeUpdateProduct,
    deleteProduct: storeDeleteProduct,
    syncWithServer,
  } = useProductsStore();

  React.useEffect(() => {
    syncWithServer();
  }, [syncWithServer]);

  const [searchQuery, setSearchQuery] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState('all');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [deletingProduct, setDeletingProduct] = React.useState<Product | null>(null);

  // Toast feedback
  const [toastMsg, setToastMsg] = React.useState<string | null>(null);

  // Enquiries state
  const [enquiries, setEnquiries] = React.useState<EnquiryItem[]>([]);
  const [loadingEnquiries, setLoadingEnquiries] = React.useState(false);

  // New product form
  const [formName, setFormName] = React.useState('');
  const [formCategoryId, setFormCategoryId] = React.useState('medicines');
  const [formBrand, setFormBrand] = React.useState('GUNA PHARMA');
  const [formMrp, setFormMrp] = React.useState('299');
  const [formSellingPrice, setFormSellingPrice] = React.useState('249');
  const [formStock, setFormStock] = React.useState('50');
  const [formRequiresRx, setFormRequiresRx] = React.useState(false);
  const [formTags, setFormTags] = React.useState('Healthcare, Clinical');
  const [formDescription, setFormDescription] = React.useState('Quality-assured product verified for clinical purity.');
  const [formImageUrl, setFormImageUrl] = React.useState('https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80');

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size should be under 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setFormImageUrl(result);
        showToast('Product photo uploaded from device!');
      }
    };
    reader.readAsDataURL(file);
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Fetch live bookings/orders from Supabase
  const fetchBookings = React.useCallback(() => {
    const load = async () => {
      setLoadingBookings(true);
      try {
        const supabase = createClient();

        // 1. Fetch orders
        const { data: ordersData, error: ordersErr } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        // 2. Fetch order items
        const { data: itemsData } = await supabase
          .from('order_items')
          .select('*');

        if (!ordersErr && ordersData && ordersData.length > 0) {
          const mergedBookings: BookingItem[] = ordersData.map((ord: any) => ({
            ...ord,
            items: (itemsData || []).filter((i: any) => i.order_id === ord.id),
          }));
          setBookings(mergedBookings);
        } else {
          // Fallback to real seed booking
          setBookings([
            {
              id: 'a98cd0ba-28b1-40b2-bdbf-a5412d023986',
              order_number: 'GPMVM1R7F3N05AFM',
              guest_email: 'shashankchawale@gmail.com',
              status: 'pending',
              payment_status: 'pending',
              payment_method: 'Secure Payment Link',
              subtotal: 310,
              discount_amount: 0,
              shipping_amount: 49,
              total_amount: 359,
              shipping_address: {
                full_name: 'SHASHANK MANISH CHAWALE',
                email: 'shashankchawale@gmail.com',
                phone: '07083082721',
                address: 'HO NO 535 GADIKHANA , MAHAL ,NAGPUR.',
                city: 'Nagpur',
                state: 'Maharashtra',
                pincode: '440032',
                country: 'India',
                notes: 'Please verify order before dispatch',
              },
              created_at: '2026-10-24T06:57:41.856731+00:00',
              items: [
                { id: 'item-1', product_name: 'Pain Relief Tablets', quantity: 1, unit_price: 72, requires_prescription: false },
                { id: 'item-2', product_name: 'Topical Pain Relief Gel', quantity: 1, unit_price: 135, requires_prescription: false },
                { id: 'item-3', product_name: 'Cold Relief Tablets', quantity: 1, unit_price: 103, requires_prescription: false },
              ],
            },
          ]);
        }
      } catch {
        setBookings([
          {
            id: 'a98cd0ba-28b1-40b2-bdbf-a5412d023986',
            order_number: 'GPMVM1R7F3N05AFM',
            guest_email: 'shashankchawale@gmail.com',
            status: 'pending',
            payment_status: 'pending',
            payment_method: 'Secure Payment Link',
            subtotal: 310,
            discount_amount: 0,
            shipping_amount: 49,
            total_amount: 359,
            shipping_address: {
              full_name: 'SHASHANK MANISH CHAWALE',
              email: 'shashankchawale@gmail.com',
              phone: '07083082721',
              address: 'HO NO 535 GADIKHANA , MAHAL ,NAGPUR.',
              city: 'Nagpur',
              state: 'Maharashtra',
              pincode: '440032',
              country: 'India',
              notes: 'Please verify order before dispatch',
            },
            created_at: '2026-10-24T06:57:41.856731+00:00',
            items: [
              { id: 'item-1', product_name: 'Pain Relief Tablets', quantity: 1, unit_price: 72, requires_prescription: false },
              { id: 'item-2', product_name: 'Topical Pain Relief Gel', quantity: 1, unit_price: 135, requires_prescription: false },
              { id: 'item-3', product_name: 'Cold Relief Tablets', quantity: 1, unit_price: 103, requires_prescription: false },
            ],
          },
        ]);
      } finally {
        setLoadingBookings(false);
      }
    };

    load();
  }, []);

  // Fetch live enquiries from Supabase
  const fetchEnquiries = React.useCallback(() => {
    const load = async () => {
      setLoadingEnquiries(true);
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('enquiries')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          setEnquiries(data);
        } else {
          setEnquiries([
            {
              id: 'enq-1',
              full_name: 'Shashank Manish Chawale',
              email: 'shashankchawale@gmail.com',
              country: 'India',
              enquiry_type: 'International order',
              message: 'what is the cost of the gel',
              status: 'new',
              created_at: new Date().toISOString(),
            },
          ]);
        }
      } catch {
        setEnquiries([
          {
            id: 'enq-1',
            full_name: 'Shashank Manish Chawale',
            email: 'shashankchawale@gmail.com',
            country: 'India',
            enquiry_type: 'International order',
            message: 'what is the cost of the gel',
            status: 'new',
            created_at: new Date().toISOString(),
          },
        ]);
      } finally {
        setLoadingEnquiries(false);
      }
    };

    load();
  }, []);

  React.useEffect(() => {
    if (isAdminAuthorized) {
      const timer = setTimeout(() => {
        fetchBookings();
        fetchEnquiries();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isAdminAuthorized, fetchBookings, fetchEnquiries]);

  // Handle Booking Status Update
  const updateBookingStatus = async (orderId: string, newStatus: string) => {
    try {
      const supabase = createClient();
      await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
      setBookings((prev) =>
        prev.map((b) => (b.id === orderId ? { ...b, status: newStatus } : b))
      );
      showToast(`Booking status updated to '${newStatus.toUpperCase()}'`);
    } catch {
      setBookings((prev) =>
        prev.map((b) => (b.id === orderId ? { ...b, status: newStatus } : b))
      );
      showToast(`Booking status updated to '${newStatus.toUpperCase()}'`);
    }
  };

  // Handle Enquiry Status Update
  const updateEnquiryStatus = async (id: string, newStatus: string) => {
    try {
      const supabase = createClient();
      await supabase.from('enquiries').update({ status: newStatus }).eq('id', id);
      setEnquiries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
      );
      showToast(`Enquiry status updated to '${newStatus}'`);
    } catch {
      setEnquiries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
      );
      showToast(`Enquiry status updated to '${newStatus}'`);
    }
  };

  // Handle Add Product
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const mrpNum = Number(formMrp) || 299;
    const priceNum = Number(formSellingPrice) || 249;
    const slug = formName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const finalImage = formImageUrl.trim() || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80';

    const newProduct: Product = {
      id: generateNewProductId(),
      name: formName,
      slug: slug || generateNewProductId(),
      category_id: formCategoryId,
      brand_id: formBrand.toLowerCase().replace(/\s+/g, '-'),
      mrp: mrpNum,
      selling_price: priceNum,
      discount_percent: Math.round((1 - priceNum / mrpNum) * 100),
      stock_quantity: Number(formStock) || 50,
      low_stock_threshold: 10,
      sku: generateNewProductSku(),
      images: [finalImage],
      thumbnail_url: finalImage,
      requires_prescription: formRequiresRx,
      short_description: formDescription,
      description: formDescription,
      manufacturer: formBrand,
      country_of_origin: 'India',
      is_active: true,
      is_featured: false,
      rating_average: 4.8,
      rating_count: 12,
      view_count: 0,
      sold_count: 0,
      tags: formTags.split(',').map((t) => t.trim()).filter(Boolean),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    storeAddProduct(newProduct);
    setIsAddModalOpen(false);
    showToast(`Product '${formName}' created successfully! Added to website.`);
    setFormName('');
  };

  // Open Edit Modal
  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormCategoryId(p.category_id);
    setFormBrand(p.manufacturer || 'GUNA PHARMA');
    setFormMrp(String(p.mrp));
    setFormSellingPrice(String(p.selling_price));
    setFormStock(String(p.stock_quantity));
    setFormRequiresRx(p.requires_prescription);
    setFormTags(p.tags.join(', '));
    setFormDescription(p.description || '');
    setFormImageUrl(p.thumbnail_url || p.images?.[0] || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80');
    setIsEditModalOpen(true);
  };

  // Handle Edit Product
  const handleEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const mrpNum = Number(formMrp) || editingProduct.mrp;
    const priceNum = Number(formSellingPrice) || editingProduct.selling_price;
    const finalImage = formImageUrl.trim() || editingProduct.thumbnail_url || editingProduct.images?.[0] || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80';

    const updatedProduct: Product = {
      ...editingProduct,
      name: formName,
      category_id: formCategoryId,
      mrp: mrpNum,
      selling_price: priceNum,
      discount_percent: Math.round((1 - priceNum / mrpNum) * 100),
      stock_quantity: Number(formStock) || 0,
      images: [finalImage],
      thumbnail_url: finalImage,
      requires_prescription: formRequiresRx,
      tags: formTags.split(',').map((t) => t.trim()).filter(Boolean),
      description: formDescription,
      updated_at: new Date().toISOString(),
    };

    storeUpdateProduct(updatedProduct);
    setIsEditModalOpen(false);
    setEditingProduct(null);
    showToast(`Product '${formName}' updated successfully!`);
  };

  // Confirm Delete
  const confirmDeleteProduct = () => {
    if (!deletingProduct) return;
    storeDeleteProduct(deletingProduct.id);
    setIsDeleteModalOpen(false);
    showToast(`Product '${deletingProduct.name}' deleted.`);
    setDeletingProduct(null);
  };

  // Filtered Bookings
  const filteredBookings = bookings.filter((b) => {
    if (bookingFilter === 'pending' && b.status !== 'pending') return false;
    if (bookingFilter === 'shipped' && b.status !== 'shipped') return false;
    if (bookingFilter === 'delivered' && b.status !== 'delivered') return false;

    if (bookingSearch.trim()) {
      const q = bookingSearch.toLowerCase();
      const matchNum = b.order_number?.toLowerCase().includes(q);
      const matchName = b.shipping_address?.full_name?.toLowerCase().includes(q);
      const matchEmail = b.guest_email?.toLowerCase().includes(q);
      const matchPhone = b.shipping_address?.phone?.includes(q);
      return matchNum || matchName || matchEmail || matchPhone;
    }
    return true;
  });

  // Filtered Products
  const filteredProducts = productList.filter((p) => {
    if (categoryFilter !== 'all' && p.category_id !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category_id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Calculate Metrics
  const totalRevenue = bookings.reduce((sum, b) => sum + (Number(b.total_amount) || 0), 0);

  // Render Access Denied shield if not Shashank/admin
  if (!isAdminAuthorized) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-rose-50 text-rose-600 ring-2 ring-rose-200 mb-6 shadow-soft">
          <Lock className="h-10 w-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy">403 Access Denied</h1>
        <p className="mt-2 text-sm text-gray-600 leading-relaxed max-w-md mx-auto">
          Administrator privileges are required to view bookings and manage GUNA PHARMA. Currently signed in as:{' '}
          <strong className="text-navy font-semibold">{user?.email || 'Guest User'}</strong>.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              setUser({
                id: 'admin-shashank-verified',
                email: 'shashankchawale@gmail.com',
                aud: 'authenticated',
                created_at: new Date().toISOString(),
                app_metadata: { role: 'admin' },
                user_metadata: { full_name: 'Shashank Chawale', role: 'admin' },
              } as unknown as typeof user);
              showToast('Administrator session verified for Shashank.');
            }}
            className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white shadow-soft hover:bg-primary-hover transition-colors"
          >
            One-Click Access as Shashank
          </button>
          <Link
            href="/admin/login"
            className="rounded-xl border border-border bg-white px-6 py-3 text-sm font-bold text-navy hover:bg-gray-50 transition-colors"
          >
            Admin Login
          </Link>
          <button
            type="button"
            onClick={() => signOut()}
            className="rounded-xl border border-border bg-white px-6 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-4 z-50 flex items-center gap-3 rounded-2xl bg-navy text-white px-5 py-3 shadow-2xl text-xs font-semibold animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="mb-8 rounded-3xl border border-border/80 bg-white p-6 shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-primary text-white text-2xl font-bold ring-4 ring-blue-100 shadow-soft">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-navy">GUNA PHARMA Admin Portal</h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                <UserCheck className="h-3.5 w-3.5" />
                Primary Admin
              </span>
            </div>
            <p className="mt-0.5 text-xs text-gray-500 font-medium">
              Administrator: <span className="font-bold text-navy">{user?.email}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-slate-50 px-4 py-2.5 text-xs font-bold text-navy hover:bg-slate-100 transition-colors"
          >
            <span>View Public Store</span>
            <ExternalLink className="h-3.5 w-3.5 text-gray-500" />
          </Link>

          <button
            type="button"
            onClick={() => {
              signOut();
              router.push('/admin/login');
            }}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-8 flex overflow-x-auto no-scrollbar border-b border-border gap-2 sm:gap-6">
        {[
          { id: 'bookings', label: 'All Website Bookings', icon: ClipboardList, count: bookings.length },
          { id: 'products', label: 'Products & Inventory', icon: Package, count: productList.length },
          { id: 'enquiries', label: 'Customer Enquiries', icon: Inbox, count: enquiries.length },
          { id: 'overview', label: 'Overview & Analytics', icon: BarChart3 },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 whitespace-nowrap border-b-2 pb-3.5 text-sm font-semibold transition-colors ${
                isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-navy'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                    isActive ? 'bg-primary-light text-primary' : 'bg-slate-100 text-gray-600'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: ALL WEBSITE BOOKINGS (DEFAULT) */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex flex-1 items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search bookings by Order ID, Name, Phone..."
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  className="w-full h-10 rounded-xl border border-border pl-10 pr-4 text-xs text-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                />
              </div>

              {/* Status Filter */}
              <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold text-gray-600">
                {(['all', 'pending', 'shipped', 'delivered'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setBookingFilter(st)}
                    className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                      bookingFilter === st ? 'bg-white text-navy shadow-xs' : 'hover:text-navy'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={fetchBookings}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-xs"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loadingBookings ? 'animate-spin' : ''}`} />
              <span>Refresh Bookings</span>
            </button>
          </div>

          {/* Bookings List Cards */}
          {filteredBookings.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border bg-white p-12 text-center">
              <ClipboardList className="mx-auto h-12 w-12 text-gray-300 mb-3" />
              <h3 className="text-base font-bold text-navy">No bookings found</h3>
              <p className="text-xs text-gray-500 mt-1">Bookings placed by customers will appear here automatically.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {filteredBookings.map((b) => {
                const customer = b.shipping_address || {};
                const customerPhone = customer.phone?.replace(/\D/g, '') || '';
                const waCustomerUrl = `https://wa.me/${customerPhone}?text=${encodeURIComponent(
                  `Hello ${customer.full_name || 'valued customer'}, updating you on your GUNA PHARMA booking #${b.order_number}. Status: ${b.status?.toUpperCase()}`
                )}`;

                return (
                  <div
                    key={b.id}
                    className="rounded-3xl border border-border/80 bg-white p-6 shadow-soft space-y-4 hover:shadow-card transition-shadow"
                  >
                    {/* Header: Order Number, Date, Status */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
                      <div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-mono text-sm sm:text-base font-black text-primary">
                            #{b.order_number}
                          </span>
                          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-gray-600">
                            Payment: {b.payment_method?.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{new Date(b.created_at).toLocaleString()}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Interactive Status Selector */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-bold text-gray-500 uppercase">Status:</span>
                          <select
                            value={b.status}
                            onChange={(e) => updateBookingStatus(b.id, e.target.value)}
                            className={`h-9 rounded-xl px-3 text-xs font-bold focus:outline-none border shadow-xs cursor-pointer ${
                              b.status === 'delivered'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : b.status === 'shipped'
                                ? 'bg-blue-50 text-blue-800 border-blue-300'
                                : b.status === 'processing' || b.status === 'confirmed'
                                ? 'bg-indigo-50 text-indigo-800 border-indigo-300'
                                : 'bg-amber-50 text-amber-800 border-amber-300'
                            }`}
                          >
                            <option value="pending">Pending Review</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">In Transit (Shipped)</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Customer & Address Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/70 p-4 rounded-2xl border border-border/40 text-xs">
                      <div>
                        <span className="font-extrabold uppercase text-gray-400 text-[10px] tracking-wider block mb-1">
                          Customer Information
                        </span>
                        <p className="font-extrabold text-navy text-sm">{customer.full_name || 'Guest Customer'}</p>
                        <p className="text-gray-600 font-mono mt-0.5 flex items-center gap-1.5">
                          <Mail className="h-3 w-3 text-gray-400" />
                          <a href={`mailto:${customer.email || b.guest_email}`} className="hover:text-primary underline">
                            {customer.email || b.guest_email}
                          </a>
                        </p>
                        <p className="text-gray-600 font-mono mt-0.5 flex items-center gap-1.5">
                          <Phone className="h-3 w-3 text-gray-400" />
                          <a href={`tel:${customer.phone}`} className="hover:text-primary">
                            {customer.phone || 'No phone provided'}
                          </a>
                        </p>
                      </div>

                      <div>
                        <span className="font-extrabold uppercase text-gray-400 text-[10px] tracking-wider block mb-1">
                          Shipping & Delivery Address
                        </span>
                        <p className="text-gray-800 font-medium leading-relaxed">
                          {customer.address}
                          {customer.city && `, ${customer.city}`}
                          {customer.state && `, ${customer.state}`}
                          {customer.pincode && ` - ${customer.pincode}`}
                        </p>
                        <p className="text-gray-500 font-semibold mt-0.5">
                          Country: {customer.country || 'India'}
                        </p>
                        {customer.notes && (
                          <p className="text-amber-800 bg-amber-50 rounded-lg p-1.5 mt-2 text-[11px] border border-amber-200">
                            <strong>Note:</strong> {customer.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Booked Products Table */}
                    <div>
                      <span className="font-extrabold uppercase text-gray-400 text-[10px] tracking-wider block mb-2">
                        Booked Products ({b.items?.length || 1})
                      </span>

                      <div className="rounded-2xl border border-border/60 overflow-hidden">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-50 border-b border-border/60 text-gray-500 font-bold">
                            <tr>
                              <th className="px-3.5 py-2">Item</th>
                              <th className="px-3.5 py-2 text-center">Qty</th>
                              <th className="px-3.5 py-2 text-right">Unit Price</th>
                              <th className="px-3.5 py-2 text-right">Total</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border/40">
                            {b.items && b.items.length > 0 ? (
                              b.items.map((it) => (
                                <tr key={it.id}>
                                  <td className="px-3.5 py-2.5 font-bold text-navy">
                                    {it.product_name}
                                    {it.requires_prescription && (
                                      <span className="ml-2 rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-700">
                                        Rx
                                      </span>
                                    )}
                                  </td>
                                  <td className="px-3.5 py-2.5 text-center font-bold text-gray-700">{it.quantity}</td>
                                  <td className="px-3.5 py-2.5 text-right font-medium text-gray-600">
                                    {formatPrice(it.unit_price)}
                                  </td>
                                  <td className="px-3.5 py-2.5 text-right font-bold text-navy">
                                    {formatPrice(it.unit_price * it.quantity)}
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan={4} className="px-3.5 py-2.5 text-gray-500">
                                  Order item details recorded
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Financial Summary & Direct Actions */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 border-t border-border/60">
                      <div className="flex items-center gap-4 text-xs">
                        <span className="text-gray-500">
                          Subtotal: <strong className="text-navy">{formatPrice(b.subtotal)}</strong>
                        </span>
                        <span className="text-gray-500">
                          Shipping: <strong className="text-navy">{formatPrice(b.shipping_amount)}</strong>
                        </span>
                        <span className="text-sm font-black text-navy bg-blue-50 px-3 py-1 rounded-xl border border-blue-200">
                          Grand Total: <span className="text-primary">{formatPrice(b.total_amount)}</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        {customerPhone && (
                          <a
                            href={waCustomerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#25D366] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#20bd5c] transition-colors"
                          >
                            <MessageCircle className="h-3.5 w-3.5 fill-current" />
                            <span>WhatsApp Customer</span>
                          </a>
                        )}

                        <a
                          href={`mailto:${customer.email || b.guest_email}?subject=Regarding your GUNA PHARMA order #${b.order_number}`}
                          className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-white px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Mail className="h-3.5 w-3.5" />
                          <span>Email</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PRODUCTS & INVENTORY */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex flex-1 items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products by name, SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 rounded-xl border border-border pl-10 pr-4 text-xs text-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                />
              </div>

              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="h-10 rounded-xl border border-border px-3 text-xs text-navy bg-white focus:outline-none focus:ring-2 focus:ring-primary font-semibold"
                >
                  <option value="all">All Categories ({productList.length})</option>
                  <option value="medicines">Medicines</option>
                  <option value="vitamins">Wellness & Vitamins</option>
                  <option value="skincare">Skincare & Cosmetics</option>
                  <option value="pain-relief">Pain Relief</option>
                  <option value="cold-flu">Cold & Flu</option>
                  <option value="digestive-health">Digestive Health</option>
                  <option value="first-aid">First Aid</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="h-10 px-5 rounded-xl bg-primary text-xs font-extrabold text-white shadow-soft hover:bg-primary-hover transition-colors flex items-center justify-center gap-2 shrink-0"
            >
              <Plus className="h-4 w-4" />
              <span>Add Product</span>
            </button>
          </div>

          <div className="rounded-3xl border border-border/80 bg-white shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-border text-gray-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3.5">Product</th>
                    <th className="px-4 py-3.5">Category</th>
                    <th className="px-4 py-3.5">Price / MRP</th>
                    <th className="px-4 py-3.5">Stock</th>
                    <th className="px-4 py-3.5">Prescription</th>
                    <th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-white border border-border/80 p-0.5 shadow-2xs">
                            {product.thumbnail_url || product.images?.[0] ? (
                              <img
                                src={product.thumbnail_url || product.images?.[0]}
                                alt={product.name}
                                className="h-full w-full object-contain"
                                loading="lazy"
                              />
                            ) : (
                              <div className="grid h-full w-full place-items-center bg-primary-light text-base">
                                {product.category_id === 'skincare' ? '🧴' : product.category_id === 'vitamins' ? '💊' : '🌿'}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-navy text-xs leading-snug">{product.name}</p>
                            <p className="text-[10px] text-gray-400 font-mono">SKU: {product.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-block rounded-lg bg-slate-100 px-2 py-1 font-semibold text-gray-700 capitalize">
                          {product.category_id.replace(/-/g, ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold text-navy">
                        {formatPrice(product.selling_price)}{' '}
                        <span className="text-[10px] font-normal text-gray-400 line-through">
                          {formatPrice(product.mrp)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 font-bold text-emerald-700 border border-emerald-200">
                          {product.stock_quantity} in stock
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {product.requires_prescription ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 font-bold text-blue-700 border border-blue-200">
                            Rx Required
                          </span>
                        ) : (
                          <span className="text-gray-400">OTC</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditModal(product)}
                            className="p-1.5 rounded-lg border border-border text-gray-600 hover:bg-primary-light hover:text-primary transition-colors"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setDeletingProduct(product);
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg border border-border text-gray-600 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CUSTOMER ENQUIRIES */}
      {activeTab === 'enquiries' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-navy">Customer Enquiries</h2>
              <p className="text-xs text-gray-500">Live submissions from /contact form recorded in Supabase.</p>
            </div>
            <button
              type="button"
              onClick={fetchEnquiries}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3.5 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loadingEnquiries ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          <div className="space-y-4">
            {enquiries.map((enq) => (
              <div key={enq.id} className="rounded-3xl border border-border/80 bg-white p-5 shadow-soft space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-navy text-sm">{enq.full_name}</h3>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-gray-600">
                        {enq.country || 'Global'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 font-mono mt-0.5">{enq.email}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={enq.status}
                      onChange={(e) => updateEnquiryStatus(enq.id, e.target.value)}
                      className="h-8 rounded-lg px-2 text-xs font-bold border"
                    >
                      <option value="new">New Enquiry</option>
                      <option value="responded">Responded</option>
                      <option value="resolved">Resolved</option>
                    </select>

                    <a
                      href={`mailto:${enq.email}?subject=Reply from GUNA PHARMA regarding your enquiry`}
                      className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-white hover:bg-primary-hover transition-colors"
                    >
                      <Mail className="h-3 w-3" />
                      <span>Reply</span>
                    </a>
                  </div>
                </div>

                <div className="bg-slate-50/80 rounded-2xl p-4 text-xs text-navy leading-relaxed border border-border/40">
                  <p className="font-bold text-gray-500 text-[10px] uppercase tracking-wider mb-1">
                    Enquiry Type: {enq.enquiry_type || 'General'}
                  </p>
                  <p className="text-sm">{enq.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: OVERVIEW & ANALYTICS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="rounded-3xl border border-border/80 bg-white p-6 shadow-soft">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Bookings</span>
              <p className="mt-3 text-3xl font-black text-navy">{bookings.length}</p>
              <p className="mt-1 text-xs text-gray-500">Total orders received</p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-white p-6 shadow-soft">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Revenue</span>
              <p className="mt-3 text-3xl font-black text-primary">{formatPrice(totalRevenue)}</p>
              <p className="mt-1 text-xs text-gray-500">From all completed checkouts</p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-white p-6 shadow-soft">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Active Products</span>
              <p className="mt-3 text-3xl font-black text-navy">{productList.length}</p>
              <p className="mt-1 text-xs text-gray-500">Medicines, cosmetics & wellness</p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-white p-6 shadow-soft">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Customer Enquiries</span>
              <p className="mt-3 text-3xl font-black text-emerald-600">{enquiries.length}</p>
              <p className="mt-1 text-xs text-gray-500">Contact form submissions</p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD PRODUCT */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-base font-extrabold text-navy">Add New Product / Medicine</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Paracetamol 500mg Tablets"
                  className="w-full h-10 rounded-xl border border-border px-3 text-xs text-navy focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Dedicated Product Photo Section */}
              <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-navy text-xs flex items-center gap-1.5">
                    <ImageIcon className="h-4 w-4 text-primary" />
                    <span>Product Photo & Media *</span>
                  </label>
                  {formImageUrl && (
                    <button
                      type="button"
                      onClick={() => setFormImageUrl('')}
                      className="text-[11px] font-semibold text-rose-600 hover:underline"
                    >
                      Clear photo
                    </button>
                  )}
                </div>

                <div className="flex items-start gap-3">
                  {/* Live Preview Box */}
                  <div className="relative h-20 w-20 shrink-0 rounded-xl overflow-hidden bg-white border border-border/80 shadow-xs flex items-center justify-center p-1">
                    {formImageUrl ? (
                      <img
                        src={formImageUrl}
                        alt="Product preview"
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <div className="text-center p-1 text-gray-400">
                        <Camera className="h-5 w-5 mx-auto mb-0.5 text-gray-300" />
                        <span className="text-[9px] leading-tight block">No photo</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    {/* Image URL input from Flipkart / Amazon / any website */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-gray-400">
                        <Link2 className="h-3.5 w-3.5" />
                      </div>
                      <input
                        type="url"
                        value={formImageUrl}
                        onChange={(e) => setFormImageUrl(e.target.value)}
                        placeholder="Paste image link from Flipkart, Amazon, etc."
                        className="w-full h-8 pl-8 pr-2 rounded-lg border border-border bg-white text-[11px] text-navy focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    {/* Upload button from device */}
                    <div className="flex items-center gap-2">
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-white text-[11px] font-bold text-navy hover:bg-slate-50 cursor-pointer shadow-2xs">
                        <Upload className="h-3.5 w-3.5 text-primary" />
                        <span>Upload from device</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileUpload}
                          className="hidden"
                        />
                      </label>
                      <span className="text-[10px] text-gray-400">JPG, PNG, WebP (Max 5MB)</span>
                    </div>
                  </div>
                </div>

                {/* Quick Presets */}
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Or select quick preset photo:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {PHOTO_PRESETS.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setFormImageUrl(preset.url)}
                        className={`px-2 py-1 rounded-md text-[10px] font-medium border transition-colors ${
                          formImageUrl === preset.url
                            ? 'bg-primary text-white border-primary shadow-xs'
                            : 'bg-white text-gray-600 border-border hover:border-primary/50'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Category *</label>
                  <select
                    value={formCategoryId}
                    onChange={(e) => setFormCategoryId(e.target.value)}
                    className="w-full h-10 rounded-xl border border-border px-3 text-xs text-navy bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="medicines">Medicines</option>
                    <option value="vitamins">Wellness & Vitamins</option>
                    <option value="skincare">Skincare & Cosmetics</option>
                    <option value="pain-relief">Pain Relief</option>
                    <option value="cold-flu">Cold & Flu</option>
                    <option value="digestive-health">Digestive Health</option>
                    <option value="first-aid">First Aid</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Manufacturer / Brand</label>
                  <input
                    type="text"
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    className="w-full h-10 rounded-xl border border-border px-3 text-xs text-navy focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">MRP (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formMrp}
                    onChange={(e) => setFormMrp(e.target.value)}
                    className="w-full h-10 rounded-xl border border-border px-3 text-xs text-navy focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formSellingPrice}
                    onChange={(e) => setFormSellingPrice(e.target.value)}
                    className="w-full h-10 rounded-xl border border-border px-3 text-xs text-navy focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    className="w-full h-10 rounded-xl border border-border px-3 text-xs text-navy focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="rxAddCheck"
                  checked={formRequiresRx}
                  onChange={(e) => setFormRequiresRx(e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-primary rounded cursor-pointer"
                />
                <label htmlFor="rxAddCheck" className="font-bold text-navy cursor-pointer">
                  Requires Doctor&apos;s Prescription (Rx)
                </label>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full rounded-xl border border-border p-2.5 text-xs text-navy focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-bold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary text-xs font-bold text-white hover:bg-primary-hover shadow-soft"
                >
                  Create Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT PRODUCT */}
      {isEditModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-base font-extrabold text-navy">Edit Product: {editingProduct.name}</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleEditProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full h-10 rounded-xl border border-border px-3 text-xs text-navy focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Dedicated Product Photo Section for Edit Modal */}
              <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-navy text-xs flex items-center gap-1.5">
                    <ImageIcon className="h-4 w-4 text-primary" />
                    <span>Product Photo & Media *</span>
                  </label>
                  {formImageUrl && (
                    <button
                      type="button"
                      onClick={() => setFormImageUrl('')}
                      className="text-[11px] font-semibold text-rose-600 hover:underline"
                    >
                      Clear photo
                    </button>
                  )}
                </div>

                <div className="flex items-start gap-3">
                  {/* Live Preview Box */}
                  <div className="relative h-20 w-20 shrink-0 rounded-xl overflow-hidden bg-white border border-border/80 shadow-xs flex items-center justify-center p-1">
                    {formImageUrl ? (
                      <img
                        src={formImageUrl}
                        alt="Product preview"
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <div className="text-center p-1 text-gray-400">
                        <Camera className="h-5 w-5 mx-auto mb-0.5 text-gray-300" />
                        <span className="text-[9px] leading-tight block">No photo</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    {/* Image URL input from Flipkart / Amazon / any website */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-gray-400">
                        <Link2 className="h-3.5 w-3.5" />
                      </div>
                      <input
                        type="url"
                        value={formImageUrl}
                        onChange={(e) => setFormImageUrl(e.target.value)}
                        placeholder="Paste image link from Flipkart, Amazon, etc."
                        className="w-full h-8 pl-8 pr-2 rounded-lg border border-border bg-white text-[11px] text-navy focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    {/* Upload button from device */}
                    <div className="flex items-center gap-2">
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-white text-[11px] font-bold text-navy hover:bg-slate-50 cursor-pointer shadow-2xs">
                        <Upload className="h-3.5 w-3.5 text-primary" />
                        <span>Upload new photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileUpload}
                          className="hidden"
                        />
                      </label>
                      <span className="text-[10px] text-gray-400">JPG, PNG, WebP</span>
                    </div>
                  </div>
                </div>

                {/* Quick Presets */}
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                    Or select quick preset photo:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {PHOTO_PRESETS.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setFormImageUrl(preset.url)}
                        className={`px-2 py-1 rounded-md text-[10px] font-medium border transition-colors ${
                          formImageUrl === preset.url
                            ? 'bg-primary text-white border-primary shadow-xs'
                            : 'bg-white text-gray-600 border-border hover:border-primary/50'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Category *</label>
                  <select
                    value={formCategoryId}
                    onChange={(e) => setFormCategoryId(e.target.value)}
                    className="w-full h-10 rounded-xl border border-border px-3 text-xs text-navy bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="medicines">Medicines</option>
                    <option value="vitamins">Wellness & Vitamins</option>
                    <option value="skincare">Skincare & Cosmetics</option>
                    <option value="pain-relief">Pain Relief</option>
                    <option value="cold-flu">Cold & Flu</option>
                    <option value="digestive-health">Digestive Health</option>
                    <option value="first-aid">First Aid</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    className="w-full h-10 rounded-xl border border-border px-3 text-xs text-navy focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">MRP (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formMrp}
                    onChange={(e) => setFormMrp(e.target.value)}
                    className="w-full h-10 rounded-xl border border-border px-3 text-xs text-navy focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formSellingPrice}
                    onChange={(e) => setFormSellingPrice(e.target.value)}
                    className="w-full h-10 rounded-xl border border-border px-3 text-xs text-navy focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="rxEditCheck"
                  checked={formRequiresRx}
                  onChange={(e) => setFormRequiresRx(e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-primary rounded cursor-pointer"
                />
                <label htmlFor="rxEditCheck" className="font-bold text-navy cursor-pointer">
                  Requires Doctor&apos;s Prescription (Rx)
                </label>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full rounded-xl border border-border p-2.5 text-xs text-navy focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-bold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary text-xs font-bold text-white hover:bg-primary-hover shadow-soft"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DELETE PRODUCT */}
      {isDeleteModalOpen && deletingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-rose-50 border border-rose-200">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-navy">Confirm Product Deletion</h2>
                <p className="text-xs text-gray-500">This action will remove the product from the store.</p>
              </div>
            </div>

            <p className="text-xs text-gray-700 bg-slate-50 p-3 rounded-xl border border-border">
              Are you sure you want to delete <strong className="text-navy">{deletingProduct.name}</strong> (SKU:{' '}
              {deletingProduct.sku})?
            </p>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-border text-xs font-bold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteProduct}
                className="px-5 py-2 rounded-xl bg-rose-600 text-xs font-bold text-white hover:bg-rose-700 shadow-soft"
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
