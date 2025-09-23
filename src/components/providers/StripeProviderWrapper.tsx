/**
 * @module components/providers/StripeProviderWrapper
 */

import React from 'react';
import { Platform } from 'react-native';

interface StripeProviderWrapperProps {
  children: React.ReactNode;
  publishableKey: string;
  merchantIdentifier: string;
}

/**
 * A platform-specific wrapper for the Stripe Provider.
 * This component handles the incompatibility between the Stripe React Native SDK and web builds.
 * For web builds, it returns the children directly, as Stripe.js is handled differently.
 * For mobile builds (iOS/Android), it wraps the children in the official StripeProvider component.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to render within the provider.
 * @param {string} props.publishableKey - The Stripe publishable key.
 * @param {string} props.merchantIdentifier - The merchant identifier for Apple Pay.
 * @returns {React.FC} A React component.
 */
export const StripeProviderWrapper: React.FC<StripeProviderWrapperProps> = ({
  children,
  publishableKey,
  merchantIdentifier,
}) => {
  // For web platform, return children without Stripe provider
  // Web Stripe integration will be handled separately when needed
  if (Platform.OS === 'web') {
    return <>{children}</>;
  }

  // For mobile platforms, use Stripe React Native
  try {
    const { StripeProvider } = require('@stripe/stripe-react-native');
    return (
      <StripeProvider
        publishableKey={publishableKey}
        merchantIdentifier={merchantIdentifier}
      >
        {children}
      </StripeProvider>
    );
  } catch (error) {
    // Fallback if Stripe is not available
    console.warn('Stripe React Native not available, continuing without Stripe provider');
    return <>{children}</>;
  }
};

export default StripeProviderWrapper;
