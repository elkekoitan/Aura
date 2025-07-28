/**
 * ProductGrid Component
 * Responsive grid layout for displaying products
 * Supports infinite scrolling, loading states, and empty states
 */

import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { ProductCard } from './ProductCard';
import { GlassCard, GlassButton } from '../ui';
import { Colors, Typography, Spacing } from '../../constants';
import { Product } from '../../store/types/product';

const { width } = Dimensions.get('window');

interface ProductGridProps {
  products: Product[];
  onProductPress?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  onToggleFavorite?: (product: Product) => void;
  loading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  numColumns?: number;
  showLoadMore?: boolean;
  onLoadMore?: () => void;
  loadingMore?: boolean;
  emptyTitle?: string;
  emptyMessage?: string;
  favoriteProductIds?: string[];
  compact?: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onProductPress,
  onAddToCart,
  onToggleFavorite,
  loading = false,
  refreshing = false,
  onRefresh,
  numColumns = 2,
  showLoadMore = false,
  onLoadMore,
  loadingMore = false,
  emptyTitle = "No Products Found",
  emptyMessage = "Try adjusting your search or filters to find what you're looking for.",
  favoriteProductIds = [],
  compact = false,
}) => {
  /**
   * Render individual product item
   */
  const renderProduct = ({ item }: { item: Product }) => (
    <ProductCard
      product={item}
      onPress={onProductPress}
      onAddToCart={onAddToCart}
      onToggleFavorite={onToggleFavorite}
      isFavorite={favoriteProductIds.includes(item.id)}
      compact={compact}
    />
  );

  /**
   * Render loading skeleton
   */
  const renderLoadingSkeleton = () => (
    <View style={styles.skeletonContainer}>
      {Array.from({ length: 6 }).map((_, index) => (
        <View key={index} style={styles.skeletonCard}>
          <GlassCard style={styles.skeletonContent}>
            <View style={styles.skeletonImage} />
            <View style={styles.skeletonInfo}>
              <View style={styles.skeletonLine} />
              <View style={[styles.skeletonLine, styles.skeletonLineShort]} />
              <View style={[styles.skeletonLine, styles.skeletonLinePrice]} />
            </View>
          </GlassCard>
        </View>
      ))}
    </View>
  );

  /**
   * Render empty state
   */
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <GlassCard style={styles.emptyCard}>
        <Text style={styles.emptyTitle}>{emptyTitle}</Text>
        <Text style={styles.emptyMessage}>{emptyMessage}</Text>
        {onRefresh && (
          <GlassButton
            title="Refresh"
            onPress={onRefresh}
            variant="primary"
            size="medium"
            gradient
            gradientColors={Colors.gradients.primary}
            style={styles.refreshButton}
          />
        )}
      </GlassCard>
    </View>
  );

  /**
   * Render load more footer
   */
  const renderFooter = () => {
    if (!showLoadMore) return null;

    if (loadingMore) {
      return (
        <View style={styles.loadMoreContainer}>
          <ActivityIndicator size="small" color={Colors.primary[500]} />
          <Text style={styles.loadMoreText}>Loading more products...</Text>
        </View>
      );
    }

    if (onLoadMore) {
      return (
        <View style={styles.loadMoreContainer}>
          <GlassButton
            title="Load More"
            onPress={onLoadMore}
            variant="outline"
            size="medium"
            fullWidth
            style={styles.loadMoreButton}
          />
        </View>
      );
    }

    return null;
  };

  /**
   * Calculate item layout for grid
   */
  const getItemLayout = (data: any, index: number) => {
    const itemHeight = compact ? 100 : (width - Spacing.component.screen.horizontal * 2 - Spacing.lg) / 2 * 1.6;
    return {
      length: itemHeight,
      offset: itemHeight * Math.floor(index / numColumns),
      index,
    };
  };

  // Show loading skeleton on initial load
  if (loading && products.length === 0) {
    return renderLoadingSkeleton();
  }

  // Show empty state when no products
  if (!loading && products.length === 0) {
    return renderEmptyState();
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={compact ? 1 : numColumns}
        key={compact ? 'list' : 'grid'} // Force re-render when layout changes
        contentContainerStyle={[
          styles.gridContainer,
          compact && styles.listContainer
        ]}
        columnWrapperStyle={!compact && numColumns > 1 ? styles.row : undefined}
        showsVerticalScrollIndicator={false}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.primary[500]}
              colors={[Colors.primary[500]]}
            />
          ) : undefined
        }
        ListFooterComponent={renderFooter}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.1}
        getItemLayout={getItemLayout}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={6}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gridContainer: {
    paddingHorizontal: Spacing.component.screen.horizontal,
    paddingBottom: Spacing['3xl'],
  },
  listContainer: {
    gap: Spacing.md,
  },
  row: {
    justifyContent: 'space-between',
  },
  
  // Loading skeleton styles
  skeletonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.component.screen.horizontal,
  },
  skeletonCard: {
    width: (width - Spacing.component.screen.horizontal * 2 - Spacing.lg) / 2,
    marginBottom: Spacing.lg,
  },
  skeletonContent: {
    padding: Spacing.md,
  },
  skeletonImage: {
    height: 120,
    backgroundColor: Colors.glass.light,
    borderRadius: Spacing.component.radius.md,
    marginBottom: Spacing.md,
  },
  skeletonInfo: {
    gap: Spacing.sm,
  },
  skeletonLine: {
    height: 12,
    backgroundColor: Colors.glass.light,
    borderRadius: 6,
  },
  skeletonLineShort: {
    width: '60%',
  },
  skeletonLinePrice: {
    width: '40%',
    height: 16,
  },
  
  // Empty state styles
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.component.screen.horizontal,
  },
  emptyCard: {
    padding: Spacing['2xl'],
    alignItems: 'center',
    width: '100%',
    maxWidth: 300,
  },
  emptyTitle: {
    ...Typography.styles.h2,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  emptyMessage: {
    ...Typography.styles.body,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: Typography.lineHeights.relaxed,
    marginBottom: Spacing['2xl'],
  },
  refreshButton: {
    minWidth: 120,
  },
  
  // Load more styles
  loadMoreContainer: {
    paddingHorizontal: Spacing.component.screen.horizontal,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  loadMoreText: {
    ...Typography.styles.body,
    color: Colors.text.secondary,
    marginTop: Spacing.sm,
  },
  loadMoreButton: {
    maxWidth: 200,
  },
});

export default ProductGrid;
