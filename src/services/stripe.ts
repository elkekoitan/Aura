import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '../config/supabase';

// Initialize Stripe
const stripePromise = loadStripe(process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export interface PaymentIntentData {
  amount: number;
  currency: string;
  productIds: string[];
  shippingAddress?: {
    name: string;
    address: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
  };
}

export interface StripeProduct {
  id: string;
  name: string;
  description?: string;
  images: string[];
  metadata: {
    product_id: string;
    category: string;
  };
}

export interface StripePrice {
  id: string;
  product: string;
  unit_amount: number;
  currency: string;
  metadata: {
    size?: string;
    color?: string;
  };
}

class StripeService {
  private stripe: any = null;

  async initialize() {
    if (!this.stripe) {
      this.stripe = await stripePromise;
    }
    return this.stripe;
  }

  // Create payment intent
  async createPaymentIntent(data: PaymentIntentData) {
    try {
      const { data: result, error } = await supabase.functions.invoke('create-payment-intent', {
        body: data,
      });

      if (error) throw error;
      return result;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  // Confirm payment
  async confirmPayment(paymentIntentId: string, paymentMethodId: string) {
    try {
      const stripe = await this.initialize();
      
      const { error, paymentIntent } = await stripe.confirmCardPayment(paymentIntentId, {
        payment_method: paymentMethodId,
      });

      if (error) throw error;
      return paymentIntent;
    } catch (error) {
      console.error('Error confirming payment:', error);
      throw error;
    }
  }

  // Create Stripe customer
  async createCustomer(email: string, name?: string) {
    try {
      const { data: result, error } = await supabase.functions.invoke('create-customer', {
        body: { email, name },
      });

      if (error) throw error;
      return result;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  }

  // Create product in Stripe
  async createProduct(product: {
    name: string;
    description?: string;
    images?: string[];
    metadata?: Record<string, string>;
  }) {
    try {
      const { data: result, error } = await supabase.functions.invoke('create-product', {
        body: product,
      });

      if (error) throw error;
      return result;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  // Create price for product
  async createPrice(price: {
    product: string;
    unit_amount: number;
    currency: string;
    metadata?: Record<string, string>;
  }) {
    try {
      const { data: result, error } = await supabase.functions.invoke('create-price', {
        body: price,
      });

      if (error) throw error;
      return result;
    } catch (error) {
      console.error('Error creating price:', error);
      throw error;
    }
  }

  // Get payment methods for customer
  async getPaymentMethods(customerId: string) {
    try {
      const { data: result, error } = await supabase.functions.invoke('get-payment-methods', {
        body: { customer_id: customerId },
      });

      if (error) throw error;
      return result;
    } catch (error) {
      console.error('Error getting payment methods:', error);
      throw error;
    }
  }

  // Create setup intent for saving payment method
  async createSetupIntent(customerId: string) {
    try {
      const { data: result, error } = await supabase.functions.invoke('create-setup-intent', {
        body: { customer_id: customerId },
      });

      if (error) throw error;
      return result;
    } catch (error) {
      console.error('Error creating setup intent:', error);
      throw error;
    }
  }

  // Process refund
  async createRefund(paymentIntentId: string, amount?: number) {
    try {
      const { data: result, error } = await supabase.functions.invoke('create-refund', {
        body: { payment_intent_id: paymentIntentId, amount },
      });

      if (error) throw error;
      return result;
    } catch (error) {
      console.error('Error creating refund:', error);
      throw error;
    }
  }

  // Get order status
  async getOrderStatus(orderId: string) {
    try {
      const { data: order, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (*)
          )
        `)
        .eq('id', orderId)
        .single();

      if (error) throw error;
      return order;
    } catch (error) {
      console.error('Error getting order status:', error);
      throw error;
    }
  }

  // Update order status
  async updateOrderStatus(orderId: string, status: string) {
    try {
      const { data: order, error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;
      return order;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }
}

export const stripeService = new StripeService();
export default stripeService;
