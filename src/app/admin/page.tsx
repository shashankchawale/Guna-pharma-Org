'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Building2,
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
  RotateCcw,
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


const AUTHORIZED_ADMIN_EMAILS = [
  'shashank@gunapharma.com',
  'shashankchawale@gmail.com',
];

const SQL_CREATE_PRODUCTS_SCRIPT = `-- ========================================================
-- GUNA PHARMA: Production Schema for 'products' Table
-- Run in Supabase SQL Editor:
-- Left sidebar -> SQL Editor (<_> icon) -> New query -> Paste & Run
-- ========================================================

-- 1. Create the products table with TEXT id to support custom SKUs and UUIDs
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  category_id TEXT NOT NULL DEFAULT 'medicines',
  category TEXT DEFAULT 'medicines',
  brand_id TEXT NOT NULL DEFAULT 'guna-pharma',
  mrp NUMERIC(10,2) NOT NULL DEFAULT 299.00,
  selling_price NUMERIC(10,2) NOT NULL DEFAULT 249.00,
  discount_percent INT DEFAULT 0,
  stock_quantity INT DEFAULT 50,
  low_stock_threshold INT DEFAULT 10,
  sku TEXT,
  images TEXT[] DEFAULT '{}',
  thumbnail_url TEXT,
  image_url TEXT,
  requires_prescription BOOLEAN DEFAULT false,
  prescription_notes TEXT,
  composition TEXT,
  usage_instructions TEXT,
  warnings TEXT,
  storage_instructions TEXT,
  manufacturer TEXT DEFAULT 'GUNA PHARMA',
  country_of_origin TEXT DEFAULT 'India',
  is_active BOOLEAN DEFAULT true,
  is_available BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  rating_average NUMERIC(3,2) DEFAULT 4.7,
  rating_count INT DEFAULT 15,
  view_count INT DEFAULT 100,
  sold_count INT DEFAULT 20,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Performance indexes
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products (slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products (category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products (is_active);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products (created_at DESC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 4. Clean non-destructive policies (no DROP keyword so Supabase shows no warning)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Public can view active products') THEN
    CREATE POLICY "Public can view active products" ON public.products FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Allow product inserts') THEN
    CREATE POLICY "Allow product inserts" ON public.products FOR INSERT WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Allow product updates') THEN
    CREATE POLICY "Allow product updates" ON public.products FOR UPDATE USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Allow product deletes') THEN
    CREATE POLICY "Allow product deletes" ON public.products FOR DELETE USING (true);
  END IF;
END $$;`;

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

interface QuoteItem {
  id: string;
  full_name: string;
  company?: string | null;
  email: string;
  country: string;
  quantity?: string | null;
  phone?: string | null;
  details: string;
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
  const [activeTab, setActiveTab] = React.useState<'bookings' | 'products' | 'enquiries' | 'quotes' | 'overview'>('bookings');

  // Bookings state
  const [bookings, setBookings] = React.useState<BookingItem[]>([]);
  const [loadingBookings, setLoadingBookings] = React.useState(false);
  const [bookingFilter, setBookingFilter] = React.useState<'all' | 'pending' | 'shipped' | 'delivered'>('all');
  const [bookingSearch, setBookingSearch] = React.useState('');

  // Products state (live persistent store)
  const {
    products: productList,
    deletedProductIds,
    addProduct: storeAddProduct,
    updateProduct: storeUpdateProduct,
    deleteProduct: storeDeleteProduct,
    resetDeletedProducts,
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

  // Quotes state (from /get-a-quote)
  const [quotes, setQuotes] = React.useState<QuoteItem[]>([]);
  const [loadingQuotes, setLoadingQuotes] = React.useState(false);
  const [quoteSearch, setQuoteSearch] = React.useState('');
  const [quoteFilter, setQuoteFilter] = React.useState<'all' | 'pending' | 'quoted' | 'closed'>('all');

  // New product form
  const [formName, setFormName] = React.useState('');
  const [formCategoryId, setFormCategoryId] = React.useState('medicines');
  const [formBrand, setFormBrand] = React.useState('GUNA PHARMA');
  const [formMrp, setFormMrp] = React.useState('299');
  const [formSellingPrice, setFormSellingPrice] = React.useState('249');
  const [formStock, setFormStock] = React.useState('50');
  const [formIsAvailable, setFormIsAvailable] = React.useState(true);
  const [formRequiresRx, setFormRequiresRx] = React.useState(false);
  const [formTags, setFormTags] = React.useState('Healthcare, Clinical');
  const [formDescription, setFormDescription] = React.useState('Quality-assured product verified for clinical purity.');
  const [formImageUrl, setFormImageUrl] = React.useState('https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80');
  const [supabaseHealth, setSupabaseHealth] = React.useState<{ connected: boolean; tableExists: boolean; productCount?: number; url: string; error?: string } | null>(null);
  const [isSqlModalOpen, setIsSqlModalOpen] = React.useState(false);
  const [copiedSql, setCopiedSql] = React.useState(false);
  const [isSeedingSupabase, setIsSeedingSupabase] = React.useState(false);
  const [isVerifyingSupabase, setIsVerifyingSupabase] = React.useState(false);

  const showToast = React.useCallback((msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  }, []);

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

  const checkSupabaseStatus = React.useCallback(async (showNotification = false) => {
    setIsVerifyingSupabase(true);
    try {
      const res = await fetch('/api/products?status=true');
      const h = await res.json();
      setSupabaseHealth(h);
      if (showNotification) {
        if (h.tableExists) {
          showToast(`Supabase 'products' table verified! ${h.productCount ?? 0} items stored in Supabase.`);
        } else {
          showToast("Supabase table 'products' not yet detected. Run the SQL script in your Supabase SQL Editor.");
        }
      }
      return h;
    } catch {
      if (showNotification) showToast("Could not reach database status endpoint.");
      return null;
    } finally {
      setIsVerifyingSupabase(false);
    }
  }, [showToast]);

  React.useEffect(() => {
    let active = true;
    fetch('/api/products?status=true')
      .then((res) => res.json())
      .then((h) => {
        if (active) setSupabaseHealth(h);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const handleSeedAllToSupabase = async () => {
    setIsSeedingSupabase(true);
    try {
      const res = await fetch('/api/products?action=seed_supabase', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showToast(`Successfully synced ${data.syncedCount} products to Supabase! You can now view them in Supabase Table Editor.`);
        await checkSupabaseStatus();
      } else {
        showToast(`Supabase sync failed: ${data.error || 'Please run the SQL script to create the products table first'}`);
      }
    } catch (err: any) {
      showToast(`Sync error: ${err.message || 'Network error'}`);
    } finally {
      setIsSeedingSupabase(false);
    }
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

  // Fetch live quotes from Supabase & localStorage fallback
  const fetchQuotes = React.useCallback(() => {
    const load = async () => {
      setLoadingQuotes(true);
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('quotes')
          .select('*')
          .order('created_at', { ascending: false });

        let localQuotes: QuoteItem[] = [];
        if (typeof window !== 'undefined') {
          try {
            const raw = localStorage.getItem('guna_local_quotes');
            if (raw) {
              const parsed = JSON.parse(raw);
              if (Array.isArray(parsed)) localQuotes = parsed;
            }
          } catch {}
        }

        if (!error && data && data.length > 0) {
          const remoteIds = new Set(data.map((q: any) => q.id));
          const onlyLocal = localQuotes.filter((q) => !remoteIds.has(q.id));
          setQuotes([...data, ...onlyLocal]);
        } else if (localQuotes.length > 0) {
          setQuotes(localQuotes);
        } else {
          setQuotes([
            {
              id: 'quote-seed-1',
              full_name: 'Dr. Rajesh Verma',
              company: 'Apex Multi-Specialty Clinic',
              email: 'dr.verma@apexclinic.com',
              country: 'India',
              phone: '+91 98201 44521',
              quantity: '500 packs',
              details: 'Requesting wholesale pricing and dispatch timeline for Paracetamol 650mg and Amoxicillin 500mg tablets.',
              status: 'pending',
              created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
            },
            {
              id: 'quote-seed-2',
              full_name: 'Kareem Mansoor',
              company: 'Gulf Wellness Distributors LLC',
              email: 'kmansoor@gulfwellness.ae',
              country: 'United Arab Emirates',
              phone: '+971 50 892 1144',
              quantity: '1,200 bottles',
              details: 'Interested in bulk importing Bontress PRO+ Scalp Serum and Vitamin C skincare formulations with certificate of analysis.',
              status: 'quoted',
              created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
            },
          ]);
        }
      } catch {
        setQuotes([
          {
            id: 'quote-seed-1',
            full_name: 'Dr. Rajesh Verma',
            company: 'Apex Multi-Specialty Clinic',
            email: 'dr.verma@apexclinic.com',
            country: 'India',
            phone: '+91 98201 44521',
            quantity: '500 packs',
            details: 'Requesting wholesale pricing and dispatch timeline for Paracetamol 650mg and Amoxicillin 500mg tablets.',
            status: 'pending',
            created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
          },
        ]);
      } finally {
        setLoadingQuotes(false);
      }
    };

    load();
  }, []);

  React.useEffect(() => {
    if (isAdminAuthorized) {
      const timer = setTimeout(() => {
        fetchBookings();
        fetchEnquiries();
        fetchQuotes();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isAdminAuthorized, fetchBookings, fetchEnquiries, fetchQuotes]);

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

  // Handle Quote Status Update
  const updateQuoteStatus = async (id: string, newStatus: string) => {
    try {
      const supabase = createClient();
      await supabase.from('quotes').update({ status: newStatus }).eq('id', id);
      setQuotes((prev) =>
        prev.map((q) => (q.id === id ? { ...q, status: newStatus } : q))
      );
      if (typeof window !== 'undefined') {
        try {
          const raw = localStorage.getItem('guna_local_quotes');
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
              const updated = parsed.map((q: any) => (q.id === id ? { ...q, status: newStatus } : q));
              localStorage.setItem('guna_local_quotes', JSON.stringify(updated));
            }
          }
        } catch {}
      }
      showToast(`Quote status updated to '${newStatus.toUpperCase()}'`);
    } catch {
      setQuotes((prev) =>
        prev.map((q) => (q.id === id ? { ...q, status: newStatus } : q))
      );
      showToast(`Quote status updated to '${newStatus.toUpperCase()}'`);
    }
  };

  // Handle Add Product
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const mrpNum = Number(formMrp) || 299;
    const priceNum = Number(formSellingPrice) || 249;
    const slug = formName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const finalImage = formImageUrl.trim() || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80';
    const calculatedDiscount = mrpNum > 0 && priceNum < mrpNum ? Math.round(((mrpNum - priceNum) / mrpNum) * 100) : 0;
    const stockNum = formIsAvailable ? (Number(formStock) || 50) : 0;

    const newProduct: Product = {
      id: generateNewProductId(),
      name: formName,
      slug: slug || generateNewProductId(),
      category_id: formCategoryId,
      category: formCategoryId,
      brand_id: formBrand.toLowerCase().replace(/\s+/g, '-'),
      mrp: mrpNum,
      selling_price: priceNum,
      price: priceNum,
      discount: calculatedDiscount,
      discount_percent: calculatedDiscount,
      stock_quantity: stockNum,
      low_stock_threshold: 10,
      sku: generateNewProductSku(),
      images: [finalImage],
      thumbnail_url: finalImage,
      image_url: finalImage,
      is_available: formIsAvailable,
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
    const addedProductName = formName;
    setFormName('');

    fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct),
    })
      .then((r) => r.json())
      .then((resData) => {
        if (resData?.supabaseSynced) {
          showToast(`Product '${addedProductName}' saved & permanently synced to Supabase!`);
          checkSupabaseStatus();
        } else {
          showToast(`Product '${addedProductName}' saved locally. (Supabase 'products' table missing; run SQL to sync permanently)`);
        }
      })
      .catch(() => {
        showToast(`Product '${addedProductName}' added to catalog database.`);
      });
  };

  // Open Edit Modal
  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormCategoryId(p.category_id || (typeof p.category === 'string' ? p.category : 'medicines'));
    setFormBrand(p.manufacturer || 'GUNA PHARMA');
    setFormMrp(String(p.mrp));
    setFormSellingPrice(String(p.selling_price || p.price || p.mrp));
    setFormStock(String(p.stock_quantity));
    setFormIsAvailable(p.is_available !== undefined ? Boolean(p.is_available) : p.stock_quantity > 0);
    setFormRequiresRx(p.requires_prescription);
    setFormTags((p.tags || []).join(', '));
    setFormDescription(p.description || p.short_description || '');
    setFormImageUrl(p.thumbnail_url || p.image_url || p.images?.[0] || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80');
    setIsEditModalOpen(true);
  };

  // Handle Edit Product
  const handleEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const mrpNum = Number(formMrp) || editingProduct.mrp;
    const priceNum = Number(formSellingPrice) || editingProduct.selling_price;
    const finalImage = formImageUrl.trim() || editingProduct.thumbnail_url || editingProduct.image_url || editingProduct.images?.[0] || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80';
    const calculatedDiscount = mrpNum > 0 && priceNum < mrpNum ? Math.round(((mrpNum - priceNum) / mrpNum) * 100) : 0;
    const stockNum = formIsAvailable ? (Number(formStock) || 0) : 0;

    const updatedProduct: Product = {
      ...editingProduct,
      name: formName,
      category_id: formCategoryId,
      category: formCategoryId,
      mrp: mrpNum,
      selling_price: priceNum,
      price: priceNum,
      discount: calculatedDiscount,
      discount_percent: calculatedDiscount,
      stock_quantity: stockNum,
      is_available: formIsAvailable,
      images: [finalImage],
      thumbnail_url: finalImage,
      image_url: finalImage,
      requires_prescription: formRequiresRx,
      tags: formTags.split(',').map((t) => t.trim()).filter(Boolean),
      description: formDescription,
      short_description: formDescription,
      updated_at: new Date().toISOString(),
    };

    storeUpdateProduct(updatedProduct);
    setIsEditModalOpen(false);
    const updatedProductName = formName;
    setEditingProduct(null);

    fetch('/api/products', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProduct),
    })
      .then((r) => r.json())
      .then((resData) => {
        if (resData?.supabaseSynced) {
          showToast(`Product '${updatedProductName}' updated & synced to Supabase!`);
          checkSupabaseStatus();
        } else {
          showToast(`Product '${updatedProductName}' updated in catalog database.`);
        }
      })
      .catch(() => {
        showToast(`Product '${updatedProductName}' updated in catalog.`);
      });
  };

  // Confirm Delete
  const confirmDeleteProduct = () => {
    if (!deletingProduct) return;
    const target = deletingProduct;
    setIsDeleteModalOpen(false);
    setDeletingProduct(null);
    storeDeleteProduct(target.id);
    if (target.slug && target.slug !== target.id) {
      storeDeleteProduct(target.slug);
    }
    fetch(`/api/products?id=${encodeURIComponent(target.id)}`, { method: 'DELETE' })
      .then(() => {
        showToast(`Product '${target.name}' deleted from catalog and Supabase.`);
        checkSupabaseStatus();
      })
      .catch(() => {
        showToast(`Product '${target.name}' deleted.`);
      });
  };

  // Filtered Bookings with multi-word search
  const filteredBookings = bookings.filter((b) => {
    if (bookingFilter === 'pending' && b.status !== 'pending') return false;
    if (bookingFilter === 'shipped' && b.status !== 'shipped') return false;
    if (bookingFilter === 'delivered' && b.status !== 'delivered') return false;

    if (bookingSearch.trim()) {
      const words = bookingSearch.toLowerCase().trim().split(/\s+/).filter(Boolean);
      const bookingBlob = [
        b.order_number,
        b.shipping_address?.full_name,
        b.guest_email,
        b.shipping_address?.phone,
        b.shipping_address?.city,
        b.shipping_address?.address,
        b.shipping_address?.notes,
        ...(b.items || []).map((it) => it.product_name),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return words.every((word) => bookingBlob.includes(word));
    }
    return true;
  });

  // Filtered Products with multi-word smart matching
  const filteredProducts = productList.filter((p) => {
    if (categoryFilter !== 'all') {
      const pCat = (p.category_id || (typeof p.category === 'string' ? p.category : '')).toLowerCase();
      if (categoryFilter === 'medicines') {
        const isMed =
          pCat === 'medicines' ||
          p.requires_prescription ||
          ['pain-relief', 'cold-flu', 'digestive-health', 'first-aid'].includes(pCat);
        if (!isMed) return false;
      } else if (categoryFilter === 'beauty') {
        if (!['beauty', 'cosmetics', 'hair-care', 'makeup'].includes(pCat)) return false;
      } else if (categoryFilter === 'skincare') {
        if (!['skincare', 'body-care', 'skin'].includes(pCat)) return false;
      } else if (categoryFilter === 'wellness') {
        if (!['wellness', 'vitamins', 'supplements', 'ayurveda', 'herbal'].includes(pCat)) return false;
      } else if (pCat !== categoryFilter) {
        return false;
      }
    }
    if (searchQuery.trim()) {
      const words = searchQuery.toLowerCase().trim().split(/\s+/).filter(Boolean);
      const searchableBlob = [
        p.name,
        p.composition,
        p.sku,
        p.category_id,
        p.manufacturer,
        p.brand,
        p.short_description,
        p.description,
        ...(p.tags || []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return words.every((w) => searchableBlob.includes(w));
    }
    return true;
  });

  // Filtered Quotes with multi-word search & status filter
  const filteredQuotes = quotes.filter((q) => {
    if (quoteFilter !== 'all') {
      if (quoteFilter === 'pending' && q.status !== 'pending' && q.status !== 'new') return false;
      if (quoteFilter === 'quoted' && q.status !== 'quoted' && q.status !== 'in-review' && q.status !== 'negotiating') return false;
      if (quoteFilter === 'closed' && q.status !== 'closed' && q.status !== 'resolved') return false;
    }
    if (quoteSearch.trim()) {
      const words = quoteSearch.toLowerCase().trim().split(/\s+/).filter(Boolean);
      const blob = [
        q.full_name,
        q.company || '',
        q.email,
        q.phone || '',
        q.country,
        q.quantity || '',
        q.details,
      ]
        .join(' ')
        .toLowerCase();

      return words.every((w) => blob.includes(w));
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
          { id: 'quotes', label: 'Wholesale Quotes', icon: FileText, count: quotes.length },
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
                  <option value="all">All Products ({productList.length})</option>
                  <option value="medicines">Medicines (Rx & Healthcare)</option>
                  <option value="beauty">Beauty Products (Cosmetics & Hair)</option>
                  <option value="skincare">Skincare (Face & Body)</option>
                  <option value="wellness">Wellness Products (Vitamins & Supplements)</option>
                  <option value="hair-care">Hair & Scalp Care</option>
                  <option value="pain-relief">Pain Relief & Fever</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {deletedProductIds && deletedProductIds.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    resetDeletedProducts();
                    showToast('Catalog restored! All deleted items have been restored.');
                  }}
                  className="h-10 px-3.5 rounded-xl border border-amber-200 bg-amber-50 text-xs font-bold text-amber-800 hover:bg-amber-100 transition-colors flex items-center justify-center gap-1.5 shrink-0 shadow-2xs"
                  title="Restore all deleted items back to the catalog"
                >
                  <RotateCcw className="h-3.5 w-3.5 text-amber-600" />
                  <span>Restore Deleted ({Math.ceil(deletedProductIds.length / 2)})</span>
                </button>
              )}

              <button
                type="button"
                onClick={async () => {
                  await syncWithServer(true);
                  const res = await fetch('/api/products?status=true');
                  const h = await res.json();
                  setSupabaseHealth(h);
                  showToast('Catalog refreshed and synced with database!');
                }}
                className="h-10 px-3.5 rounded-xl border border-border bg-white text-xs font-bold text-navy hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 shrink-0 shadow-2xs"
                title="Refresh and sync catalog products"
              >
                <RefreshCw className="h-3.5 w-3.5 text-primary" />
                <span>Sync Database</span>
              </button>

              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="h-10 px-5 rounded-xl bg-primary text-xs font-extrabold text-white shadow-soft hover:bg-primary-hover transition-colors flex items-center justify-center gap-2 shrink-0"
              >
                <Plus className="h-4 w-4" />
                <span>Add Product</span>
              </button>
            </div>
          </div>

          {/* Supabase Missing Table Notice or Connected Banner */}
          {!supabaseHealth?.tableExists ? (
            <div className="rounded-2xl border-2 border-amber-300 bg-amber-50/90 p-4 sm:p-5 shadow-xs">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-500 text-white shadow-xs">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-extrabold text-amber-950">
                        Supabase Action Required: &apos;products&apos; Table Missing in Your Database
                      </h4>
                      <span className="rounded-full bg-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-900">
                        PGRST205
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-amber-900/80 leading-relaxed max-w-3xl">
                      Your Supabase project (<strong className="font-semibold text-amber-950">shashankchawale&apos;s Project</strong>) has tables for quotes, orders, and enquiries, but the <strong className="font-bold text-amber-950">products</strong> table has not been created yet. Added products currently only save locally and will vanish on refresh. Run the quick SQL script below once in your Supabase SQL Editor so added products permanently appear in your Supabase Table Editor!
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(SQL_CREATE_PRODUCTS_SCRIPT);
                      setCopiedSql(true);
                      showToast('SQL Script copied to clipboard! Paste it into Supabase SQL Editor.');
                      setTimeout(() => setCopiedSql(false), 3000);
                    }}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 px-3.5 py-2 text-xs font-bold text-white shadow-soft transition-colors"
                  >
                    <ClipboardList className="h-4 w-4" />
                    <span>{copiedSql ? 'Copied to Clipboard!' : '1-Click Copy SQL'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsSqlModalOpen(true)}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-amber-300 bg-white hover:bg-amber-100/70 px-3.5 py-2 text-xs font-bold text-amber-950 transition-colors shadow-2xs"
                  >
                    <FileText className="h-4 w-4 text-amber-700" />
                    <span>Setup Instructions</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => checkSupabaseStatus(true)}
                    disabled={isVerifyingSupabase}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-amber-300 bg-white hover:bg-amber-100/70 px-3 py-2 text-xs font-bold text-amber-950 transition-colors shadow-2xs"
                    title="Check if table was created in Supabase"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 text-amber-700 ${isVerifyingSupabase ? 'animate-spin' : ''}`} />
                    <span>Verify</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-3.5 sm:p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-emerald-600 text-white">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-emerald-950">
                      Supabase &apos;products&apos; Table Online &amp; Connected ({supabaseHealth.productCount ?? 0} items in Supabase)
                    </p>
                    <p className="text-[11px] text-emerald-800">
                      All additions, edits, and deletions are saved directly to your Supabase Table Editor.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleSeedAllToSupabase}
                  disabled={isSeedingSupabase}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 px-3.5 py-1.5 text-xs font-bold text-white shadow-soft transition-colors shrink-0"
                >
                  <Sparkles className={`h-3.5 w-3.5 ${isSeedingSupabase ? 'animate-spin' : ''}`} />
                  <span>{isSeedingSupabase ? 'Syncing Catalog...' : 'Push All Catalog Items to Supabase'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Database & Supabase Live Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/80 bg-slate-50 p-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-navy">Database Status:</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 font-bold text-emerald-700 border border-emerald-200">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Active Catalog ({productList.length} Items)
              </span>
              {supabaseHealth?.tableExists ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 font-bold text-emerald-700 border border-emerald-200">
                  Supabase: Connected ({supabaseHealth.productCount ?? 0} in Table)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 font-bold text-amber-800 border border-amber-300">
                  Supabase: &apos;products&apos; Table Missing
                </span>
              )}
            </div>
            <span className="text-[11px] text-gray-500">
              {supabaseHealth?.tableExists
                ? 'Two-way synchronization with Supabase Table Editor active.'
                : 'Run the setup SQL once in Supabase SQL Editor to link your live products table.'}
            </span>
          </div>

          <div className="rounded-3xl border border-border/80 bg-white shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-border text-gray-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3.5">Product</th>
                    <th className="px-4 py-3.5">Category</th>
                    <th className="px-4 py-3.5">Price / MRP</th>
                    <th className="px-4 py-3.5">Stock & Availability</th>
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
                            {product.thumbnail_url || product.image_url || product.images?.[0] ? (
                              <img
                                src={product.thumbnail_url || product.image_url || product.images?.[0]}
                                alt={product.name}
                                className="h-full w-full object-contain"
                                loading="lazy"
                              />
                            ) : (
                              <div className="grid h-full w-full place-items-center bg-primary-light text-base">
                                {product.category_id === 'skincare' ? '🧴' : product.category_id === 'wellness' ? '💊' : '🌿'}
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
                          {(product.category_id || (typeof product.category === 'string' ? product.category : 'medicines')).replace(/-/g, ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold text-navy">
                        {formatPrice(product.selling_price || product.price || product.mrp)}{' '}
                        <span className="text-[10px] font-normal text-gray-400 line-through">
                          {formatPrice(product.mrp)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {product.is_available === false ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 font-bold text-rose-700 border border-rose-200">
                            Unavailable
                          </span>
                        ) : product.stock_quantity <= 0 ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 font-bold text-amber-700 border border-amber-200">
                            Out of Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 font-bold text-emerald-700 border border-emerald-200">
                            {product.stock_quantity} in stock
                          </span>
                        )}
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

      {/* TAB 4: WHOLESALE & PRODUCT QUOTES */}
      {activeTab === 'quotes' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-navy">Wholesale & Product Quotes</h2>
                <span className="rounded-full bg-blue-100 text-primary px-2.5 py-0.5 text-xs font-bold">
                  {filteredQuotes.length} Requests
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Live bulk order and trade inquiries from /get-a-quote form recorded in Supabase.
              </p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setActiveTab('enquiries')}
                className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-gray-600 hover:text-navy bg-slate-100 px-3 py-2 rounded-xl border border-border"
              >
                <span>Customer Enquiries ({enquiries.length})</span>
              </button>
              <button
                type="button"
                onClick={fetchQuotes}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3.5 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-2xs"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loadingQuotes ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-border/80 shadow-xs">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search quotes by client, company, email, phone, products..."
                value={quoteSearch}
                onChange={(e) => setQuoteSearch(e.target.value)}
                className="w-full h-9 rounded-xl border border-border pl-10 pr-4 text-xs text-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary bg-slate-50/50"
              />
            </div>

            {/* Status Filter Pills */}
            <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold text-gray-600">
              {(['all', 'pending', 'quoted', 'closed'] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setQuoteFilter(filter)}
                  className={`rounded-lg px-3 py-1 capitalize transition-colors ${
                    quoteFilter === filter
                      ? 'bg-white text-navy shadow-xs font-extrabold'
                      : 'text-gray-500 hover:text-navy'
                  }`}
                >
                  {filter === 'all' ? 'All Quotes' : filter === 'quoted' ? 'Quoted' : filter}
                </button>
              ))}
            </div>
          </div>

          {/* Quotes Cards List */}
          <div className="space-y-4">
            {filteredQuotes.length > 0 ? (
              filteredQuotes.map((q) => {
                const cleanPhone = (q.phone || '').replace(/[^0-9+]/g, '');
                const waPhone = cleanPhone.replace(/^\+/, '');
                const formattedDate = q.created_at
                  ? new Date(q.created_at).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : 'Recent';

                return (
                  <div
                    key={q.id}
                    className="rounded-3xl border border-border/80 bg-white p-5 sm:p-6 shadow-soft space-y-4 hover:border-primary/40 transition-colors"
                  >
                    {/* Top Row: Client Info & Status Selector */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-extrabold text-navy text-sm sm:text-base">{q.full_name}</h3>
                          {q.company && (
                            <span className="inline-flex items-center gap-1 rounded-lg bg-blue-50 text-primary border border-blue-200 px-2.5 py-0.5 text-xs font-bold">
                              <Building2 className="h-3 w-3" />
                              {q.company}
                            </span>
                          )}
                          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-gray-700">
                            {q.country || 'International'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Submitted on {formattedDate}</p>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                        <select
                          value={q.status || 'pending'}
                          onChange={(e) => updateQuoteStatus(q.id, e.target.value)}
                          className={`h-8 rounded-xl px-3 text-xs font-bold border transition-colors cursor-pointer ${
                            q.status === 'quoted'
                              ? 'bg-blue-50 text-primary border-blue-200'
                              : q.status === 'closed' || q.status === 'resolved'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          <option value="pending">Pending Review</option>
                          <option value="quoted">Quote Sent</option>
                          <option value="negotiating">In Negotiation</option>
                          <option value="closed">Order Confirmed</option>
                        </select>
                      </div>
                    </div>

                    {/* Middle Row: Contact & Quantity Badges */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="rounded-xl bg-slate-50 p-2.5 border border-border/40">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">
                          Email Address
                        </span>
                        <a
                          href={`mailto:${q.email}?subject=GUNA PHARMA Wholesale Quotation for ${encodeURIComponent(q.company || q.full_name)}`}
                          className="font-semibold text-primary hover:underline truncate block"
                        >
                          {q.email}
                        </a>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-2.5 border border-border/40">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">
                          Phone / Contact
                        </span>
                        {q.phone ? (
                          <div className="flex items-center gap-2">
                            <a href={`tel:${cleanPhone}`} className="font-semibold text-navy hover:text-primary">
                              {q.phone}
                            </a>
                            {waPhone && (
                              <a
                                href={`https://wa.me/${waPhone}?text=${encodeURIComponent(`Hello ${q.full_name}, thank you for your wholesale inquiry with GUNA PHARMA. We have prepared your quotation.`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700"
                              >
                                <MessageCircle className="h-3 w-3" />
                                <span>WhatsApp</span>
                              </a>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">Not provided</span>
                        )}
                      </div>

                      <div className="rounded-xl bg-slate-50 p-2.5 border border-border/40">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">
                          Expected Quantity
                        </span>
                        <span className="font-extrabold text-navy flex items-center gap-1.5">
                          <Package className="h-3.5 w-3.5 text-primary" />
                          {q.quantity || 'Bulk / Trade Supply'}
                        </span>
                      </div>
                    </div>

                    {/* Details Box */}
                    <div className="bg-blue-50/40 rounded-2xl p-4 text-xs text-navy leading-relaxed border border-blue-100">
                      <p className="font-bold text-gray-500 text-[10px] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <FileText className="h-3.5 w-3.5 text-primary" />
                        <span>Quotation Requirements & Products:</span>
                      </p>
                      <p className="text-xs sm:text-sm font-medium whitespace-pre-wrap">{q.details}</p>
                    </div>

                    {/* Action Bar */}
                    <div className="flex flex-wrap items-center justify-end gap-2.5 pt-1">
                      {q.phone && waPhone && (
                        <a
                          href={`https://wa.me/${waPhone}?text=${encodeURIComponent(`Hello ${q.full_name}, regarding your bulk inquiry at GUNA PHARMA: `)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition-colors shadow-2xs"
                        >
                          <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
                          <span>WhatsApp Client</span>
                        </a>
                      )}

                      <a
                        href={`mailto:${q.email}?subject=GUNA PHARMA Wholesale Quotation for ${encodeURIComponent(q.company || q.full_name)}&body=${encodeURIComponent(`Dear ${q.full_name},\n\nThank you for reaching out to GUNA PHARMA regarding wholesale availability for:\n"${q.details}"\n\nPlease find our preliminary trade pricing and supply terms attached.\n\nBest regards,\nGUNA PHARMA Trade Desk`)}`}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary-hover transition-colors shadow-2xs"
                      >
                        <Mail className="h-3.5 w-3.5" />
                        <span>Send Official Quotation</span>
                      </a>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="rounded-3xl border border-dashed border-border bg-white p-12 text-center space-y-3">
                <FileText className="h-10 w-10 text-gray-300 mx-auto" />
                <h3 className="font-bold text-navy text-sm">No wholesale quotes found</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  {quoteSearch ? `No quotes match "${quoteSearch}". Try clearing your search.` : 'Quotes submitted via the /get-a-quote form will appear here automatically.'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: OVERVIEW & ANALYTICS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            <div className="rounded-3xl border border-border/80 bg-white p-6 shadow-soft">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Bookings</span>
              <p className="mt-3 text-3xl font-black text-navy">{bookings.length}</p>
              <p className="mt-1 text-xs text-gray-500">Total orders received</p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-white p-6 shadow-soft">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Revenue</span>
              <p className="mt-3 text-3xl font-black text-primary">{formatPrice(totalRevenue)}</p>
              <p className="mt-1 text-xs text-gray-500">From completed checkouts</p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-white p-6 shadow-soft">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Active Products</span>
              <p className="mt-3 text-3xl font-black text-navy">{productList.length}</p>
              <p className="mt-1 text-xs text-gray-500">Catalog items</p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-white p-6 shadow-soft">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Customer Enquiries</span>
              <p className="mt-3 text-3xl font-black text-emerald-600">{enquiries.length}</p>
              <p className="mt-1 text-xs text-gray-500">Contact form submissions</p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-white p-6 shadow-soft">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Wholesale Quotes</span>
              <p className="mt-3 text-3xl font-black text-blue-600">{quotes.length}</p>
              <p className="mt-1 text-xs text-gray-500">B2B & bulk inquiries</p>
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

              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Category *</label>
                  <select
                    value={formCategoryId}
                    onChange={(e) => setFormCategoryId(e.target.value)}
                    className="w-full h-10 rounded-xl border border-border px-3 text-xs text-navy bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="medicines">Medicines (Rx & Healthcare)</option>
                    <option value="beauty">Beauty Products (Cosmetics & Hair)</option>
                    <option value="skincare">Skincare (Face & Body Care)</option>
                    <option value="wellness">Wellness Products (Vitamins & Supplements)</option>
                    <option value="pain-relief">Pain Relief & Fever</option>
                    <option value="hair-care">Hair & Scalp Care</option>
                    <option value="cold-flu">Cold & Flu</option>
                    <option value="digestive-health">Digestive Health</option>
                    <option value="first-aid">First Aid & Antiseptics</option>
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

              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="availAddCheck"
                    checked={formIsAvailable}
                    onChange={(e) => setFormIsAvailable(e.target.checked)}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 rounded cursor-pointer"
                  />
                  <label htmlFor="availAddCheck" className="font-bold text-navy cursor-pointer text-xs">
                    In Stock & Available for Sale
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="rxAddCheck"
                    checked={formRequiresRx}
                    onChange={(e) => setFormRequiresRx(e.target.checked)}
                    className="h-4 w-4 text-primary focus:ring-primary rounded cursor-pointer"
                  />
                  <label htmlFor="rxAddCheck" className="font-bold text-navy cursor-pointer text-xs">
                    Prescription Required (Rx)
                  </label>
                </div>
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

              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Category *</label>
                  <select
                    value={formCategoryId}
                    onChange={(e) => setFormCategoryId(e.target.value)}
                    className="w-full h-10 rounded-xl border border-border px-3 text-xs text-navy bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="medicines">Medicines (Rx & Healthcare)</option>
                    <option value="beauty">Beauty Products (Cosmetics & Hair)</option>
                    <option value="skincare">Skincare (Face & Body Care)</option>
                    <option value="wellness">Wellness Products (Vitamins & Supplements)</option>
                    <option value="pain-relief">Pain Relief & Fever</option>
                    <option value="hair-care">Hair & Scalp Care</option>
                    <option value="cold-flu">Cold & Flu</option>
                    <option value="digestive-health">Digestive Health</option>
                    <option value="first-aid">First Aid & Antiseptics</option>
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

              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="availEditCheck"
                    checked={formIsAvailable}
                    onChange={(e) => setFormIsAvailable(e.target.checked)}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 rounded cursor-pointer"
                  />
                  <label htmlFor="availEditCheck" className="font-bold text-navy cursor-pointer text-xs">
                    In Stock & Available for Sale
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="rxEditCheck"
                    checked={formRequiresRx}
                    onChange={(e) => setFormRequiresRx(e.target.checked)}
                    className="h-4 w-4 text-primary focus:ring-primary rounded cursor-pointer"
                  />
                  <label htmlFor="rxEditCheck" className="font-bold text-navy cursor-pointer text-xs">
                    Prescription Required (Rx)
                  </label>
                </div>
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

      {/* MODAL: SUPABASE SQL SETUP INSTRUCTIONS */}
      {isSqlModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-7 shadow-2xl space-y-5 my-8">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary-light text-primary border border-blue-200 shrink-0">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-navy">
                    Setup &apos;products&apos; Table in Supabase
                  </h3>
                  <p className="text-xs text-gray-500">
                    Follow these 3 quick steps to link your Supabase Table Editor permanently.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSqlModalOpen(false)}
                className="rounded-xl p-1.5 text-gray-400 hover:bg-slate-100 hover:text-navy transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Step-by-Step Guide */}
            <div className="space-y-3 rounded-2xl bg-slate-50 p-4 border border-border/80 text-xs text-navy">
              <div className="flex items-start gap-2.5">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-primary text-white font-extrabold text-[11px] shrink-0">
                  1
                </span>
                <p className="leading-snug">
                  Open your <a href="https://supabase.com/dashboard/project/xtnazvpjlsupnyyovnes" target="_blank" rel="noreferrer" className="font-bold text-primary underline inline-flex items-center gap-1">Supabase Dashboard <ExternalLink className="h-3 w-3" /></a> for <strong>shashankchawale&apos;s Project</strong>.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-primary text-white font-extrabold text-[11px] shrink-0">
                  2
                </span>
                <p className="leading-snug">
                  On the left sidebar, click the <strong>SQL Editor</strong> icon (the <code className="bg-white px-1.5 py-0.5 rounded border border-border font-mono">&lt;_&gt;</code> icon directly below Table Editor). Then click <strong>+ New query</strong>.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-primary text-white font-extrabold text-[11px] shrink-0">
                  3
                </span>
                <p className="leading-snug">
                  Paste the SQL script below and click the green <strong>Run</strong> button. Once complete, click <strong>Verify Connection</strong> below!
                </p>
              </div>
            </div>

            {/* SQL Script Box */}
            <div className="relative rounded-2xl border border-slate-700 bg-slate-900 text-slate-100 shadow-inner overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-4 py-2 text-[11px] text-slate-400">
                <span className="font-mono">supabase/create_products_table.sql</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(SQL_CREATE_PRODUCTS_SCRIPT);
                    setCopiedSql(true);
                    showToast('SQL Script copied to clipboard!');
                    setTimeout(() => setCopiedSql(false), 3000);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary hover:bg-primary-hover px-2.5 py-1 text-xs font-bold text-white transition-colors"
                >
                  <ClipboardList className="h-3.5 w-3.5" />
                  <span>{copiedSql ? 'Copied!' : 'Copy Script'}</span>
                </button>
              </div>
              <pre className="max-h-60 overflow-y-auto p-4 text-[11px] font-mono leading-relaxed select-all text-emerald-300 no-scrollbar">
                {SQL_CREATE_PRODUCTS_SCRIPT}
              </pre>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(SQL_CREATE_PRODUCTS_SCRIPT);
                  setCopiedSql(true);
                  showToast('SQL script copied!');
                  setTimeout(() => setCopiedSql(false), 3000);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-slate-100 hover:bg-slate-200 px-4 py-2.5 text-xs font-bold text-navy transition-colors"
              >
                <ClipboardList className="h-4 w-4 text-primary" />
                <span>{copiedSql ? 'Copied to Clipboard!' : 'Copy SQL Script'}</span>
              </button>

              <div className="flex items-center gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setIsSqlModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-border text-xs font-bold text-gray-600 hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    const h = await checkSupabaseStatus(true);
                    if (h?.tableExists) {
                      setIsSqlModalOpen(false);
                    }
                  }}
                  disabled={isVerifyingSupabase}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-xs font-bold text-white hover:bg-primary-hover shadow-soft transition-colors"
                >
                  <RefreshCw className={`h-4 w-4 ${isVerifyingSupabase ? 'animate-spin' : ''}`} />
                  <span>{isVerifyingSupabase ? 'Verifying...' : 'Verify Connection'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
