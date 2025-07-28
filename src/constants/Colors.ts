// Aura App - Turquoise & Glassmorphism Color Palette
export const Colors = {
  // Primary Turquoise Palette
  primary: {
    50: '#E6FFFA',
    100: '#B2F5EA',
    200: '#81E6D9',
    300: '#4FD1C7',
    400: '#38B2AC',
    500: '#319795', // Main turquoise
    600: '#2C7A7B',
    700: '#285E61',
    800: '#234E52',
    900: '#1D4044',
  },

  // Holographic Accents
  holographic: {
    pink: '#FF6B9D',
    purple: '#A855F7',
    blue: '#3B82F6',
    cyan: '#06B6D4',
    green: '#10B981',
    yellow: '#F59E0B',
  },

  // Glassmorphism Colors
  glass: {
    white: 'rgba(255, 255, 255, 0.25)',
    whiteStrong: 'rgba(255, 255, 255, 0.4)',
    dark: 'rgba(0, 0, 0, 0.25)',
    darkStrong: 'rgba(0, 0, 0, 0.4)',
    turquoise: 'rgba(49, 151, 149, 0.25)',
    turquoiseStrong: 'rgba(49, 151, 149, 0.4)',
  },

  // Background Gradients
  gradients: {
    primary: ['#319795', '#38B2AC', '#4FD1C7'] as const,
    holographic: ['#FF6B9D', '#A855F7', '#3B82F6', '#06B6D4'] as const,
    dark: ['#1D4044', '#234E52', '#285E61'] as const,
    light: ['#E6FFFA', '#B2F5EA', '#81E6D9'] as const,
  },

  // Semantic Colors
  semantic: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    errorBackground: 'rgba(239, 68, 68, 0.1)', // Light red background for error messages
  },

  // Text Colors
  text: {
    primary: '#1D4044',
    secondary: '#285E61',
    tertiary: '#2C7A7B',
    light: '#81E6D9',
    white: '#FFFFFF',
    muted: '#9CA3AF',
  },

  // Background Colors
  background: {
    primary: '#FFFFFF',
    secondary: '#F8FAFC',
    tertiary: '#E6FFFA',
    dark: '#1D4044',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },

  // Border Colors
  border: {
    light: 'rgba(255, 255, 255, 0.2)',
    dark: 'rgba(0, 0, 0, 0.1)',
    primary: 'rgba(49, 151, 149, 0.3)',
  },

  // Shadow Colors
  shadow: {
    light: 'rgba(0, 0, 0, 0.1)',
    medium: 'rgba(0, 0, 0, 0.2)',
    strong: 'rgba(0, 0, 0, 0.3)',
    colored: 'rgba(49, 151, 149, 0.3)',
  },
};

export default Colors;
