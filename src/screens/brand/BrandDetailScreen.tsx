/**
 * BrandDetailScreen
 * Comprehensive brand detail view with products, stats, and actions
 * Integrates with Redux state management and navigation
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
  Linking,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { GlassCard, GlassButton } from '../../components/ui';
import { ProductGrid } from '../../components/product/ProductGrid';
import { Colors, Typography, Spacing } from '../../constants';
import { useAppDispatch, useAppSelector } from '../../store';
import { 
  fetchBrandById,
  setSelectedBrand,
} from '../../store/slices/brandSlice';
import { fetchProductsByBrand } from '../../store/slices/productSlice';
import { Brand } from '../../store/types/brand';
import { Product } from '../../store/types/product';

type BrandDetailRouteProp = RouteProp<{
  BrandDetail: { brandId: string; brand?: Brand };
}, 'BrandDetail'>;

export default function BrandDetailScreen() {
  const route = useRoute<BrandDetailRouteProp>();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  
  const { brandId, brand: routeBrand } = route.params;
  
  // Redux state
  const { selectedBrand, loading, error } = useAppSelector((state) => state.brands);
  const { products } = useAppSelector((state) => state.products);
  
  // Local state
  const [refreshing, setRefreshing] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [brandProducts, setBrandProducts] = useState<Product[]>([]);

  // Use route brand or selected brand
  const brand = selectedBrand || routeBrand;

  /**
   * Initialize data on mount
   */
  useEffect(() => {
    loadBrandData();
  }, [brandId]);

  /**
   * Load brand data and products
   */
  const loadBrandData = async () => {
    try {
      if (!brand || brand.id !== brandId) {
        await dispatch(fetchBrandById(brandId));
      }
      
      const result = await dispatch(fetchProductsByBrand(brandId));
      if (result.payload) {
        setBrandProducts(result.payload);
      }
    } catch (error) {
      console.error('Failed to load brand data:', error);
    }
  };

  /**
   * Handle refresh
   */
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadBrandData();
    } finally {
      setRefreshing(false);
    }
  };

  /**
   * Handle follow brand
   */
  const handleFollowBrand = () => {
    setIsFollowing(!isFollowing);
    console.log('Toggle follow brand:', brand?.id, !isFollowing);
    // TODO: Implement follow functionality with backend
  };

  /**
   * Handle visit website
   */
  const handleVisitWebsite = async () => {
    if (brand?.website_url) {
      try {
        await Linking.openURL(brand.website_url);
      } catch (error) {
        console.error('Failed to open website:', error);
      }
    }
  };

  /**
   * Handle product press
   */
  const handleProductPress = (product: Product) => {
    console.log('Navigate to product:', product.id);
    // TODO: Navigate to product detail
  };

  /**
   * Handle add to cart
   */
  const handleAddToCart = (product: Product) => {
    console.log('Add to cart:', product.id);
    // TODO: Implement cart functionality
  };

  /**
   * Handle toggle favorite
   */
  const handleToggleFavorite = (product: Product) => {
    console.log('Toggle favorite:', product.id);
    // TODO: Implement favorites functionality
  };

  /**
   * Get brand logo with fallback
   */
  const getBrandLogo = (): string => {
    return brand?.logo_url || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop';
  };

  /**
   * Get product count
   */
  const getProductCount = (): number => {
    return brandProducts.length || brand?.product_count || brand?.products?.length || 0;
  };

  if (loading && !brand) {
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
            <Text style={styles.loadingText}>Loading brand...</Text>
          </GlassCard>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !brand) {
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
            <Text style={styles.errorTitle}>Brand Not Found</Text>
            <Text style={styles.errorMessage}>
              {error || 'The brand you are looking for could not be found.'}
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

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={Colors.gradients.holographic}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary[500]}
            colors={[Colors.primary[500]]}
          />
        }
      >
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
        </View>

        {/* Brand Info */}
        <View style={styles.brandInfo}>
          <GlassCard style={styles.brandCard}>
            {/* Brand Logo and Basic Info */}
            <View style={styles.brandHeader}>
              <View style={styles.logoContainer}>
                <Image
                  source={{ uri: getBrandLogo() }}
                  style={styles.logo}
                  resizeMode="cover"
                />
                {brand.is_featured && (
                  <View style={styles.featuredBadge}>
                    <LinearGradient
                      colors={Colors.gradients.primary}
                      style={styles.featuredGradient}
                    >
                      <Ionicons name="star" size={16} color={Colors.text.white} />
                    </LinearGradient>
                  </View>
                )}
              </View>

              <View style={styles.brandDetails}>
                <Text style={styles.brandName}>{brand.name}</Text>
                <Text style={styles.brandDescription}>{brand.description}</Text>
              </View>
            </View>

            {/* Brand Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.stat}>
                <Text style={styles.statValue}>{getProductCount()}</Text>
                <Text style={styles.statLabel}>Products</Text>
              </View>
              
              <View style={styles.statDivider} />
              
              <View style={styles.stat}>
                <Text style={styles.statValue}>4.8</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
              
              <View style={styles.statDivider} />
              
              <View style={styles.stat}>
                <Text style={styles.statValue}>12K</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <GlassButton
                title={isFollowing ? "Following" : "Follow"}
                onPress={handleFollowBrand}
                variant={isFollowing ? "primary" : "outline"}
                size="medium"
                gradient={isFollowing}
                gradientColors={Colors.gradients.primary}
                style={styles.followButton}
                icon={
                  <Ionicons 
                    name={isFollowing ? "heart" : "heart-outline"} 
                    size={16} 
                    color={isFollowing ? Colors.text.white : Colors.text.primary} 
                  />
                }
              />

              {brand.website_url && (
                <GlassButton
                  title="Website"
                  onPress={handleVisitWebsite}
                  variant="outline"
                  size="medium"
                  style={styles.websiteButton}
                  icon={<Ionicons name="globe-outline" size={16} color={Colors.text.primary} />}
                />
              )}
            </View>
          </GlassCard>
        </View>

        {/* Products Section Header */}
        <View style={styles.productsHeader}>
          <Text style={styles.sectionTitle}>Products</Text>
          <Text style={styles.sectionSubtitle}>
            {getProductCount()} {getProductCount() === 1 ? 'product' : 'products'} available
          </Text>
        </View>
      </ScrollView>

      {/* Products Grid */}
      <ProductGrid
        products={brandProducts}
        onProductPress={handleProductPress}
        onAddToCart={handleAddToCart}
        onToggleFavorite={handleToggleFavorite}
        loading={loading}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        emptyTitle="No products found"
        emptyMessage={`${brand.name} hasn't added any products yet.`}
        numColumns={2}
      />
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
    paddingHorizontal: Spacing.component.screen.horizontal,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
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
  brandInfo: {
    paddingHorizontal: Spacing.component.screen.horizontal,
    marginBottom: Spacing.lg,
  },
  brandCard: {
    padding: Spacing.lg,
  },
  brandHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  logoContainer: {
    position: 'relative',
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    marginRight: Spacing.md,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  featuredBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  featuredGradient: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandDetails: {
    flex: 1,
  },
  brandName: {
    ...Typography.styles.h1,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  brandDescription: {
    ...Typography.styles.body,
    color: Colors.text.secondary,
    lineHeight: Typography.lineHeights.relaxed,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.lg,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.border.light,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    ...Typography.styles.h2,
    color: Colors.text.primary,
    fontWeight: Typography.weights.bold,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    ...Typography.styles.caption,
    color: Colors.text.secondary,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.border.light,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  followButton: {
    flex: 1,
  },
  websiteButton: {
    flex: 1,
  },
  productsHeader: {
    paddingHorizontal: Spacing.component.screen.horizontal,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.styles.h2,
    color: Colors.text.white,
    marginBottom: Spacing.xs,
  },
  sectionSubtitle: {
    ...Typography.styles.body,
    color: Colors.text.white,
    opacity: 0.8,
  },
});
