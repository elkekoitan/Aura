// Aura App - Typography System
export const Typography = {
  // Font Families
  fonts: {
    primary: 'System', // iOS: San Francisco, Android: Roboto
    secondary: 'System',
    mono: 'Courier New',
  },

  // Font Sizes
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
    '6xl': 60,
    '7xl': 72,
  },

  // Font Weights
  weights: {
    thin: '100' as const,
    extraLight: '200' as const,
    light: '300' as const,
    normal: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
    extraBold: '800' as const,
    black: '900' as const,
  },

  // Line Heights
  lineHeights: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },

  // Letter Spacing
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
    widest: 2,
  },

  // Text Styles
  styles: {
    h1: {
      fontSize: 36,
      fontWeight: '700' as const,
      lineHeight: 1.2,
      letterSpacing: -0.5,
    },
    h2: {
      fontSize: 30,
      fontWeight: '600' as const,
      lineHeight: 1.3,
      letterSpacing: -0.3,
    },
    h3: {
      fontSize: 24,
      fontWeight: '600' as const,
      lineHeight: 1.4,
      letterSpacing: 0,
    },
    h4: {
      fontSize: 20,
      fontWeight: '500' as const,
      lineHeight: 1.4,
      letterSpacing: 0,
    },
    h5: {
      fontSize: 18,
      fontWeight: '500' as const,
      lineHeight: 1.4,
      letterSpacing: 0,
    },
    h6: {
      fontSize: 16,
      fontWeight: '500' as const,
      lineHeight: 1.4,
      letterSpacing: 0,
    },
    body: {
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 1.6,
      letterSpacing: 0,
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 1.5,
      letterSpacing: 0,
    },
    caption: {
      fontSize: 12,
      fontWeight: '400' as const,
      lineHeight: 1.4,
      letterSpacing: 0.5,
    },
    button: {
      fontSize: 16,
      fontWeight: '600' as const,
      lineHeight: 1.2,
      letterSpacing: 0.5,
    },
    buttonSmall: {
      fontSize: 14,
      fontWeight: '600' as const,
      lineHeight: 1.2,
      letterSpacing: 0.5,
    },
    label: {
      fontSize: 14,
      fontWeight: '500' as const,
      lineHeight: 1.4,
      letterSpacing: 0.3,
    },
  },
};

export default Typography;
