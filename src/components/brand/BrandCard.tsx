/**
 * BrandCard Component
 * Reusable brand card with glassmorphism design
 * Displays brand logo, name, stats, and interactive actions
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard, GlassButton } from '../ui';
import { Colors, Typography, Spacing } from '../../constants';
import { Brand } from '../../store/types/brand';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - Spacing.component.screen.horizontal * 2 - Spacing.lg) / 2;

interface BrandCardProps {
  brand: Brand;
  onPress?: (brand: Brand) => void;
  onFollow?: (brand: Brand) => void;
  showStats?: boolean;
  showProducts?: boolean;
  compact?: boolean;
  isFollowing?: boolean;
  productCount?: number;
}

export const BrandCard: React.FC<BrandCardProps> = ({
  brand,
  onPress,
  onFollow,
  showStats = true,
  showProducts = false,
  compact = false,
  isFollowing = false,
  productCount,
}) => {
  /**
   * Get brand logo with fallback
   */
  const getBrandLogo = (): string => {
    return brand.logo_url || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop';
  };

  /**
   * Get product count display
   */
  const getProductCount = (): number => {
    return productCount || brand.product_count || brand.products?.length || 0;
  };

  /**
   * Handle card press
   */
  const handlePress = () => {
    onPress?.(brand);
  };

  /**
   * Handle follow toggle
   */
  const handleFollow = (event: any) => {
    event.stopPropagation();
    onFollow?.(brand);
  };

  return (
    <TouchableOpacity
      style={[styles.container, compact && styles.compactContainer]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <GlassCard style={[styles.card, compact && styles.compactCard]}>
        {/* Brand Header */}
        <View style={[styles.header, compact && styles.compactHeader]}>
          {/* Brand Logo */}
          <View style={[styles.logoContainer, compact && styles.compactLogoContainer]}>
            <Image
              source={{ uri: getBrandLogo() }}
              style={[styles.logo, compact && styles.compactLogo]}
              resizeMode="cover"
            />
            
            {/* Featured Badge */}
            {brand.is_featured && (
              <View style={styles.featuredBadge}>
                <LinearGradient
                  colors={Colors.gradients.primary}
                  style={styles.featuredGradient}
                >
                  <Ionicons name="star" size={12} color={Colors.text.white} />
                </LinearGradient>
              </View>
            )}
          </View>

          {/* Follow Button */}
          {onFollow && !compact && (
            <TouchableOpacity
              style={styles.followButton}
              onPress={handleFollow}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={isFollowing ? Colors.gradients.primary : Colors.gradients.glass}
                style={styles.followGradient}
              >
                <Ionicons
                  name={isFollowing ? "heart" : "heart-outline"}
                  size={16}
                  color={isFollowing ? Colors.text.white : Colors.text.primary}
                />
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>

        {/* Brand Info */}
        <View style={[styles.infoContainer, compact && styles.compactInfoContainer]}>
          {/* Brand Name */}
          <Text 
            style={[styles.brandName, compact && styles.compactBrandName]}
            numberOfLines={compact ? 1 : 2}
          >
            {brand.name}
          </Text>

          {/* Brand Description */}
          {!compact && (
            <Text 
              style={styles.description}
              numberOfLines={2}
            >
              {brand.description}
            </Text>
          )}

          {/* Stats */}
          {showStats && (
            <View style={styles.statsContainer}>
              <View style={styles.stat}>
                <Ionicons name="shirt-outline" size={14} color={Colors.text.secondary} />
                <Text style={styles.statText}>
                  {getProductCount()} {getProductCount() === 1 ? 'Product' : 'Products'}
                </Text>
              </View>
              
              {brand.website_url && (
                <View style={styles.stat}>
                  <Ionicons name="globe-outline" size={14} color={Colors.text.secondary} />
                  <Text style={styles.statText}>Website</Text>
                </View>
              )}
            </View>
          )}

          {/* Featured Products Preview */}
          {showProducts && brand.products && brand.products.length > 0 && (
            <View style={styles.productsPreview}>
              <Text style={styles.productsTitle}>Featured Products</Text>
              <View style={styles.productImages}>
                {brand.products.slice(0, 3).map((product, index) => (
                  <Image
                    key={product.id}
                    source={{ uri: product.images?.[0] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&h=100&fit=crop' }}
                    style={[styles.productImage, { zIndex: 3 - index }]}
                  />
                ))}
                {brand.products.length > 3 && (
                  <View style={styles.moreProducts}>
                    <Text style={styles.moreText}>+{brand.products.length - 3}</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Compact Follow Button */}
          {onFollow && compact && (
            <GlassButton
              title={isFollowing ? "Following" : "Follow"}
              onPress={handleFollow}
              variant={isFollowing ? "primary" : "outline"}
              size="small"
              fullWidth
              gradient={isFollowing}
              gradientColors={Colors.gradients.primary}
              style={styles.compactFollowButton}
            />
          )}
        </View>
      </GlassCard>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    marginBottom: Spacing.lg,
  },
  compactContainer: {
    width: '100%',
  },
  card: {
    overflow: 'hidden',
  },
  compactCard: {
    flexDirection: 'row',
    padding: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  compactHeader: {
    marginBottom: 0,
    marginRight: Spacing.md,
  },
  logoContainer: {
    position: 'relative',
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
  },
  compactLogoContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  compactLogo: {
    borderRadius: 25,
  },
  featuredBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    borderRadius: 10,
    overflow: 'hidden',
  },
  featuredGradient: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  followButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  followGradient: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    padding: Spacing.md,
    paddingTop: 0,
  },
  compactInfoContainer: {
    flex: 1,
    padding: 0,
    justifyContent: 'space-between',
  },
  brandName: {
    ...Typography.styles.h3,
    color: Colors.text.primary,
    fontWeight: Typography.weights.semiBold,
    marginBottom: Spacing.sm,
    lineHeight: Typography.lineHeights.tight,
  },
  compactBrandName: {
    fontSize: 16,
    marginBottom: Spacing.xs,
  },
  description: {
    ...Typography.styles.body,
    color: Colors.text.secondary,
    marginBottom: Spacing.md,
    lineHeight: Typography.lineHeights.relaxed,
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statText: {
    ...Typography.styles.caption,
    color: Colors.text.secondary,
    fontSize: 12,
  },
  productsPreview: {
    marginBottom: Spacing.md,
  },
  productsTitle: {
    ...Typography.styles.caption,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
    fontSize: 12,
  },
  productImages: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: -8,
    borderWidth: 2,
    borderColor: Colors.background.primary,
  },
  moreProducts: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.glass.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -8,
    borderWidth: 2,
    borderColor: Colors.background.primary,
  },
  moreText: {
    ...Typography.styles.caption,
    color: Colors.text.primary,
    fontSize: 10,
    fontWeight: Typography.weights.semiBold,
  },
  compactFollowButton: {
    marginTop: Spacing.sm,
  },
});

export default BrandCard;
