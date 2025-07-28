import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Database Types
export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  full_name?: string;
  username?: string;
  avatar_url?: string;
  bio?: string;
  website?: string;
  location?: string;
  birth_date?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  style_preferences?: string[];
  body_measurements?: {
    height?: number;
    weight?: number;
    chest?: number;
    waist?: number;
    hips?: number;
    shoe_size?: number;
  };
  created_at: string;
  updated_at: string;
}

export interface Brand {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  website_url?: string;
  category: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  brand_id: string;
  name: string;
  description?: string;
  category: string;
  subcategory?: string;
  price: number;
  currency: string;
  images: string[];
  colors: string[];
  sizes: string[];
  materials?: string[];
  care_instructions?: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface Look {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  image_url?: string;
  products: string[]; // Product IDs
  tags?: string[];
  is_public: boolean;
  likes_count: number;
  saves_count: number;
  created_at: string;
  updated_at: string;
}

export interface UserLook {
  id: string;
  user_id: string;
  look_id: string;
  action: 'like' | 'save' | 'try';
  created_at: string;
}

export interface Avatar {
  id: string;
  user_id: string;
  model_url: string;
  texture_url?: string;
  body_measurements: {
    height: number;
    chest: number;
    waist: number;
    hips: number;
  };
  face_features?: {
    skin_tone: string;
    hair_color: string;
    eye_color: string;
  };
  created_at: string;
  updated_at: string;
}

export default supabase;
