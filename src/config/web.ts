/**
 * Web-specific configuration
 * Handles web platform differences and optimizations
 */

import { Platform } from 'react-native';

// Web platform detection
export const isWeb = Platform.OS === 'web';

// Web-specific feature flags
export const webFeatures = {
  // Camera features have limited support on web
  virtualTryOn: true,
  cameraCapture: typeof navigator !== 'undefined' && !!navigator.mediaDevices,
  fileUpload: true,
  
  // Payment features
  stripePayments: true,
  applePayWeb: false, // Apple Pay Web requires special setup
  googlePayWeb: true,
  
  // Storage features
  localStorage: typeof window !== 'undefined' && !!window.localStorage,
  sessionStorage: typeof window !== 'undefined' && !!window.sessionStorage,
  
  // Performance features
  imageOptimization: true,
  lazyLoading: true,
  serviceWorker: typeof navigator !== 'undefined' && 'serviceWorker' in navigator,
};

// Web-specific API endpoints
export const webApiConfig = {
  baseUrl: process.env.EXPO_PUBLIC_API_URL || 'https://api.aurafashion.app',
  timeout: 10000,
  retries: 3,
};

// Web performance optimizations
export const webPerformance = {
  // Image loading
  imageFormats: ['webp', 'avif', 'jpg', 'png'],
  imageSizes: [320, 640, 960, 1280, 1920],
  lazyLoadOffset: 100,
  
  // Bundle splitting
  chunkSize: 244 * 1024, // 244KB chunks
  maxChunks: 10,
  
  // Caching
  cacheStrategy: 'stale-while-revalidate',
  cacheDuration: 24 * 60 * 60 * 1000, // 24 hours
};

// Web-specific error handling
export const webErrorHandling = {
  enableSentry: process.env.EXPO_PUBLIC_SENTRY_DSN !== undefined,
  enableConsoleLogging: process.env.EXPO_PUBLIC_DEBUG_MODE === 'true',
  enableAnalytics: process.env.EXPO_PUBLIC_ENABLE_ANALYTICS === 'true',
};

// Browser compatibility checks
export const browserSupport = {
  checkWebGL: () => {
    try {
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch (e) {
      return false;
    }
  },
  
  checkWebAssembly: () => {
    return typeof WebAssembly === 'object';
  },
  
  checkServiceWorker: () => {
    return 'serviceWorker' in navigator;
  },
  
  checkPushNotifications: () => {
    return 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
  },
  
  checkWebRTC: () => {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  },
};

// Web-specific UI adaptations
export const webUI = {
  // Responsive breakpoints
  breakpoints: {
    mobile: 768,
    tablet: 1024,
    desktop: 1440,
    wide: 1920,
  },
  
  // Touch vs mouse interactions
  isTouchDevice: () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  },
  
  // Viewport detection
  getViewportSize: () => {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  },
  
  // Device pixel ratio
  getPixelRatio: () => {
    return window.devicePixelRatio || 1;
  },
};

// Web-specific analytics
export const webAnalytics = {
  // Google Analytics
  gaId: process.env.EXPO_PUBLIC_GOOGLE_ANALYTICS_ID,
  
  // Performance tracking
  trackPageLoad: () => {
    if (typeof window !== 'undefined' && window.performance) {
      const navigation = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        firstPaint: window.performance.getEntriesByName('first-paint')[0]?.startTime || 0,
        firstContentfulPaint: window.performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
      };
    }
    return null;
  },
  
  // User interaction tracking
  trackUserInteraction: (action: string, category: string, label?: string) => {
    if (webErrorHandling.enableAnalytics && typeof gtag !== 'undefined') {
      gtag('event', action, {
        event_category: category,
        event_label: label,
      });
    }
  },
};

// Web-specific security
export const webSecurity = {
  // Content Security Policy
  csp: {
    'default-src': "'self'",
    'script-src': "'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://www.googletagmanager.com",
    'style-src': "'self' 'unsafe-inline'",
    'img-src': "'self' data: https: blob:",
    'font-src': "'self' data:",
    'connect-src': "'self' https: wss:",
    'media-src': "'self' blob:",
    'object-src': "'none'",
    'base-uri': "'self'",
    'form-action': "'self'",
  },
  
  // HTTPS enforcement
  enforceHttps: process.env.NODE_ENV === 'production',
  
  // XSS protection
  enableXssProtection: true,
  
  // Frame options
  frameOptions: 'DENY',
};

// Export web configuration
export const webConfig = {
  features: webFeatures,
  api: webApiConfig,
  performance: webPerformance,
  errorHandling: webErrorHandling,
  browserSupport,
  ui: webUI,
  analytics: webAnalytics,
  security: webSecurity,
};

export default webConfig;
