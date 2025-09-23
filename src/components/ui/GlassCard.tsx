/**
 * @module components/ui/GlassCard
 */

import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing } from '../../constants';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
  gradient?: boolean;
  gradientColors?: readonly string[];
  borderRadius?: number;
  padding?: number;
  margin?: number;
  shadow?: boolean;
}

/**
 * A card component with a frosted glass effect using `expo-blur`.
 * It can be customized with gradients, shadows, and various other properties.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The content to render inside the card.
 * @param {ViewStyle} [props.style] - Custom styles for the card container.
 * @param {number} [props.intensity=20] - The intensity of the blur effect.
 * @param {'light' | 'dark' | 'default'} [props.tint='light'] - The tint of the blur view.
 * @param {boolean} [props.gradient=false] - Whether to apply a gradient background.
 * @param {readonly string[]} [props.gradientColors=Colors.gradients.primary] - The colors for the gradient.
 * @param {number} [props.borderRadius=Spacing.component.radius.lg] - The border radius of the card.
 * @param {number} [props.padding=Spacing.component.card.padding] - The padding inside the card.
 * @param {number} [props.margin=Spacing.component.card.margin] - The margin around the card.
 * @param {boolean} [props.shadow=true] - Whether to apply a shadow to the card.
 * @returns {React.FC} A React component.
 */
export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  intensity = 20,
  tint = 'light',
  gradient = false,
  gradientColors = Colors.gradients.primary,
  borderRadius = Spacing.component.radius.lg,
  padding = Spacing.component.card.padding,
  margin = Spacing.component.card.margin,
  shadow = true,
}) => {
  const cardStyle: ViewStyle = {
    borderRadius,
    margin,
    overflow: 'hidden',
    ...style,
  };

  const contentStyle: ViewStyle = {
    padding,
    borderRadius,
    borderWidth: 1,
    borderColor: Colors.border.light,
    backgroundColor: Colors.glass.white,
  };

  if (shadow) {
    cardStyle.shadowColor = Colors.shadow.colored;
    cardStyle.shadowOffset = { width: 0, height: 8 };
    cardStyle.shadowOpacity = 0.3;
    cardStyle.shadowRadius = 16;
    cardStyle.elevation = 8;
  }

  if (gradient) {
    return (
      <View style={cardStyle}>
        <LinearGradient
          colors={gradientColors as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
        <BlurView intensity={intensity} tint={tint} style={contentStyle}>
          {children}
        </BlurView>
      </View>
    );
  }

  return (
    <View style={cardStyle}>
      <BlurView intensity={intensity} tint={tint} style={contentStyle}>
        {children}
      </BlurView>
    </View>
  );
};

export default GlassCard;
