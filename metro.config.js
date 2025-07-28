const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add resolver configuration to handle platform-specific modules
config.resolver.platforms = ['web', 'ios', 'android', 'native'];

// Configure platform-specific module resolution
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// Add platform-specific extensions
config.resolver.sourceExts = [...config.resolver.sourceExts, 'web.js', 'web.ts', 'web.tsx'];

// Configure module mapping for web platform
config.resolver.alias = {
  ...config.resolver.alias,
  // Map Stripe React Native to empty module for web builds
  '@stripe/stripe-react-native': require.resolve('./src/utils/stripe-web-stub.js'),
  // Map Expo Camera to web-compatible implementation
  'expo-camera': require.resolve('./src/utils/camera-web-stub.js'),
};

// Configure platform-specific extensions for web
config.resolver.platforms = ['web', 'native', 'ios', 'android'];
config.resolver.sourceExts = [...config.resolver.sourceExts, 'web.js', 'web.ts', 'web.tsx'];

module.exports = config;
