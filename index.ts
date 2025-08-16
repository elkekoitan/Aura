import { registerRootComponent } from 'expo';
import { Platform } from 'react-native';

// Initialize React Native bridge config for web only
if (Platform.OS === 'web') {
  // Load stubs conditionally to avoid missing file errors
  try {
    require('./src/utils/patch-turbo-module-registry');
    require('./src/utils/fbBatchedBridge-web-stub');
  } catch (error) {
    console.warn('Web stubs not available:', error);
  }
}

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
