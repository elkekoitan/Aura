import { supabase } from '../config/supabase';
import { mockProducts, mockCategories, mockBrands } from '../data/mockProducts';

const isProduction = process.env.EXPO_PUBLIC_APP_ENV === 'production';

export class ProductionDataService {
  // Products
  static async getProducts() {
    if (!isProduction) {
      return mockProducts;
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback to mock data if API fails
      return mockProducts;
    }
  }

  static async getFeaturedProducts() {
    if (!isProduction) {
      return mockProducts.filter(p => p.is_featured);
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', true)
        .eq('is_active', true)
        .order('featured_order', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching featured products:', error);
      return mockProducts.filter(p => p.is_featured);
    }
  }

  static async getProductById(id: string) {
    if (!isProduction) {
      return mockProducts.find(p => p.id === id);
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching product:', error);
      return mockProducts.find(p => p.id === id);
    }
  }

  // Categories
  static async getCategories() {
    if (!isProduction) {
      return mockCategories;
    }

    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return mockCategories;
    }
  }

  // Brands
  static async getBrands() {
    if (!isProduction) {
      return mockBrands;
    }

    try {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching brands:', error);
      return mockBrands;
    }
  }

  // User Management
  static async createUser(userData: any) {
    if (!isProduction) {
      console.log('Demo mode: User creation simulated');
      return { success: true, user: userData };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
          }
        }
      });

      if (error) throw error;
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async signInUser(email: string, password: string) {
    if (!isProduction) {
      console.log('Demo mode: Sign in simulated');
      return { 
        success: true, 
        user: { 
          id: 'demo-user', 
          email, 
          user_metadata: { 
            first_name: 'Demo', 
            last_name: 'User' 
          } 
        } 
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  }

  // Orders
  static async createOrder(orderData: any) {
    if (!isProduction) {
      console.log('Demo mode: Order creation simulated');
      return { success: true, orderId: 'demo-order-' + Date.now() };
    }

    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (error) throw error;
      return { success: true, orderId: data.id };
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  // Analytics
  static async trackEvent(eventName: string, properties: any = {}) {
    if (!isProduction) {
      console.log('Demo mode: Analytics event tracked:', eventName, properties);
      return;
    }

    try {
      // Track with your analytics service (Firebase, Mixpanel, etc.)
      console.log('Analytics event:', eventName, properties);
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }

  // App Configuration
  static getAppConfig() {
    return {
      isProduction,
      enableAnalytics: process.env.EXPO_PUBLIC_ENABLE_ANALYTICS === 'true',
      enableVirtualTryOn: process.env.EXPO_PUBLIC_ENABLE_VIRTUAL_TRYON === 'true',
      enablePushNotifications: process.env.EXPO_PUBLIC_ENABLE_PUSH_NOTIFICATIONS === 'true',
      enableCrashReporting: process.env.EXPO_PUBLIC_ENABLE_CRASH_REPORTING === 'true',
      apiUrl: process.env.EXPO_PUBLIC_API_URL,
      cdnUrl: process.env.EXPO_PUBLIC_CDN_URL,
    };
  }
}

export default ProductionDataService;
