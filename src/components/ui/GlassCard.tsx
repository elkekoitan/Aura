import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Spacing } from '../../constants';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
  gradient?: boolean;
  gradientColors?: readonly string[];
  borderRadius?: number;
  padding?: number;
  margin?: number;
  shadow?: boolean;
}

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
  const baseCardStyle: ViewStyle = {
    borderRadius,
    margin,
    overflow: 'hidden',
  };

  const shadowStyle: ViewStyle = shadow
    ? {
        shadowColor: Colors.shadow.colored,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
      }
    : {};

  const containerStyle: any = [baseCardStyle, shadowStyle, style];

  const contentStyle: ViewStyle = {
    padding,
    borderRadius,
    borderWidth: 1,
    borderColor: Colors.border.light,
    backgroundColor: Colors.glass.white,
  };

  if (gradient) {
    return (
      <View style={containerStyle}>
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
    <View style={containerStyle}>
      <BlurView intensity={intensity} tint={tint} style={contentStyle}>
        {children}
      </BlurView>
    </View>
  );
};

export default GlassCard;
