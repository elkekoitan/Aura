/**
 * ProductManagement Screen
 * Admin interface for managing products with CRUD operations
 * Includes search, filtering, and bulk operations
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { GlassCard, GlassButton, SearchBar } from '../../components/ui';
import { ProductCard } from '../../components/product';
import { Colors, Typography, Spacing } from '../../constants';
import { useAppDispatch, useAppSelector } from '../../store';
import { 
  fetchProducts,
  searchProducts,
  setSearchQuery,
} from '../../store/slices/productSlice';
import { deleteProduct } from '../../store/slices/adminSlice';
import { Product } from '../../store/types/product';

export default function ProductManagement() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  
  const { 
    products, 
    searchQuery,
    loading,
    error 
  } = useAppSelector((state) => state.products);

  const [refreshing, setRefreshing] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  /**
   * Load products on mount
   */
  useEffect(() => {
    loadProducts();
  }, []);

  /**
   * Load all products
   */
  const loadProducts = async () => {
    try {
      await dispatch(fetchProducts({ page: 1, limit: 100 }));
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  /**
   * Handle refresh
   */
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadProducts();
    } finally {
      setRefreshing(false);
    }
  };

  /**
   * Handle search
   */
  const handleSearch = (query: string) => {
    dispatch(setSearchQuery(query));
    if (query.trim()) {
      dispatch(searchProducts(query));
    } else {
      loadProducts();
    }
  };

  /**
   * Handle product edit
   */
  const handleEditProduct = (product: Product) => {
    navigation.navigate('EditProduct', { productId: product.id, product });
  };

  /**
   * Handle product delete
   */
  const handleDeleteProduct = (product: Product) => {
    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete "${product.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => confirmDeleteProduct(product.id)
        },
      ]
    );
  };

  /**
   * Confirm product deletion
   */
  const confirmDeleteProduct = async (productId: string) => {
    try {
      await dispatch(deleteProduct(productId)).unwrap();
      await loadProducts(); // Refresh list
      Alert.alert('Success', 'Product deleted successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete product. Please try again.');
    }
  };

  /**
   * Toggle product selection
   */
  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  /**
   * Toggle selection mode
   */
  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedProducts([]);
  };

  /**
   * Handle bulk delete
   */
  const handleBulkDelete = () => {
    if (selectedProducts.length === 0) return;

    Alert.alert(
      'Delete Products',
      `Are you sure you want to delete ${selectedProducts.length} product(s)? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: confirmBulkDelete
        },
      ]
    );
  };

  /**
   * Confirm bulk deletion
   */
  const confirmBulkDelete = async () => {
    try {
      // Delete products one by one
      for (const productId of selectedProducts) {
        await dispatch(deleteProduct(productId)).unwrap();
      }
      
      await loadProducts(); // Refresh list
      setSelectedProducts([]);
      setIsSelectionMode(false);
      Alert.alert('Success', `${selectedProducts.length} product(s) deleted successfully`);
    } catch (error) {
      Alert.alert('Error', 'Failed to delete some products. Please try again.');
    }
  };

  /**
   * Render product item for admin list
   */
  const renderProductItem = ({ item }: { item: Product }) => (
    <View style={styles.productItem}>
      <TouchableOpacity
        style={styles.productContent}
        onPress={() => isSelectionMode ? toggleProductSelection(item.id) : handleEditProduct(item)}
        onLongPress={() => {
          if (!isSelectionMode) {
            setIsSelectionMode(true);
            toggleProductSelection(item.id);
          }
        }}
        activeOpacity={0.7}
      >
        <GlassCard style={[
          styles.productCard,
          isSelectionMode && selectedProducts.includes(item.id) && styles.selectedCard
        ]}>
          {/* Selection indicator */}
          {isSelectionMode && (
            <View style={styles.selectionIndicator}>
              <Ionicons 
                name={selectedProducts.includes(item.id) ? "checkmark-circle" : "ellipse-outline"} 
                size={24} 
                color={selectedProducts.includes(item.id) ? Colors.primary[500] : Colors.text.secondary} 
              />
            </View>
          )}

          <ProductCard
            product={item}
            compact={true}
            showBrand={true}
            showPrice={true}
          />

          {/* Admin actions */}
          {!isSelectionMode && (
            <View style={styles.adminActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleEditProduct(item)}
                activeOpacity={0.7}
              >
                <Ionicons name="create-outline" size={20} color={Colors.primary[500]} />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleDeleteProduct(item)}
                activeOpacity={0.7}
              >
                <Ionicons name="trash-outline" size={20} color={Colors.semantic.error} />
              </TouchableOpacity>
            </View>
          )}

          {/* Stock status indicator */}
          <View style={styles.stockIndicator}>
            <View style={[
              styles.stockDot,
              { backgroundColor: item.stock_quantity > 10 ? Colors.semantic.success : 
                               item.stock_quantity > 0 ? Colors.semantic.warning : 
                               Colors.semantic.error }
            ]} />
            <Text style={styles.stockText}>
              {item.stock_quantity} in stock
            </Text>
          </View>
        </GlassCard>
      </TouchableOpacity>
    </View>
  );

  /**
   * Render header with actions
   */
  const renderHeader = () => (
    <View style={styles.headerActions}>
      <View style={styles.headerLeft}>
        <Text style={styles.productCount}>
          {products.length} product{products.length !== 1 ? 's' : ''}
        </Text>
        {isSelectionMode && (
          <Text style={styles.selectionCount}>
            {selectedProducts.length} selected
          </Text>
        )}
      </View>

      <View style={styles.headerRight}>
        {isSelectionMode ? (
          <>
            {selectedProducts.length > 0 && (
              <TouchableOpacity
                style={styles.headerButton}
                onPress={handleBulkDelete}
                activeOpacity={0.7}
              >
                <Ionicons name="trash-outline" size={20} color={Colors.semantic.error} />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.headerButton}
              onPress={toggleSelectionMode}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={20} color={Colors.text.primary} />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={toggleSelectionMode}
              activeOpacity={0.7}
            >
              <Ionicons name="checkmark-circle-outline" size={20} color={Colors.text.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => navigation.navigate('AddProduct')}
              activeOpacity={0.7}
            >
              <Ionicons name="add" size={20} color={Colors.primary[500]} />
            </TouchableOpacity>
          </>
        )}
      </View>
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
          <Text style={styles.title}>Product Management</Text>
          <Text style={styles.subtitle}>Manage your product catalog</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <SearchBar
          query={searchQuery}
          onQueryChange={handleSearch}
          onSearch={handleSearch}
          placeholder="Search products..."
          loading={loading}
        />
      </View>

      {/* Header Actions */}
      {renderHeader()}

      {/* Products List */}
      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id}
        style={styles.productsList}
        contentContainerStyle={styles.productsContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primary[500]}
            colors={[Colors.primary[500]]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <GlassCard style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>No Products Found</Text>
              <Text style={styles.emptyMessage}>
                {searchQuery ? 'Try adjusting your search terms.' : 'Start by adding your first product.'}
              </Text>
              {!searchQuery && (
                <GlassButton
                  title="Add Product"
                  onPress={() => navigation.navigate('AddProduct')}
                  variant="primary"
                  size="medium"
                  gradient
                  gradientColors={Colors.gradients.primary}
                  style={styles.addButton}
                />
              )}
            </GlassCard>
          </View>
        }
      />
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
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.component.screen.horizontal,
    marginBottom: Spacing.md,
  },
  headerLeft: {
    flex: 1,
  },
  productCount: {
    ...Typography.styles.body,
    color: Colors.text.white,
    fontWeight: Typography.weights.semiBold,
  },
  selectionCount: {
    ...Typography.styles.caption,
    color: Colors.text.white,
    opacity: 0.8,
    marginTop: Spacing.xs,
  },
  headerRight: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.glass.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productsList: {
    flex: 1,
  },
  productsContent: {
    paddingHorizontal: Spacing.component.screen.horizontal,
    paddingBottom: Spacing['3xl'],
  },
  productItem: {
    marginBottom: Spacing.md,
  },
  productContent: {
    position: 'relative',
  },
  productCard: {
    padding: Spacing.md,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: Colors.primary[500],
  },
  selectionIndicator: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
    zIndex: 10,
  },
  adminActions: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    flexDirection: 'row',
    gap: Spacing.sm,
    zIndex: 10,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.glass.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stockIndicator: {
    position: 'absolute',
    bottom: Spacing.md,
    right: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.glass.light,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Spacing.component.radius.sm,
  },
  stockDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Spacing.xs,
  },
  stockText: {
    ...Typography.styles.caption,
    color: Colors.text.primary,
    fontSize: 11,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing['3xl'],
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
  addButton: {
    minWidth: 120,
  },
});
