/**
 * ProductDetailScreen
 * Comprehensive product detail view with images, specifications, and purchase options
 * Integrates with Redux state management and shopping cart functionality
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { GlassCard, GlassButton } from '../../components/ui';
import { Colors, Typography, Spacing } from '../../constants';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchProductById, setSelectedProduct } from '../../store/slices/productSlice';
import { addToCart } from '../../store/slices/cartSlice';
import { Product } from '../../store/types/product';

const { width, height } = Dimensions.get('window');

type ProductDetailRouteProp = RouteProp<{
  ProductDetail: { productId: string; product?: Product };
}, 'ProductDetail'>;

export default function ProductDetailScreen() {
  const route = useRoute<ProductDetailRouteProp>();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  
  const { productId, product: routeProduct } = route.params;
  
  // Redux state
  const { selectedProduct, loading, error } = useAppSelector((state) => state.products);
  const { addingItem } = useAppSelector((state) => state.cart);
  
  // Local state
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  // Use route product or selected product
  const product = selectedProduct || routeProduct;

  /**
   * Initialize data on mount
   */
  useEffect(() => {
    loadProductData();
  }, [productId]);

  /**
   * Load product data
   */
  const loadProductData = async () => {
    try {
      if (!product || product.id !== productId) {
        await dispatch(fetchProductById(productId));
      }
    } catch (error) {
      console.error('Failed to load product data:', error);
    }
  };

  /**
   * Get product images
   */
  const getProductImages = (): string[] => {
    if (product?.product_images && product.product_images.length > 0) {
      return product.product_images
        .sort((a, b) => a.sort_order - b.sort_order)
        .map(img => img.image_url);
    }
    if (product?.images && product.images.length > 0) {
      return product.images;
    }
    return ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=1200&fit=crop'];
  };

  /**
   * Handle add to cart
   */
  const handleAddToCart = async () => {
    if (!product) return;

    if (!selectedSize && product.sizes && product.sizes.length > 0) {
      Alert.alert('Size Required', 'Please select a size before adding to cart.');
      return;
    }

    if (!selectedColor && product.colors && product.colors.length > 0) {
      Alert.alert('Color Required', 'Please select a color before adding to cart.');
      return;
    }

    try {
      await dispatch(addToCart({
        product,
        quantity,
        selectedSize,
        selectedColor,
      })).unwrap();

      Alert.alert(
        'Added to Cart',
        `${product.name} has been added to your cart.`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to add item to cart. Please try again.');
    }
  };

  /**
   * Handle virtual try-on
   */
  const handleTryOn = () => {
    if (!product) return;

    navigation.navigate('TryOnCamera', {
      productId: product.id,
      product,
    });
  };

  /**
   * Handle buy now
   */
  const handleBuyNow = () => {
    if (!selectedSize && product?.sizes && product.sizes.length > 0) {
      Alert.alert('Size Required', 'Please select a size before purchasing.');
      return;
    }
    
    if (!selectedColor && product?.colors && product.colors.length > 0) {
      Alert.alert('Color Required', 'Please select a color before purchasing.');
      return;
    }

    // TODO: Navigate to checkout
    Alert.alert(
      'Buy Now',
      `Proceeding to checkout for ${product?.name}`,
      [{ text: 'OK' }]
    );
  };

  /**
   * Toggle favorite
   */
  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // TODO: Implement favorites functionality
  };

  /**
   * Handle brand press
   */
  const handleBrandPress = () => {
    if (product?.brand) {
      navigation.navigate('BrandDetail', { 
        brandId: product.brand.id, 
        brand: product.brand 
      });
    }
  };

  if (loading && !product) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={Colors.gradients.holographic}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.loadingContainer}>
          <GlassCard style={styles.loadingCard}>
            <Text style={styles.loadingText}>Loading product...</Text>
          </GlassCard>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !product) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={Colors.gradients.holographic}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.errorContainer}>
          <GlassCard style={styles.errorCard}>
            <Text style={styles.errorTitle}>Product Not Found</Text>
            <Text style={styles.errorMessage}>
              {error || 'The product you are looking for could not be found.'}
            </Text>
            <GlassButton
              title="Go Back"
              onPress={() => navigation.goBack()}
              variant="primary"
              size="medium"
              gradient
              gradientColors={Colors.gradients.primary}
            />
          </GlassCard>
        </View>
      </SafeAreaView>
    );
  }

  const images = getProductImages();

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={Colors.gradients.holographic}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={Colors.gradients.glass}
            style={styles.backGradient}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
          </LinearGradient>
        </TouchableOpacity>

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
              size={24}
              color={isFavorite ? Colors.text.white : Colors.text.primary}
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Product Images */}
        <View style={styles.imageSection}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / width);
              setSelectedImageIndex(index);
            }}
          >
            {images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={styles.productImage}
                resizeMode="cover"
              />
            ))}
          </ScrollView>

          {/* Image indicators */}
          {images.length > 1 && (
            <View style={styles.imageIndicators}>
              {images.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.indicator,
                    selectedImageIndex === index && styles.activeIndicator
                  ]}
                />
              ))}
            </View>
          )}
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          <GlassCard style={styles.infoCard}>
            {/* Brand */}
            {product.brand && (
              <TouchableOpacity
                style={styles.brandContainer}
                onPress={handleBrandPress}
                activeOpacity={0.7}
              >
                <Text style={styles.brandName}>{product.brand.name}</Text>
                <Ionicons name="chevron-forward" size={16} color={Colors.text.secondary} />
              </TouchableOpacity>
            )}

            {/* Product Name */}
            <Text style={styles.productName}>{product.name}</Text>

            {/* Price */}
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>

            {/* Description */}
            <Text style={styles.description}>{product.description}</Text>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <View style={styles.optionSection}>
                <Text style={styles.optionTitle}>Size</Text>
                <View style={styles.optionGrid}>
                  {product.sizes.map((size) => (
                    <TouchableOpacity
                      key={size}
                      style={[
                        styles.optionButton,
                        selectedSize === size && styles.selectedOption
                      ]}
                      onPress={() => setSelectedSize(size)}
                      activeOpacity={0.7}
                    >
                      <Text style={[
                        styles.optionText,
                        selectedSize === size && styles.selectedOptionText
                      ]}>
                        {size}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <View style={styles.optionSection}>
                <Text style={styles.optionTitle}>Color</Text>
                <View style={styles.optionGrid}>
                  {product.colors.map((color) => (
                    <TouchableOpacity
                      key={color}
                      style={[
                        styles.colorButton,
                        selectedColor === color && styles.selectedOption
                      ]}
                      onPress={() => setSelectedColor(color)}
                      activeOpacity={0.7}
                    >
                      <Text style={[
                        styles.optionText,
                        selectedColor === color && styles.selectedOptionText
                      ]}>
                        {color}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Stock Status */}
            <View style={styles.stockSection}>
              <View style={[
                styles.stockIndicator,
                { backgroundColor: product.stock_quantity > 0 ? Colors.semantic.success : Colors.semantic.error }
              ]} />
              <Text style={styles.stockText}>
                {product.stock_quantity > 0 
                  ? `${product.stock_quantity} in stock` 
                  : 'Out of stock'
                }
              </Text>
            </View>
          </GlassCard>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <GlassCard style={styles.actionsCard}>
          {/* Try-On Button */}
          <GlassButton
            title="Virtual Try-On"
            onPress={handleTryOn}
            variant="secondary"
            size="large"
            fullWidth
            style={styles.tryOnButton}
            icon={<Ionicons name="camera-outline" size={20} color={Colors.primary[500]} />}
          />

          <View style={styles.actionButtons}>
            <GlassButton
              title={addingItem ? "Adding..." : "Add to Cart"}
              onPress={handleAddToCart}
              variant="outline"
              size="large"
              style={styles.addToCartButton}
              disabled={product.stock_quantity === 0 || addingItem}
            />

            <GlassButton
              title="Buy Now"
              onPress={handleBuyNow}
              variant="primary"
              size="large"
              gradient
              gradientColors={Colors.gradients.primary}
              style={styles.buyNowButton}
              disabled={product.stock_quantity === 0}
            />
          </View>
        </GlassCard>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.component.screen.horizontal,
  },
  loadingCard: {
    padding: Spacing['2xl'],
    alignItems: 'center',
  },
  loadingText: {
    ...Typography.styles.body,
    color: Colors.text.primary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.component.screen.horizontal,
  },
  errorCard: {
    padding: Spacing['2xl'],
    alignItems: 'center',
    width: '100%',
    maxWidth: 300,
  },
  errorTitle: {
    ...Typography.styles.h2,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  errorMessage: {
    ...Typography.styles.body,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: Typography.lineHeights.relaxed,
    marginBottom: Spacing['2xl'],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.component.screen.horizontal,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  backGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  favoriteGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageSection: {
    height: height * 0.6,
    position: 'relative',
  },
  productImage: {
    width,
    height: '100%',
  },
  imageIndicators: {
    position: 'absolute',
    bottom: Spacing.lg,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.glass.light,
  },
  activeIndicator: {
    backgroundColor: Colors.primary[500],
  },
  productInfo: {
    paddingHorizontal: Spacing.component.screen.horizontal,
    marginTop: -Spacing.lg,
  },
  infoCard: {
    padding: Spacing.lg,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  brandName: {
    ...Typography.styles.button,
    color: Colors.primary[500],
    fontWeight: Typography.weights.semiBold,
  },
  productName: {
    ...Typography.styles.h1,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  price: {
    ...Typography.styles.h2,
    color: Colors.primary[500],
    fontWeight: Typography.weights.bold,
    marginBottom: Spacing.lg,
  },
  description: {
    ...Typography.styles.body,
    color: Colors.text.secondary,
    lineHeight: Typography.lineHeights.relaxed,
    marginBottom: Spacing.lg,
  },
  optionSection: {
    marginBottom: Spacing.lg,
  },
  optionTitle: {
    ...Typography.styles.h6,
    color: Colors.text.primary,
    fontWeight: Typography.weights.semiBold,
    marginBottom: Spacing.md,
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  optionButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Spacing.component.radius.sm,
    backgroundColor: Colors.glass.light,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  colorButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Spacing.component.radius.sm,
    backgroundColor: Colors.glass.light,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  selectedOption: {
    backgroundColor: Colors.primary[500],
    borderColor: Colors.primary[500],
  },
  optionText: {
    ...Typography.styles.button,
    color: Colors.text.primary,
  },
  selectedOptionText: {
    color: Colors.text.white,
  },
  stockSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  stockIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Spacing.sm,
  },
  stockText: {
    ...Typography.styles.body,
    color: Colors.text.secondary,
  },
  bottomActions: {
    paddingHorizontal: Spacing.component.screen.horizontal,
    paddingBottom: Spacing.lg,
  },
  actionsCard: {
    padding: Spacing.lg,
  },
  tryOnButton: {
    marginBottom: Spacing.md,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  addToCartButton: {
    flex: 1,
  },
  buyNowButton: {
    flex: 1,
  },
});
