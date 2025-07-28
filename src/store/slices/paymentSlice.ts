/**
 * Payment Redux Slice
 * Manages Stripe payment state, operations, and form management
 * Integrates with Stripe API for payment processing
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  PaymentState, 
  PaymentFormData,
  PaymentValidation,
  StripePaymentIntent,
  StripePaymentMethod,
  CreatePaymentIntentParams,
  ConfirmPaymentParams,
  StripeError
} from '../types/payment';

// Mock Stripe API calls for development
// In production, these would call actual Stripe API endpoints

// Initial state
const initialState: PaymentState = {
  // Stripe state
  paymentIntent: null,
  paymentMethods: [],
  customer: null,
  
  // Form state
  paymentForm: {
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvc: '',
    cardholderName: '',
    billingAddress: {
      line1: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'US',
    },
  },
  formValidation: {
    isValid: false,
    errors: {},
  },
  
  // Loading states
  loading: false,
  processing: false,
  confirmingPayment: false,
  
  // Error states
  error: null,
  paymentError: null,
  
  // Success state
  paymentSuccess: false,
  lastPaymentIntent: null,
};

/**
 * Create payment intent
 */
export const createPaymentIntent = createAsyncThunk(
  'payment/createPaymentIntent',
  async (params: CreatePaymentIntentParams) => {
    // Mock API call - replace with actual Stripe API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const paymentIntent: StripePaymentIntent = {
      id: `pi_${Date.now()}`,
      amount: params.amount,
      currency: params.currency,
      status: 'requires_payment_method',
      client_secret: `pi_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
      created: Math.floor(Date.now() / 1000),
      description: params.description,
      metadata: params.metadata,
    };

    return paymentIntent;
  }
);

/**
 * Confirm payment
 */
export const confirmPayment = createAsyncThunk(
  'payment/confirmPayment',
  async (params: ConfirmPaymentParams) => {
    // Mock API call - replace with actual Stripe API
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate payment success/failure
    const isSuccess = Math.random() > 0.1; // 90% success rate for demo
    
    if (!isSuccess) {
      const error: StripeError = {
        type: 'card_error',
        code: 'card_declined',
        message: 'Your card was declined.',
      };
      throw error;
    }

    const paymentIntent: StripePaymentIntent = {
      id: params.paymentIntentId,
      amount: 0, // Will be filled from existing payment intent
      currency: 'usd',
      status: 'succeeded',
      client_secret: '',
      payment_method: params.paymentMethodId,
      created: Math.floor(Date.now() / 1000),
    };

    return paymentIntent;
  }
);

/**
 * Create payment method
 */
export const createPaymentMethod = createAsyncThunk(
  'payment/createPaymentMethod',
  async (cardData: PaymentFormData) => {
    // Mock API call - replace with actual Stripe API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const paymentMethod: StripePaymentMethod = {
      id: `pm_${Date.now()}`,
      type: 'card',
      card: {
        brand: 'visa', // Would be determined by card number
        country: 'US',
        exp_month: parseInt(cardData.expiryMonth),
        exp_year: parseInt(cardData.expiryYear),
        funding: 'credit',
        last4: cardData.cardNumber.slice(-4),
      },
      billing_details: {
        name: cardData.cardholderName,
        address: {
          line1: cardData.billingAddress.line1,
          line2: cardData.billingAddress.line2,
          city: cardData.billingAddress.city,
          state: cardData.billingAddress.state,
          postal_code: cardData.billingAddress.postal_code,
          country: cardData.billingAddress.country,
        },
      },
    };

    return paymentMethod;
  }
);

/**
 * Fetch customer payment methods
 */
export const fetchPaymentMethods = createAsyncThunk(
  'payment/fetchPaymentMethods',
  async (customerId: string) => {
    // Mock API call - replace with actual Stripe API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const paymentMethods: StripePaymentMethod[] = [
      {
        id: 'pm_1234567890',
        type: 'card',
        card: {
          brand: 'visa',
          country: 'US',
          exp_month: 12,
          exp_year: 2025,
          funding: 'credit',
          last4: '4242',
        },
        billing_details: {
          name: 'John Doe',
        },
      },
    ];

    return paymentMethods;
  }
);

/**
 * Validate payment form
 */
const validatePaymentForm = (formData: PaymentFormData): PaymentValidation => {
  const errors: PaymentValidation['errors'] = {};

  // Card number validation (basic)
  if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length < 13) {
    errors.cardNumber = 'Please enter a valid card number';
  }

  // Expiry month validation
  const month = parseInt(formData.expiryMonth);
  if (!formData.expiryMonth || month < 1 || month > 12) {
    errors.expiryMonth = 'Please enter a valid month';
  }

  // Expiry year validation
  const year = parseInt(formData.expiryYear);
  const currentYear = new Date().getFullYear();
  if (!formData.expiryYear || year < currentYear || year > currentYear + 20) {
    errors.expiryYear = 'Please enter a valid year';
  }

  // CVC validation
  if (!formData.cvc || formData.cvc.length < 3) {
    errors.cvc = 'Please enter a valid CVC';
  }

  // Cardholder name validation
  if (!formData.cardholderName.trim()) {
    errors.cardholderName = 'Please enter the cardholder name';
  }

  // Billing address validation
  if (!formData.billingAddress.line1.trim() || 
      !formData.billingAddress.city.trim() || 
      !formData.billingAddress.state.trim() || 
      !formData.billingAddress.postal_code.trim()) {
    errors.billingAddress = 'Please complete the billing address';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Payment slice
const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    // Form management
    updatePaymentForm: (state, action: PayloadAction<Partial<PaymentFormData>>) => {
      state.paymentForm = { ...state.paymentForm, ...action.payload };
      state.formValidation = validatePaymentForm(state.paymentForm);
    },
    
    updateBillingAddress: (state, action: PayloadAction<Partial<PaymentFormData['billingAddress']>>) => {
      state.paymentForm.billingAddress = { ...state.paymentForm.billingAddress, ...action.payload };
      state.formValidation = validatePaymentForm(state.paymentForm);
    },
    
    clearPaymentForm: (state) => {
      state.paymentForm = initialState.paymentForm;
      state.formValidation = initialState.formValidation;
    },
    
    // Error management
    clearError: (state) => {
      state.error = null;
    },
    
    clearPaymentError: (state) => {
      state.paymentError = null;
    },
    
    // Success management
    clearPaymentSuccess: (state) => {
      state.paymentSuccess = false;
      state.lastPaymentIntent = null;
    },
    
    // Reset state
    resetPaymentState: (state) => {
      return { ...initialState };
    },
  },
  extraReducers: (builder) => {
    // Create payment intent
    builder
      .addCase(createPaymentIntent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPaymentIntent.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentIntent = action.payload;
      })
      .addCase(createPaymentIntent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create payment intent';
      });

    // Confirm payment
    builder
      .addCase(confirmPayment.pending, (state) => {
        state.confirmingPayment = true;
        state.paymentError = null;
      })
      .addCase(confirmPayment.fulfilled, (state, action) => {
        state.confirmingPayment = false;
        state.paymentSuccess = true;
        state.lastPaymentIntent = action.payload;
        state.paymentIntent = action.payload;
      })
      .addCase(confirmPayment.rejected, (state, action) => {
        state.confirmingPayment = false;
        state.paymentError = action.error.message || 'Payment failed';
      });

    // Create payment method
    builder
      .addCase(createPaymentMethod.pending, (state) => {
        state.processing = true;
        state.error = null;
      })
      .addCase(createPaymentMethod.fulfilled, (state, action) => {
        state.processing = false;
        state.paymentMethods.push(action.payload);
      })
      .addCase(createPaymentMethod.rejected, (state, action) => {
        state.processing = false;
        state.error = action.error.message || 'Failed to create payment method';
      });

    // Fetch payment methods
    builder
      .addCase(fetchPaymentMethods.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentMethods.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentMethods = action.payload;
      })
      .addCase(fetchPaymentMethods.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch payment methods';
      });
  },
});

// Export actions
export const {
  updatePaymentForm,
  updateBillingAddress,
  clearPaymentForm,
  clearError,
  clearPaymentError,
  clearPaymentSuccess,
  resetPaymentState,
} = paymentSlice.actions;

// Export reducer
export default paymentSlice.reducer;
