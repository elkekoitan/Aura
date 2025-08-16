import '@testing-library/jest-native';
import 'react-native-gesture-handler/jestSetup';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock Expo modules
jest.mock('expo-constants', () => ({
  manifest: {
    expo: {
      name: 'Aura Fashion App',
      slug: 'aura-fashion-app',
      version: '1.0.0',
    },
  },
}));

// Mock Linear Gradient
jest.mock('expo-linear-gradient', () => {
  const React = require('react');
  const { View } = require('react-native');
  return React.forwardRef(({ children, ...props }, ref) => {
    return <View ref={ref} {...props}>{children}</View>;
  });
});

// Mock Blur View
jest.mock('expo-blur', () => {
  const React = require('react');
  const { View } = require('react-native');
  return React.forwardRef(({ children, ...props }, ref) => {
    return <View ref={ref} {...props}>{children}</View>;
  });
});

// Mock Image Picker
jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(() =>
    Promise.resolve({
      canceled: false,
      assets: [{ uri: 'mock-image-uri', width: 300, height: 400 }],
    })
  ),
  requestMediaLibraryPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: 'granted', granted: true })
  ),
  MediaTypeOptions: {
    Images: 'images',
  },
}));

// Mock Camera
jest.mock('expo-camera', () => ({
  Camera: jest.fn(() => null),
  requestCameraPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: 'granted', granted: true })
  ),
}));

// Mock Media Library
jest.mock('expo-media-library', () => ({
  requestPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: 'granted', granted: true })
  ),
  getAssetInfoAsync: jest.fn(() =>
    Promise.resolve({
      uri: 'mock-media-uri',
      filename: 'test.jpg',
      duration: 1000,
      fileSize: 1024,
      type: 'image',
    })
  ),
}));

// Mock Supabase
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    auth: {
      getSession: jest.fn(() =>
        Promise.resolve({
          data: { session: null },
          error: null,
        })
      ),
      onAuthStateChange: jest.fn(() => ({
        data: {
          subscription: {
            unsubscribe: jest.fn(),
          },
        },
      })),
      signUp: jest.fn(() =>
        Promise.resolve({
          data: { user: null, session: null },
          error: null,
        })
      ),
      signInWithPassword: jest.fn(() =>
        Promise.resolve({
          data: { user: null, session: null },
          error: null,
        })
      ),
      signOut: jest.fn(() =>
        Promise.resolve({
          error: null,
        })
      ),
      resetPasswordForEmail: jest.fn(() =>
        Promise.resolve({
          error: null,
        })
      ),
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() =>
            Promise.resolve({
              data: null,
              error: null,
            })
          ),
        })),
        insert: jest.fn(() =>
          Promise.resolve({
            data: null,
            error: null,
          })
        ),
        update: jest.fn(() =>
          Promise.resolve({
            data: null,
            error: null,
          })
        ),
        delete: jest.fn(() =>
          Promise.resolve({
            data: null,
            error: null,
          })
        ),
      })),
    })),
  })),
}));

// Mock Stripe
jest.mock('@stripe/stripe-react-native', () => ({
  StripeProvider: ({ children }) => children,
  useStripe: () => ({
    presentPaymentSheet: jest.fn(),
    confirmPayment: jest.fn(),
    createPaymentMethod: jest.fn(),
    initPaymentSheet: jest.fn(),
  }),
}));

// Mock Redux store
const mockStore = {
  dispatch: jest.fn(),
  getState: jest.fn(),
  subscribe: jest.fn(),
  replaceReducer: jest.fn(),
  injectDefaultMiddleware: jest.fn(),
};

jest.mock('../src/store', () => ({
  store: mockStore,
}));

// Mock navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    reset: jest.fn(),
    dispatch: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    isFocused: () => true,
    canGoBack: () => false,
    getParent: () => null,
    getId: () => 'test',
  }),
  useRoute: () => ({
    params: {},
    name: 'Test',
    key: 'test-key',
  }),
  NavigationContainer: ({ children }) => children,
  createStackNavigator: () => ({
    Navigator: ({ children }) => children,
    Screen: ({ children }) => children,
  }),
  useFocusEffect: jest.fn(),
}));

// Mock gesture handler
jest.mock('react-native-gesture-handler', () => ({
  GestureHandlerRootView: ({ children }) => children,
  PanGestureHandler: ({ children }) => children,
  TapGestureHandler: ({ children }) => children,
}));

// Mock safe area context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

// Mock dimensions
jest.mock('react-native/Libraries/Utilities/Dimensions', () => ({
  get: () => ({ width: 375, height: 812 }),
}));

// Mock platform
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'ios',
  select: jest.fn((obj) => obj.ios),
}));

// Mock vector icons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: jest.fn(() => null),
}));

// Suppress console warnings in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
  log: jest.fn(),
};

// Mock timers
jest.useFakeTimers();

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
  jest.useRealTimers();
});