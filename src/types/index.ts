/**
 * TypeScript types for GUNA PHARMA
 */

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  parent_id?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  category_id: string;
  brand_id: string;
  mrp: number;
  selling_price: number;
  discount_percent: number;
  stock_quantity: number;
  low_stock_threshold: number;
  sku: string;
  barcode?: string;
  weight?: number;
  dimensions?: string;
  images: string[];
  thumbnail_url?: string;
  requires_prescription: boolean;
  prescription_notes?: string;
  composition?: string;
  usage_instructions?: string;
  warnings?: string;
  storage_instructions?: string;
  manufacturer?: string;
  country_of_origin?: string;
  expiry_date?: string;
  is_active: boolean;
  is_featured: boolean;
  rating_average: number;
  rating_count: number;
  view_count: number;
  sold_count: number;
  tags: string[];
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at: string;
  // Relations
  category?: Category;
  brand?: Brand;
}

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product: Product;
  added_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  type: 'shipping' | 'billing';
  full_name: string;
  phone: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  landmark?: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id?: string;
  guest_email?: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  subtotal: number;
  discount_amount: number;
  shipping_amount: number;
  tax_amount: number;
  total_amount: number;
  currency: string;
  shipping_address: Address;
  billing_address?: Address;
  notes?: string;
  coupon_code?: string;
  razor_pay_order_id?: string;
  razor_pay_payment_id?: string;
  razor_pay_signature?: string;
  delivered_at?: string;
  cancelled_at?: string;
  cancellation_reason?: string;
  created_at: string;
  updated_at: string;
  // Relations
  items?: OrderItem[];
  user?: User;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_sku: string;
  product_image?: string;
  quantity: number;
  unit_price: number;
  mrp: number;
  discount_percent: number;
  total_price: number;
  requires_prescription: boolean;
  prescription_status?: PrescriptionStatus;
  prescription_file_url?: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  phone?: string;
  full_name?: string;
  avatar_url?: string;
  role: 'customer' | 'admin' | 'pharmacist';
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Prescription {
  id: string;
  user_id: string;
  order_item_id?: string;
  file_url: string;
  file_name: string;
  file_type: string;
  file_size: number;
  status: PrescriptionStatus;
  reviewed_by?: string;
  reviewed_at?: string;
  rejection_reason?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  name: string;
  description?: string;
  type: 'percentage' | 'fixed';
  value: number;
  min_order_amount?: number;
  max_discount_amount?: number;
  usage_limit?: number;
  usage_count: number;
  user_limit?: number;
  starts_at: string;
  expires_at: string;
  is_active: boolean;
  applicable_categories?: string[];
  applicable_products?: string[];
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  order_id?: string;
  rating: number;
  title?: string;
  comment?: string;
  is_verified_purchase: boolean;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  // Relations
  user?: User;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featured_image?: string;
  author_id: string;
  category_id?: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  published_at?: string;
  meta_title?: string;
  meta_description?: string;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product?: Product;
}

// Enums
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'packed'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'returned'
  | 'refunded';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded';

export type PaymentMethod = 'razorpay' | 'cod' | 'wallet' | 'bank_transfer' | 'wise' | 'ach' | 'link' | 'btc';

export type PrescriptionStatus = 'not_required' | 'pending' | 'approved' | 'rejected' | 'expired';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FilterOptions {
  categories?: string[];
  brands?: string[];
  priceRange?: [number, number];
  inStockOnly?: boolean;
  minRating?: number;
  search?: string;
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'newest' | 'popular' | 'rating';
}

export interface SearchSuggestion {
  type: 'product' | 'category' | 'brand';
  id: string;
  name: string;
  slug: string;
  image?: string;
}