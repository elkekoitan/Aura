// Web stub for React Native's TurboModuleRegistry
// This module is used for native module registration but doesn't exist on web

const mockDevSettings = {
  addMenuItem: () => {},
  reload: () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  },
  onFastRefresh: () => {},
  setHotLoadingEnabled: () => {},
  setLiveReloadEnabled: () => {},
  setProfilingEnabled: () => {},
  setRemoteDebuggingEnabled: () => {},
};

const mockSourceCode = {
  getConstants: () => ({
    scriptURL: typeof window !== 'undefined' ? window.location.href : '',
    bundleURL: typeof window !== 'undefined' ? window.location.href : ''
  })
};

const TurboModuleRegistry = {
  get: (name) => {
    console.warn(`TurboModuleRegistry.get('${name}') called on web - returning null`);
    return null;
  },
  getEnforcing: (name) => {
    console.warn(`TurboModuleRegistry.getEnforcing('${name}') called on web - returning stub`);
    
    // Return stubs for common modules
    if (name === 'DevSettings') {
      return mockDevSettings;
    }
    
    if (name === 'SourceCode') {
      return mockSourceCode;
    }
    
    // Return empty stub for other modules
    return {};
  },
};

// Set global TurboModuleRegistry for web compatibility
if (typeof window !== 'undefined') {
  window.TurboModuleRegistry = TurboModuleRegistry;
}
if (typeof global !== 'undefined') {
  global.TurboModuleRegistry = TurboModuleRegistry;
}

export default TurboModuleRegistry;