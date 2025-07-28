/**
 * CartScreen
 * Shopping cart interface with item management and checkout functionality
 * Integrates with Redux cart state and navigation
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { GlassCard, GlassButton } from '../../components/ui';
import { Colors, Typography, Spacing } from '../../constants';
import { useAppDispatch, useAppSelector } from '../../store';
import { 
  loadCartFromStorage,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
} from '../../store/slices/cartSlice';
import { CartItem } from '../../store/types/cart';

export default function CartScreen() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  
  const { 
    items, 
    summary,
    loading,
    updatingQuantity,
    removingItem,
    error 
  } = useAppSelector((state) => state.cart);

  /**
   * Load cart on mount
   */
  useEffect(() => {
    dispatch(loadCartFromStorage());
  }, []);

  /**
   * Handle quantity update
   */
  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    
    dispatch(updateCartItemQuantity({ itemId, quantity: newQuantity }));
  };

  /**
   * Handle item removal
   */
  const handleRemoveItem = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    Alert.alert(
      'Remove Item',
      `Remove ${item.product.name} from your cart?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => dispatch(removeFromCart({ itemId }))
        },
      ]
    );
  };

  /**
   * Handle clear cart
   */
  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: () => dispatch(clearCart())
        },
      ]
    );
  };

  /**
   * Handle checkout
   */
  const handleCheckout = () => {
    if (items.length === 0) return;

    navigation.navigate('Checkout');
  };

  /**
   * Get product image
   */
  const getProductImage = (item: CartItem): string => {
    if (item.product.product_images && item.product.product_images.length > 0) {
      const primaryImage = item.product.product_images.find(img => img.is_primary);
      return primaryImage?.image_url || item.product.product_images[0].image_url;
    }
    if (item.product.images && item.product.images.length > 0) {
      return item.product.images[0];
    }
    return 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=600&fit=crop';
  };

  /**
   * Render cart item
   */
  const renderCartItem = ({ item }: { item: CartItem }) => (
    <GlassCard style={styles.cartItem}>
      <TouchableOpacity
        style={styles.itemContent}
        onPress={() => navigation.navigate('ProductDetail', { 
          productId: item.product.id, 
          product: item.product 
        })}
        activeOpacity={0.7}
      >
        {/* Product Image */}
        <Image
          source={{ uri: getProductImage(item) }}
          style={styles.productImage}
          resizeMode="cover"
        />

        {/* Product Info */}
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.product.name}
          </Text>
          
          {item.product.brand && (
            <Text style={styles.brandName}>{item.product.brand.name}</Text>
          )}

          {/* Selected options */}
          <View style={styles.optionsContainer}>
            {item.selectedSize && (
              <Text style={styles.optionText}>Size: {item.selectedSize}</Text>
            )}
            {item.selectedColor && (
              <Text style={styles.optionText}>Color: {item.selectedColor}</Text>
            )}
          </View>

          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
        </View>

        {/* Quantity Controls */}
        <View style={styles.quantityControls}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleUpdateQuantity(item.id, item.quantity - 1)}
            disabled={updatingQuantity}
            activeOpacity={0.7}
          >
            <Ionicons name="remove" size={16} color={Colors.text.primary} />
          </TouchableOpacity>
          
          <Text style={styles.quantity}>{item.quantity}</Text>
          
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleUpdateQuantity(item.id, item.quantity + 1)}
            disabled={updatingQuantity}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={16} color={Colors.text.primary} />
          </TouchableOpacity>
        </View>

        {/* Remove Button */}
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveItem(item.id)}
          disabled={removingItem}
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={20} color={Colors.semantic.error} />
        </TouchableOpacity>
      </TouchableOpacity>
    </GlassCard>
  );

  /**
   * Render cart summary
   */
  const renderSummary = () => (
    <GlassCard style={styles.summaryCard}>
      <Text style={styles.summaryTitle}>Order Summary</Text>
      
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Subtotal</Text>
        <Text style={styles.summaryValue}>${summary.subtotal.toFixed(2)}</Text>
      </View>
      
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Tax</Text>
        <Text style={styles.summaryValue}>${summary.tax.toFixed(2)}</Text>
      </View>
      
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Shipping</Text>
        <Text style={styles.summaryValue}>
          {summary.shipping === 0 ? 'FREE' : `$${summary.shipping.toFixed(2)}`}
        </Text>
      </View>
      
      {summary.discount > 0 && (
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Discount</Text>
          <Text style={[styles.summaryValue, styles.discountValue]}>
            -${summary.discount.toFixed(2)}
          </Text>
        </View>
      )}
      
      <View style={[styles.summaryRow, styles.totalRow]}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>${summary.total.toFixed(2)}</Text>
      </View>
    </GlassCard>
  );

  /**
   * Render empty cart
   */
  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <GlassCard style={styles.emptyCard}>
        <Text style={styles.emptyIcon}>🛒</Text>
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptyMessage}>
          Discover amazing fashion items and add them to your cart.
        </Text>
        <GlassButton
          title="Start Shopping"
          onPress={() => navigation.navigate('Discover')}
          variant="primary"
          size="medium"
          gradient
          gradientColors={Colors.gradients.primary}
          style={styles.shopButton}
        />
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
          <Text style={styles.title}>Shopping Cart</Text>
          <Text style={styles.subtitle}>
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </Text>
        </View>

        {items.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearCart}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={24} color={Colors.semantic.error} />
          </TouchableOpacity>
        )}
      </View>

      {items.length === 0 ? (
        renderEmptyCart()
      ) : (
        <>
          {/* Cart Items */}
          <FlatList
            data={items}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.id}
            style={styles.cartList}
            contentContainerStyle={styles.cartContent}
            showsVerticalScrollIndicator={false}
          />

          {/* Summary and Checkout */}
          <View style={styles.bottomSection}>
            {renderSummary()}
            
            <GlassButton
              title="Proceed to Checkout"
              onPress={handleCheckout}
              variant="primary"
              size="large"
              fullWidth
              gradient
              gradientColors={Colors.gradients.primary}
              style={styles.checkoutButton}
            />
          </View>
        </>
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
  clearButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartList: {
    flex: 1,
  },
  cartContent: {
    paddingHorizontal: Spacing.component.screen.horizontal,
    paddingBottom: Spacing.lg,
  },
  cartItem: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: Spacing.component.radius.md,
    marginRight: Spacing.md,
  },
  productInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  productName: {
    ...Typography.styles.h6,
    color: Colors.text.primary,
    fontWeight: Typography.weights.semiBold,
    marginBottom: Spacing.xs,
  },
  brandName: {
    ...Typography.styles.caption,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  optionsContainer: {
    marginBottom: Spacing.xs,
  },
  optionText: {
    ...Typography.styles.caption,
    color: Colors.text.secondary,
    fontSize: 12,
  },
  price: {
    ...Typography.styles.button,
    color: Colors.primary[500],
    fontWeight: Typography.weights.semiBold,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.glass.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    ...Typography.styles.button,
    color: Colors.text.primary,
    marginHorizontal: Spacing.md,
    minWidth: 30,
    textAlign: 'center',
  },
  removeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryCard: {
    margin: Spacing.component.screen.horizontal,
    padding: Spacing.lg,
  },
  summaryTitle: {
    ...Typography.styles.h3,
    color: Colors.text.primary,
    fontWeight: Typography.weights.semiBold,
    marginBottom: Spacing.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  summaryLabel: {
    ...Typography.styles.body,
    color: Colors.text.secondary,
  },
  summaryValue: {
    ...Typography.styles.body,
    color: Colors.text.primary,
    fontWeight: Typography.weights.semiBold,
  },
  discountValue: {
    color: Colors.semantic.success,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    paddingTop: Spacing.md,
    marginTop: Spacing.md,
    marginBottom: 0,
  },
  totalLabel: {
    ...Typography.styles.h6,
    color: Colors.text.primary,
    fontWeight: Typography.weights.bold,
  },
  totalValue: {
    ...Typography.styles.h6,
    color: Colors.primary[500],
    fontWeight: Typography.weights.bold,
  },
  bottomSection: {
    paddingBottom: Spacing.lg,
  },
  checkoutButton: {
    marginHorizontal: Spacing.component.screen.horizontal,
    marginTop: Spacing.md,
  },
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
