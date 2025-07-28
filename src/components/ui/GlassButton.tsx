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
  gradientColors?: string[];
  fullWidth?: boolean;
}

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

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

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
            colors={gradientColors}
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
