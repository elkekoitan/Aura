/**
 * Profile Redux Slice
 * Manages user profile state, style preferences, body measurements, and avatar
 * Integrates with Supabase for profile data persistence
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  ProfileState,
  UserProfile,
  StylePreferences,
  BodyMeasurements,
  UserAvatar,
  Wishlist,
  UpdateProfileParams,
  UpdateStylePreferencesParams,
  UpdateBodyMeasurementsParams,
  UpdateAvatarParams,
  ProfileValidation
} from '../types/profile';

// Initial state
const initialState: ProfileState = {
  // Profile data
  profile: null,
  stylePreferences: null,
  bodyMeasurements: null,
  avatar: null,
  wishlists: [],
  
  // Editing states
  isEditing: false,
  editingSection: null,
  
  // Loading states
  loading: false,
  saving: false,
  uploadingAvatar: false,
  
  // Error states
  error: null,
  validationErrors: {},
};

/**
 * Fetch user profile
 */
export const fetchUserProfile = createAsyncThunk(
  'profile/fetchUserProfile',
  async (userId: string) => {
    // Mock API call - replace with actual Supabase API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockProfile: UserProfile = {
      id: 'profile-001',
      user_id: userId,
      full_name: 'Sarah Johnson',
      display_name: 'Sarah',
      bio: 'Fashion enthusiast and style blogger. Love discovering new trends and sharing outfit inspirations! ✨',
      avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
      cover_image_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop',
      date_of_birth: '1995-06-15',
      gender: 'female',
      location: {
        city: 'New York',
        state: 'NY',
        country: 'US',
      },
      phone: '+1 (555) 123-4567',
      website: 'https://sarahstyle.blog',
      social_links: {
        instagram: '@sarahstyle',
        tiktok: '@sarahfashion',
        pinterest: 'sarahstyleboard',
      },
      created_at: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    };

    return mockProfile;
  }
);

/**
 * Fetch style preferences
 */
export const fetchStylePreferences = createAsyncThunk(
  'profile/fetchStylePreferences',
  async (userId: string) => {
    // Mock API call - replace with actual Supabase API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockPreferences: StylePreferences = {
      id: 'style-001',
      user_id: userId,
      preferred_styles: ['minimalist', 'casual', 'business'],
      favorite_colors: ['#000000', '#FFFFFF', '#F5F5DC', '#8B4513', '#4169E1'],
      preferred_brands: ['brand-001', 'brand-002', 'brand-003'],
      price_range: {
        min: 50,
        max: 300,
      },
      lifestyle: ['professional', 'socialite'],
      occasions: ['work', 'casual', 'date-night', 'brunch'],
      fit_preferences: ['fitted', 'regular'],
      material_preferences: ['cotton', 'silk', 'wool', 'linen'],
      pattern_preferences: ['solid', 'stripes', 'geometric'],
      shopping_frequency: 'monthly',
      preferred_shopping_time: 'weekend',
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    };

    return mockPreferences;
  }
);

/**
 * Fetch body measurements
 */
export const fetchBodyMeasurements = createAsyncThunk(
  'profile/fetchBodyMeasurements',
  async (userId: string) => {
    // Mock API call - replace with actual Supabase API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockMeasurements: BodyMeasurements = {
      id: 'measurements-001',
      user_id: userId,
      height: 165, // cm
      weight: 60, // kg
      dress_size: 'M',
      top_size: 'M',
      bottom_size: '28',
      shoe_size: '8',
      bra_size: '34B',
      bust: 86,
      waist: 68,
      hips: 94,
      inseam: 76,
      shoulder_width: 38,
      arm_length: 58,
      neck: 32,
      preferred_fit: {
        tops: 'fitted',
        bottoms: 'regular',
        dresses: 'fitted',
      },
      body_type: 'hourglass',
      created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    };

    return mockMeasurements;
  }
);

/**
 * Update user profile
 */
export const updateUserProfile = createAsyncThunk(
  'profile/updateUserProfile',
  async (params: UpdateProfileParams) => {
    // Mock API call - replace with actual Supabase API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return params;
  }
);

/**
 * Update style preferences
 */
export const updateStylePreferences = createAsyncThunk(
  'profile/updateStylePreferences',
  async (params: UpdateStylePreferencesParams) => {
    // Mock API call - replace with actual Supabase API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return params;
  }
);

/**
 * Update body measurements
 */
export const updateBodyMeasurements = createAsyncThunk(
  'profile/updateBodyMeasurements',
  async (params: UpdateBodyMeasurementsParams) => {
    // Mock API call - replace with actual Supabase API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return params;
  }
);

/**
 * Upload avatar image
 */
export const uploadAvatarImage = createAsyncThunk(
  'profile/uploadAvatarImage',
  async (imageUri: string) => {
    // Mock API call - replace with actual Supabase Storage API
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return mock uploaded URL
    return `https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&t=${Date.now()}`;
  }
);

/**
 * Validate profile data
 */
const validateProfile = (profile: Partial<UserProfile>): ProfileValidation => {
  const errors: Record<string, string> = {};

  if (!profile.full_name?.trim()) {
    errors.full_name = 'Full name is required';
  }

  if (profile.full_name && profile.full_name.length < 2) {
    errors.full_name = 'Full name must be at least 2 characters';
  }

  if (profile.phone && !/^\+?[\d\s\-\(\)]+$/.test(profile.phone)) {
    errors.phone = 'Please enter a valid phone number';
  }

  if (profile.website && !/^https?:\/\/.+\..+/.test(profile.website)) {
    errors.website = 'Please enter a valid website URL';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Profile slice
const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    // Editing state management
    setEditing: (state, action: PayloadAction<boolean>) => {
      state.isEditing = action.payload;
      if (!action.payload) {
        state.editingSection = null;
      }
    },
    
    setEditingSection: (state, action: PayloadAction<ProfileState['editingSection']>) => {
      state.editingSection = action.payload;
      state.isEditing = action.payload !== null;
    },
    
    // Error management
    clearError: (state) => {
      state.error = null;
    },
    
    clearValidationErrors: (state) => {
      state.validationErrors = {};
    },
    
    setValidationErrors: (state, action: PayloadAction<Record<string, string>>) => {
      state.validationErrors = action.payload;
    },
    
    // Reset state
    resetProfileState: (state) => {
      return { ...initialState };
    },
  },
  extraReducers: (builder) => {
    // Fetch user profile
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch profile';
      });

    // Fetch style preferences
    builder
      .addCase(fetchStylePreferences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStylePreferences.fulfilled, (state, action) => {
        state.loading = false;
        state.stylePreferences = action.payload;
      })
      .addCase(fetchStylePreferences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch style preferences';
      });

    // Fetch body measurements
    builder
      .addCase(fetchBodyMeasurements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBodyMeasurements.fulfilled, (state, action) => {
        state.loading = false;
        state.bodyMeasurements = action.payload;
      })
      .addCase(fetchBodyMeasurements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch body measurements';
      });

    // Update user profile
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.saving = true;
        state.error = null;
        state.validationErrors = {};
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.saving = false;
        state.isEditing = false;
        state.editingSection = null;
        if (state.profile) {
          state.profile = { ...state.profile, ...action.payload, updated_at: new Date().toISOString() };
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message || 'Failed to update profile';
      });

    // Update style preferences
    builder
      .addCase(updateStylePreferences.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateStylePreferences.fulfilled, (state, action) => {
        state.saving = false;
        state.isEditing = false;
        state.editingSection = null;
        if (state.stylePreferences) {
          state.stylePreferences = { ...state.stylePreferences, ...action.payload, updated_at: new Date().toISOString() };
        }
      })
      .addCase(updateStylePreferences.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message || 'Failed to update style preferences';
      });

    // Update body measurements
    builder
      .addCase(updateBodyMeasurements.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateBodyMeasurements.fulfilled, (state, action) => {
        state.saving = false;
        state.isEditing = false;
        state.editingSection = null;
        if (state.bodyMeasurements) {
          state.bodyMeasurements = { ...state.bodyMeasurements, ...action.payload, updated_at: new Date().toISOString() };
        }
      })
      .addCase(updateBodyMeasurements.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message || 'Failed to update body measurements';
      });

    // Upload avatar image
    builder
      .addCase(uploadAvatarImage.pending, (state) => {
        state.uploadingAvatar = true;
        state.error = null;
      })
      .addCase(uploadAvatarImage.fulfilled, (state, action) => {
        state.uploadingAvatar = false;
        if (state.profile) {
          state.profile.avatar_url = action.payload;
          state.profile.updated_at = new Date().toISOString();
        }
      })
      .addCase(uploadAvatarImage.rejected, (state, action) => {
        state.uploadingAvatar = false;
        state.error = action.error.message || 'Failed to upload avatar';
      });
  },
});

// Export actions
export const {
  setEditing,
  setEditingSection,
  clearError,
  clearValidationErrors,
  setValidationErrors,
  resetProfileState,
} = profileSlice.actions;

// Export reducer
export default profileSlice.reducer;
