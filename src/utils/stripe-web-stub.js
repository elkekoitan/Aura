/**
 * Stripe Web Stub
 * Provides empty implementations of Stripe React Native functions for web builds
 * This prevents build errors when Stripe React Native is imported on web platform
 */

// Mock StripeProvider component for web
export const StripeProvider = ({ children }) => children;

// Mock useStripe hook for web
export const useStripe = () => ({
  initPaymentSheet: null,
  presentPaymentSheet: null,
  confirmPayment: null,
  handleCardAction: null,
  isApplePaySupported: null,
  presentApplePay: null,
  confirmApplePayPayment: null,
  isGooglePaySupported: null,
  initGooglePay: null,
  presentGooglePay: null,
  createGooglePayPaymentMethod: null,
});

// Mock CardField component for web
export const CardField = () => null;

// Mock other Stripe components that might be used
export const ApplePayButton = () => null;
export const GooglePayButton = () => null;
export const AuBECSDebitForm = () => null;

// Default export
export default {
  StripeProvider,
  useStripe,
  CardField,
  ApplePayButton,
  GooglePayButton,
  AuBECSDebitForm,
};
