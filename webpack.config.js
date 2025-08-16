const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Add alias to replace React Native modules with web stubs for web builds
  config.resolve.alias = {
    ...config.resolve.alias,
    // Ensure all `react-native` imports resolve to react-native-web
    'react-native': require.resolve('react-native-web'),
    '@stripe/stripe-react-native': path.resolve(__dirname, 'src/utils/stripe-web-stub.js'),
    'expo-camera': path.resolve(__dirname, 'src/utils/camera-web-stub.js'),

    // Stubs for RN deep internals referenced by some libs
    'react-native/Libraries/ReactNative/ReactFabricPublicInstance/ReactFabricPublicInstance': path.resolve(__dirname, 'src/utils/reactFabricPublicInstance.js'),
  };

  // Add fallbacks for Node.js modules that aren't available in the browser
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "crypto": false,
    "stream": false,
    "buffer": false,
    "util": false,
    "assert": false,
    "http": false,
    "https": false,
    "os": false,
    "url": false,
    "zlib": false,
  };

  return config;
};
