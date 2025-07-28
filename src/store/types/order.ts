/**
 * Order Management TypeScript type definitions
 * Provides comprehensive typing for order operations and tracking
 */

import { CartItem, CartSummary, ShippingAddress, PaymentMethod, ShippingMethod } from './cart';
import { Product } from './product';

// Order status types
export type OrderStatus = 
  | 'pending'           // Order created, payment pending
  | 'confirmed'         // Payment confirmed, order processing
  | 'processing'        // Order being prepared
  | 'shipped'           // Order shipped, in transit
  | 'delivered'         // Order delivered successfully
  | 'cancelled'         // Order cancelled
  | 'refunded'          // Order refunded
  | 'returned';         // Order returned

// Order types
export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  items: CartItem[];
  summary: CartSummary;
  shippingAddress: ShippingAddress;
  billingAddress?: ShippingAddress;
  paymentMethod: PaymentMethod;
  shippingMethod: ShippingMethod;
  trackingNumber?: string;
  trackingUrl?: string;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  notes?: string;
  customerId: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  selectedSize?: string;
  selectedColor?: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
}

// Order tracking types
export interface TrackingEvent {
  id: string;
  orderId: string;
  status: OrderStatus;
  description: string;
  location?: string;
  timestamp: string;
  isEstimated?: boolean;
}

export interface OrderTracking {
  orderId: string;
  trackingNumber: string;
  carrier: string;
  status: OrderStatus;
  estimatedDelivery?: string;
  events: TrackingEvent[];
  currentLocation?: string;
  lastUpdated: string;
}

// Order filters and search
export interface OrderFilters {
  status?: OrderStatus[];
  dateRange?: {
    start: string;
    end: string;
  };
  minAmount?: number;
  maxAmount?: number;
  customerId?: string;
}

export interface OrderSearchParams {
  query?: string;
  filters?: OrderFilters;
  sortBy?: 'created_at' | 'updated_at' | 'total' | 'status';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Order state types
export interface OrderState {
  // Orders data
  orders: Order[];
  selectedOrder: Order | null;
  orderTracking: Record<string, OrderTracking>;
  
  // Search and filters
  searchQuery: string;
  filters: OrderFilters;
  sortBy: 'created_at' | 'updated_at' | 'total' | 'status';
  sortOrder: 'asc' | 'desc';
  
  // Pagination
  currentPage: number;
  totalPages: number;
  totalOrders: number;
  hasMore: boolean;
  
  // Loading states
  loading: boolean;
  trackingLoading: boolean;
  updatingOrder: boolean;
  
  // Error states
  error: string | null;
  trackingError: string | null;
}

// Order operations
export interface CreateOrderParams {
  items: CartItem[];
  shippingAddress: ShippingAddress;
  billingAddress?: ShippingAddress;
  paymentMethod: PaymentMethod;
  shippingMethod: ShippingMethod;
  customerId: string;
  notes?: string;
}

export interface UpdateOrderParams {
  orderId: string;
  status?: OrderStatus;
  trackingNumber?: string;
  trackingUrl?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  notes?: string;
}

export interface CancelOrderParams {
  orderId: string;
  reason: string;
  refundAmount?: number;
}

export interface ReturnOrderParams {
  orderId: string;
  items: {
    itemId: string;
    quantity: number;
    reason: string;
  }[];
  returnMethod: 'pickup' | 'drop_off' | 'mail';
}

// Component prop types
export interface OrderCardProps {
  order: Order;
  onPress?: (order: Order) => void;
  onTrack?: (order: Order) => void;
  onCancel?: (order: Order) => void;
  onReturn?: (order: Order) => void;
  showActions?: boolean;
  compact?: boolean;
}

export interface OrderListProps {
  orders: Order[];
  loading?: boolean;
  onOrderPress?: (order: Order) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  emptyMessage?: string;
}

export interface OrderTrackingProps {
  tracking: OrderTracking;
  loading?: boolean;
  error?: string;
  onRefresh?: () => void;
}

export interface OrderSummaryProps {
  order: Order;
  showItems?: boolean;
  showShipping?: boolean;
  showPayment?: boolean;
}

// Admin order management
export interface AdminOrderFilters extends OrderFilters {
  brandId?: string;
  productId?: string;
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded';
  fulfillmentStatus?: 'unfulfilled' | 'partial' | 'fulfilled';
}

export interface OrderAnalytics {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  ordersByStatus: Record<OrderStatus, number>;
  revenueByMonth: Array<{
    month: string;
    revenue: number;
    orders: number;
  }>;
  topProducts: Array<{
    product: Product;
    quantity: number;
    revenue: number;
  }>;
  customerMetrics: {
    newCustomers: number;
    returningCustomers: number;
    averageLifetimeValue: number;
  };
}

// Return and refund types
export interface ReturnRequest {
  id: string;
  orderId: string;
  customerId: string;
  items: Array<{
    orderItemId: string;
    quantity: number;
    reason: string;
    condition: 'new' | 'used' | 'damaged';
  }>;
  status: 'requested' | 'approved' | 'rejected' | 'received' | 'processed';
  returnMethod: 'pickup' | 'drop_off' | 'mail';
  refundAmount: number;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface RefundRequest {
  id: string;
  orderId: string;
  amount: number;
  reason: string;
  status: 'pending' | 'approved' | 'processed' | 'rejected';
  paymentIntentId?: string;
  refundId?: string;
  createdAt: string;
  processedAt?: string;
  notes?: string;
}

// Notification types
export interface OrderNotification {
  id: string;
  orderId: string;
  customerId: string;
  type: 'order_confirmed' | 'order_shipped' | 'order_delivered' | 'order_cancelled' | 'order_returned';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  data?: Record<string, any>;
}
