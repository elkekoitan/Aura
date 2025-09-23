/**
 * @module screens/main/DiscoverScreen
 * @description A comprehensive discovery screen for users to find products, brands, and categories.
 * It features search, filtering, sorting, and various sections for featured content.
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { GlassCard, GlassButton } from '../../components/ui';
import { SearchBar } from '../../components/ui/SearchBar';
import { ProductGrid } from '../../components/product/ProductGrid';
import { Colors, Typography, Spacing } from '../../constants';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  fetchProducts,
  fetchFeaturedProducts,
  searchProducts,
  setSearchQuery,
  setFilters,
  clearFilters,
  setSortBy,
  setSortOrder,
} from '../../store/slices/productSlice';
import { fetchFeaturedBrands } from '../../store/slices/brandSlice';
import { fetchCategories } from '../../store/slices/categorySlice';
import { Product, ProductFilters, ProductSortOption } from '../../store/types/product';

const { width, height } = Dimensions.get('window');

/**
 * A comprehensive discovery screen for users to find products, brands, and categories.
 * It features search, filtering, sorting, and various sections for featured content.
 * @returns {React.FC} A React component.
 */
export default function DiscoverScreen() {
  // Navigation
  const navigation = useNavigation();

  // Redux state
  const dispatch = useAppDispatch();
  const {
    products,
    featuredProducts,
    searchQuery,
    filters,
    sortBy,
    sortOrder,
    loading,
    searchLoading,
    error,
    hasMore,
    currentPage
  } = useAppSelector((state) => state.products);

  const { featuredBrands, brands } = useAppSelector((state) => state.brands);
  const { categories } = useAppSelector((state) => state.categories);

  // Local state
  const [activeTab, setActiveTab] = useState<'all' | 'featured' | 'brands'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);

  /**
   * Initializes data on screen focus.
   */
  useFocusEffect(
    useCallback(() => {
      loadInitialData();
    }, [])
  );

  /**
   * Loads the initial data for the screen, including products, brands, and categories.
   */
  const loadInitialData = async () => {
    try {
      await Promise.all([
        dispatch(fetchProducts({ page: 1, limit: 20 })),
        dispatch(fetchFeaturedProducts(10)),
        dispatch(fetchFeaturedBrands(6)),
        dispatch(fetchCategories()),
      ]);
    } catch (error) {
      console.error('Failed to load initial data:', error);
    }
  };

  /**
   * Handles the pull-to-refresh action.
   */
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadInitialData();
    } finally {
      setRefreshing(false);
    }
  };

  /**
   * Handles changes to the search query input.
   * @param {string} query - The current search query.
   */
  const handleSearchChange = (query: string) => {
    dispatch(setSearchQuery(query));

    // Generate search suggestions (mock implementation)
    if (query.length > 0) {
      const suggestions = [
        `${query} dress`,
        `${query} top`,
        `${query} jacket`,
        `${query} shoes`,
      ].filter(s => s !== query);
      setSearchSuggestions(suggestions.slice(0, 3));
    } else {
      setSearchSuggestions([]);
    }
  };

  /**
   * Executes a search based on the current query.
   * @param {string} query - The search query.
   */
  const handleSearch = (query: string) => {
    if (query.trim()) {
      dispatch(searchProducts(query));
      setActiveTab('all');
    } else {
      dispatch(fetchProducts({ page: 1, limit: 20 }));
    }
  };

  /**
   * Handles pressing a product card.
   * @param {Product} product - The pressed product.
   */
  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetail', { productId: product.id, product });
  };

  /**
   * Handles adding a product to the cart.
   * @param {Product} product - The product to add.
   * @todo Implement cart functionality.
   */
  const handleAddToCart = (product: Product) => {
    console.log('Add to cart:', product.id);
    // TODO: Implement cart functionality
  };

  /**
   * Handles toggling a product as a favorite.
   * @param {Product} product - The product to toggle.
   * @todo Implement favorites functionality.
   */
  const handleToggleFavorite = (product: Product) => {
    console.log('Toggle favorite:', product.id);
    // TODO: Implement favorites functionality
  };

  /**
   * Applies a category filter to the product list.
   * @param {string} categoryId - The ID of the category to filter by.
   */
  const handleCategoryFilter = (categoryId: string) => {
    const newFilters: ProductFilters = {
      ...filters,
      categories: [categoryId]
    };
    dispatch(setFilters(newFilters));
    dispatch(fetchProducts({ filters: newFilters, page: 1, limit: 20 }));
    setActiveTab('all');
  };

  /**
   * Applies a brand filter to the product list.
   * @param {string} brandId - The ID of the brand to filter by.
   */
  const handleBrandFilter = (brandId: string) => {
    const newFilters: ProductFilters = {
      ...filters,
      brands: [brandId]
    };
    dispatch(setFilters(newFilters));
    dispatch(fetchProducts({ filters: newFilters, page: 1, limit: 20 }));
    setActiveTab('all');
  };

  /**
   * Handles pressing a brand chip to navigate to the brand detail screen.
   * @param {any} brand - The pressed brand.
   */
  const handleBrandPress = (brand: any) => {
    navigation.navigate('BrandDetail', { brandId: brand.id, brand });
  };

  /**
   * Handles changing the sort order of the product list.
   * @param {ProductSortOption} sortOption - The selected sort option.
   */
  const handleSortChange = (sortOption: ProductSortOption) => {
    dispatch(setSortBy(sortOption));
    dispatch(fetchProducts({
      query: searchQuery,
      filters,
      sortBy: sortOption,
      sortOrder,
      page: 1,
      limit: 20
    }));
  };

  /**
   * Clears all active filters and the search query.
   */
  const handleClearFilters = () => {
    dispatch(clearFilters());
    dispatch(setSearchQuery(''));
    dispatch(fetchProducts({ page: 1, limit: 20 }));
    setSearchSuggestions([]);
  };

  /**
   * Loads more products when the user reaches the end of the list.
   */
  const handleLoadMore = () => {
    if (hasMore && !loading) {
      dispatch(fetchProducts({
        query: searchQuery,
        filters,
        sortBy,
        sortOrder,
        page: currentPage + 1,
        limit: 20
      }));
    }
  };

  /**
   * Gets the list of products to display based on the active tab.
   * @returns {Product[]} The list of products to display.
   */
  const getCurrentProducts = () => {
    switch (activeTab) {
      case 'featured':
        return featuredProducts;
      case 'brands':
        return products.filter(p => p.brand && featuredBrands.some(b => b.id === p.brand_id));
      default:
        return products;
    }
  };

  /**
   * Renders the category filter chips.
   * @returns {React.ReactElement} The category chips component.
   */
  const renderCategoryChips = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.categoriesContainer}
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={styles.categoryChip}
          onPress={() => handleCategoryFilter(category.id)}
          activeOpacity={0.7}
        >
          <GlassCard style={styles.categoryCard}>
            <Text style={styles.categoryName}>{category.name}</Text>
          </GlassCard>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  /**
   * Renders the featured brand chips.
   * @returns {React.ReactElement} The brand chips component.
   */
  const renderBrandChips = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.brandsContainer}
    >
      {featuredBrands.map((brand) => (
        <TouchableOpacity
          key={brand.id}
          style={styles.brandChip}
          onPress={() => handleBrandFilter(brand.id)}
          onLongPress={() => handleBrandPress(brand)}
          activeOpacity={0.7}
        >
          <GlassCard style={styles.brandCard}>
            <Text style={styles.brandName}>{brand.name}</Text>
          </GlassCard>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

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
          <Text style={styles.title}>Discover</Text>
          <Text style={styles.subtitle}>Find your next favorite piece</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <SearchBar
            query={searchQuery}
            onQueryChange={handleSearchChange}
            onSearch={handleSearch}
            suggestions={searchSuggestions}
            loading={searchLoading}
            placeholder="Search products, brands, styles..."
          />
        </View>

        {/* Categories */}
        {categories.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categories</Text>
            {renderCategoryChips()}
          </View>
        )}

        {/* Featured Brands */}
        {featuredBrands.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Featured Brands</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('BrandList')}
                activeOpacity={0.7}
              >
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            {renderBrandChips()}
          </View>
        )}

        {/* Tab Selector */}
        <View style={styles.section}>
          <View style={styles.tabContainer}>
            {[
              { key: 'all', label: 'All Products' },
              { key: 'featured', label: 'Featured' },
              { key: 'brands', label: 'Top Brands' },
            ].map((tab) => (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.tab,
                  activeTab === tab.key && styles.activeTab
                ]}
                onPress={() => setActiveTab(tab.key as any)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.tabText,
                  activeTab === tab.key && styles.activeTabText
                ]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Sort and Filter Controls */}
        <View style={styles.controlsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.controlsContent}
          >
            {/* Sort Options */}
            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => handleSortChange('price')}
              activeOpacity={0.7}
            >
              <GlassCard style={[styles.controlCard, sortBy === 'price' && styles.activeControlCard]}>
                <Ionicons name="pricetag-outline" size={16} color={Colors.text.primary} />
                <Text style={styles.controlText}>Price</Text>
              </GlassCard>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => handleSortChange('created_at')}
              activeOpacity={0.7}
            >
              <GlassCard style={[styles.controlCard, sortBy === 'created_at' && styles.activeControlCard]}>
                <Ionicons name="time-outline" size={16} color={Colors.text.primary} />
                <Text style={styles.controlText}>Newest</Text>
              </GlassCard>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => handleSortChange('name')}
              activeOpacity={0.7}
            >
              <GlassCard style={[styles.controlCard, sortBy === 'name' && styles.activeControlCard]}>
                <Ionicons name="text-outline" size={16} color={Colors.text.primary} />
                <Text style={styles.controlText}>Name</Text>
              </GlassCard>
            </TouchableOpacity>

            {/* Clear Filters */}
            {(Object.keys(filters).length > 0 || searchQuery) && (
              <TouchableOpacity
                style={styles.controlButton}
                onPress={handleClearFilters}
                activeOpacity={0.7}
              >
                <GlassCard style={styles.clearCard}>
                  <Ionicons name="close-circle-outline" size={16} color={Colors.semantic.error} />
                  <Text style={styles.clearText}>Clear</Text>
                </GlassCard>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Products Grid */}
      <ProductGrid
        products={getCurrentProducts()}
        onProductPress={handleProductPress}
        onAddToCart={handleAddToCart}
        onToggleFavorite={handleToggleFavorite}
        loading={loading}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        showLoadMore={hasMore}
        onLoadMore={handleLoadMore}
        loadingMore={loading && currentPage > 1}
        emptyTitle={searchQuery ? "No products found" : "No products available"}
        emptyMessage={searchQuery ? `No results for "${searchQuery}". Try different keywords.` : "Check back later for new products."}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.component.screen.horizontal,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    alignItems: 'center',
  },
  title: {
    ...Typography.styles.h1,
    color: Colors.text.white,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.styles.body,
    color: Colors.text.white,
    textAlign: 'center',
    opacity: 0.9,
  },
  searchContainer: {
    paddingHorizontal: Spacing.component.screen.horizontal,
    marginBottom: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.component.screen.horizontal,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.styles.h2,
    color: Colors.text.white,
  },
  viewAllText: {
    ...Typography.styles.button,
    color: Colors.primary[400],
    fontSize: 14,
  },

  // Categories
  categoriesContainer: {
    paddingHorizontal: Spacing.component.screen.horizontal,
    gap: Spacing.md,
  },
  categoryChip: {
    marginRight: Spacing.md,
  },
  categoryCard: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    minWidth: 80,
    alignItems: 'center',
  },
  categoryName: {
    ...Typography.styles.button,
    color: Colors.text.primary,
    fontSize: 14,
  },

  // Brands
  brandsContainer: {
    paddingHorizontal: Spacing.component.screen.horizontal,
    gap: Spacing.md,
  },
  brandChip: {
    marginRight: Spacing.md,
  },
  brandCard: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    minWidth: 100,
    alignItems: 'center',
  },
  brandName: {
    ...Typography.styles.button,
    color: Colors.text.primary,
    fontSize: 14,
  },

  // Tabs
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.component.screen.horizontal,
    marginBottom: Spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    alignItems: 'center',
    borderRadius: Spacing.component.radius.md,
    marginHorizontal: Spacing.xs,
  },
  activeTab: {
    backgroundColor: Colors.glass.turquoise,
  },
  tabText: {
    ...Typography.styles.button,
    color: Colors.text.secondary,
    fontSize: 14,
  },
  activeTabText: {
    color: Colors.text.primary,
    fontWeight: Typography.weights.semiBold,
  },

  // Controls
  controlsContainer: {
    marginBottom: Spacing.lg,
  },
  controlsContent: {
    paddingHorizontal: Spacing.component.screen.horizontal,
    gap: Spacing.md,
  },
  controlButton: {
    marginRight: Spacing.md,
  },
  controlCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  activeControlCard: {
    backgroundColor: Colors.glass.turquoise,
  },
  controlText: {
    ...Typography.styles.button,
    color: Colors.text.primary,
    fontSize: 14,
  },
  clearCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
    backgroundColor: Colors.semantic.errorBackground,
  },
  clearText: {
    ...Typography.styles.button,
    color: Colors.semantic.error,
    fontSize: 14,
  },
});
