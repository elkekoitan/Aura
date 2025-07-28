// Aura App - Spacing System
export const Spacing = {
  // Base spacing unit (4px)
  unit: 4,

  // Spacing scale
  xs: 4,    // 4px
  sm: 8,    // 8px
  md: 12,   // 12px
  lg: 16,   // 16px
  xl: 20,   // 20px
  '2xl': 24, // 24px
  '3xl': 32, // 32px
  '4xl': 40, // 40px
  '5xl': 48, // 48px
  '6xl': 64, // 64px
  '7xl': 80, // 80px
  '8xl': 96, // 96px

  // Component specific spacing
  component: {
    // Padding
    padding: {
      xs: 8,
      sm: 12,
      md: 16,
      lg: 20,
      xl: 24,
    },
    
    // Margins
    margin: {
      xs: 8,
      sm: 12,
      md: 16,
      lg: 20,
      xl: 24,
    },

    // Gaps
    gap: {
      xs: 4,
      sm: 8,
      md: 12,
      lg: 16,
      xl: 20,
    },

    // Border radius
    radius: {
      xs: 4,
      sm: 8,
      md: 12,
      lg: 16,
      xl: 20,
      '2xl': 24,
      '3xl': 32,
      full: 9999,
    },

    // Screen padding
    screen: {
      horizontal: 20,
      vertical: 16,
    },

    // Card spacing
    card: {
      padding: 16,
      margin: 12,
      gap: 12,
    },

    // Button spacing
    button: {
      paddingHorizontal: 20,
      paddingVertical: 12,
      gap: 8,
    },

    // Input spacing
    input: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 8,
    },

    // Header spacing
    header: {
      height: 60,
      paddingHorizontal: 20,
      paddingVertical: 12,
    },

    // Tab bar spacing
    tabBar: {
      height: 80,
      paddingHorizontal: 20,
      paddingVertical: 12,
    },

    // Modal spacing
    modal: {
      padding: 20,
      margin: 20,
      gap: 16,
    },

    // List spacing
    list: {
      itemPadding: 16,
      itemGap: 8,
      sectionGap: 24,
    },
  },
};

export default Spacing;
