const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Fix for bundling issues with undefined path resolution
config.resolver = {
  ...config.resolver,
  sourceExts: ['ts', 'tsx', 'js', 'jsx', 'json', 'mjs'],
  assetExts: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'ttf', 'otf', 'woff', 'woff2'],
  platforms: ['native', 'android', 'ios', 'web'],
  unstable_enablePackageExports: true,
  // Only exclude tests; allow react-native-web to be resolved by Metro
  blockList: require('metro-config/src/defaults/exclusionList')([
    /.*\/__tests__\/.*/,
  ]),
};

// Override serializer to handle path issues
config.serializer = {
  ...config.serializer,
  customSerializer: null,
};

module.exports = config;
