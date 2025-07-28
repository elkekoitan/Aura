/**
 * CheckoutScreen
 * Complete checkout flow with shipping, payment, and order confirmation
 * Integrates with Stripe for payment processing and order management
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { GlassCard, GlassButton } from '../../components/ui';
import { Colors, Typography, Spacing } from '../../constants';
import { useAppDispatch, useAppSelector } from '../../store';
import { processCheckout, clearCart } from '../../store/slices/cartSlice';
import { ShippingAddress, PaymentMethod, ShippingMethod } from '../../store/types/cart';

const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: 'standard',
    name: 'Standard Shipping',
    description: '5-7 business days',
    price: 9.99,
    estimatedDays: '5-7 days',
  },
  {
    id: 'express',
    name: 'Express Shipping',
    description: '2-3 business days',
    price: 19.99,
    estimatedDays: '2-3 days',
  },
  {
    id: 'overnight',
    name: 'Overnight Shipping',
    description: 'Next business day',
    price: 39.99,
    estimatedDays: '1 day',
  },
];

export default function CheckoutScreen() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  
  const { items, summary, isCheckingOut, checkoutError } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);

  // Checkout state
  const [currentStep, setCurrentStep] = useState<'shipping' | 'payment' | 'review'>('shipping');
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: '',
    lastName: '',
    address1: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
  });
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<ShippingMethod>(SHIPPING_METHODS[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({
    type: 'card',
    cardLast4: '4242',
    cardBrand: 'visa',
    expiryMonth: 12,
    expiryYear: 2025,
  });

  /**
   * Calculate total with shipping
   */
  const calculateTotal = () => {
    return summary.subtotal + summary.tax + selectedShippingMethod.price - summary.discount;
  };

  /**
   * Validate shipping address
   */
  const validateShippingAddress = (): boolean => {
    const required = ['firstName', 'lastName', 'address1', 'city', 'state', 'zipCode'];
    return required.every(field => shippingAddress[field as keyof ShippingAddress]?.toString().trim());
  };

  /**
   * Handle step navigation
   */
  const handleNextStep = () => {
    switch (currentStep) {
      case 'shipping':
        if (!validateShippingAddress()) {
          Alert.alert('Missing Information', 'Please fill in all required shipping fields.');
          return;
        }
        setCurrentStep('payment');
        break;
      case 'payment':
        setCurrentStep('review');
        break;
      case 'review':
        handlePlaceOrder();
        break;
    }
  };

  const handlePreviousStep = () => {
    switch (currentStep) {
      case 'payment':
        setCurrentStep('shipping');
        break;
      case 'review':
        setCurrentStep('payment');
        break;
    }
  };

  /**
   * Handle order placement
   */
  const handlePlaceOrder = async () => {
    try {
      const checkoutData = {
        shippingAddress,
        paymentMethod,
        shippingMethod: selectedShippingMethod,
      };

      const order = await dispatch(processCheckout(checkoutData)).unwrap();
      
      // Navigate to order confirmation
      navigation.navigate('OrderConfirmation', { order });
      
    } catch (error) {
      Alert.alert('Checkout Failed', 'There was an error processing your order. Please try again.');
    }
  };

  /**
   * Render shipping form
   */
  const renderShippingForm = () => (
    <GlassCard style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>Shipping Address</Text>
      
      <View style={styles.formRow}>
        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>First Name *</Text>
          <GlassCard style={styles.inputCard}>
            <TextInput
              style={styles.input}
              value={shippingAddress.firstName}
              onChangeText={(text) => setShippingAddress(prev => ({ ...prev, firstName: text }))}
              placeholder="John"
              placeholderTextColor={Colors.text.muted}
            />
          </GlassCard>
        </View>
        
        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>Last Name *</Text>
          <GlassCard style={styles.inputCard}>
            <TextInput
              style={styles.input}
              value={shippingAddress.lastName}
              onChangeText={(text) => setShippingAddress(prev => ({ ...prev, lastName: text }))}
              placeholder="Doe"
              placeholderTextColor={Colors.text.muted}
            />
          </GlassCard>
        </View>
      </View>

      <View style={styles.formField}>
        <Text style={styles.fieldLabel}>Address *</Text>
        <GlassCard style={styles.inputCard}>
          <TextInput
            style={styles.input}
            value={shippingAddress.address1}
            onChangeText={(text) => setShippingAddress(prev => ({ ...prev, address1: text }))}
            placeholder="123 Main Street"
            placeholderTextColor={Colors.text.muted}
          />
        </GlassCard>
      </View>

      <View style={styles.formRow}>
        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>City *</Text>
          <GlassCard style={styles.inputCard}>
            <TextInput
              style={styles.input}
              value={shippingAddress.city}
              onChangeText={(text) => setShippingAddress(prev => ({ ...prev, city: text }))}
              placeholder="New York"
              placeholderTextColor={Colors.text.muted}
            />
          </GlassCard>
        </View>
        
        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>State *</Text>
          <GlassCard style={styles.inputCard}>
            <TextInput
              style={styles.input}
              value={shippingAddress.state}
              onChangeText={(text) => setShippingAddress(prev => ({ ...prev, state: text }))}
              placeholder="NY"
              placeholderTextColor={Colors.text.muted}
            />
          </GlassCard>
        </View>
        
        <View style={styles.formField}>
          <Text style={styles.fieldLabel}>ZIP Code *</Text>
          <GlassCard style={styles.inputCard}>
            <TextInput
              style={styles.input}
              value={shippingAddress.zipCode}
              onChangeText={(text) => setShippingAddress(prev => ({ ...prev, zipCode: text }))}
              placeholder="10001"
              placeholderTextColor={Colors.text.muted}
              keyboardType="numeric"
            />
          </GlassCard>
        </View>
      </View>

      {/* Shipping Methods */}
      <Text style={[styles.sectionTitle, { marginTop: Spacing.lg }]}>Shipping Method</Text>
      {SHIPPING_METHODS.map((method) => (
        <TouchableOpacity
          key={method.id}
          style={styles.shippingOption}
          onPress={() => setSelectedShippingMethod(method)}
          activeOpacity={0.7}
        >
          <GlassCard style={[
            styles.shippingCard,
            selectedShippingMethod.id === method.id && styles.selectedShippingCard
          ]}>
            <View style={styles.shippingInfo}>
              <View style={styles.radioButton}>
                {selectedShippingMethod.id === method.id && (
                  <View style={styles.radioSelected} />
                )}
              </View>
              <View style={styles.shippingDetails}>
                <Text style={styles.shippingName}>{method.name}</Text>
                <Text style={styles.shippingDescription}>{method.description}</Text>
              </View>
              <Text style={styles.shippingPrice}>
                {method.price === 0 ? 'FREE' : `$${method.price.toFixed(2)}`}
              </Text>
            </View>
          </GlassCard>
        </TouchableOpacity>
      ))}
    </GlassCard>
  );

  /**
   * Render payment form
   */
  const renderPaymentForm = () => (
    <GlassCard style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>Payment Method</Text>
      
      <TouchableOpacity style={styles.paymentOption} activeOpacity={0.7}>
        <GlassCard style={styles.paymentCard}>
          <View style={styles.paymentInfo}>
            <View style={styles.cardIcon}>
              <Ionicons name="card" size={24} color={Colors.primary[500]} />
            </View>
            <View style={styles.cardDetails}>
              <Text style={styles.cardText}>•••• •••• •••• {paymentMethod.cardLast4}</Text>
              <Text style={styles.cardExpiry}>
                {paymentMethod.expiryMonth}/{paymentMethod.expiryYear}
              </Text>
            </View>
            <Text style={styles.cardBrand}>{paymentMethod.cardBrand?.toUpperCase()}</Text>
          </View>
        </GlassCard>
      </TouchableOpacity>

      <GlassButton
        title="Add New Payment Method"
        variant="outline"
        size="medium"
        fullWidth
        onPress={() => {
          // TODO: Navigate to add payment method
          Alert.alert('Coming Soon', 'Payment method management will be available soon.');
        }}
        style={styles.addPaymentButton}
      />
    </GlassCard>
  );

  /**
   * Render order review
   */
  const renderOrderReview = () => (
    <GlassCard style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>Order Review</Text>
      
      {/* Order Items */}
      <View style={styles.orderItems}>
        {items.slice(0, 3).map((item) => (
          <View key={item.id} style={styles.orderItem}>
            <Text style={styles.itemName} numberOfLines={1}>
              {item.product.name}
            </Text>
            <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
            <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
          </View>
        ))}
        {items.length > 3 && (
          <Text style={styles.moreItems}>
            +{items.length - 3} more item{items.length - 3 !== 1 ? 's' : ''}
          </Text>
        )}
      </View>

      {/* Order Summary */}
      <View style={styles.orderSummary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>${summary.subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Shipping</Text>
          <Text style={styles.summaryValue}>${selectedShippingMethod.price.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Tax</Text>
          <Text style={styles.summaryValue}>${summary.tax.toFixed(2)}</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${calculateTotal().toFixed(2)}</Text>
        </View>
      </View>
    </GlassCard>
  );

  /**
   * Get step content
   */
  const getStepContent = () => {
    switch (currentStep) {
      case 'shipping':
        return renderShippingForm();
      case 'payment':
        return renderPaymentForm();
      case 'review':
        return renderOrderReview();
    }
  };

  /**
   * Get step title
   */
  const getStepTitle = () => {
    switch (currentStep) {
      case 'shipping':
        return 'Shipping Information';
      case 'payment':
        return 'Payment Method';
      case 'review':
        return 'Review Order';
    }
  };

  /**
   * Get button title
   */
  const getButtonTitle = () => {
    switch (currentStep) {
      case 'shipping':
        return 'Continue to Payment';
      case 'payment':
        return 'Review Order';
      case 'review':
        return isCheckingOut ? 'Processing...' : 'Place Order';
    }
  };

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={Colors.gradients.holographic}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.emptyContainer}>
          <GlassCard style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Cart is Empty</Text>
            <Text style={styles.emptyMessage}>
              Add some items to your cart before checking out.
            </Text>
            <GlassButton
              title="Continue Shopping"
              onPress={() => navigation.navigate('Discover')}
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

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => currentStep === 'shipping' ? navigation.goBack() : handlePreviousStep()}
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
          <Text style={styles.title}>Checkout</Text>
          <Text style={styles.subtitle}>{getStepTitle()}</Text>
        </View>
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[
            styles.progressFill,
            { width: currentStep === 'shipping' ? '33%' : currentStep === 'payment' ? '66%' : '100%' }
          ]} />
        </View>
        <Text style={styles.progressText}>
          Step {currentStep === 'shipping' ? '1' : currentStep === 'payment' ? '2' : '3'} of 3
        </Text>
      </View>

      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {getStepContent()}
        </ScrollView>

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          <GlassCard style={styles.actionsCard}>
            <GlassButton
              title={getButtonTitle()}
              onPress={handleNextStep}
              variant="primary"
              size="large"
              fullWidth
              gradient
              gradientColors={Colors.gradients.primary}
              disabled={isCheckingOut}
            />
          </GlassCard>
        </View>
      </KeyboardAvoidingView>
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
  progressContainer: {
    paddingHorizontal: Spacing.component.screen.horizontal,
    marginBottom: Spacing.lg,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.glass.light,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary[500],
    borderRadius: 2,
  },
  progressText: {
    ...Typography.styles.caption,
    color: Colors.text.white,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.component.screen.horizontal,
    paddingBottom: Spacing.lg,
  },
  sectionCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.styles.h3,
    color: Colors.text.primary,
    fontWeight: Typography.weights.semiBold,
    marginBottom: Spacing.lg,
  },

  // Form styles
  formRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  formField: {
    flex: 1,
    marginBottom: Spacing.md,
  },
  fieldLabel: {
    ...Typography.styles.button,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  inputCard: {
    padding: Spacing.md,
  },
  input: {
    ...Typography.styles.body,
    color: Colors.text.primary,
    fontSize: 16,
  },

  // Shipping styles
  shippingOption: {
    marginBottom: Spacing.md,
  },
  shippingCard: {
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  selectedShippingCard: {
    borderColor: Colors.primary[500],
    backgroundColor: Colors.glass.turquoise,
  },
  shippingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border.light,
    marginRight: Spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary[500],
  },
  shippingDetails: {
    flex: 1,
  },
  shippingName: {
    ...Typography.styles.button,
    color: Colors.text.primary,
    fontWeight: Typography.weights.semiBold,
  },
  shippingDescription: {
    ...Typography.styles.caption,
    color: Colors.text.secondary,
  },
  shippingPrice: {
    ...Typography.styles.button,
    color: Colors.primary[500],
    fontWeight: Typography.weights.semiBold,
  },

  // Payment styles
  paymentOption: {
    marginBottom: Spacing.md,
  },
  paymentCard: {
    padding: Spacing.md,
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    marginRight: Spacing.md,
  },
  cardDetails: {
    flex: 1,
  },
  cardText: {
    ...Typography.styles.button,
    color: Colors.text.primary,
    fontWeight: Typography.weights.semiBold,
  },
  cardExpiry: {
    ...Typography.styles.caption,
    color: Colors.text.secondary,
  },
  cardBrand: {
    ...Typography.styles.caption,
    color: Colors.text.secondary,
    fontWeight: Typography.weights.semiBold,
  },
  addPaymentButton: {
    marginTop: Spacing.md,
  },

  // Order review styles
  orderItems: {
    marginBottom: Spacing.lg,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  itemName: {
    ...Typography.styles.body,
    color: Colors.text.primary,
    flex: 1,
    marginRight: Spacing.md,
  },
  itemQuantity: {
    ...Typography.styles.caption,
    color: Colors.text.secondary,
    marginRight: Spacing.md,
  },
  itemPrice: {
    ...Typography.styles.button,
    color: Colors.text.primary,
    fontWeight: Typography.weights.semiBold,
  },
  moreItems: {
    ...Typography.styles.caption,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  orderSummary: {
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    paddingTop: Spacing.lg,
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

  // Bottom actions
  bottomActions: {
    paddingHorizontal: Spacing.component.screen.horizontal,
    paddingBottom: Spacing.lg,
  },
  actionsCard: {
    padding: Spacing.lg,
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
});
