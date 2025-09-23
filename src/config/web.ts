/**
 * @module config/web
 * @description Contains web-specific configurations, feature flags, and utility functions.
 * This module helps in handling differences between the web platform and native platforms.
 */

import { Platform } from 'react-native';

/**
 * A boolean flag indicating if the current platform is web.
 * @type {boolean}
 */
export const isWeb = Platform.OS === 'web';

/**
 * An object containing feature flags specific to the web platform.
 * @property {boolean} virtualTryOn - Whether the virtual try-on feature is enabled on the web.
 * @property {boolean} cameraCapture - Whether camera capture is available.
 * @property {boolean} fileUpload - Whether file upload is enabled.
 * @property {boolean} stripePayments - Whether Stripe payments are enabled.
 * @property {boolean} applePayWeb - Whether Apple Pay for the web is enabled.
 * @property {boolean} googlePayWeb - Whether Google Pay for the web is enabled.
 * @property {boolean} localStorage - Whether local storage is available.
 * @property {boolean} sessionStorage - Whether session storage is available.
 * @property {boolean} imageOptimization - Whether image optimization is enabled.
 * @property {boolean} lazyLoading - Whether lazy loading of assets is enabled.
 * @property {boolean} serviceWorker - Whether service workers are available.
 */
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

/**
 * An object containing API configuration for the web platform.
 * @property {string} baseUrl - The base URL for API requests.
 * @property {number} timeout - The timeout for API requests in milliseconds.
 * @property {number} retries - The number of retries for failed API requests.
 */
export const webApiConfig = {
  baseUrl: process.env.EXPO_PUBLIC_API_URL || 'https://api.aurafashion.app',
  timeout: 10000,
  retries: 3,
};

/**
 * An object containing performance optimization settings for the web.
 * @property {string[]} imageFormats - The preferred image formats.
 * @property {number[]} imageSizes - The available image sizes for optimization.
 * @property {number} lazyLoadOffset - The offset for lazy loading images.
 * @property {number} chunkSize - The chunk size for bundle splitting.
 * @property {number} maxChunks - The maximum number of chunks.
 * @property {string} cacheStrategy - The caching strategy for assets.
 * @property {number} cacheDuration - The duration for caching in milliseconds.
 */
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

/**
 * An object containing error handling settings for the web.
 * @property {boolean} enableSentry - Whether Sentry error reporting is enabled.
 * @property {boolean} enableConsoleLogging - Whether console logging is enabled.
 * @property {boolean} enableAnalytics - Whether analytics tracking is enabled.
 */
export const webErrorHandling = {
  enableSentry: process.env.EXPO_PUBLIC_SENTRY_DSN !== undefined,
  enableConsoleLogging: process.env.EXPO_PUBLIC_DEBUG_MODE === 'true',
  enableAnalytics: process.env.EXPO_PUBLIC_ENABLE_ANALYTICS === 'true',
};

/**
 * An object containing functions to check for browser compatibility and feature support.
 */
export const browserSupport = {
  /**
   * Checks if WebGL is supported by the browser.
   * @returns {boolean} True if WebGL is supported, false otherwise.
   */
  checkWebGL: () => {
    try {
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch (e) {
      return false;
    }
  },
  
  /**
   * Checks if WebAssembly is supported by the browser.
   * @returns {boolean} True if WebAssembly is supported, false otherwise.
   */
  checkWebAssembly: () => {
    return typeof WebAssembly === 'object';
  },
  
  /**
   * Checks if Service Workers are supported by the browser.
   * @returns {boolean} True if Service Workers are supported, false otherwise.
   */
  checkServiceWorker: () => {
    return 'serviceWorker' in navigator;
  },
  
  /**
   * Checks if Push Notifications are supported by the browser.
   * @returns {boolean} True if Push Notifications are supported, false otherwise.
   */
  checkPushNotifications: () => {
    return 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
  },
  
  /**
   * Checks if WebRTC is supported by the browser.
   * @returns {boolean} True if WebRTC is supported, false otherwise.
   */
  checkWebRTC: () => {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  },
};

/**
 * An object containing UI-related configurations and utility functions for the web.
 */
export const webUI = {
  /**
   * Responsive breakpoints for different screen sizes.
   * @property {number} mobile - The breakpoint for mobile devices.
   * @property {number} tablet - The breakpoint for tablet devices.
   * @property {number} desktop - The breakpoint for desktop devices.
   * @property {number} wide - The breakpoint for wide-screen devices.
   */
  breakpoints: {
    mobile: 768,
    tablet: 1024,
    desktop: 1440,
    wide: 1920,
  },
  
  /**
   * Checks if the current device is a touch device.
   * @returns {boolean} True if it's a touch device, false otherwise.
   */
  isTouchDevice: () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  },
  
  /**
   * Gets the current viewport size.
   * @returns {{width: number, height: number}} The width and height of the viewport.
   */
  getViewportSize: () => {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  },
  
  /**
   * Gets the device's pixel ratio.
   * @returns {number} The device pixel ratio.
   */
  getPixelRatio: () => {
    return window.devicePixelRatio || 1;
  },
};

/**
 * An object containing analytics-related configurations and functions for the web.
 */
export const webAnalytics = {
  /**
   * The Google Analytics ID.
   * @type {string | undefined}
   */
  gaId: process.env.EXPO_PUBLIC_GOOGLE_ANALYTICS_ID,
  
  /**
   * Tracks page load performance metrics.
   * @returns {object | null} An object with performance metrics, or null if not available.
   */
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
  
  /**
   * Tracks a user interaction event using Google Analytics.
   * @param {string} action - The action of the event.
   * @param {string} category - The category of the event.
   * @param {string} [label] - The label of the event.
   */
  trackUserInteraction: (action: string, category: string, label?: string) => {
    if (webErrorHandling.enableAnalytics && typeof gtag !== 'undefined') {
      gtag('event', action, {
        event_category: category,
        event_label: label,
      });
    }
  },
};

/**
 * An object containing web security configurations.
 */
export const webSecurity = {
  /**
   * The Content Security Policy (CSP) for the web application.
   * @type {object}
   */
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
  
  /**
   * A flag to enforce HTTPS in production.
   * @type {boolean}
   */
  enforceHttps: process.env.NODE_ENV === 'production',
  
  /**
   * A flag to enable XSS protection headers.
   * @type {boolean}
   */
  enableXssProtection: true,
  
  /**
   * The X-Frame-Options header value.
   * @type {string}
   */
  frameOptions: 'DENY',
};

/**
 * The main web configuration object, aggregating all other web-specific configurations.
 * @type {object}
 */
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
