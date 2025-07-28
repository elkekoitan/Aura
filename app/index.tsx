import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppSelector } from '../src/store';
import WelcomeScreen from '../src/screens/onboarding/WelcomeScreen';

export default function IndexScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [showOnboarding, setShowOnboarding] = useState(true);

  const handleGetStarted = () => {
    setShowOnboarding(false);
    if (isAuthenticated) {
      router.replace('/(tabs)');
    } else {
      router.push('/(auth)/login');
    }
  };

  if (showOnboarding) {
    return <WelcomeScreen onGetStarted={handleGetStarted} />;
  }

  return (
    <View style={styles.container}>
      {/* This will be replaced by navigation logic */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#319795',
  },
});
