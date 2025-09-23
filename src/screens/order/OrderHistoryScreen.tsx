/**
 * @module screens/order/OrderHistoryScreen
 * @description A screen that displays the user's order history, with options to search, filter by status, and view order details.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { GlassCard, GlassButton, SearchBar } from '../../components/ui';
import { Colors, Typography, Spacing } from '../../constants';
import { useAppDispatch, useAppSelector } from '../../store';
import { 
  fetchOrders,
  setSearchQuery,
  setFilters,
  clearFilters,
} from '../../store/slices/orderSlice';
import { Order, OrderStatus } from '../../store/types/order';

const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending: Colors.semantic.warning,
  confirmed: Colors.primary[500],
  processing: Colors.primary[600],
  shipped: Colors.semantic.info,
  delivered: Colors.semantic.success,
  cancelled: Colors.semantic.error,
  refunded: Colors.semantic.warning,
  returned: Colors.semantic.error,
};

const ORDER_STATUS_ICONS: Record<OrderStatus, string> = {
  pending: 'time-outline',
  confirmed: 'checkmark-circle-outline',
  processing: 'cog-outline',
  shipped: 'airplane-outline',
  delivered: 'checkmark-done-outline',
  cancelled: 'close-circle-outline',
  refunded: 'return-up-back-outline',
  returned: 'return-down-back-outline',
};

/**
 * A screen that displays the user's order history, with options to search, filter by status, and view order details.
 * @returns {React.FC} A React component.
 */
export default function OrderHistoryScreen() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  
  const { 
    orders, 
    searchQuery,
    filters,
    loading,
    error 
  } = useAppSelector((state) => state.orders);

  const [refreshing, setRefreshing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'all'>('all');

  /**
   * Loads the user's orders when the component mounts.
   */
  useEffect(() => {
    loadOrders();
  }, []);

  /**
   * Fetches the list of orders from the store.
   */
  const loadOrders = async () => {
    try {
      await dispatch(fetchOrders({}));
    } catch (error) {
      console.error('Failed to load orders:', error);
    }
  };

  /**
   * Handles the pull-to-refresh action to reload the order list.
   */
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadOrders();
    } finally {
      setRefreshing(false);
    }
  };

  /**
   * Handles searching for orders.
   * @param {string} query - The search query.
   * @todo Implement search functionality.
   */
  const handleSearch = (query: string) => {
    dispatch(setSearchQuery(query));
    // TODO: Implement search functionality
  };

  /**
   * Handles filtering orders by status.
   * @param {OrderStatus | 'all'} status - The status to filter by.
   * @todo Implement filtering functionality.
   */
  const handleStatusFilter = (status: OrderStatus | 'all') => {
    setSelectedStatus(status);
    if (status === 'all') {
      dispatch(clearFilters());
    } else {
      dispatch(setFilters({ status: [status] }));
    }
    // TODO: Implement filtering
  };

  /**
   * Navigates to the order detail screen.
   * @param {Order} order - The order to view.
   */
  const handleOrderPress = (order: Order) => {
    navigation.navigate('OrderDetail', { orderId: order.id, order });
  };

  /**
   * Navigates to the order tracking screen.
   * @param {Order} order - The order to track.
   */
  const handleTrackOrder = (order: Order) => {
    navigation.navigate('OrderTracking', { orderId: order.id });
  };

  /**
   * Handles reordering items from a previous order.
   * @param {Order} order - The order to reorder from.
   * @todo Implement reorder functionality.
   */
  const handleReorder = (order: Order) => {
    // TODO: Implement reorder functionality
    console.log('Reorder:', order.id);
  };

  /**
   * Formats a date string for display.
   * @param {string} dateString - The ISO date string to format.
   * @returns {string} The formatted date string (e.g., "Jan 1, 2024").
   */
  const formatOrderDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  /**
   * Gets the display text for a given order status.
   * @param {OrderStatus} status - The order status.
   * @returns {string} The formatted status text.
   */
  const getStatusDisplayText = (status: OrderStatus): string => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
  };

  /**
   * Renders a single order item for the list.
   * @param {object} params - The render item parameters.
   * @param {Order} params.item - The order item to render.
   * @returns {React.ReactElement} The rendered order item component.
   */
  const renderOrderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity
      style={styles.orderItem}
      onPress={() => handleOrderPress(item)}
      activeOpacity={0.7}
    >
      <GlassCard style={styles.orderCard}>
        {/* Order Header */}
        <View style={styles.orderHeader}>
          <View style={styles.orderInfo}>
            <Text style={styles.orderNumber}>{item.orderNumber}</Text>
            <Text style={styles.orderDate}>{formatOrderDate(item.createdAt)}</Text>
          </View>
          
          <View style={styles.statusContainer}>
            <View style={[
              styles.statusDot,
              { backgroundColor: ORDER_STATUS_COLORS[item.status] }
            ]} />
            <Text style={[
              styles.statusText,
              { color: ORDER_STATUS_COLORS[item.status] }
            ]}>
              {getStatusDisplayText(item.status)}
            </Text>
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.orderSummary}>
          <Text style={styles.itemCount}>
            {item.summary.itemCount} {item.summary.itemCount === 1 ? 'item' : 'items'}
          </Text>
          <Text style={styles.orderTotal}>${item.summary.total.toFixed(2)}</Text>
        </View>

        {/* Order Actions */}
        <View style={styles.orderActions}>
          {item.trackingNumber && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleTrackOrder(item)}
              activeOpacity={0.7}
            >
              <Ionicons name="location-outline" size={16} color={Colors.primary[500]} />
              <Text style={styles.actionText}>Track</Text>
            </TouchableOpacity>
          )}
          
          {item.status === 'delivered' && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleReorder(item)}
              activeOpacity={0.7}
            >
              <Ionicons name="refresh-outline" size={16} color={Colors.primary[500]} />
              <Text style={styles.actionText}>Reorder</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleOrderPress(item)}
            activeOpacity={0.7}
          >
            <Ionicons name="eye-outline" size={16} color={Colors.primary[500]} />
            <Text style={styles.actionText}>View</Text>
          </TouchableOpacity>
        </View>
      </GlassCard>
    </TouchableOpacity>
  );

  /**
   * Renders the status filter buttons.
   * @returns {React.ReactElement} The status filter component.
   */
  const renderStatusFilter = () => {
    const statuses: Array<{ key: OrderStatus | 'all'; label: string }> = [
      { key: 'all', label: 'All' },
      { key: 'pending', label: 'Pending' },
      { key: 'confirmed', label: 'Confirmed' },
      { key: 'shipped', label: 'Shipped' },
      { key: 'delivered', label: 'Delivered' },
    ];

    return (
      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          data={statuses}
          keyExtractor={(item) => item.key}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedStatus === item.key && styles.activeFilterButton
              ]}
              onPress={() => handleStatusFilter(item.key)}
              activeOpacity={0.7}
            >
              <GlassCard style={[
                styles.filterCard,
                selectedStatus === item.key && styles.activeFilterCard
              ]}>
                <Text style={[
                  styles.filterText,
                  selectedStatus === item.key && styles.activeFilterText
                ]}>
                  {item.label}
                </Text>
              </GlassCard>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  };

  /**
   * Renders a view to display when there are no orders.
   * @returns {React.ReactElement} The empty state component.
   */
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <GlassCard style={styles.emptyCard}>
        <Text style={styles.emptyIcon}>📦</Text>
        <Text style={styles.emptyTitle}>No Orders Yet</Text>
        <Text style={styles.emptyMessage}>
          {searchQuery 
            ? `No orders found for "${searchQuery}"`
            : "You haven't placed any orders yet. Start shopping to see your order history here."
          }
        </Text>
        {!searchQuery && (
          <GlassButton
            title="Start Shopping"
            onPress={() => navigation.navigate('Discover')}
            variant="primary"
            size="medium"
            gradient
            gradientColors={Colors.gradients.primary}
            style={styles.shopButton}
          />
        )}
      </GlassCard>
    </View>
  );

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
        
        <View style={styles.headerContent}>
          <Text style={styles.title}>Order History</Text>
          <Text style={styles.subtitle}>
            {orders.length} {orders.length === 1 ? 'order' : 'orders'}
          </Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <SearchBar
          query={searchQuery}
          onQueryChange={handleSearch}
          onSearch={handleSearch}
          placeholder="Search orders..."
          loading={loading}
        />
      </View>

      {/* Status Filter */}
      {renderStatusFilter()}

      {/* Orders List */}
      {orders.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          style={styles.ordersList}
          contentContainerStyle={styles.ordersContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={Colors.primary[500]}
              colors={[Colors.primary[500]]}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.component.screen.horizontal,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    marginRight: Spacing.md,
  },
  backGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
  },
  title: {
    ...Typography.styles.h1,
    color: Colors.text.white,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.styles.body,
    color: Colors.text.white,
    opacity: 0.8,
  },
  searchContainer: {
    paddingHorizontal: Spacing.component.screen.horizontal,
    marginBottom: Spacing.md,
  },

  // Filter styles
  filterContainer: {
    marginBottom: Spacing.lg,
  },
  filterContent: {
    paddingHorizontal: Spacing.component.screen.horizontal,
    gap: Spacing.sm,
  },
  filterButton: {
    marginRight: Spacing.sm,
  },
  filterCard: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  activeFilterCard: {
    backgroundColor: Colors.primary[500],
    borderColor: Colors.primary[500],
  },
  filterText: {
    ...Typography.styles.button,
    color: Colors.text.primary,
    fontSize: 14,
  },
  activeFilterText: {
    color: Colors.text.white,
  },

  // Orders list
  ordersList: {
    flex: 1,
  },
  ordersContent: {
    paddingHorizontal: Spacing.component.screen.horizontal,
    paddingBottom: Spacing['3xl'],
  },
  orderItem: {
    marginBottom: Spacing.md,
  },
  orderCard: {
    padding: Spacing.lg,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    ...Typography.styles.h6,
    color: Colors.text.primary,
    fontWeight: Typography.weights.semiBold,
    marginBottom: Spacing.xs,
  },
  orderDate: {
    ...Typography.styles.caption,
    color: Colors.text.secondary,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    ...Typography.styles.caption,
    fontWeight: Typography.weights.semiBold,
    fontSize: 12,
  },
  orderSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  itemCount: {
    ...Typography.styles.body,
    color: Colors.text.secondary,
  },
  orderTotal: {
    ...Typography.styles.h6,
    color: Colors.text.primary,
    fontWeight: Typography.weights.bold,
  },
  orderActions: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  actionText: {
    ...Typography.styles.button,
    color: Colors.primary[500],
    fontSize: 14,
  },

  // Empty state
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
    fontSize: 64,
    marginBottom: Spacing.lg,
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
  shopButton: {
    minWidth: 150,
  },
});
