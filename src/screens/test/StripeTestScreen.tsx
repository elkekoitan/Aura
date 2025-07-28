import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useStripe } from '@stripe/stripe-react-native';
import { GlassCard, GlassButton } from '../../components/ui';
import { Colors, Typography, Spacing } from '../../constants';

export default function StripeTestScreen() {
  const [loading, setLoading] = useState(false);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const testProducts = [
    {
      id: 1,
      name: 'Turquoise Silk Dress',
      price: 299,
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300',
    },
    {
      id: 2,
      name: 'Holographic Sneakers',
      price: 159,
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300',
    },
    {
      id: 3,
      name: 'Glass Effect Jacket',
      price: 199,
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300',
    },
  ];

  const handlePurchase = async (product: any) => {
    setLoading(true);
    
    try {
      // Test Stripe integration
      Alert.alert(
        'Test Purchase',
        `Would you like to purchase ${product.name} for $${product.price}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Buy Now',
            onPress: () => processPayment(product),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const processPayment = async (product: any) => {
    try {
      // Initialize payment sheet
      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: 'Aura Digital Fashion',
        paymentIntentClientSecret: 'pi_test_client_secret', // This would come from your backend
        defaultBillingDetails: {
          name: 'Test User',
        },
      });

      if (initError) {
        Alert.alert('Error', initError.message);
        return;
      }

      // Present payment sheet
      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        Alert.alert('Payment Failed', presentError.message);
      } else {
        Alert.alert(
          'Payment Successful! 🎉',
          `You have successfully purchased ${product.name} for $${product.price}.\n\nThis is a test transaction using Stripe.`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Payment processing failed');
    }
  };

  const testStripeConnection = async () => {
    setLoading(true);
    
    try {
      // Test if Stripe keys are configured
      const publishableKey = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY;
      
      if (publishableKey && publishableKey.startsWith('pk_test_')) {
        Alert.alert(
          'Stripe Configuration ✅',
          'Stripe test keys are properly configured!\n\nPublishable Key: ' + 
          publishableKey.substring(0, 20) + '...',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Stripe Configuration ❌',
          'Stripe keys are not properly configured.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to test Stripe configuration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={Colors.gradients.light}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Stripe Payment Test</Text>
          <Text style={styles.subtitle}>Test your payment integration</Text>
        </View>

        {/* Stripe Status */}
        <GlassCard style={styles.statusCard}>
          <Text style={styles.statusTitle}>🔐 Stripe Configuration</Text>
          <Text style={styles.statusText}>
            Test your Stripe integration with real payment flow
          </Text>
          <GlassButton
            title="Test Stripe Connection"
            onPress={testStripeConnection}
            loading={loading}
            variant="outline"
            size="medium"
            fullWidth
            style={styles.testButton}
          />
        </GlassCard>

        {/* Test Products */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Test Products</Text>
          {testProducts.map((product) => (
            <GlassCard key={product.id} style={styles.productCard}>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productPrice}>${product.price}</Text>
              </View>
              <GlassButton
                title="Buy Now"
                onPress={() => handlePurchase(product)}
                loading={loading}
                variant="primary"
                size="medium"
                gradient
                gradientColors={Colors.gradients.primary}
              />
            </GlassCard>
          ))}
        </View>

        {/* Test Cards Info */}
        <GlassCard style={styles.infoCard}>
          <Text style={styles.infoTitle}>💳 Test Card Numbers</Text>
          <View style={styles.testCards}>
            <Text style={styles.testCardText}>
              <Text style={styles.testCardLabel}>Visa:</Text> 4242 4242 4242 4242
            </Text>
            <Text style={styles.testCardText}>
              <Text style={styles.testCardLabel}>Mastercard:</Text> 5555 5555 5555 4444
            </Text>
            <Text style={styles.testCardText}>
              <Text style={styles.testCardLabel}>Amex:</Text> 3782 822463 10005
            </Text>
            <Text style={styles.testCardText}>
              <Text style={styles.testCardLabel}>Declined:</Text> 4000 0000 0000 0002
            </Text>
          </View>
          <Text style={styles.infoNote}>
            Use any future expiry date and any 3-digit CVC
          </Text>
        </GlassCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.component.screen.horizontal,
    paddingVertical: Spacing['2xl'],
    alignItems: 'center',
  },
  title: {
    ...Typography.styles.h1,
    color: Colors.text.primary,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.styles.body,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  statusCard: {
    marginHorizontal: Spacing.component.screen.horizontal,
    marginBottom: Spacing['2xl'],
    alignItems: 'center',
  },
  statusTitle: {
    ...Typography.styles.h4,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  statusText: {
    ...Typography.styles.body,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  testButton: {
    marginTop: Spacing.md,
  },
  section: {
    marginBottom: Spacing['2xl'],
  },
  sectionTitle: {
    ...Typography.styles.h3,
    color: Colors.text.primary,
    paddingHorizontal: Spacing.component.screen.horizontal,
    marginBottom: Spacing.lg,
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: Spacing.component.screen.horizontal,
    marginBottom: Spacing.md,
    paddingVertical: Spacing.lg,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    ...Typography.styles.h6,
    color: Colors.text.primary,
  },
  productPrice: {
    ...Typography.styles.h5,
    color: Colors.primary[500],
    marginTop: Spacing.xs,
  },
  infoCard: {
    marginHorizontal: Spacing.component.screen.horizontal,
    marginBottom: Spacing['2xl'],
  },
  infoTitle: {
    ...Typography.styles.h4,
    color: Colors.text.primary,
    marginBottom: Spacing.lg,
  },
  testCards: {
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  testCardText: {
    ...Typography.styles.body,
    color: Colors.text.primary,
  },
  testCardLabel: {
    fontWeight: Typography.weights.semiBold,
    color: Colors.primary[500],
  },
  infoNote: {
    ...Typography.styles.caption,
    color: Colors.text.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
