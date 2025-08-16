import { 
  authSlice, 
  signUp, 
  signIn, 
  signOut, 
  resetPassword, 
  updateProfile, 
  fetchProfile,
  setSession,
  clearError,
  setLoading
} from '../../src/store/slices/authSlice';
import { User, Session } from '@supabase/supabase-js';

// Mock Supabase
jest.mock('../../src/config/supabase', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      resetPasswordForEmail: jest.fn(),
    },
    from: jest.fn(() => ({
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(),
          })),
        })),
      })),
    })),
  },
}));

const mockSupabase = require('../../src/config/supabase').supabase;

describe('authSlice', () => {
  const initialState = {
    user: null,
    session: null,
    profile: null,
    loading: false,
    error: null,
    isAuthenticated: false,
  };

  describe('initial state', () => {
    it('should return the initial state', () => {
      expect(authSlice.reducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });
  });

  describe('setSession', () => {
    it('should set user and session', () => {
      const mockUser: User = {
        id: 'user-id',
        email: 'test@example.com',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      };

      const mockSession: Session = {
        access_token: 'mock-token',
        refresh_token: 'mock-refresh-token',
        expires_in: 3600,
        token_type: 'bearer',
        user: mockUser,
      };

      const actual = authSlice.reducer(initialState, setSession({
        user: mockUser,
        session: mockSession,
      }));

      expect(actual.user).toEqual(mockUser);
      expect(actual.session).toEqual(mockSession);
      expect(actual.isAuthenticated).toBe(true);
    });

    it('should clear user and session when null', () => {
      const actual = authSlice.reducer({
        ...initialState,
        user: { id: 'user-id', email: 'test@example.com' } as User,
        session: {} as Session,
        isAuthenticated: true,
      }, setSession({
        user: null,
        session: null,
      }));

      expect(actual.user).toBeNull();
      expect(actual.session).toBeNull();
      expect(actual.isAuthenticated).toBe(false);
    });
  });

  describe('clearError', () => {
    it('should clear error', () => {
      const state = {
        ...initialState,
        error: 'Test error message',
      };

      const actual = authSlice.reducer(state, clearError());

      expect(actual.error).toBeNull();
    });
  });

  describe('setLoading', () => {
    it('should set loading state', () => {
      const actual = authSlice.reducer(initialState, setLoading(true));

      expect(actual.loading).toBe(true);
    });

    it('should unset loading state', () => {
      const state = {
        ...initialState,
        loading: true,
      };

      const actual = authSlice.reducer(state, setLoading(false));

      expect(actual.loading).toBe(false);
    });
  });

  describe('signUp', () => {
    it('should handle pending state', () => {
      const action = { type: signUp.pending.type };
      const state = authSlice.reducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fulfilled state', async () => {
      const mockUser: User = {
        id: 'user-id',
        email: 'test@example.com',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      };

      const mockSession: Session = {
        access_token: 'mock-token',
        refresh_token: 'mock-refresh-token',
        expires_in: 3600,
        token_type: 'bearer',
        user: mockUser,
      };

      mockSupabase.auth.signUp.mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null,
      });

      const action = { type: signUp.fulfilled.type, payload: { user: mockUser, session: mockSession } };
      const state = authSlice.reducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.session).toEqual(mockSession);
      expect(state.isAuthenticated).toBe(true);
    });

    it('should handle rejected state', () => {
      const mockError = new Error('Sign up failed');
      const action = { type: signUp.rejected.type, error: { message: 'Sign up failed' } };
      const state = authSlice.reducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Sign up failed');
    });
  });

  describe('signIn', () => {
    it('should handle pending state', () => {
      const action = { type: signIn.pending.type };
      const state = authSlice.reducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fulfilled state', async () => {
      const mockUser: User = {
        id: 'user-id',
        email: 'test@example.com',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      };

      const mockSession: Session = {
        access_token: 'mock-token',
        refresh_token: 'mock-refresh-token',
        expires_in: 3600,
        token_type: 'bearer',
        user: mockUser,
      };

      mockSupabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null,
      });

      const action = { type: signIn.fulfilled.type, payload: { user: mockUser, session: mockSession } };
      const state = authSlice.reducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.session).toEqual(mockSession);
      expect(state.isAuthenticated).toBe(true);
    });

    it('should handle rejected state', () => {
      const action = { type: signIn.rejected.type, error: { message: 'Sign in failed' } };
      const state = authSlice.reducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Sign in failed');
    });
  });

  describe('signOut', () => {
    it('should handle pending state', () => {
      const action = { type: signOut.pending.type };
      const state = authSlice.reducer(initialState, action);

      expect(state.loading).toBe(true);
    });

    it('should handle fulfilled state', () => {
      const action = { type: signOut.fulfilled.type };
      const state = authSlice.reducer({
        ...initialState,
        user: { id: 'user-id', email: 'test@example.com' } as User,
        session: {} as Session,
        isAuthenticated: true,
      }, action);

      expect(state.loading).toBe(false);
      expect(state.user).toBeNull();
      expect(state.session).toBeNull();
      expect(state.profile).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });

    it('should handle rejected state', () => {
      const action = { type: signOut.rejected.type, error: { message: 'Sign out failed' } };
      const state = authSlice.reducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Sign out failed');
    });
  });

  describe('resetPassword', () => {
    it('should handle pending state', () => {
      const action = { type: resetPassword.pending.type };
      const state = authSlice.reducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fulfilled state', () => {
      const action = { type: resetPassword.fulfilled.type };
      const state = authSlice.reducer(initialState, action);

      expect(state.loading).toBe(false);
    });

    it('should handle rejected state', () => {
      const action = { type: resetPassword.rejected.type, error: { message: 'Password reset failed' } };
      const state = authSlice.reducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Password reset failed');
    });
  });

  describe('updateProfile', () => {
    it('should handle pending state', () => {
      const action = { type: updateProfile.pending.type };
      const state = authSlice.reducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fulfilled state', async () => {
      const mockProfile = {
        id: 'profile-id',
        user_id: 'user-id',
        full_name: 'Test User',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      };

      mockSupabase.from.mockReturnValue({
        update: jest.fn(() => ({
          eq: jest.fn(() => ({
            select: jest.fn(() => ({
              single: jest.fn().mockResolvedValue({
                data: mockProfile,
                error: null,
              }),
            })),
          })),
        })),
      });

      const action = { type: updateProfile.fulfilled.type, payload: mockProfile };
      const state = authSlice.reducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.profile).toEqual(mockProfile);
    });

    it('should handle rejected state', () => {
      const action = { type: updateProfile.rejected.type, error: { message: 'Profile update failed' } };
      const state = authSlice.reducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Profile update failed');
    });
  });

  describe('fetchProfile', () => {
    it('should handle pending state', () => {
      const action = { type: fetchProfile.pending.type };
      const state = authSlice.reducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fulfilled state', async () => {
      const mockProfile = {
        id: 'profile-id',
        user_id: 'user-id',
        full_name: 'Test User',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      };

      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn().mockResolvedValue({
              data: mockProfile,
              error: null,
            }),
          })),
        })),
      });

      const action = { type: fetchProfile.fulfilled.type, payload: mockProfile };
      const state = authSlice.reducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.profile).toEqual(mockProfile);
    });

    it('should handle rejected state', () => {
      const action = { type: fetchProfile.rejected.type, error: { message: 'Failed to fetch profile' } };
      const state = authSlice.reducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Failed to fetch profile');
    });
  });
});