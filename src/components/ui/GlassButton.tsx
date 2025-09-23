/**
 * @module components/ui/GlassButton
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Animated } from 'react-native';
import { Colors, Typography, Spacing } from '../../constants';

interface GlassButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  gradient?: boolean;
  gradientColors?: readonly string[];
  fullWidth?: boolean;
}

/**
 * A stylish button with a glass-like, blurred background effect.
 * It supports different variants, sizes, loading states, and icons.
 * @param {object} props - The component props.
 * @param {string} props.title - The text to display on the button.
 * @param {() => void} props.onPress - The function to call when the button is pressed.
 * @param {'primary' | 'secondary' | 'outline' | 'ghost'} [props.variant='primary'] - The button's visual style.
 * @param {'small' | 'medium' | 'large'} [props.size='medium'] - The size of the button.
 * @param {boolean} [props.disabled=false] - Whether the button is disabled.
 * @param {boolean} [props.loading=false] - Whether to show a loading indicator.
 * @param {ViewStyle} [props.style] - Custom styles for the button container.
 * @param {TextStyle} [props.textStyle] - Custom styles for the button text.
 * @param {React.ReactNode} [props.icon] - An icon to display on the button.
 * @param {'left' | 'right'} [props.iconPosition='left'] - The position of the icon relative to the text.
 * @param {boolean} [props.gradient=false] - Whether to apply a gradient background.
 * @param {readonly string[]} [props.gradientColors=Colors.gradients.primary] - The colors for the gradient.
 * @param {boolean} [props.fullWidth=false] - Whether the button should take up the full width of its container.
 * @returns {React.FC} A React component.
 */
export const GlassButton: React.FC<GlassButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
  iconPosition = 'left',
  gradient = false,
  gradientColors = Colors.gradients.primary,
  fullWidth = false,
}) => {
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  /**
   * Handles the press-in event to animate the button scale down.
   */
  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  /**
   * Handles the press-out event to animate the button scale back to normal.
   */
  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  /**
   * Determines the button's style based on its variant, size, and state.
   * @returns {ViewStyle} The computed button style.
   */
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: Spacing.component.radius.lg,
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      borderWidth: 1,
    };

    if (fullWidth) {
      baseStyle.width = '100%';
    }

    // Size variations
    switch (size) {
      case 'small':
        baseStyle.paddingHorizontal = Spacing.component.button.paddingHorizontal * 0.75;
        baseStyle.paddingVertical = Spacing.component.button.paddingVertical * 0.75;
        baseStyle.minHeight = 36;
        break;
      case 'large':
        baseStyle.paddingHorizontal = Spacing.component.button.paddingHorizontal * 1.25;
        baseStyle.paddingVertical = Spacing.component.button.paddingVertical * 1.25;
        baseStyle.minHeight = 56;
        break;
      default:
        baseStyle.paddingHorizontal = Spacing.component.button.paddingHorizontal;
        baseStyle.paddingVertical = Spacing.component.button.paddingVertical;
        baseStyle.minHeight = 48;
    }

    // Variant styles
    switch (variant) {
      case 'primary':
        baseStyle.backgroundColor = Colors.glass.turquoiseStrong;
        baseStyle.borderColor = Colors.border.primary;
        break;
      case 'secondary':
        baseStyle.backgroundColor = Colors.glass.white;
        baseStyle.borderColor = Colors.border.light;
        break;
      case 'outline':
        baseStyle.backgroundColor = 'transparent';
        baseStyle.borderColor = Colors.primary[500];
        baseStyle.borderWidth = 2;
        break;
      case 'ghost':
        baseStyle.backgroundColor = 'transparent';
        baseStyle.borderColor = 'transparent';
        break;
    }

    if (disabled) {
      baseStyle.opacity = 0.5;
    }

    return { ...baseStyle, ...style };
  };

  /**
   * Determines the text style based on the button's variant and size.
   * @returns {TextStyle} The computed text style.
   */
  const getTextStyle = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      ...Typography.styles.button,
      textAlign: 'center',
    };

    // Size variations
    switch (size) {
      case 'small':
        baseTextStyle.fontSize = Typography.sizes.sm;
        break;
      case 'large':
        baseTextStyle.fontSize = Typography.sizes.lg;
        break;
    }

    // Variant text colors
    switch (variant) {
      case 'primary':
        baseTextStyle.color = Colors.text.white;
        break;
      case 'secondary':
        baseTextStyle.color = Colors.text.primary;
        break;
      case 'outline':
        baseTextStyle.color = Colors.primary[500];
        break;
      case 'ghost':
        baseTextStyle.color = Colors.text.primary;
        break;
    }

    return { ...baseTextStyle, ...textStyle };
  };

  /**
   * Renders the content of the button, including the icon, text, and loading indicator.
   * @returns {React.ReactElement} The button content.
   */
  const renderContent = () => (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
      {loading && <ActivityIndicator size="small" color={getTextStyle().color} />}
      {!loading && icon && iconPosition === 'left' && icon}
      {!loading && <Text style={getTextStyle()}>{title}</Text>}
      {!loading && icon && iconPosition === 'right' && icon}
    </View>
  );

  if (gradient && variant === 'primary') {
    return (
      <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
        <TouchableOpacity
          style={getButtonStyle()}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled || loading}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={gradientColors as any}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />
          <BlurView intensity={20} tint="light" style={{ padding: 0 }}>
            {renderContent()}
          </BlurView>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <TouchableOpacity
        style={getButtonStyle()}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.8}
      >
        <BlurView intensity={20} tint="light" style={{ padding: 0 }}>
          {renderContent()}
        </BlurView>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default GlassButton;
