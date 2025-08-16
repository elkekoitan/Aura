// Patch TurboModuleRegistry for web compatibility
// This must be imported before any React Native modules

if (typeof window !== 'undefined') {
  console.log('Patching TurboModuleRegistry for web...');
  
  // Create mock modules
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
      scriptURL: window.location.href,
      bundleURL: window.location.href
    })
  };

  // Create a mock TurboModuleRegistry
  const mockTurboModuleRegistry = {
    get: (name) => {
      console.log(`[TurboModuleRegistry] get called with: ${name}`);
      if (name === 'DevSettings') {
        return mockDevSettings;
      }
      if (name === 'SourceCode') {
        return mockSourceCode;
      }
      return null;
    },
    getEnforcing: (name) => {
      console.log(`[TurboModuleRegistry] getEnforcing called with: ${name}`);
      if (name === 'DevSettings') {
        return mockDevSettings;
      }
      if (name === 'SourceCode') {
        return mockSourceCode;
      }
      throw new Error(`TurboModuleRegistry.getEnforcing(...): '${name}' could not be found. Verify that a module by this name is registered in the native binary.`);
    }
  };

  // Try to patch the global TurboModuleRegistry
  if (typeof global !== 'undefined') {
    global.TurboModuleRegistry = mockTurboModuleRegistry;
    console.log('Set global.TurboModuleRegistry');
  }
  
  window.TurboModuleRegistry = mockTurboModuleRegistry;
  console.log('Set window.TurboModuleRegistry');
  
  // Monkey patch the require function to intercept TurboModuleRegistry imports
  if (typeof global !== 'undefined' && global.__r) {
    const originalRequire = global.__r;
    global.__r = function(moduleId) {
      if (typeof moduleId === 'string' && moduleId.includes('TurboModuleRegistry')) {
        console.log('Intercepted TurboModuleRegistry require:', moduleId);
        return mockTurboModuleRegistry;
      }
      return originalRequire.apply(this, arguments);
    };
    console.log('Patched global.__r');
  }
}

export default {};