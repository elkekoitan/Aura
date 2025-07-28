import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard, GlassButton } from '../../components/ui';
import { Colors, Typography, Spacing } from '../../constants';
import { useAppDispatch, useAppSelector } from '../../store';
import { removeFromCart, updateQuantity, clearCart } from '../../store/slices/cartSlice';

const { width } = Dimensions.get('window');

export default function CartScreen() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { items, total } = useAppSelector((state) => state.cart);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRemoveItem = (productId: string) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => dispatch(removeFromCart(productId))
        },
      ]
    );
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
    } else {
      dispatch(updateQuantity({ productId, quantity }));
    }
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          style: 'destructive',
          onPress: () => dispatch(clearCart())
        },
      ]
    );
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      Alert.alert('Empty Cart', 'Please add some items to your cart first.');
      return;
    }

    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      navigation.navigate('Checkout' as never);
    }, 1000);
  };

  const renderCartItem = (item: any) => (
    <GlassCard key={item.id} style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemBrand}>{item.brand}</Text>
        <Text style={styles.itemPrice}>${item.price}</Text>
        
        {item.selectedSize && (
          <Text style={styles.itemSize}>Size: {item.selectedSize}</Text>
        )}
        
        {item.selectedColor && (
          <Text style={styles.itemColor}>Color: {item.selectedColor}</Text>
        )}
      </View>

      <View style={styles.itemActions}>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleUpdateQuantity(item.id, item.quantity - 1)}
          >
            <Ionicons name="remove" size={16} color={Colors.text.white} />
          </TouchableOpacity>
          
          <Text style={styles.quantityText}>{item.quantity}</Text>
          
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleUpdateQuantity(item.id, item.quantity + 1)}
          >
            <Ionicons name="add" size={16} color={Colors.text.white} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveItem(item.id)}
        >
          <Ionicons name="trash-outline" size={20} color={Colors.semantic.error} />
        </TouchableOpacity>
      </View>
    </GlassCard>
  );

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="bag-outline" size={80} color={Colors.text.white} />
      <Text style={styles.emptyTitle}>Your cart is empty</Text>
      <Text style={styles.emptySubtitle}>
        Discover amazing fashion items and add them to your cart
      </Text>
      <GlassButton
        title="Start Shopping"
        onPress={() => navigation.navigate('Discover' as never)}
        style={styles.shopButton}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[Colors.primary[600], Colors.primary[800]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.text.white} />
        </TouchableOpacity>
        
        <Text style={styles.title}>Shopping Cart</Text>
        
        {items.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearCart}
          >
            <Ionicons name="trash-outline" size={24} color={Colors.text.white} />
          </TouchableOpacity>
        )}
      </View>

      {items.length === 0 ? (
        renderEmptyCart()
      ) : (
        <>
          {/* Cart Items */}
          <ScrollView
            style={styles.cartList}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.cartContent}
          >
            {items.map(renderCartItem)}
          </ScrollView>

          {/* Summary */}
          <View style={styles.summary}>
            <GlassCard style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal ({items.length} items)</Text>
                <Text style={styles.summaryValue}>${total.toFixed(2)}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Shipping</Text>
                <Text style={styles.summaryValue}>Free</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tax</Text>
                <Text style={styles.summaryValue}>${(total * 0.08).toFixed(2)}</Text>
              </View>
              
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>${(total * 1.08).toFixed(2)}</Text>
              </View>
            </GlassCard>

            <GlassButton
              title={isProcessing ? "Processing..." : "Proceed to Checkout"}
              onPress={handleCheckout}
              disabled={isProcessing}
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
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...Typography.styles.h2,
    color: Colors.text.white,
    flex: 1,
    textAlign: 'center',
  },
  clearButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartList: {
    flex: 1,
  },
  cartContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  cartItem: {
    flexDirection: 'row',
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: Colors.neutral[200],
  },
  itemDetails: {
    flex: 1,
    marginLeft: Spacing.md,
    justifyContent: 'space-between',
  },
  itemName: {
    ...Typography.styles.h4,
    color: Colors.text.white,
    marginBottom: Spacing.xs,
  },
  itemBrand: {
    ...Typography.styles.caption,
    color: Colors.text.white,
    opacity: 0.7,
  },
  itemPrice: {
    ...Typography.styles.h4,
    color: Colors.accent[400],
    fontWeight: '700',
  },
  itemSize: {
    ...Typography.styles.caption,
    color: Colors.text.white,
    opacity: 0.8,
  },
  itemColor: {
    ...Typography.styles.caption,
    color: Colors.text.white,
    opacity: 0.8,
  },
  itemActions: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: Spacing.xs,
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    ...Typography.styles.body,
    color: Colors.text.white,
    marginHorizontal: Spacing.md,
    fontWeight: '600',
  },
  removeButton: {
    marginTop: Spacing.md,
    padding: Spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyTitle: {
    ...Typography.styles.h2,
    color: Colors.text.white,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    ...Typography.styles.body,
    color: Colors.text.white,
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: Spacing.xl,
  },
  shopButton: {
    minWidth: 200,
  },
  summary: {
    padding: Spacing.lg,
  },
  summaryCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  summaryLabel: {
    ...Typography.styles.body,
    color: Colors.text.white,
  },
  summaryValue: {
    ...Typography.styles.body,
    color: Colors.text.white,
    fontWeight: '600',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    paddingTop: Spacing.sm,
    marginTop: Spacing.sm,
    marginBottom: 0,
  },
  totalLabel: {
    ...Typography.styles.h3,
    color: Colors.text.white,
  },
  totalValue: {
    ...Typography.styles.h3,
    color: Colors.accent[400],
    fontWeight: '700',
  },
  checkoutButton: {
    width: '100%',
  },
});
