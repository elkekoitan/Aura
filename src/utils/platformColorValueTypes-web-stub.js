'use strict';

// Web stub for React Native's StyleSheet PlatformColorValueTypes
// Provides a no-op processor so processColor can continue with numeric colors.

export function processColorObject(input) {
  // On web, platform-specific color objects (PlatformColor, DynamicColorIOS) are unsupported.
  // Returning null signals the caller to fall back to default processing.
  return null;
}

export default {
  processColorObject,
};