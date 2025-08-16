'use strict';

// Minimal web stub that stores settings in-memory
let settings = null;

export function getGlobalHookSettings() {
  return settings;
}

export function setGlobalHookSettings(serialized) {
  settings = serialized;
}

export default { getGlobalHookSettings, setGlobalHookSettings };