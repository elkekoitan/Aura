// Web stub for React Native's __fbBatchedBridgeConfig
// This global is expected by RN's native module system but doesn't exist on web

console.log('Loading fbBatchedBridge web stub...');

if (typeof global !== 'undefined' && !global.__fbBatchedBridgeConfig) {
  global.__fbBatchedBridgeConfig = {
    remoteModuleConfig: [],
    localModulesConfig: []
  };
  console.log('Set global.__fbBatchedBridgeConfig');
}

if (typeof window !== 'undefined' && !window.__fbBatchedBridgeConfig) {
  window.__fbBatchedBridgeConfig = {
    remoteModuleConfig: [],
    localModulesConfig: []
  };
  console.log('Set window.__fbBatchedBridgeConfig');
}

// Export empty object for module compatibility
export default {};