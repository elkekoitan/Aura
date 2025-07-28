/**
 * OrderConfirmationScreen
 * Order confirmation and success screen with order details and tracking
 * Displays order summary, estimated delivery, and next steps
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Share,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { GlassCard, GlassButton } from '../../components/ui';
import { Colors, Typography, Spacing } from '../../constants';
import { Order } from '../../store/types/cart';

type OrderConfirmationRouteProp = RouteProp<{
  OrderConfirmation: { order: Order };
}, 'OrderConfirmation'>;

export default function OrderConfirmationScreen() {
  const route = useRoute<OrderConfirmationRouteProp>();
  const navigation = useNavigation();
  
  const { order } = route.params;

  /**
   * Format date for display
   */
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  /**
   * Handle share order
   */
  const handleShareOrder = async () => {
    try {
      await Share.share({
        message: `I just ordered from Aura Fashion! Order #${order.orderNumber}`,
        title: 'My Aura Fashion Order',
      });
    } catch (error) {
      console.error('Error sharing order:', error);
    }
  };

  /**
   * Handle track order
   */
  const handleTrackOrder = () => {
    // TODO: Navigate to order tracking screen
    navigation.navigate('OrderTracking', { orderId: order.id });
  };

  /**
   * Handle continue shopping
   */
  const handleContinueShopping = () => {
    navigation.navigate('Discover');
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
        contentContainerStyle={styles.scrollContent}
      >
        {/* Success Header */}
        <View style={styles.successHeader}>
          <View style={styles.successIcon}>
            <LinearGradient
              colors={Colors.gradients.primary}
              style={styles.iconGradient}
            >
              <Ionicons name="checkmark" size={48} color={Colors.text.white} />
            </LinearGradient>
          </View>
          
          <Text style={styles.successTitle}>Order Confirmed!</Text>
          <Text style={styles.successMessage}>
            Thank you for your purchase. Your order has been confirmed and will be shipped soon.
          </Text>
        </View>

        {/* Order Details */}
        <GlassCard style={styles.orderCard}>
          <View style={styles.orderHeader}>
            <Text style={styles.orderTitle}>Order Details</Text>
            <TouchableOpacity
              style={styles.shareButton}
              onPress={handleShareOrder}
              activeOpacity={0.7}
            >
              <Ionicons name="share-outline" size={20} color={Colors.primary[500]} />
            </TouchableOpacity>
          </View>

          <View style={styles.orderInfo}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Order Number</Text>
              <Text style={styles.infoValue}>{order.orderNumber}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Order Date</Text>
              <Text style={styles.infoValue}>{formatDate(order.createdAt)}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Status</Text>
              <View style={styles.statusContainer}>
                <View style={[styles.statusDot, { backgroundColor: Colors.semantic.success }]} />
                <Text style={[styles.infoValue, { color: Colors.semantic.success }]}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Text>
              </View>
            </View>

            {order.estimatedDelivery && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Estimated Delivery</Text>
                <Text style={styles.infoValue}>{formatDate(order.estimatedDelivery)}</Text>
              </View>
            )}
          </View>
        </GlassCard>

        {/* Shipping Information */}
        <GlassCard style={styles.shippingCard}>
          <Text style={styles.sectionTitle}>Shipping Information</Text>
          
          <View style={styles.addressContainer}>
            <Text style={styles.addressName}>
              {order.shippingAddress.firstName} {order.shippingAddress.lastName}
            </Text>
            <Text style={styles.addressLine}>{order.shippingAddress.address1}</Text>
            {order.shippingAddress.address2 && (
              <Text style={styles.addressLine}>{order.shippingAddress.address2}</Text>
            )}
            <Text style={styles.addressLine}>
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
            </Text>
            <Text style={styles.addressLine}>{order.shippingAddress.country}</Text>
          </View>

          <View style={styles.shippingMethod}>
            <Text style={styles.shippingLabel}>Shipping Method</Text>
            <Text style={styles.shippingValue}>
              {order.shippingMethod.name} - {order.shippingMethod.estimatedDays}
            </Text>
          </View>
        </GlassCard>

        {/* Order Items */}
        <GlassCard style={styles.itemsCard}>
          <Text style={styles.sectionTitle}>Order Items ({order.items.length})</Text>
          
          {order.items.map((item) => (
            <View key={item.id} style={styles.orderItem}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName} numberOfLines={2}>
                  {item.product.name}
                </Text>
                {item.product.brand && (
                  <Text style={styles.itemBrand}>{item.product.brand.name}</Text>
                )}
                <View style={styles.itemOptions}>
                  {item.selectedSize && (
                    <Text style={styles.itemOption}>Size: {item.selectedSize}</Text>
                  )}
                  {item.selectedColor && (
                    <Text style={styles.itemOption}>Color: {item.selectedColor}</Text>
                  )}
                </View>
              </View>
              
              <View style={styles.itemPricing}>
                <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
                <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
              </View>
            </View>
          ))}
        </GlassCard>

        {/* Order Summary */}
        <GlassCard style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>${order.summary.subtotal.toFixed(2)}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={styles.summaryValue}>
              {order.summary.shipping === 0 ? 'FREE' : `$${order.summary.shipping.toFixed(2)}`}
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax</Text>
            <Text style={styles.summaryValue}>${order.summary.tax.toFixed(2)}</Text>
          </View>
          
          {order.summary.discount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Discount</Text>
              <Text style={[styles.summaryValue, styles.discountValue]}>
                -${order.summary.discount.toFixed(2)}
              </Text>
            </View>
          )}
          
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${order.summary.total.toFixed(2)}</Text>
          </View>
        </GlassCard>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <GlassButton
            title="Track Order"
            onPress={handleTrackOrder}
            variant="primary"
            size="large"
            fullWidth
            gradient
            gradientColors={Colors.gradients.primary}
            style={styles.trackButton}
            icon={<Ionicons name="location-outline" size={20} color={Colors.text.white} />}
          />
          
          <GlassButton
            title="Continue Shopping"
            onPress={handleContinueShopping}
            variant="outline"
            size="large"
            fullWidth
            style={styles.shopButton}
          />
        </View>

        {/* Help Section */}
        <GlassCard style={styles.helpCard}>
          <Text style={styles.helpTitle}>Need Help?</Text>
          <Text style={styles.helpText}>
            If you have any questions about your order, please contact our customer support team.
          </Text>
          
          <View style={styles.helpButtons}>
            <GlassButton
              title="Contact Support"
              onPress={() => {
                // TODO: Navigate to support
                console.log('Contact support');
              }}
              variant="outline"
              size="medium"
              style={styles.helpButton}
            />
            
            <GlassButton
              title="FAQ"
              onPress={() => {
                // TODO: Navigate to FAQ
                console.log('Open FAQ');
              }}
              variant="outline"
              size="medium"
              style={styles.helpButton}
            />
          </View>
        </GlassCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.component.screen.horizontal,
    paddingVertical: Spacing.lg,
  },

  // Success header
  successHeader: {
    alignItems: 'center',
    marginBottom: Spacing['2xl'],
  },
  successIcon: {
    marginBottom: Spacing.lg,
  },
  iconGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successTitle: {
    ...Typography.styles.h1,
    color: Colors.text.white,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  successMessage: {
    ...Typography.styles.body,
    color: Colors.text.white,
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: Typography.lineHeights.relaxed,
  },

  // Order details
  orderCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  orderTitle: {
    ...Typography.styles.h3,
    color: Colors.text.primary,
    fontWeight: Typography.weights.semiBold,
  },
  shareButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderInfo: {
    gap: Spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    ...Typography.styles.body,
    color: Colors.text.secondary,
  },
  infoValue: {
    ...Typography.styles.body,
    color: Colors.text.primary,
    fontWeight: Typography.weights.semiBold,
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

  // Shipping
  shippingCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.styles.h3,
    color: Colors.text.primary,
    fontWeight: Typography.weights.semiBold,
    marginBottom: Spacing.lg,
  },
  addressContainer: {
    marginBottom: Spacing.lg,
  },
  addressName: {
    ...Typography.styles.button,
    color: Colors.text.primary,
    fontWeight: Typography.weights.semiBold,
    marginBottom: Spacing.xs,
  },
  addressLine: {
    ...Typography.styles.body,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  shippingMethod: {
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    paddingTop: Spacing.md,
  },
  shippingLabel: {
    ...Typography.styles.body,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  shippingValue: {
    ...Typography.styles.body,
    color: Colors.text.primary,
    fontWeight: Typography.weights.semiBold,
  },

  // Order items
  itemsCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  itemInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  itemName: {
    ...Typography.styles.button,
    color: Colors.text.primary,
    fontWeight: Typography.weights.semiBold,
    marginBottom: Spacing.xs,
  },
  itemBrand: {
    ...Typography.styles.caption,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  itemOptions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  itemOption: {
    ...Typography.styles.caption,
    color: Colors.text.secondary,
    fontSize: 12,
  },
  itemPricing: {
    alignItems: 'flex-end',
  },
  itemQuantity: {
    ...Typography.styles.caption,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  itemPrice: {
    ...Typography.styles.button,
    color: Colors.text.primary,
    fontWeight: Typography.weights.semiBold,
  },

  // Summary
  summaryCard: {
    padding: Spacing.lg,
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

  // Actions
  actionButtons: {
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  trackButton: {
    marginBottom: 0,
  },
  shopButton: {
    marginBottom: 0,
  },

  // Help
  helpCard: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  helpTitle: {
    ...Typography.styles.h6,
    color: Colors.text.primary,
    fontWeight: Typography.weights.semiBold,
    marginBottom: Spacing.md,
  },
  helpText: {
    ...Typography.styles.body,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: Typography.lineHeights.relaxed,
    marginBottom: Spacing.lg,
  },
  helpButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  helpButton: {
    flex: 1,
  },
});
