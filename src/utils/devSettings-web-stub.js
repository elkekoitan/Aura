// Web stub for React Native's DevSettings module
// This module is used for development settings but doesn't exist on web

const DevSettings = {
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

export default DevSettings;