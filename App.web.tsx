import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { store } from './src/store';
import { supabase } from './src/config/supabase';
import AppNavigator from './src/navigation/AppNavigator';
import { Colors, Typography, Spacing } from './src/constants';
import { useAppDispatch, useAppSelector } from './src/store';
import { setSession, setLoading } from './src/store/slices/authSlice';

/**
 * Web-specific App component without Stripe integration
 * Provides the same functionality as the main App but optimized for web deployment
 */

function AppContent() {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        dispatch(setSession({ user: session?.user || null, session }));
        
        if (initializing) {
          setInitializing(false);
        }
        
        dispatch(setLoading(false));
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch, initializing]);

  // Show loading screen while initializing
  if (initializing || loading) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={Colors.gradients.holographic}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.loadingContent}>
          <Text style={styles.loadingTitle}>Aura</Text>
          <Text style={styles.loadingSubtitle}>Digital Fashion Experience</Text>
          <ActivityIndicator 
            size="large" 
            color={Colors.primary[500]} 
            style={styles.loadingSpinner}
          />
        </View>
      </View>
    );
  }

  return <AppNavigator />;
}

export default function App() {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <StatusBar style="light" backgroundColor={Colors.primary[500]} />
          <AppContent />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
    gap: Spacing.lg,
  },
  loadingTitle: {
    ...Typography.styles.h1,
    fontSize: 48,
    color: Colors.text.white,
    fontWeight: Typography.weights.bold,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  loadingSubtitle: {
    ...Typography.styles.h3,
    color: Colors.text.white,
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: Spacing['2xl'],
  },
  loadingSpinner: {
    marginTop: Spacing.lg,
  },
});
