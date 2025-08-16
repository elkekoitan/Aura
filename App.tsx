import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, ActivityIndicator, Platform, LogBox, Dimensions } from 'react-native';
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import { QueryProvider } from './src/providers/QueryProvider';
import { AnalyticsProvider } from './src/providers/AnalyticsProvider';

// Conditional Stripe import for web compatibility
let StripeProvider: any = ({ children }: { children: React.ReactNode }) => children;

if (Platform.OS !== 'web') {
  try {
    const stripe = require('@stripe/stripe-react-native');
    StripeProvider = stripe.StripeProvider;
  } catch (error) {
    console.warn('Stripe React Native not available');
  }
}

import { LinearGradient } from 'expo-linear-gradient';
import { store } from './src/store';
import { supabase } from './src/config/supabase';
import { setSession, setProfile } from './src/store/slices/authSlice';
import { loadCartFromStorage } from './src/store/slices/cartSlice';
import {
  fetchUserProfile,
  fetchStylePreferences,
  fetchBodyMeasurements
} from './src/store/slices/profileSlice';
import { Colors, Typography } from './src/constants';
import AppNavigator from './src/navigation/AppNavigator';

// Performance optimization: memoize styles
const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375;

// Global error handler
const globalErrorHandler = (error: Error, errorInfo: React.ErrorInfo) => {
  console.error('Global Error Handler:', error, errorInfo);
  
  // Burada hata takip sistemi entegre edilebilir
  // Örnek: Sentry, LogRocket, Datadog vb.
  
  // Kritik hatalarda bildirim gönder
  if (error.name === 'TypeError' || error.name === 'ReferenceError') {
    console.error('🚨 Critical error detected:', error.message);
  }
};

// Development mode'da bazı uyarıları gizle
if (__DEV__) {
  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
    'AsyncStorage has been extracted from react-native core',
    'Module RCTImageLoader',
  ]);
}

// Loading Screen Component - memoized for performance
const LoadingScreen = React.memo(() => (
  <View style={styles.loadingContainer}>
    <LinearGradient
      colors={Colors.gradients.primary}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={StyleSheet.absoluteFillObject}
    />
    <View style={styles.loadingContent}>
      <Text style={styles.loadingLogo}>AURA</Text>
      <Text style={styles.loadingSubtitle}>Digital Fashion Experience</Text>
      <ActivityIndicator
        size="large"
        color={Colors.text.white}
        style={styles.loadingSpinner}
      />
    </View>
  </View>
));

LoadingScreen.displayName = 'LoadingScreen';

// Main App Component
function AppContent() {
  const [isLoading, setIsLoading] = useState(true);

  // Memoize initialization function to prevent unnecessary re-renders
  const initializeApp = useCallback(async () => {
    try {
      console.log('Initializing app with Supabase...');

      // Check for existing session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
        // Set mock session (no user - will show auth screens)
        store.dispatch(setSession({ user: null, session: null }));
      } else {
        // Set real session
        store.dispatch(setSession({ user: session?.user ?? null, session }));
        
        // Load user profile if authenticated
        if (session?.user) {
          store.dispatch(fetchUserProfile(session.user.id));
          store.dispatch(fetchStylePreferences(session.user.id));
          store.dispatch(fetchBodyMeasurements(session.user.id));
        }
      }

      // Load cart from storage
      store.dispatch(loadCartFromStorage());

      // Set up auth state listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        store.dispatch(setSession({ user: session?.user ?? null, session }));
        
        // Load user profile if authenticated
        if (session?.user) {
          store.dispatch(fetchUserProfile(session.user.id));
          store.dispatch(fetchStylePreferences(session.user.id));
          store.dispatch(fetchBodyMeasurements(session.user.id));
          
          // Fetch and set profile
          try {
            const { data: profile, error: profileError } = await supabase
              .from('user_profiles')
              .select('*')
              .eq('user_id', session.user.id)
              .single();
            
            if (!profileError && profile) {
              store.dispatch(setProfile(profile));
            }
          } catch (profileError) {
            console.error('Profile fetch error in auth listener:', profileError);
          }
        } else {
          // Clear profile when user logs out
          store.dispatch(setProfile(null));
        }
      });

      return () => subscription.unsubscribe();
    } catch (error) {
      console.error('Error initializing app:', error);
      // Fallback to mock session
      store.dispatch(setSession({ user: null, session: null }));
    } finally {
      // Small delay for smooth loading experience
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    }
  }, []);

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return <AppNavigator />;
}

// Simple test component - memoized for performance
const SimpleTestApp = React.memo(() => (
  <View style={styles.container}>
    <Text style={styles.title}>🎉 AURA APP WORKS!</Text>
    <Text style={styles.subtitle}>Basic functionality test</Text>
    <ActivityIndicator size="large" color="#319795" style={{ marginTop: 20 }} />
  </View>
));

SimpleTestApp.displayName = 'SimpleTestApp';

// Memoize the main App component for performance
export default React.memo(function App() {
  // Try full app with error boundary
  try {
    return (
      <Provider store={store}>
        <QueryProvider>
          <AnalyticsProvider
            enableFirebase={__DEV__}
            enableSegment={__DEV__}
          >
            <ErrorBoundary>
              <StripeProvider
                publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''}
                merchantIdentifier="merchant.com.aura.digitalfashion"
              >
                <GestureHandlerRootView style={{ flex: 1 }}>
                  <SafeAreaProvider>
                    <StatusBar
                      style="light"
                      backgroundColor={Colors.primary?.[500] || '#319795'}
                    />
                    <AppContent />
                  </SafeAreaProvider>
                </GestureHandlerRootView>
              </StripeProvider>
            </ErrorBoundary>
          </AnalyticsProvider>
        </QueryProvider>
      </Provider>
    );
  } catch (error) {
    console.error('App Error:', error);
    return <SimpleTestApp />;
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#319795',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    opacity: 0.9,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingLogo: {
    ...Typography.styles.h1,
    fontSize: 48,
    fontWeight: Typography.weights.black,
    color: Colors.text.white,
    letterSpacing: 8,
    marginBottom: 8,
  },
  loadingSubtitle: {
    ...Typography.styles.body,
    color: Colors.text.white,
    opacity: 0.9,
    marginBottom: 32,
  },
  loadingSpinner: {
    marginTop: 16,
  },
});
