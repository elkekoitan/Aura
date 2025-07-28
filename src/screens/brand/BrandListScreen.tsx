/**
 * BrandListScreen
 * Complete brand discovery interface with search, filtering, and sorting
 * Integrates with Redux state management and Supabase backend
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { GlassCard } from '../../components/ui';
import { SearchBar } from '../../components/ui/SearchBar';
import { BrandGrid } from '../../components/brand/BrandGrid';
import { Colors, Typography, Spacing } from '../../constants';
import { useAppDispatch, useAppSelector } from '../../store';
import { 
  fetchBrands, 
  fetchFeaturedBrands,
  searchBrands,
  setSearchQuery,
  setFilters,
  clearFilters,
  setSortBy,
  setSortOrder,
} from '../../store/slices/brandSlice';
import { Brand, BrandFilters, BrandSortOption } from '../../store/types/brand';

export default function BrandListScreen() {
  // Redux state
  const dispatch = useAppDispatch();
  const { 
    brands, 
    featuredBrands,
    searchQuery,
    filters,
    sortBy,
    sortOrder,
    loading,
    searchLoading,
    error,
    hasMore,
    currentPage
  } = useAppSelector((state) => state.brands);

  // Local state
  const [activeTab, setActiveTab] = useState<'all' | 'featured'>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [followingBrands, setFollowingBrands] = useState<string[]>([]);

  /**
   * Initialize data on screen focus
   */
  useFocusEffect(
    useCallback(() => {
      loadInitialData();
    }, [])
  );

  /**
   * Load initial data for the screen
   */
  const loadInitialData = async () => {
    try {
      await Promise.all([
        dispatch(fetchBrands({ page: 1, limit: 20 })),
        dispatch(fetchFeaturedBrands(10)),
      ]);
    } catch (error) {
      console.error('Failed to load initial data:', error);
    }
  };

  /**
   * Handle refresh
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
   * Handle search query change
   */
  const handleSearchChange = (query: string) => {
    dispatch(setSearchQuery(query));
    
    // Generate search suggestions (mock implementation)
    if (query.length > 0) {
      const suggestions = [
        `${query} fashion`,
        `${query} luxury`,
        `${query} streetwear`,
        `${query} designer`,
      ].filter(s => s !== query);
      setSearchSuggestions(suggestions.slice(0, 3));
    } else {
      setSearchSuggestions([]);
    }
  };

  /**
   * Handle search execution
   */
  const handleSearch = (query: string) => {
    if (query.trim()) {
      dispatch(searchBrands(query));
      setActiveTab('all');
    } else {
      dispatch(fetchBrands({ page: 1, limit: 20 }));
    }
  };

  /**
   * Handle brand press
   */
  const handleBrandPress = (brand: Brand) => {
    // Navigate to brand detail screen
    console.log('Navigate to brand:', brand.id);
  };

  /**
   * Handle follow brand
   */
  const handleFollowBrand = (brand: Brand) => {
    const isFollowing = followingBrands.includes(brand.id);
    if (isFollowing) {
      setFollowingBrands(prev => prev.filter(id => id !== brand.id));
    } else {
      setFollowingBrands(prev => [...prev, brand.id]);
    }
    console.log('Toggle follow brand:', brand.id, !isFollowing);
    // TODO: Implement follow functionality with backend
  };

  /**
   * Handle sort change
   */
  const handleSortChange = (sortOption: BrandSortOption) => {
    dispatch(setSortBy(sortOption));
    dispatch(fetchBrands({ 
      query: searchQuery,
      filters,
      sortBy: sortOption,
      sortOrder,
      page: 1,
      limit: 20 
    }));
  };

  /**
   * Handle filter change
   */
  const handleFilterChange = (filterType: keyof BrandFilters, value: any) => {
    const newFilters: BrandFilters = {
      ...filters,
      [filterType]: value
    };
    dispatch(setFilters(newFilters));
    dispatch(fetchBrands({ 
      query: searchQuery,
      filters: newFilters,
      sortBy,
      sortOrder,
      page: 1,
      limit: 20 
    }));
  };

  /**
   * Handle clear filters
   */
  const handleClearFilters = () => {
    dispatch(clearFilters());
    dispatch(setSearchQuery(''));
    dispatch(fetchBrands({ page: 1, limit: 20 }));
    setSearchSuggestions([]);
  };

  /**
   * Handle load more brands
   */
  const handleLoadMore = () => {
    if (hasMore && !loading) {
      dispatch(fetchBrands({
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
   * Get current brands to display based on active tab
   */
  const getCurrentBrands = () => {
    switch (activeTab) {
      case 'featured':
        return featuredBrands;
      default:
        return brands;
    }
  };

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
          <Text style={styles.title}>Brands</Text>
          <Text style={styles.subtitle}>Discover amazing fashion brands</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <SearchBar
            query={searchQuery}
            onQueryChange={handleSearchChange}
            onSearch={handleSearch}
            suggestions={searchSuggestions}
            loading={searchLoading}
            placeholder="Search brands..."
          />
        </View>

        {/* Tab Selector */}
        <View style={styles.section}>
          <View style={styles.tabContainer}>
            {[
              { key: 'all', label: 'All Brands' },
              { key: 'featured', label: 'Featured' },
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
              onPress={() => handleSortChange('name')}
              activeOpacity={0.7}
            >
              <GlassCard style={[styles.controlCard, sortBy === 'name' && styles.activeControlCard]}>
                <Ionicons name="text-outline" size={16} color={Colors.text.primary} />
                <Text style={styles.controlText}>Name</Text>
              </GlassCard>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => handleSortChange('product_count')}
              activeOpacity={0.7}
            >
              <GlassCard style={[styles.controlCard, sortBy === 'product_count' && styles.activeControlCard]}>
                <Ionicons name="shirt-outline" size={16} color={Colors.text.primary} />
                <Text style={styles.controlText}>Products</Text>
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

            {/* Filter: Featured Only */}
            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => handleFilterChange('featured', !filters.featured)}
              activeOpacity={0.7}
            >
              <GlassCard style={[styles.controlCard, filters.featured && styles.activeControlCard]}>
                <Ionicons name="star-outline" size={16} color={Colors.text.primary} />
                <Text style={styles.controlText}>Featured</Text>
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

      {/* Brands Grid */}
      <BrandGrid
        brands={getCurrentBrands()}
        onBrandPress={handleBrandPress}
        onFollow={handleFollowBrand}
        loading={loading}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        showLoadMore={hasMore}
        onLoadMore={handleLoadMore}
        loadingMore={loading && currentPage > 1}
        emptyTitle={searchQuery ? "No brands found" : "No brands available"}
        emptyMessage={searchQuery ? `No results for "${searchQuery}". Try different keywords.` : "Check back later for new brands."}
        followingBrandIds={followingBrands}
        showStats={true}
        showProducts={false}
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
