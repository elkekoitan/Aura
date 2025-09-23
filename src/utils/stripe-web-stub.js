/**
 * @module utils/stripe-web-stub
 * @description Provides mock implementations of Stripe React Native components and hooks
 * for web builds where the native library is not available. This prevents build errors.
 */

/**
 * A mock StripeProvider component for web builds. It simply renders its children.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to render.
 * @returns {React.ReactNode} The children of the component.
 */
export const StripeProvider = ({ children }) => children;

/**
 * A mock useStripe hook for web builds.
 * @returns {object} An object with null values for all Stripe methods.
 */
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

/**
 * A mock CardField component for web builds. It renders nothing.
 * @returns {null}
 */
export const CardField = () => null;

/**
 * A mock ApplePayButton component for web builds. It renders nothing.
 * @returns {null}
 */
export const ApplePayButton = () => null;

/**
 * A mock GooglePayButton component for web builds. It renders nothing.
 * @returns {null}
 */
export const GooglePayButton = () => null;

/**
 * A mock AuBECSDebitForm component for web builds. It renders nothing.
 * @returns {null}
 */
export const AuBECSDebitForm = () => null;

/**
 * The default export containing all the mock Stripe components and hooks.
 */
export default {
  StripeProvider,
  useStripe,
  CardField,
  ApplePayButton,
  GooglePayButton,
  AuBECSDebitForm,
};
