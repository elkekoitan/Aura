/**
 * ProductCard Component
 * Reusable product card with glassmorphism design
 * Displays product image, name, price, brand with interactive actions
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
import { Product } from '../../store/types/product';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - Spacing.component.screen.horizontal * 2 - Spacing.lg) / 2;

interface ProductCardProps {
  product: Product;
  onPress?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  onToggleFavorite?: (product: Product) => void;
  showBrand?: boolean;
  showPrice?: boolean;
  compact?: boolean;
  isFavorite?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onAddToCart,
  onToggleFavorite,
  showBrand = true,
  showPrice = true,
  compact = false,
  isFavorite = false,
}) => {
  /**
   * Get primary product image with fallback
   */
  const getPrimaryImage = (): string => {
    if (product.product_images && product.product_images.length > 0) {
      const primaryImage = product.product_images.find(img => img.is_primary);
      return primaryImage?.image_url || product.product_images[0].image_url;
    }
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    return 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=600&fit=crop';
  };

  /**
   * Format price with currency
   */
  const formatPrice = (price: number): string => {
    return `$${price.toFixed(2)}`;
  };

  /**
   * Handle card press
   */
  const handlePress = () => {
    onPress?.(product);
  };

  /**
   * Handle add to cart
   */
  const handleAddToCart = (event: any) => {
    event.stopPropagation();
    onAddToCart?.(product);
  };

  /**
   * Handle toggle favorite
   */
  const handleToggleFavorite = (event: any) => {
    event.stopPropagation();
    onToggleFavorite?.(product);
  };

  return (
    <TouchableOpacity
      style={[styles.container, compact && styles.compactContainer]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <GlassCard style={[styles.card, compact && styles.compactCard]}>
        {/* Product Image */}
        <View style={[styles.imageContainer, compact && styles.compactImageContainer]}>
          <Image
            source={{ uri: getPrimaryImage() }}
            style={[styles.image, compact && styles.compactImage]}
            resizeMode="cover"
          />
          
          {/* Favorite Button */}
          {onToggleFavorite && (
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={handleToggleFavorite}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={isFavorite ? Colors.gradients.primary : Colors.gradients.glass}
                style={styles.favoriteGradient}
              >
                <Ionicons
                  name={isFavorite ? "heart" : "heart-outline"}
                  size={16}
                  color={isFavorite ? Colors.text.white : Colors.text.primary}
                />
              </LinearGradient>
            </TouchableOpacity>
          )}

          {/* Featured Badge */}
          {product.is_featured && (
            <View style={styles.featuredBadge}>
              <LinearGradient
                colors={Colors.gradients.primary}
                style={styles.featuredGradient}
              >
                <Text style={styles.featuredText}>Featured</Text>
              </LinearGradient>
            </View>
          )}

          {/* Stock Status */}
          {product.stock_quantity <= 0 && (
            <View style={styles.outOfStockOverlay}>
              <Text style={styles.outOfStockText}>Out of Stock</Text>
            </View>
          )}
        </View>

        {/* Product Info */}
        <View style={[styles.infoContainer, compact && styles.compactInfoContainer]}>
          {/* Brand Name */}
          {showBrand && product.brand && (
            <Text style={[styles.brandText, compact && styles.compactBrandText]}>
              {product.brand.name}
            </Text>
          )}

          {/* Product Name */}
          <Text 
            style={[styles.productName, compact && styles.compactProductName]}
            numberOfLines={compact ? 1 : 2}
          >
            {product.name}
          </Text>

          {/* Price and Actions */}
          <View style={styles.bottomRow}>
            {showPrice && (
              <Text style={[styles.price, compact && styles.compactPrice]}>
                {formatPrice(product.price)}
              </Text>
            )}

            {/* Add to Cart Button */}
            {onAddToCart && product.stock_quantity > 0 && !compact && (
              <TouchableOpacity
                style={styles.addToCartButton}
                onPress={handleAddToCart}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={Colors.gradients.primary}
                  style={styles.addToCartGradient}
                >
                  <Ionicons name="add" size={16} color={Colors.text.white} />
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>

          {/* Compact Add to Cart */}
          {onAddToCart && product.stock_quantity > 0 && compact && (
            <GlassButton
              title="Add to Cart"
              onPress={handleAddToCart}
              variant="primary"
              size="small"
              fullWidth
              gradient
              gradientColors={Colors.gradients.primary}
              style={styles.compactAddButton}
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
  imageContainer: {
    position: 'relative',
    height: CARD_WIDTH * 1.2,
    borderRadius: Spacing.component.radius.md,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  compactImageContainer: {
    width: 80,
    height: 80,
    marginBottom: 0,
    marginRight: Spacing.md,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  compactImage: {
    borderRadius: Spacing.component.radius.sm,
  },
  favoriteButton: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    borderRadius: 16,
    overflow: 'hidden',
  },
  favoriteGradient: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredBadge: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    borderRadius: Spacing.component.radius.sm,
    overflow: 'hidden',
  },
  featuredGradient: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  featuredText: {
    ...Typography.styles.caption,
    color: Colors.text.white,
    fontWeight: Typography.weights.semiBold,
    fontSize: 10,
  },
  outOfStockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outOfStockText: {
    ...Typography.styles.button,
    color: Colors.text.white,
    fontSize: 12,
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
  brandText: {
    ...Typography.styles.caption,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  compactBrandText: {
    fontSize: 11,
  },
  productName: {
    ...Typography.styles.body,
    color: Colors.text.primary,
    fontWeight: Typography.weights.semiBold,
    marginBottom: Spacing.sm,
    lineHeight: Typography.lineHeights.tight,
  },
  compactProductName: {
    fontSize: 14,
    marginBottom: Spacing.xs,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    ...Typography.styles.h3,
    color: Colors.primary[500],
    fontWeight: Typography.weights.bold,
  },
  compactPrice: {
    fontSize: 16,
  },
  addToCartButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  addToCartGradient: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  compactAddButton: {
    marginTop: Spacing.sm,
  },
});

export default ProductCard;
