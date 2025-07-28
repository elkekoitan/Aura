import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StripeProvider } from '@stripe/stripe-react-native';
import { store } from './src/store';
import { supabase } from './src/config/supabase';
import { setSession } from './src/store/slices/authSlice';
import WelcomeScreen from './src/screens/onboarding/WelcomeScreen';
import StripeTestScreen from './src/screens/test/StripeTestScreen';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showStripeTest, setShowStripeTest] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      store.dispatch(setSession({ user: session?.user ?? null, session }));
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      store.dispatch(setSession({ user: session?.user ?? null, session }));
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleGetStarted = () => {
    setShowOnboarding(false);
    setShowStripeTest(true); // Show Stripe test instead of main app
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        {/* Loading screen */}
      </View>
    );
  }

  return (
    <Provider store={store}>
      <StripeProvider publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaProvider>
            <StatusBar style="light" />
            {showOnboarding ? (
              <WelcomeScreen onGetStarted={handleGetStarted} />
            ) : showStripeTest ? (
              <StripeTestScreen />
            ) : (
              <View style={styles.container}>
                {/* Main app will be implemented here */}
              </View>
            )}
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
});
