import React from 'react';
import { Platform } from 'react-native';

interface StripeProviderWrapperProps {
  children: React.ReactNode;
  publishableKey: string;
  merchantIdentifier: string;
}

/**
 * Platform-specific Stripe Provider wrapper
 * Handles the incompatibility between Stripe React Native and web builds
 * 
 * For web builds: Returns children without Stripe provider (Stripe web will be handled separately)
 * For mobile builds: Uses Stripe React Native provider
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
