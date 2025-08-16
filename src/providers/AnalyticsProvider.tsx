import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { Platform } from 'react-native';

// Analytics context
interface AnalyticsContextType {
  track: (eventName: string, properties?: Record<string, any>) => void;
  identify: (userId: string, traits?: Record<string, any>) => void;
  screen: (screenName: string, properties?: Record<string, any>) => void;
  group: (groupId: string, traits?: Record<string, any>) => void;
  alias: (userId: string) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | null>(null);

// Mock analytics functions for development
const mockAnalytics = {
  track: (eventName: string, properties?: Record<string, any>) => {
    if (__DEV__) {
      console.log('[Analytics] Track:', eventName, properties);
    }
  },
  identify: (userId: string, traits?: Record<string, any>) => {
    if (__DEV__) {
      console.log('[Analytics] Identify:', userId, traits);
    }
  },
  screen: (screenName: string, properties?: Record<string, any>) => {
    if (__DEV__) {
      console.log('[Analytics] Screen:', screenName, properties);
    }
  },
  group: (groupId: string, traits?: Record<string, any>) => {
    if (__DEV__) {
      console.log('[Analytics] Group:', groupId, traits);
    }
  },
  alias: (userId: string) => {
    if (__DEV__) {
      console.log('[Analytics] Alias:', userId);
    }
  },
};

// Firebase Analytics (web only)
const firebaseAnalytics = Platform.OS === 'web' ? {
  track: (eventName: string, properties?: Record<string, any>) => {
    if (typeof window !== 'undefined' && (window as any).firebase) {
      (window as any).firebase.analytics().logEvent(eventName, properties);
    }
  },
  identify: (userId: string, traits?: Record<string, any>) => {
    if (typeof window !== 'undefined' && (window as any).firebase) {
      (window as any).firebase.analytics().setUserId(userId);
      if (traits) {
        Object.entries(traits).forEach(([key, value]) => {
          (window as any).firebase.analytics().setUserProperty(key, String(value));
        });
      }
    }
  },
  screen: (screenName: string, properties?: Record<string, any>) => {
    if (typeof window !== 'undefined' && (window as any).firebase) {
      window.firebase.analytics().logEvent('screen_view', {
        screen_name: screenName,
        ...properties,
      });
    }
  },
  group: (groupId: string, traits?: Record<string, any>) => {
    if (__DEV__) {
      console.log('[Firebase Analytics] Group not supported:', groupId, traits);
    }
  },
  alias: (userId: string) => {
    if (__DEV__) {
      console.log('[Firebase Analytics] Alias not supported:', userId);
    }
  },
} : null;

// Segment Analytics (web only)
const segmentAnalytics = Platform.OS === 'web' ? {
  track: (eventName: string, properties?: Record<string, any>) => {
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track(eventName, properties);
    }
  },
  identify: (userId: string, traits?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.analytics) {
      window.analytics.identify(userId, traits);
    }
  },
  screen: (screenName: string, properties?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.analytics) {
      window.analytics.screen(screenName, properties);
    }
  },
  group: (groupId: string, traits?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.analytics) {
      window.analytics.group(groupId, traits);
    }
  },
  alias: (userId: string) => {
    if (typeof window !== 'undefined' && window.analytics) {
      window.analytics.alias(userId);
    }
  },
} : null;

// Determine which analytics to use
const getAnalytics = () => {
  if (Platform.OS === 'web') {
    // Prefer Firebase Analytics if available
    if (firebaseAnalytics) {
      return firebaseAnalytics;
    }
    // Fall back to Segment Analytics if available
    if (segmentAnalytics) {
      return segmentAnalytics;
    }
  }
  // Use mock analytics for mobile or when no analytics is available
  return mockAnalytics;
};

interface AnalyticsProviderProps {
  children: ReactNode;
  enableFirebase?: boolean;
  enableSegment?: boolean;
  firebaseConfig?: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
  segmentWriteKey?: string;
}

export function AnalyticsProvider({ 
  children, 
  enableFirebase = false, 
  enableSegment = false,
  firebaseConfig,
  segmentWriteKey 
}: AnalyticsProviderProps) {
  useEffect(() => {
    if (Platform.OS === 'web') {
      // Initialize Firebase Analytics if enabled
      if (enableFirebase && firebaseConfig && typeof window !== 'undefined') {
        // Use dynamic imports only for web platform to avoid bundling issues
        const initFirebase = async () => {
          try {
            const { initializeApp } = await import('firebase/app');
            const { getAnalytics } = await import('firebase/analytics');
            const app = initializeApp(firebaseConfig);
            const analytics = getAnalytics(app);
            (window as any).firebase = { analytics: () => analytics };
          } catch (error) {
            if (__DEV__) {
              console.warn('[Firebase] Failed to initialize:', error);
            }
          }
        };
        initFirebase();
      }

      // Initialize Segment Analytics if enabled
      if (enableSegment && segmentWriteKey && typeof window !== 'undefined') {
        // Load Segment script
        const script = document.createElement('script');
        script.src = 'https://cdn.segment.com/analytics.js/v1/' + segmentWriteKey + '/analytics.min.js';
        script.async = true;
        document.head.appendChild(script);

        // Initialize Segment
        script.onload = () => {
          (window as any).analytics = {
            track: (eventName: string, properties?: Record<string, any>) => {
              if ((window as any).analytics) {
                (window as any).analytics.track(eventName, properties);
              }
            },
            identify: (userId: string, traits?: Record<string, any>) => {
              if ((window as any).analytics) {
                (window as any).analytics.identify(userId, traits);
              }
            },
            screen: (screenName: string, properties?: Record<string, any>) => {
              if ((window as any).analytics) {
                (window as any).analytics.screen(screenName, properties);
              }
            },
            group: (groupId: string, traits?: Record<string, any>) => {
              if ((window as any).analytics) {
                (window as any).analytics.group(groupId, traits);
              }
            },
            alias: (userId: string) => {
              if ((window as any).analytics) {
                (window as any).analytics.alias(userId);
              }
            },
          };
        };
      }
    }
  }, [enableFirebase, enableSegment, firebaseConfig, segmentWriteKey]);

  const analytics = getAnalytics();

  const value: AnalyticsContextType = {
    track: (eventName: string, properties?: Record<string, any>) => {
      analytics.track(eventName, properties);
    },
    identify: (userId: string, traits?: Record<string, any>) => {
      analytics.identify(userId, traits);
    },
    screen: (screenName: string, properties?: Record<string, any>) => {
      analytics.screen(screenName, properties);
    },
    group: (groupId: string, traits?: Record<string, any>) => {
      analytics.group(groupId, traits);
    },
    alias: (userId: string) => {
      analytics.alias(userId);
    },
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
}

// Hook to use analytics
export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
}

// Higher-order component for analytics tracking
export function withAnalytics<P extends object>(
  Component: React.ComponentType<P>,
  screenName?: string
) {
  return function AnalyticsComponent(props: P) {
    const { screen } = useAnalytics();

    useEffect(() => {
      if (screenName) {
        screen(screenName);
      }
    }, [screen, screenName]);

    return <Component {...props} />;
  };
}

// Custom hook for screen tracking
export function useScreenTracking(screenName: string, properties?: Record<string, any>) {
  const { screen } = useAnalytics();

  useEffect(() => {
    screen(screenName, properties);
  }, [screen, screenName, properties]);
}

// Event tracking helpers
export const AnalyticsEvents = {
  // Authentication events
  SIGN_UP: 'user_signed_up',
  SIGN_IN: 'user_signed_in',
  SIGN_OUT: 'user_signed_out',
  PASSWORD_RESET: 'password_reset',
  
  // Onboarding events
  ONBOARDING_STARTED: 'onboarding_started',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  ONBOARDING_STEP_COMPLETED: 'onboarding_step_completed',
  
  // Product events
  PRODUCT_VIEWED: 'product_viewed',
  PRODUCT_ADDED_TO_CART: 'product_added_to_cart',
  PRODUCT_REMOVED_FROM_CART: 'product_removed_from_cart',
  PRODUCT_PURCHASED: 'product_purchased',
  
  // Try-on events
  TRY_ON_STARTED: 'try_on_started',
  TRY_ON_COMPLETED: 'try_on_completed',
  TRY_ON_SHARED: 'try_on_shared',
  
  // Profile events
  PROFILE_UPDATED: 'profile_updated',
  STYLE_PREFERENCES_UPDATED: 'style_preferences_updated',
  BODY_MEASUREMENTS_UPDATED: 'body_measurements_updated',
  
  // Navigation events
  SCREEN_VIEWED: 'screen_viewed',
  NAVIGATION_ITEM_TAPPED: 'navigation_item_tapped',
} as const;

// Property helpers
export const AnalyticsProperties = {
  PRODUCT_ID: 'product_id',
  PRODUCT_NAME: 'product_name',
  PRODUCT_PRICE: 'product_price',
  PRODUCT_CATEGORY: 'product_category',
  BRAND_ID: 'brand_id',
  BRAND_NAME: 'brand_name',
  SCREEN_NAME: 'screen_name',
  STEP_NAME: 'step_name',
  COMPLETION_PERCENTAGE: 'completion_percentage',
  ERROR_TYPE: 'error_type',
  ERROR_MESSAGE: 'error_message',
  DEVICE_TYPE: 'device_type',
  PLATFORM: 'platform',
} as const;