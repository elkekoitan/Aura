/**
 * @module components/brand/BrandGrid
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
import { BrandCard } from './BrandCard';
import { GlassCard, GlassButton } from '../ui';
import { Colors, Typography, Spacing } from '../../constants';
import { Brand } from '../../store/types/brand';

const { width } = Dimensions.get('window');

interface BrandGridProps {
  brands: Brand[];
  onBrandPress?: (brand: Brand) => void;
  onFollow?: (brand: Brand) => void;
  loading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  numColumns?: number;
  showLoadMore?: boolean;
  onLoadMore?: () => void;
  loadingMore?: boolean;
  emptyTitle?: string;
  emptyMessage?: string;
  followingBrandIds?: string[];
  compact?: boolean;
  showStats?: boolean;
  showProducts?: boolean;
}

/**
 * A responsive grid layout for displaying a list of brands.
 * It supports infinite scrolling, loading states, empty states, and pull-to-refresh.
 * @param {object} props - The component props.
 * @param {Brand[]} props.brands - An array of brand objects to display.
 * @param {(brand: Brand) => void} [props.onBrandPress] - Function to call when a brand card is pressed.
 * @param {(brand: Brand) => void} [props.onFollow] - Function to call when a brand's follow button is pressed.
 * @param {boolean} [props.loading=false] - Whether the initial data is loading.
 * @param {boolean} [props.refreshing=false] - Whether the grid is currently being refreshed.
 * @param {() => void} [props.onRefresh] - Function to call when the user pulls to refresh.
 * @param {number} [props.numColumns=2] - The number of columns in the grid.
 * @param {boolean} [props.showLoadMore=false] - Whether to show the "Load More" button.
 * @param {() => void} [props.onLoadMore] - Function to call when the user reaches the end of the list.
 * @param {boolean} [props.loadingMore=false] - Whether more data is being loaded.
 * @param {string} [props.emptyTitle="No Brands Found"] - The title for the empty state.
 * @param {string} [props.emptyMessage="Try adjusting your search or filters to find brands."] - The message for the empty state.
 * @param {string[]} [props.followingBrandIds=[]] - An array of brand IDs that the user is following.
 * @param {boolean} [props.compact=false] - Whether to render the brand cards in a compact style.
 * @param {boolean} [props.showStats=true] - Whether to show stats on the brand cards.
 * @param {boolean} [props.showProducts=false] - Whether to show products on the brand cards.
 * @returns {React.FC} A React component.
 */
export const BrandGrid: React.FC<BrandGridProps> = ({
  brands,
  onBrandPress,
  onFollow,
  loading = false,
  refreshing = false,
  onRefresh,
  numColumns = 2,
  showLoadMore = false,
  onLoadMore,
  loadingMore = false,
  emptyTitle = "No Brands Found",
  emptyMessage = "Try adjusting your search or filters to find brands.",
  followingBrandIds = [],
  compact = false,
  showStats = true,
  showProducts = false,
}) => {
  /**
   * Renders a single brand card item for the FlatList.
   * @param {object} params - The render item parameters.
   * @param {Brand} params.item - The brand item to render.
   * @returns {React.ReactElement} The rendered BrandCard component.
   */
  const renderBrand = ({ item }: { item: Brand }) => (
    <BrandCard
      brand={item}
      onPress={onBrandPress}
      onFollow={onFollow}
      isFollowing={followingBrandIds.includes(item.id)}
      compact={compact}
      showStats={showStats}
      showProducts={showProducts}
    />
  );

  /**
   * Renders a loading skeleton placeholder while the initial data is being fetched.
   * @returns {React.ReactElement} The loading skeleton view.
   */
  const renderLoadingSkeleton = () => (
    <View style={styles.skeletonContainer}>
      {Array.from({ length: 6 }).map((_, index) => (
        <View key={index} style={styles.skeletonCard}>
          <GlassCard style={styles.skeletonContent}>
            <View style={styles.skeletonHeader}>
              <View style={styles.skeletonLogo} />
              <View style={styles.skeletonFollow} />
            </View>
            <View style={styles.skeletonInfo}>
              <View style={styles.skeletonLine} />
              <View style={[styles.skeletonLine, styles.skeletonLineShort]} />
              <View style={styles.skeletonStats}>
                <View style={styles.skeletonStat} />
                <View style={styles.skeletonStat} />
              </View>
            </View>
          </GlassCard>
        </View>
      ))}
    </View>
  );

  /**
   * Renders a view to display when there are no brands to show.
   * @returns {React.ReactElement} The empty state view.
   */
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <GlassCard style={styles.emptyCard}>
        <View style={styles.emptyIcon}>
          <Text style={styles.emptyIconText}>🏢</Text>
        </View>
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
   * Renders the footer component for the FlatList, showing a "Load More" button or an activity indicator.
   * @returns {React.ReactElement | null} The footer component, or null.
   */
  const renderFooter = () => {
    if (!showLoadMore) return null;

    if (loadingMore) {
      return (
        <View style={styles.loadMoreContainer}>
          <ActivityIndicator size="small" color={Colors.primary[500]} />
          <Text style={styles.loadMoreText}>Loading more brands...</Text>
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
   * Calculates the layout of an item in the list for performance optimization.
   * @param {any} data - The list data.
   * @param {number} index - The index of the item.
   * @returns {{length: number, offset: number, index: number}} The layout object.
   */
  const getItemLayout = (data: any, index: number) => {
    const itemHeight = compact ? 80 : (width - Spacing.component.screen.horizontal * 2 - Spacing.lg) / 2 * 1.4;
    return {
      length: itemHeight,
      offset: itemHeight * Math.floor(index / numColumns),
      index,
    };
  };

  // Show loading skeleton on initial load
  if (loading && brands.length === 0) {
    return renderLoadingSkeleton();
  }

  // Show empty state when no brands
  if (!loading && brands.length === 0) {
    return renderEmptyState();
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={brands}
        renderItem={renderBrand}
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
  skeletonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  skeletonLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.glass.light,
  },
  skeletonFollow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.glass.light,
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
  skeletonStats: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  skeletonStat: {
    width: 60,
    height: 10,
    backgroundColor: Colors.glass.light,
    borderRadius: 5,
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
  emptyIcon: {
    marginBottom: Spacing.lg,
  },
  emptyIconText: {
    fontSize: 48,
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

export default BrandGrid;
