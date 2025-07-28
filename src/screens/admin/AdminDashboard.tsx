/**
 * AdminDashboard Screen
 * Main admin interface with statistics, quick actions, and recent activity
 * Provides overview of all admin operations and system health
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { GlassCard, GlassButton } from '../../components/ui';
import { AdminCard } from '../../components/admin/AdminCard';
import { Colors, Typography, Spacing } from '../../constants';
import { useAppDispatch, useAppSelector } from '../../store';
import { 
  fetchDashboardStats, 
  fetchRecentActivity,
  clearDashboardError,
} from '../../store/slices/adminSlice';
import { AdminActivity } from '../../store/types/admin';

export default function AdminDashboard() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  
  const { 
    dashboardStats, 
    recentActivity,
    dashboardLoading,
    activityLoading,
    dashboardError,
  } = useAppSelector((state) => state.admin);

  const [refreshing, setRefreshing] = useState(false);

  /**
   * Load dashboard data on mount
   */
  useEffect(() => {
    loadDashboardData();
  }, []);

  /**
   * Load all dashboard data
   */
  const loadDashboardData = async () => {
    try {
      await Promise.all([
        dispatch(fetchDashboardStats()),
        dispatch(fetchRecentActivity()),
      ]);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  /**
   * Handle refresh
   */
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadDashboardData();
    } finally {
      setRefreshing(false);
    }
  };

  /**
   * Navigate to specific admin section
   */
  const navigateToSection = (section: string) => {
    switch (section) {
      case 'products':
        navigation.navigate('ProductManagement');
        break;
      case 'brands':
        navigation.navigate('BrandManagement');
        break;
      case 'categories':
        navigation.navigate('CategoryManagement');
        break;
      case 'users':
        // TODO: Implement user management
        console.log('Navigate to user management');
        break;
      default:
        console.log('Unknown section:', section);
    }
  };

  /**
   * Format activity timestamp
   */
  const formatActivityTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return `${diffDays}d ago`;
    }
  };

  /**
   * Get activity icon based on type
   */
  const getActivityIcon = (type: string): string => {
    switch (type) {
      case 'product_created':
      case 'product_updated':
        return 'shirt-outline';
      case 'brand_created':
      case 'brand_updated':
        return 'business-outline';
      case 'user_registered':
        return 'person-add-outline';
      case 'order_placed':
        return 'bag-outline';
      default:
        return 'information-circle-outline';
    }
  };

  /**
   * Render activity item
   */
  const renderActivityItem = ({ item }: { item: AdminActivity }) => (
    <View style={styles.activityItem}>
      <View style={styles.activityIcon}>
        <Ionicons 
          name={getActivityIcon(item.type) as any} 
          size={20} 
          color={Colors.primary[500]} 
        />
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityDescription}>{item.description}</Text>
        <Text style={styles.activityTime}>{formatActivityTime(item.created_at)}</Text>
      </View>
    </View>
  );

  /**
   * Render quick actions
   */
  const renderQuickActions = () => (
    <View style={styles.quickActions}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsGrid}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('AddProduct')}
          activeOpacity={0.7}
        >
          <GlassCard style={styles.actionCard}>
            <Ionicons name="add-circle-outline" size={32} color={Colors.primary[500]} />
            <Text style={styles.actionText}>Add Product</Text>
          </GlassCard>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('AddBrand')}
          activeOpacity={0.7}
        >
          <GlassCard style={styles.actionCard}>
            <Ionicons name="business-outline" size={32} color={Colors.primary[500]} />
            <Text style={styles.actionText}>Add Brand</Text>
          </GlassCard>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigateToSection('products')}
          activeOpacity={0.7}
        >
          <GlassCard style={styles.actionCard}>
            <Ionicons name="list-outline" size={32} color={Colors.primary[500]} />
            <Text style={styles.actionText}>Manage Products</Text>
          </GlassCard>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigateToSection('brands')}
          activeOpacity={0.7}
        >
          <GlassCard style={styles.actionCard}>
            <Ionicons name="storefront-outline" size={32} color={Colors.primary[500]} />
            <Text style={styles.actionText}>Manage Brands</Text>
          </GlassCard>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (dashboardError) {
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
            <Text style={styles.errorTitle}>Error Loading Dashboard</Text>
            <Text style={styles.errorMessage}>{dashboardError}</Text>
            <GlassButton
              title="Retry"
              onPress={() => {
                dispatch(clearDashboardError());
                loadDashboardData();
              }}
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
          <Text style={styles.title}>Admin Dashboard</Text>
          <Text style={styles.subtitle}>Manage your fashion platform</Text>
        </View>

        {/* Statistics Grid */}
        {dashboardStats && (
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <View style={styles.statsGrid}>
              <AdminCard
                title="Total Products"
                value={dashboardStats.totalProducts}
                icon="shirt-outline"
                trend={{ value: 12, isPositive: true }}
                onPress={() => navigateToSection('products')}
              />
              
              <AdminCard
                title="Total Brands"
                value={dashboardStats.totalBrands}
                icon="business-outline"
                trend={{ value: 8, isPositive: true }}
                onPress={() => navigateToSection('brands')}
              />
              
              <AdminCard
                title="Featured Items"
                value={dashboardStats.featuredProducts}
                icon="star-outline"
                subtitle="Products"
              />
              
              <AdminCard
                title="Low Stock"
                value={dashboardStats.lowStockProducts}
                icon="warning-outline"
                subtitle="Items"
                trend={{ value: 5, isPositive: false }}
              />
            </View>
          </View>
        )}

        {/* Quick Actions */}
        {renderQuickActions()}

        {/* Recent Activity */}
        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <GlassCard style={styles.activityCard}>
            {activityLoading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading activity...</Text>
              </View>
            ) : recentActivity.length > 0 ? (
              <FlatList
                data={recentActivity}
                renderItem={renderActivityItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                ItemSeparatorComponent={() => <View style={styles.activitySeparator} />}
              />
            ) : (
              <View style={styles.emptyActivity}>
                <Text style={styles.emptyText}>No recent activity</Text>
              </View>
            )}
          </GlassCard>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  sectionTitle: {
    ...Typography.styles.h2,
    color: Colors.text.white,
    paddingHorizontal: Spacing.component.screen.horizontal,
    marginBottom: Spacing.md,
  },

  // Statistics
  statsSection: {
    marginBottom: Spacing['2xl'],
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.component.screen.horizontal,
  },

  // Quick Actions
  quickActions: {
    marginBottom: Spacing['2xl'],
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.component.screen.horizontal,
  },
  actionButton: {
    width: '48%',
    marginBottom: Spacing.md,
  },
  actionCard: {
    padding: Spacing.lg,
    alignItems: 'center',
    minHeight: 100,
    justifyContent: 'center',
  },
  actionText: {
    ...Typography.styles.button,
    color: Colors.text.primary,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },

  // Activity
  activitySection: {
    marginBottom: Spacing['3xl'],
  },
  activityCard: {
    marginHorizontal: Spacing.component.screen.horizontal,
    padding: Spacing.lg,
  },
  loadingContainer: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  loadingText: {
    ...Typography.styles.body,
    color: Colors.text.secondary,
  },
  emptyActivity: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  emptyText: {
    ...Typography.styles.body,
    color: Colors.text.secondary,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: Spacing.md,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.glass.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  activityContent: {
    flex: 1,
  },
  activityDescription: {
    ...Typography.styles.body,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  activityTime: {
    ...Typography.styles.caption,
    color: Colors.text.secondary,
  },
  activitySeparator: {
    height: 1,
    backgroundColor: Colors.border.light,
    marginVertical: Spacing.sm,
  },
});
