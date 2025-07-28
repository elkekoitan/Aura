import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StripeProvider } from '@stripe/stripe-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { store } from './src/store';
import { supabase } from './src/config/supabase';
import { setSession } from './src/store/slices/authSlice';
import { Colors, Typography } from './src/constants';
import AppNavigator from './src/navigation/AppNavigator';

// Loading Screen Component
function LoadingScreen() {
  return (
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
  );
}

// Main App Component
function AppContent() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Get initial session
        const { data: { session } } = await supabase.auth.getSession();
        store.dispatch(setSession({ user: session?.user ?? null, session }));

        // Small delay for smooth loading experience
        setTimeout(() => {
          setIsLoading(false);
        }, 1500);
      } catch (error) {
        console.error('Error initializing app:', error);
        setIsLoading(false);
      }
    };

    initializeApp();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      store.dispatch(setSession({ user: session?.user ?? null, session }));
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return <AppNavigator />;
}

export default function App() {
  return (
    <Provider store={store}>
      <StripeProvider
        publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''}
        merchantIdentifier="merchant.com.aura.digitalfashion"
      >
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaProvider>
            <StatusBar style="light" backgroundColor={Colors.primary[500]} />
            <AppContent />
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </StripeProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#319795',
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
