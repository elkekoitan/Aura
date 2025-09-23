/**
 * @module services/stripe
 * @description A service class for interacting with the Stripe API and related Supabase functions.
 * It handles payment intents, customer creation, and other Stripe-related operations.
 */

import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '../config/supabase';

// Initialize Stripe
const stripePromise = loadStripe(process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

/**
 * Represents the data required to create a payment intent.
 * @interface PaymentIntentData
 */
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

/**
 * Represents a product in the Stripe system.
 * @interface StripeProduct
 */
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

/**
 * Represents a price for a product in the Stripe system.
 * @interface StripePrice
 */
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

/**
 * A service class for handling Stripe-related operations.
 * @class StripeService
 */
class StripeService {
  private stripe: any = null;

  /**
   * Initializes the Stripe.js instance.
   * @returns {Promise<any>} A promise that resolves with the Stripe instance.
   */
  async initialize() {
    if (!this.stripe) {
      this.stripe = await stripePromise;
    }
    return this.stripe;
  }

  /**
   * Creates a payment intent by invoking a Supabase function.
   * @param {PaymentIntentData} data - The data for the payment intent.
   * @returns {Promise<any>} A promise that resolves with the payment intent data.
   */
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

  /**
   * Confirms a payment using a payment intent and payment method ID.
   * @param {string} paymentIntentId - The ID of the payment intent.
   * @param {string} paymentMethodId - The ID of the payment method.
   * @returns {Promise<any>} A promise that resolves with the confirmed payment intent.
   */
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

  /**
   * Creates a new Stripe customer.
   * @param {string} email - The customer's email address.
   * @param {string} [name] - The customer's name.
   * @returns {Promise<any>} A promise that resolves with the new customer data.
   */
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

  /**
   * Creates a new product in Stripe.
   * @param {object} product - The product data.
   * @returns {Promise<any>} A promise that resolves with the new product data.
   */
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

  /**
   * Creates a new price for a product in Stripe.
   * @param {object} price - The price data.
   * @returns {Promise<any>} A promise that resolves with the new price data.
   */
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

  /**
   * Gets the payment methods for a customer.
   * @param {string} customerId - The ID of the customer.
   * @returns {Promise<any>} A promise that resolves with the list of payment methods.
   */
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

  /**
   * Creates a setup intent for saving a payment method.
   * @param {string} customerId - The ID of the customer.
   * @returns {Promise<any>} A promise that resolves with the setup intent data.
   */
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

  /**
   * Creates a refund for a payment.
   * @param {string} paymentIntentId - The ID of the payment intent to refund.
   * @param {number} [amount] - The amount to refund.
   * @returns {Promise<any>} A promise that resolves with the refund data.
   */
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

  /**
   * Gets the status of an order.
   * @param {string} orderId - The ID of the order.
   * @returns {Promise<any>} A promise that resolves with the order data.
   */
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

  /**
   * Updates the status of an order.
   * @param {string} orderId - The ID of the order to update.
   * @param {string} status - The new status for the order.
   * @returns {Promise<any>} A promise that resolves with the updated order data.
   */
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
