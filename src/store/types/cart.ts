/**
 * Shopping Cart TypeScript type definitions
 * Provides comprehensive typing for cart operations and checkout functionality
 */

import { Product } from './product';

// Cart item types
export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  price: number; // Price at time of adding to cart
  addedAt: string;
}

export interface CartSummary {
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  itemCount: number;
}

// Cart state types
export interface CartState {
  items: CartItem[];
  summary: CartSummary;
  
  // Loading states
  loading: boolean;
  addingItem: boolean;
  removingItem: boolean;
  updatingQuantity: boolean;
  
  // Error states
  error: string | null;
  
  // Checkout state
  isCheckingOut: boolean;
  checkoutError: string | null;
}

// Cart operations
export interface AddToCartParams {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface UpdateCartItemParams {
  itemId: string;
  quantity: number;
}

export interface RemoveFromCartParams {
  itemId: string;
}

// Checkout types
export interface ShippingAddress {
  id?: string;
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

export interface PaymentMethod {
  id?: string;
  type: 'card' | 'paypal' | 'apple_pay' | 'google_pay';
  cardLast4?: string;
  cardBrand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault?: boolean;
}

export interface CheckoutData {
  shippingAddress: ShippingAddress;
  billingAddress?: ShippingAddress;
  paymentMethod: PaymentMethod;
  shippingMethod: ShippingMethod;
  promoCode?: string;
}

export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
}

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
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

// Component prop types
export interface CartItemProps {
  item: CartItem;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
  loading?: boolean;
}

export interface CartSummaryProps {
  summary: CartSummary;
  showDetails?: boolean;
}

export interface CheckoutFormProps {
  onSubmit: (data: CheckoutData) => void;
  loading?: boolean;
  error?: string;
}

// Validation types
export interface CartValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Promo code types
export interface PromoCode {
  code: string;
  type: 'percentage' | 'fixed' | 'shipping';
  value: number;
  description: string;
  minOrderAmount?: number;
  maxDiscount?: number;
  expiresAt?: string;
  usageLimit?: number;
  usageCount?: number;
}

export interface PromoCodeValidation {
  isValid: boolean;
  discount: number;
  message: string;
  promoCode?: PromoCode;
}
