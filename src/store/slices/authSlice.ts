/**
 * @module store/slices/authSlice
 * @description A Redux slice for managing authentication state, including user, session, and profile information.
 * It provides async thunks for signing up, signing in, signing out, resetting passwords, and managing user profiles.
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, Session } from '@supabase/supabase-js';
import { supabase, UserProfile } from '../../config/supabase';

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  session: null,
  profile: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

// Async thunks
/**
 * An async thunk for signing up a new user.
 * @param {object} params - The sign-up parameters.
 * @param {string} params.email - The user's email address.
 * @param {string} params.password - The user's password.
 * @param {string} [params.fullName] - The user's full name.
 * @returns {Promise<any>} A promise that resolves with the sign-up data.
 */
export const signUp = createAsyncThunk(
  'auth/signUp',
  async ({ email, password, fullName }: { email: string; password: string; fullName?: string }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) throw error;
    return data;
  }
);

/**
 * An async thunk for signing in a user.
 * @param {object} params - The sign-in parameters.
 * @param {string} params.email - The user's email address.
 * @param {string} params.password - The user's password.
 * @returns {Promise<any>} A promise that resolves with the sign-in data.
 */
export const signIn = createAsyncThunk(
  'auth/signIn',
  async ({ email, password }: { email: string; password: string }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  }
);

/**
 * An async thunk for signing out the current user.
 */
export const signOut = createAsyncThunk('auth/signOut', async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
});

/**
 * An async thunk for sending a password reset email.
 * @param {object} params - The password reset parameters.
 * @param {string} params.email - The user's email address.
 */
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ email }: { email: string }) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  }
);

/**
 * An async thunk for updating a user's profile.
 * @param {Partial<UserProfile>} updates - The profile updates.
 * @returns {Promise<any>} A promise that resolves with the updated profile data.
 */
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (updates: Partial<UserProfile>) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('user_id', updates.user_id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
);

/**
 * An async thunk for fetching a user's profile.
 * @param {string} userId - The ID of the user whose profile to fetch.
 * @returns {Promise<any>} A promise that resolves with the user's profile data.
 */
export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (userId: string) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Sets the user and session in the state.
     * @param {AuthState} state - The current state.
     * @param {PayloadAction<{ user: User | null; session: Session | null }>} action - The action containing the user and session.
     */
    setSession: (state, action: PayloadAction<{ user: User | null; session: Session | null }>) => {
      state.user = action.payload.user;
      state.session = action.payload.session;
      state.isAuthenticated = !!action.payload.user;
    },
    /**
     * Clears any authentication-related errors.
     * @param {AuthState} state - The current state.
     */
    clearError: (state) => {
      state.error = null;
    },
    /**
     * Sets the loading state.
     * @param {AuthState} state - The current state.
     * @param {PayloadAction<boolean>} action - The action containing the loading state.
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Sign Up
    builder
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.session = action.payload.session;
        state.isAuthenticated = !!action.payload.user;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Sign up failed';
      });

    // Sign In
    builder
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.session = action.payload.session;
        state.isAuthenticated = !!action.payload.user;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Sign in failed';
      });

    // Sign Out
    builder
      .addCase(signOut.pending, (state) => {
        state.loading = true;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.session = null;
        state.profile = null;
        state.isAuthenticated = false;
      })
      .addCase(signOut.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Sign out failed';
      });

    // Reset Password
    builder
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Password reset failed';
      });

    // Update Profile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Profile update failed';
      });

    // Fetch Profile
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch profile';
      });
  },
});

export const { setSession, clearError, setLoading } = authSlice.actions;
export default authSlice.reducer;
