/**
 * Navigation Type Definitions
 * Proper TypeScript type definitions for React Navigation
 */

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Terms: undefined;
  Privacy: undefined;
};

export type MainTabParamList = {
  Discover: undefined;
  TryOn: undefined;
  Cart: undefined;
  Profile: undefined;
};

export type AppStackParamList = {
  // Auth Screens
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Terms: undefined;
  Privacy: undefined;

  // Main Tabs
  MainTabs: undefined;

  // Brand Screens
  BrandList: undefined;
  BrandDetail: { brandId: string };

  // Product Screens
  ProductDetail: { productId: string };

  // Cart & Checkout
  Cart: undefined;
  Checkout: undefined;
  OrderConfirmation: { orderId: string };

  // Order Screens
  OrderHistory: undefined;

  // Profile Screens
  ProfileEdit: undefined;
  StylePreferences: undefined;
  BodyMeasurements: undefined;

  // Admin Screens
  AdminDashboard: undefined;
  ProductManagement: undefined;

  // TryOn Screens
  TryOnCamera: { productId: string; product: any };
  TryOnProcessing: { sessionId: string; productId: string; product: any };
  TryOnHistory: undefined;

  // Test Screens
  StripeTest: undefined;
};

export type RootStackParamList = AppStackParamList;

// Navigation Helpers
import { NavigationProp as NavigationPropType } from '@react-navigation/native';
import { RouteProp as RoutePropType } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export type NavigationProp<T extends keyof RootStackParamList> =
  StackNavigationProp<RootStackParamList, T>;

export type RouteProp<T extends keyof RootStackParamList> =
  RoutePropType<RootStackParamList, T>;

// Tab Navigation Types
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp as StackNavigationPropAuth } from '@react-navigation/stack';

export type TabNavigationProp<T extends keyof MainTabParamList> =
  BottomTabNavigationProp<MainTabParamList, T>;

// Auth Navigation Types
export type AuthNavigationProp<T extends keyof AuthStackParamList> =
  StackNavigationPropAuth<AuthStackParamList, T>;