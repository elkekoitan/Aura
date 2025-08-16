// Minimal web stub for React Native's RCTAlertManager used by Alert.prompt on iOS
// On web, we can implement as a no-op; callers often guard by Platform.OS === 'ios'.
// For safety, provide alertWithArgs that maps to window.alert if available.

function alertWithArgs(args, onResult) {
  try {
    const { title, message } = args || {};
    if (typeof window !== 'undefined' && window.alert) {
      const text = [title, message].filter(Boolean).join('\n');
      window.alert(text);
    }
  } finally {
    // invoke callback with id=0 and no value (emulates pressing first button)
    if (typeof onResult === 'function') {
      onResult(0, undefined);
    }
  }
}

export default { alertWithArgs };