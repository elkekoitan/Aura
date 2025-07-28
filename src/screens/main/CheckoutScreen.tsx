import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard, GlassButton } from '../../components/ui';
import { Colors, Typography, Spacing } from '../../constants';
import { useAppDispatch, useAppSelector } from '../../store';
import { clearCart } from '../../store/slices/cartSlice';

export default function CheckoutScreen() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { items, total } = useAppSelector((state) => state.cart);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    address: '',
    city: '',
    zipCode: '',
    phone: '',
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
  });

  const handleInputChange = (section: 'shipping' | 'payment', field: string, value: string) => {
    if (section === 'shipping') {
      setShippingInfo(prev => ({ ...prev, [field]: value }));
    } else {
      setPaymentInfo(prev => ({ ...prev, [field]: value }));
    }
  };

  const validateForm = () => {
    const requiredShipping = ['fullName', 'address', 'city', 'zipCode', 'phone'];
    const requiredPayment = ['cardNumber', 'expiryDate', 'cvv', 'cardholderName'];

    for (const field of requiredShipping) {
      if (!shippingInfo[field as keyof typeof shippingInfo]) {
        Alert.alert('Missing Information', `Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }

    for (const field of requiredPayment) {
      if (!paymentInfo[field as keyof typeof paymentInfo]) {
        Alert.alert('Missing Information', `Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }

    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      dispatch(clearCart());
      
      Alert.alert(
        'Order Placed Successfully!',
        'Thank you for your purchase. You will receive a confirmation email shortly.',
        [
          {
            text: 'Continue Shopping',
            onPress: () => navigation.navigate('Discover' as never),
          },
        ]
      );
    }, 3000);
  };

  const renderInput = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    placeholder: string,
    keyboardType: any = 'default',
    secureTextEntry = false
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.text.white + '60'}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
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
        
        <Text style={styles.title}>Checkout</Text>
        
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Order Summary */}
        <GlassCard style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Items ({items.length})</Text>
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

        {/* Shipping Information */}
        <GlassCard style={styles.section}>
          <Text style={styles.sectionTitle}>Shipping Information</Text>
          
          {renderInput(
            'Full Name',
            shippingInfo.fullName,
            (text) => handleInputChange('shipping', 'fullName', text),
            'Enter your full name'
          )}
          
          {renderInput(
            'Address',
            shippingInfo.address,
            (text) => handleInputChange('shipping', 'address', text),
            'Enter your address'
          )}
          
          <View style={styles.row}>
            <View style={styles.halfInput}>
              {renderInput(
                'City',
                shippingInfo.city,
                (text) => handleInputChange('shipping', 'city', text),
                'City'
              )}
            </View>
            <View style={styles.halfInput}>
              {renderInput(
                'ZIP Code',
                shippingInfo.zipCode,
                (text) => handleInputChange('shipping', 'zipCode', text),
                'ZIP Code',
                'numeric'
              )}
            </View>
          </View>
          
          {renderInput(
            'Phone Number',
            shippingInfo.phone,
            (text) => handleInputChange('shipping', 'phone', text),
            'Enter your phone number',
            'phone-pad'
          )}
        </GlassCard>

        {/* Payment Information */}
        <GlassCard style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Information</Text>
          
          {renderInput(
            'Cardholder Name',
            paymentInfo.cardholderName,
            (text) => handleInputChange('payment', 'cardholderName', text),
            'Name on card'
          )}
          
          {renderInput(
            'Card Number',
            paymentInfo.cardNumber,
            (text) => handleInputChange('payment', 'cardNumber', text),
            '1234 5678 9012 3456',
            'numeric'
          )}
          
          <View style={styles.row}>
            <View style={styles.halfInput}>
              {renderInput(
                'Expiry Date',
                paymentInfo.expiryDate,
                (text) => handleInputChange('payment', 'expiryDate', text),
                'MM/YY',
                'numeric'
              )}
            </View>
            <View style={styles.halfInput}>
              {renderInput(
                'CVV',
                paymentInfo.cvv,
                (text) => handleInputChange('payment', 'cvv', text),
                '123',
                'numeric',
                true
              )}
            </View>
          </View>
        </GlassCard>

        {/* Security Notice */}
        <GlassCard style={styles.securityNotice}>
          <Ionicons name="shield-checkmark" size={24} color={Colors.semantic.success} />
          <Text style={styles.securityText}>
            Your payment information is encrypted and secure
          </Text>
        </GlassCard>
      </ScrollView>

      {/* Place Order Button */}
      <View style={styles.footer}>
        <GlassButton
          title={isProcessing ? "Processing Payment..." : `Place Order - $${(total * 1.08).toFixed(2)}`}
          onPress={handlePlaceOrder}
          disabled={isProcessing}
          style={styles.placeOrderButton}
        />
      </View>
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
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  section: {
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.styles.h3,
    color: Colors.text.white,
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
  inputContainer: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    ...Typography.styles.body,
    color: Colors.text.white,
    marginBottom: Spacing.xs,
    fontWeight: '600',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: Spacing.md,
    color: Colors.text.white,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 0.48,
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  securityText: {
    ...Typography.styles.caption,
    color: Colors.text.white,
    marginLeft: Spacing.sm,
    flex: 1,
  },
  footer: {
    padding: Spacing.lg,
    paddingTop: 0,
  },
  placeOrderButton: {
    width: '100%',
  },
});
