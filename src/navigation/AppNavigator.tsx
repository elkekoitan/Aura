import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppSelector } from '../store';

// Import Screens
import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import MainTabNavigator from './MainTabNavigator';
import StripeTestScreen from '../screens/test/StripeTestScreen';
import TermsScreen from '../screens/legal/TermsScreen';
import PrivacyScreen from '../screens/legal/PrivacyScreen';
import { BrandListScreen, BrandDetailScreen } from '../screens/brand';
import { AdminDashboard, ProductManagement } from '../screens/admin';
import ProductDetailScreen from '../screens/product/ProductDetailScreen';
import CheckoutScreen from '../screens/checkout/CheckoutScreen';
import OrderConfirmationScreen from '../screens/checkout/OrderConfirmationScreen';
import OrderHistoryScreen from '../screens/order/OrderHistoryScreen';
import ProfileEditScreen from '../screens/profile/ProfileEditScreen';
import StylePreferencesScreen from '../screens/profile/StylePreferencesScreen';
import BodyMeasurementsScreen from '../screens/profile/BodyMeasurementsScreen';
import TryOnCameraScreen from '../screens/tryOn/TryOnCameraScreen';
import TryOnProcessingScreen from '../screens/tryOn/TryOnProcessingScreen';
import TryOnHistoryScreen from '../screens/tryOn/TryOnHistoryScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);

  useEffect(() => {
    checkFirstLaunch();
  }, []);

  const checkFirstLaunch = async () => {
    try {
      const hasLaunched = await AsyncStorage.getItem('hasLaunched');
      if (hasLaunched) {
        setIsFirstLaunch(false);
        setShowOnboarding(false);
      }
    } catch (error) {
      console.error('Error checking first launch:', error);
    }
  };

  const handleCompleteOnboarding = async () => {
    try {
      await AsyncStorage.setItem('hasLaunched', 'true');
      setShowOnboarding(false);
      setIsFirstLaunch(false);
    } catch (error) {
      console.error('Error saving onboarding completion:', error);
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: 'transparent' },
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      >
        {showOnboarding && isFirstLaunch ? (
          // Onboarding Flow
          <>
            <Stack.Screen name="Welcome">
              {(props) => (
                <WelcomeScreen
                  {...props}
                  onGetStarted={() => {
                    props.navigation.navigate('Onboarding');
                  }}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Onboarding">
              {(props) => (
                <OnboardingScreen
                  {...props}
                  onComplete={handleCompleteOnboarding}
                />
              )}
            </Stack.Screen>
          </>
        ) : isAuthenticated ? (
          // Authenticated User Flow
          <>
            <Stack.Screen name="MainTabs" component={MainTabNavigator} />
            <Stack.Screen 
              name="StripeTest" 
              component={StripeTestScreen}
              options={{
                presentation: 'modal',
                gestureEnabled: true,
              }}
            />
            <Stack.Screen 
              name="Terms" 
              component={TermsScreen}
              options={{
                presentation: 'modal',
                gestureEnabled: true,
              }}
            />
            <Stack.Screen
              name="Privacy"
              component={PrivacyScreen}
              options={{
                presentation: 'modal',
                gestureEnabled: true,
              }}
            />
            <Stack.Screen
              name="BrandList"
              component={BrandListScreen}
              options={{
                gestureEnabled: true,
              }}
            />
            <Stack.Screen
              name="BrandDetail"
              component={BrandDetailScreen}
              options={{
                gestureEnabled: true,
              }}
            />
            <Stack.Screen
              name="AdminDashboard"
              component={AdminDashboard}
              options={{
                gestureEnabled: true,
              }}
            />
            <Stack.Screen
              name="ProductManagement"
              component={ProductManagement}
              options={{
                gestureEnabled: true,
              }}
            />
            <Stack.Screen
              name="ProductDetail"
              component={ProductDetailScreen}
              options={{
                gestureEnabled: true,
              }}
            />
            <Stack.Screen
              name="Checkout"
              component={CheckoutScreen}
              options={{
                gestureEnabled: true,
              }}
            />
            <Stack.Screen
              name="OrderConfirmation"
              component={OrderConfirmationScreen}
              options={{
                gestureEnabled: true,
              }}
            />
            <Stack.Screen
              name="OrderHistory"
              component={OrderHistoryScreen}
              options={{
                gestureEnabled: true,
              }}
            />
            <Stack.Screen
              name="ProfileEdit"
              component={ProfileEditScreen}
              options={{
                gestureEnabled: true,
              }}
            />
            <Stack.Screen
              name="StylePreferences"
              component={StylePreferencesScreen}
              options={{
                gestureEnabled: true,
              }}
            />
            <Stack.Screen
              name="BodyMeasurements"
              component={BodyMeasurementsScreen}
              options={{
                gestureEnabled: true,
              }}
            />
            <Stack.Screen
              name="TryOnCamera"
              component={TryOnCameraScreen}
              options={{
                gestureEnabled: true,
              }}
            />
            <Stack.Screen
              name="TryOnProcessing"
              component={TryOnProcessingScreen}
              options={{
                gestureEnabled: false,
              }}
            />
            <Stack.Screen
              name="TryOnHistory"
              component={TryOnHistoryScreen}
              options={{
                gestureEnabled: true,
              }}
            />
          </>
        ) : (
          // Authentication Flow
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen 
              name="Terms" 
              component={TermsScreen}
              options={{
                presentation: 'modal',
                gestureEnabled: true,
              }}
            />
            <Stack.Screen 
              name="Privacy" 
              component={PrivacyScreen}
              options={{
                presentation: 'modal',
                gestureEnabled: true,
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
