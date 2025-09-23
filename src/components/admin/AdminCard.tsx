/**
 * @module components/admin/AdminCard
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from '../ui';
import { Colors, Typography, Spacing } from '../../constants';
import { AdminCardProps } from '../../store/types/admin';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - Spacing.component.screen.horizontal * 2 - Spacing.lg) / 2;

/**
 * A reusable card component for displaying statistics and metrics on the admin dashboard.
 * It features a glassmorphism design, trend indicators, and can be made interactive.
 * @param {object} props - The component props.
 * @param {string} props.title - The main title of the card.
 * @param {string | number} props.value - The primary value to be displayed.
 * @param {string} [props.subtitle] - An optional subtitle for the card.
 * @param {keyof typeof Ionicons.glyphMap} [props.icon] - The name of the icon to display.
 * @param {object} [props.trend] - An object representing the trend data.
 * @param {boolean} props.trend.isPositive - Whether the trend is positive or negative.
 * @param {number} props.trend.value - The percentage value of the trend.
 * @param {() => void} [props.onPress] - An optional function to handle press events.
 * @returns {React.FC} A React component.
 */
export const AdminCard: React.FC<AdminCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  onPress,
}) => {
  /**
   * Formats large numbers with appropriate suffixes (K for thousands, M for millions).
   * @param {string | number} val - The value to format.
   * @returns {string} The formatted value as a string.
   */
  const formatValue = (val: string | number): string => {
    if (typeof val === 'string') return val;
    
    if (val >= 1000000) {
      return `${(val / 1000000).toFixed(1)}M`;
    } else if (val >= 1000) {
      return `${(val / 1000).toFixed(1)}K`;
    }
    
    return val.toString();
  };

  /**
   * Determines the color for the trend indicator based on whether it's positive or negative.
   * @returns {string} The color hex code.
   */
  const getTrendColor = (): string => {
    if (!trend) return Colors.text.secondary;
    return trend.isPositive ? Colors.semantic.success : Colors.semantic.error;
  };

  /**
   * Determines the icon for the trend indicator based on whether it's positive or negative.
   * @returns {string} The name of the trend icon.
   */
  const getTrendIcon = (): string => {
    if (!trend) return 'remove-outline';
    return trend.isPositive ? 'trending-up' : 'trending-down';
  };

  /**
   * Renders the main content of the card.
   * @returns {React.FC} A React component.
   */
  const CardContent = () => (
    <GlassCard style={styles.card}>
      {/* Header with icon */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>
        
        {icon && (
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={Colors.gradients.primary}
              style={styles.iconGradient}
            >
              <Ionicons name={icon as any} size={24} color={Colors.text.white} />
            </LinearGradient>
          </View>
        )}
      </View>

      {/* Main value */}
      <View style={styles.valueContainer}>
        <Text style={styles.value}>
          {formatValue(value)}
        </Text>
        
        {/* Trend indicator */}
        {trend && (
          <View style={styles.trendContainer}>
            <Ionicons 
              name={getTrendIcon() as any} 
              size={16} 
              color={getTrendColor()} 
            />
            <Text style={[styles.trendText, { color: getTrendColor() }]}>
              {Math.abs(trend.value)}%
            </Text>
          </View>
        )}
      </View>

      {/* Interactive indicator */}
      {onPress && (
        <View style={styles.interactiveIndicator}>
          <Ionicons name="chevron-forward" size={16} color={Colors.text.secondary} />
        </View>
      )}
    </GlassCard>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <CardContent />
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <CardContent />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    marginBottom: Spacing.lg,
  },
  card: {
    padding: Spacing.lg,
    minHeight: 120,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  titleContainer: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  title: {
    ...Typography.styles.h6,
    color: Colors.text.primary,
    fontWeight: Typography.weights.semiBold,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.styles.caption,
    color: Colors.text.secondary,
    fontSize: 12,
  },
  iconContainer: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  iconGradient: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  valueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  value: {
    ...Typography.styles.h2,
    color: Colors.text.primary,
    fontWeight: Typography.weights.bold,
    fontSize: 28,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  trendText: {
    ...Typography.styles.caption,
    fontWeight: Typography.weights.semiBold,
    fontSize: 12,
  },
  interactiveIndicator: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
  },
});

export default AdminCard;
