/**
 * User Profile TypeScript type definitions
 * Provides comprehensive typing for user profile management, style preferences, and personalization
 */

// Basic profile types
export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  cover_image_url?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';
  location?: {
    city?: string;
    state?: string;
    country?: string;
  };
  phone?: string;
  website?: string;
  social_links?: {
    instagram?: string;
    tiktok?: string;
    twitter?: string;
    pinterest?: string;
  };
  created_at: string;
  updated_at: string;
}

// Style preferences
export interface StylePreferences {
  id: string;
  user_id: string;
  
  // Style categories
  preferred_styles: StyleCategory[];
  favorite_colors: string[];
  preferred_brands: string[];
  price_range: {
    min: number;
    max: number;
  };
  
  // Occasion preferences
  lifestyle: LifestyleType[];
  occasions: OccasionType[];
  
  // Fashion preferences
  fit_preferences: FitPreference[];
  material_preferences: MaterialType[];
  pattern_preferences: PatternType[];
  
  // Shopping behavior
  shopping_frequency: 'weekly' | 'monthly' | 'seasonally' | 'rarely';
  preferred_shopping_time: 'morning' | 'afternoon' | 'evening' | 'weekend';
  
  created_at: string;
  updated_at: string;
}

export type StyleCategory = 
  | 'casual' | 'formal' | 'business' | 'streetwear' | 'bohemian'
  | 'minimalist' | 'vintage' | 'sporty' | 'glamorous' | 'edgy'
  | 'romantic' | 'preppy' | 'gothic' | 'punk' | 'hipster';

export type LifestyleType = 
  | 'professional' | 'student' | 'parent' | 'traveler' | 'athlete'
  | 'artist' | 'entrepreneur' | 'socialite' | 'homebody' | 'adventurer';

export type OccasionType = 
  | 'work' | 'casual' | 'date-night' | 'party' | 'wedding' | 'vacation'
  | 'gym' | 'formal-event' | 'brunch' | 'shopping' | 'travel' | 'home';

export type FitPreference = 
  | 'tight' | 'fitted' | 'regular' | 'loose' | 'oversized' | 'tailored';

export type MaterialType = 
  | 'cotton' | 'silk' | 'wool' | 'linen' | 'denim' | 'leather'
  | 'cashmere' | 'polyester' | 'viscose' | 'modal' | 'bamboo' | 'organic';

export type PatternType = 
  | 'solid' | 'stripes' | 'polka-dots' | 'floral' | 'geometric'
  | 'animal-print' | 'plaid' | 'paisley' | 'abstract' | 'tie-dye';

// Body measurements
export interface BodyMeasurements {
  id: string;
  user_id: string;
  
  // Basic measurements
  height: number; // in cm
  weight?: number; // in kg
  
  // Clothing sizes
  dress_size?: string;
  top_size?: string;
  bottom_size?: string;
  shoe_size?: string;
  bra_size?: string;
  
  // Detailed measurements (in cm)
  bust?: number;
  waist?: number;
  hips?: number;
  inseam?: number;
  shoulder_width?: number;
  arm_length?: number;
  neck?: number;
  
  // Fit preferences
  preferred_fit: {
    tops: FitPreference;
    bottoms: FitPreference;
    dresses: FitPreference;
  };
  
  // Body type (optional)
  body_type?: 'pear' | 'apple' | 'hourglass' | 'rectangle' | 'inverted-triangle';
  
  created_at: string;
  updated_at: string;
}

// Avatar and appearance
export interface UserAvatar {
  id: string;
  user_id: string;
  
  // Avatar images
  avatar_url: string;
  full_body_avatar_url?: string;
  
  // Physical characteristics
  skin_tone?: 'very-light' | 'light' | 'medium-light' | 'medium' | 'medium-dark' | 'dark' | 'very-dark';
  hair_color?: 'blonde' | 'brown' | 'black' | 'red' | 'gray' | 'white' | 'other';
  hair_length?: 'short' | 'medium' | 'long' | 'very-long';
  eye_color?: 'brown' | 'blue' | 'green' | 'hazel' | 'gray' | 'amber';
  
  // Style characteristics
  style_personality?: StyleCategory[];
  color_palette?: string[];
  
  created_at: string;
  updated_at: string;
}

// Wishlist and favorites
export interface Wishlist {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  is_public: boolean;
  items: WishlistItem[];
  created_at: string;
  updated_at: string;
}

export interface WishlistItem {
  id: string;
  wishlist_id: string;
  product_id: string;
  added_at: string;
  notes?: string;
  priority?: 'low' | 'medium' | 'high';
}

// Profile state types
export interface ProfileState {
  // Profile data
  profile: UserProfile | null;
  stylePreferences: StylePreferences | null;
  bodyMeasurements: BodyMeasurements | null;
  avatar: UserAvatar | null;
  wishlists: Wishlist[];
  
  // Editing states
  isEditing: boolean;
  editingSection: 'profile' | 'style' | 'measurements' | 'avatar' | null;
  
  // Loading states
  loading: boolean;
  saving: boolean;
  uploadingAvatar: boolean;
  
  // Error states
  error: string | null;
  validationErrors: Record<string, string>;
}

// Profile operations
export interface UpdateProfileParams {
  full_name?: string;
  display_name?: string;
  bio?: string;
  date_of_birth?: string;
  gender?: UserProfile['gender'];
  location?: UserProfile['location'];
  phone?: string;
  website?: string;
  social_links?: UserProfile['social_links'];
}

export interface UpdateStylePreferencesParams {
  preferred_styles?: StyleCategory[];
  favorite_colors?: string[];
  preferred_brands?: string[];
  price_range?: StylePreferences['price_range'];
  lifestyle?: LifestyleType[];
  occasions?: OccasionType[];
  fit_preferences?: FitPreference[];
  material_preferences?: MaterialType[];
  pattern_preferences?: PatternType[];
  shopping_frequency?: StylePreferences['shopping_frequency'];
  preferred_shopping_time?: StylePreferences['preferred_shopping_time'];
}

export interface UpdateBodyMeasurementsParams {
  height?: number;
  weight?: number;
  dress_size?: string;
  top_size?: string;
  bottom_size?: string;
  shoe_size?: string;
  bra_size?: string;
  bust?: number;
  waist?: number;
  hips?: number;
  inseam?: number;
  shoulder_width?: number;
  arm_length?: number;
  neck?: number;
  preferred_fit?: BodyMeasurements['preferred_fit'];
  body_type?: BodyMeasurements['body_type'];
}

export interface UpdateAvatarParams {
  avatar_url?: string;
  full_body_avatar_url?: string;
  skin_tone?: UserAvatar['skin_tone'];
  hair_color?: UserAvatar['hair_color'];
  hair_length?: UserAvatar['hair_length'];
  eye_color?: UserAvatar['eye_color'];
  style_personality?: StyleCategory[];
  color_palette?: string[];
}

// Component prop types
export interface ProfileFormProps {
  profile: UserProfile | null;
  onSave: (data: UpdateProfileParams) => void;
  loading?: boolean;
  error?: string;
}

export interface StylePreferencesFormProps {
  preferences: StylePreferences | null;
  onSave: (data: UpdateStylePreferencesParams) => void;
  loading?: boolean;
  error?: string;
}

export interface BodyMeasurementsFormProps {
  measurements: BodyMeasurements | null;
  onSave: (data: UpdateBodyMeasurementsParams) => void;
  loading?: boolean;
  error?: string;
}

export interface AvatarEditorProps {
  avatar: UserAvatar | null;
  onSave: (data: UpdateAvatarParams) => void;
  onUploadImage: (imageUri: string) => void;
  loading?: boolean;
  uploadingImage?: boolean;
  error?: string;
}

// Validation types
export interface ProfileValidation {
  isValid: boolean;
  errors: Record<string, string>;
}

// Analytics types
export interface ProfileAnalytics {
  profile_completion: number; // percentage
  style_preferences_set: boolean;
  measurements_provided: boolean;
  avatar_uploaded: boolean;
  wishlists_created: number;
  last_updated: string;
}

// Recommendation types
export interface StyleRecommendation {
  id: string;
  user_id: string;
  product_id: string;
  reason: string;
  confidence_score: number;
  recommendation_type: 'style-match' | 'size-fit' | 'color-palette' | 'occasion-based';
  created_at: string;
}

// Privacy settings
export interface ProfilePrivacySettings {
  id: string;
  user_id: string;
  profile_visibility: 'public' | 'friends' | 'private';
  show_measurements: boolean;
  show_style_preferences: boolean;
  show_wishlists: boolean;
  allow_recommendations: boolean;
  marketing_emails: boolean;
  style_notifications: boolean;
  updated_at: string;
}
