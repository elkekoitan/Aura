/**
 * Payment-related TypeScript type definitions
 * Provides comprehensive typing for Stripe integration and payment processing
 */

// Stripe payment types
export interface StripePaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'requires_capture' | 'canceled' | 'succeeded';
  client_secret: string;
  payment_method?: string;
  created: number;
  description?: string;
  metadata?: Record<string, string>;
}

export interface StripePaymentMethod {
  id: string;
  type: 'card' | 'apple_pay' | 'google_pay';
  card?: {
    brand: string;
    country: string;
    exp_month: number;
    exp_year: number;
    funding: string;
    last4: string;
  };
  billing_details?: {
    address?: {
      city?: string;
      country?: string;
      line1?: string;
      line2?: string;
      postal_code?: string;
      state?: string;
    };
    email?: string;
    name?: string;
    phone?: string;
  };
}

export interface StripeCustomer {
  id: string;
  email?: string;
  name?: string;
  phone?: string;
  created: number;
  default_source?: string;
  invoice_prefix?: string;
  metadata?: Record<string, string>;
}

// Payment form types
export interface PaymentFormData {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvc: string;
  cardholderName: string;
  billingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
}

export interface PaymentValidation {
  isValid: boolean;
  errors: {
    cardNumber?: string;
    expiryMonth?: string;
    expiryYear?: string;
    cvc?: string;
    cardholderName?: string;
    billingAddress?: string;
  };
}

// Payment state types
export interface PaymentState {
  // Stripe state
  paymentIntent: StripePaymentIntent | null;
  paymentMethods: StripePaymentMethod[];
  customer: StripeCustomer | null;
  
  // Form state
  paymentForm: PaymentFormData;
  formValidation: PaymentValidation;
  
  // Loading states
  loading: boolean;
  processing: boolean;
  confirmingPayment: boolean;
  
  // Error states
  error: string | null;
  paymentError: string | null;
  
  // Success state
  paymentSuccess: boolean;
  lastPaymentIntent: StripePaymentIntent | null;
}

// Payment operations
export interface CreatePaymentIntentParams {
  amount: number;
  currency: string;
  customerId?: string;
  description?: string;
  metadata?: Record<string, string>;
}

export interface ConfirmPaymentParams {
  paymentIntentId: string;
  paymentMethodId: string;
  billingDetails?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: {
      line1?: string;
      line2?: string;
      city?: string;
      state?: string;
      postal_code?: string;
      country?: string;
    };
  };
}

export interface CreatePaymentMethodParams {
  type: 'card';
  card: {
    number: string;
    exp_month: number;
    exp_year: number;
    cvc: string;
  };
  billing_details?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: {
      line1?: string;
      line2?: string;
      city?: string;
      state?: string;
      postal_code?: string;
      country?: string;
    };
  };
}

// Component prop types
export interface PaymentFormProps {
  onSubmit: (data: PaymentFormData) => void;
  loading?: boolean;
  error?: string;
  initialData?: Partial<PaymentFormData>;
}

export interface PaymentMethodCardProps {
  paymentMethod: StripePaymentMethod;
  isSelected?: boolean;
  onSelect?: (paymentMethod: StripePaymentMethod) => void;
  onDelete?: (paymentMethod: StripePaymentMethod) => void;
  showActions?: boolean;
}

export interface PaymentSummaryProps {
  amount: number;
  currency: string;
  description?: string;
  breakdown?: {
    subtotal: number;
    tax: number;
    shipping: number;
    discount: number;
  };
}

// Webhook types
export interface StripeWebhookEvent {
  id: string;
  type: string;
  data: {
    object: any;
  };
  created: number;
  livemode: boolean;
  pending_webhooks: number;
  request?: {
    id: string;
    idempotency_key?: string;
  };
}

// Error types
export interface StripeError {
  type: 'card_error' | 'invalid_request_error' | 'api_error' | 'authentication_error' | 'rate_limit_error';
  code?: string;
  decline_code?: string;
  message: string;
  param?: string;
  payment_intent?: {
    id: string;
    status: string;
  };
  payment_method?: {
    id: string;
    type: string;
  };
  source?: {
    id: string;
    type: string;
  };
}

// Utility types
export interface PaymentMethodDisplay {
  id: string;
  type: string;
  displayName: string;
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault?: boolean;
}

export interface PaymentHistory {
  id: string;
  amount: number;
  currency: string;
  status: string;
  description?: string;
  created: number;
  paymentMethod: PaymentMethodDisplay;
}

// Configuration types
export interface StripeConfig {
  publishableKey: string;
  merchantId?: string;
  countryCode: string;
  currencyCode: string;
  testMode: boolean;
}

// Apple Pay / Google Pay types
export interface ApplePayConfig {
  merchantId: string;
  countryCode: string;
  currencyCode: string;
  supportedNetworks: string[];
  merchantCapabilities: string[];
}

export interface GooglePayConfig {
  environment: 'TEST' | 'PRODUCTION';
  merchantId: string;
  countryCode: string;
  currencyCode: string;
  allowedCardNetworks: string[];
  allowedCardAuthMethods: string[];
}
