/**
 * @module constants/Spacing
 * @description Defines the spacing system for the Aura Fashion app, based on a 4px grid.
 * This includes a general spacing scale and component-specific spacing values.
 */

export const Spacing = {
  /**
   * The base unit for the spacing system (4px).
   */
  unit: 4,

  /**
   * A general-purpose spacing scale for consistent layout.
   */
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

  /**
   * Spacing values tailored for specific UI components.
   */
  component: {
    /**
     * Padding values for components.
     */
    padding: {
      xs: 8,
      sm: 12,
      md: 16,
      lg: 20,
      xl: 24,
    },
    
    /**
     * Margin values for components.
     */
    margin: {
      xs: 8,
      sm: 12,
      md: 16,
      lg: 20,
      xl: 24,
    },

    /**
     * Gap values for use in flexbox layouts.
     */
    gap: {
      xs: 4,
      sm: 8,
      md: 12,
      lg: 16,
      xl: 20,
    },

    /**
     * Border radius values for rounding corners.
     */
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

    /**
     * Default padding for screens.
     */
    screen: {
      horizontal: 20,
      vertical: 16,
    },

    /**
     * Spacing for card components.
     */
    card: {
      padding: 16,
      margin: 12,
      gap: 12,
    },

    /**
     * Spacing for button components.
     */
    button: {
      paddingHorizontal: 20,
      paddingVertical: 12,
      gap: 8,
    },

    /**
     * Spacing for input components.
     */
    input: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 8,
    },

    /**
     * Spacing for headers.
     */
    header: {
      height: 60,
      paddingHorizontal: 20,
      paddingVertical: 12,
    },

    /**
     * Spacing for tab bars.
     */
    tabBar: {
      height: 80,
      paddingHorizontal: 20,
      paddingVertical: 12,
    },

    /**
     * Spacing for modals.
     */
    modal: {
      padding: 20,
      margin: 20,
      gap: 16,
    },

    /**
     * Spacing for lists and list items.
     */
    list: {
      itemPadding: 16,
      itemGap: 8,
      sectionGap: 24,
    },
  },
};

export default Spacing;
