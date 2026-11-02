'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Order, OrderStatus } from '@/types';
import { createClient } from '@/lib/supabase/client';

export interface TrackingMilestone {
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
  current?: boolean;
}

export interface DetailedOrder extends Order {
  carrier?: string;
  tracking_number?: string;
  estimated_delivery?: string;
  tracking_steps?: TrackingMilestone[];
}

export const sampleOrders: DetailedOrder[] = [
  {
    id: 'ord-849201',
    order_number: 'GP-849201',
    status: 'shipped',
    payment_status: 'paid',
    payment_method: 'razorpay',
    subtotal: 1298,
    discount_amount: 150,
    shipping_amount: 0,
    tax_amount: 0,
    total_amount: 1148,
    currency: 'USD',
    carrier: 'BlueDart Express Air',
    tracking_number: 'BD-77829104',
    estimated_delivery: 'Tomorrow by 6:00 PM',
    created_at: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    shipping_address: {
      id: 'addr-1',
      user_id: 'guest',
      type: 'shipping',
      full_name: 'Dr. Rahul Sharma',
      phone: '+91 98201 44521',
      address_line_1: 'Flat 402, Sunshine Heights, Juhu Lane',
      city: 'Mumbai',
      state: 'Maharashtra',
      postal_code: '400049',
      country: 'India',
      is_default: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    items: [
      {
        id: 'item-1',
        order_id: 'ord-849201',
        product_id: '1',
        product_name: 'NovaClind 300mg Capsules (Clindamycin IP)',
        product_sku: 'MED-NOV-300',
        quantity: 2,
        unit_price: 349,
        mrp: 399,
        discount_percent: 12,
        total_price: 698,
        requires_prescription: true,
        prescription_status: 'approved',
        created_at: new Date().toISOString(),
      },
      {
        id: 'item-2',
        order_id: 'ord-849201',
        product_id: '2',
        product_name: 'Glow Boost Vitamin C 20% Face Serum with Ferulic Acid',
        product_sku: 'COS-VITC-30',
        quantity: 1,
        unit_price: 450,
        mrp: 650,
        discount_percent: 30,
        total_price: 450,
        requires_prescription: false,
        prescription_status: 'not_required',
        created_at: new Date().toISOString(),
      },
    ],
    tracking_steps: [
      {
        title: 'Order Confirmed',
        description: 'Payment verified and sent to pharmacy',
        timestamp: 'Yesterday, 10:15 AM',
        completed: true,
      },
      {
        title: 'Pharmacist Prescription Review',
        description: 'Approved by Dr. M. Iyer (Reg: MPC-48912)',
        timestamp: 'Yesterday, 11:30 AM',
        completed: true,
      },
      {
        title: 'Carefully Packed & Sealed',
        description: 'Temperature-controlled blister pack packed in Mumbai Central Hub',
        timestamp: 'Yesterday, 04:45 PM',
        completed: true,
      },
      {
        title: 'In Transit with BlueDart Express',
        description: 'Dispatched via Air Courier (AWB #BD-77829104)',
        timestamp: 'Today, 06:12 AM',
        completed: true,
        current: true,
      },
      {
        title: 'Out for Delivery',
        description: 'Courier agent will contact for doorstep delivery',
        timestamp: 'Expected tomorrow',
        completed: false,
      },
      {
        title: 'Delivered',
        description: 'Package handed over with OTP verification',
        timestamp: 'Expected tomorrow, 6:00 PM',
        completed: false,
      },
    ],
  },
  {
    id: 'ord-729410',
    order_number: 'GP-729410',
    status: 'delivered',
    payment_status: 'paid',
    payment_method: 'cod',
    subtotal: 599,
    discount_amount: 0,
    shipping_amount: 0,
    tax_amount: 0,
    total_amount: 599,
    currency: 'USD',
    carrier: 'Delhivery Surface',
    tracking_number: 'DL-99201824',
    delivered_at: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    created_at: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    shipping_address: {
      id: 'addr-2',
      user_id: 'guest',
      type: 'shipping',
      full_name: 'Dr. Rahul Sharma',
      phone: '+91 98201 44521',
      address_line_1: 'Flat 402, Sunshine Heights, Juhu Lane',
      city: 'Mumbai',
      state: 'Maharashtra',
      postal_code: '400049',
      country: 'India',
      is_default: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    items: [
      {
        id: 'item-3',
        order_id: 'ord-729410',
        product_id: '3',
        product_name: 'Daily Multi-Vitamin + Essential Minerals Complex',
        product_sku: 'VIT-MULTI-60',
        quantity: 1,
        unit_price: 599,
        mrp: 799,
        discount_percent: 25,
        total_price: 599,
        requires_prescription: false,
        prescription_status: 'not_required',
        created_at: new Date().toISOString(),
      },
    ],
    tracking_steps: [
      {
        title: 'Order Confirmed',
        description: 'Order placed via Cash on Delivery',
        timestamp: 'Oct 16, 02:20 PM',
        completed: true,
      },
      {
        title: 'Packed & Dispatched',
        description: 'Dispatched from Mumbai warehouse',
        timestamp: 'Oct 17, 10:00 AM',
        completed: true,
      },
      {
        title: 'In Transit',
        description: 'Arrived at local sorting hub',
        timestamp: 'Oct 18, 08:30 AM',
        completed: true,
      },
      {
        title: 'Delivered',
        description: 'Delivered and cash collected with digital receipt',
        timestamp: 'Oct 18, 03:45 PM',
        completed: true,
        current: true,
      },
    ],
  },
];

interface OrdersState {
  orders: DetailedOrder[];
  addOrder: (order: DetailedOrder) => void;
  syncWithSupabase: () => Promise<void>;
  findOrderByNumber: (orderNumber: string) => DetailedOrder | undefined;
}

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: sampleOrders,
      addOrder: (order) => {
        set((state) => ({
          orders: [order, ...state.orders.filter((o) => o.order_number !== order.order_number)],
        }));
      },
      findOrderByNumber: (orderNumber: string) => {
        const clean = orderNumber.trim().toUpperCase();
        return get().orders.find((o) => o.order_number.toUpperCase() === clean);
      },
      syncWithSupabase: async () => {
        try {
          const supabase = createClient();
          const { data, error } = await supabase
            .from('orders')
            .select(`
              id,
              order_number,
              guest_email,
              status,
              payment_status,
              payment_method,
              subtotal,
              discount_amount,
              shipping_amount,
              total_amount,
              shipping_address,
              created_at,
              updated_at
            `)
            .order('created_at', { ascending: false })
            .limit(20);

          if (error || !data || data.length === 0) return;

          const transformed: DetailedOrder[] = data.map((item) => {
            const status = (item.status as OrderStatus) || 'processing';
            return {
              id: item.id,
              order_number: item.order_number,
              guest_email: item.guest_email,
              status,
              payment_status: item.payment_status || 'pending',
              payment_method: item.payment_method || 'cod',
              subtotal: Number(item.subtotal) || 0,
              discount_amount: Number(item.discount_amount) || 0,
              shipping_amount: Number(item.shipping_amount) || 0,
              tax_amount: 0,
              total_amount: Number(item.total_amount) || 0,
              currency: 'USD',
              shipping_address: item.shipping_address || {
                full_name: 'Customer',
                address_line_1: 'Shipping Address',
                city: '',
                state: '',
                postal_code: '',
                country: 'India',
              },
              carrier: 'BlueDart Express',
              tracking_number: `BD-${item.order_number.replace(/\D/g, '').slice(-6) || '720914'}`,
              estimated_delivery: '3-4 Business Days',
              created_at: item.created_at,
              updated_at: item.updated_at,
              tracking_steps: generateTrackingSteps(status, item.created_at),
            };
          });

          // Merge Supabase orders with existing local orders
          set((state) => {
            const map = new Map<string, DetailedOrder>();
            transformed.forEach((o) => map.set(o.order_number, o));
            state.orders.forEach((o) => {
              if (!map.has(o.order_number)) map.set(o.order_number, o);
            });
            return { orders: Array.from(map.values()) };
          });
        } catch (e) {
          console.warn('Orders sync error:', e);
        }
      },
    }),
    {
      name: 'gunapharma_orders_v1',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : dummyStorage)),
    }
  )
);

const dummyStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export function generateTrackingSteps(status: OrderStatus, createdAt: string): TrackingMilestone[] {
  const isDelivered = status === 'delivered';
  const isShipped = status === 'shipped' || isDelivered;
  const isPacked = status === 'packed' || isShipped;
  const isConfirmed = status !== 'cancelled';

  return [
    {
      title: 'Order Confirmed',
      description: 'Order placed & payment verified',
      timestamp: new Date(createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      completed: isConfirmed,
    },
    {
      title: 'Pharmacist Review',
      description: 'Quality checks & prescription verified',
      timestamp: 'Verified by Registered Pharmacist',
      completed: isPacked,
      current: status === 'processing' || status === 'confirmed',
    },
    {
      title: 'Packed & Dispatched',
      description: 'Hermetically packed with safety seals',
      timestamp: isPacked ? 'Dispatched from Central Pharmacy Hub' : 'Pending packaging',
      completed: isPacked,
      current: status === 'packed',
    },
    {
      title: 'In Transit',
      description: 'Courier partner moving package to destination city',
      timestamp: isShipped ? 'In Transit via BlueDart Express Air' : 'Pending handover',
      completed: isShipped,
      current: status === 'shipped' || status === 'out_for_delivery',
    },
    {
      title: 'Delivered',
      description: 'Package delivered to recipient',
      timestamp: isDelivered ? 'Successfully delivered' : 'Expected within 2-3 business days',
      completed: isDelivered,
      current: isDelivered,
    },
  ];
}
