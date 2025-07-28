import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { store } from '../src/store';
import { supabase } from '../src/config/supabase';
import { setSession } from '../src/store/slices/authSlice';

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return null; // Or a loading screen
  }

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: 'transparent' },
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="onboarding" />
          </Stack>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}
