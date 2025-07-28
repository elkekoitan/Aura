import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassCard, GlassButton } from '../../components/ui';
import { Colors, Typography, Spacing } from '../../constants';

export default function StripeTestScreen() {
  const handleWebPaymentDemo = () => {
    Alert.alert(
      'Payment Demo',
      'Payment processing is only available on mobile devices. This is a demo feature for web.',
      [{ text: 'OK' }]
    );
  };

  const mockProducts = [
    {
      id: 1,
      name: 'Premium Holographic Dress',
      price: 299.99,
      description: 'Stunning holographic dress with AR try-on capability',
    },
    {
      id: 2,
      name: 'Digital Fashion Jacket',
      price: 199.99,
      description: 'Futuristic jacket with customizable LED patterns',
    },
    {
      id: 3,
      name: 'Virtual Reality Sneakers',
      price: 149.99,
      description: 'Smart sneakers with haptic feedback technology',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={Colors.gradients.holographic}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Payment Demo</Text>
          <Text style={styles.subtitle}>
            Web Version - Mobile payment features available on iOS/Android
          </Text>
        </View>

        <View style={styles.productsContainer}>
          {mockProducts.map((product) => (
            <GlassCard key={product.id} style={styles.productCard}>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productDescription}>{product.description}</Text>
                <Text style={styles.productPrice}>${product.price}</Text>
              </View>
              
              <GlassButton
                title="Demo Payment"
                onPress={handleWebPaymentDemo}
                variant="primary"
                size="medium"
                gradient
                gradientColors={Colors.gradients.primary}
                style={styles.payButton}
              />
            </GlassCard>
          ))}
        </View>

        <GlassCard style={styles.infoCard}>
          <Text style={styles.infoTitle}>Payment Integration</Text>
          <Text style={styles.infoText}>
            This screen demonstrates the payment integration capabilities of the Aura app. 
            Full Stripe payment processing is available on mobile devices (iOS/Android).
          </Text>
          <Text style={styles.infoText}>
            Features include:
            {'\n'}• Secure payment processing with Stripe
            {'\n'}• Apple Pay and Google Pay support
            {'\n'}• Real-time payment status updates
            {'\n'}• Order confirmation and tracking
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
  content: {
    flex: 1,
    paddingHorizontal: Spacing.component.screen.horizontal,
    paddingVertical: Spacing.component.screen.vertical,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing['4xl'],
  },
  title: {
    ...Typography.styles.h1,
    color: Colors.text.white,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  subtitle: {
    ...Typography.styles.body,
    color: Colors.text.white,
    textAlign: 'center',
    opacity: 0.9,
  },
  productsContainer: {
    gap: Spacing.lg,
    marginBottom: Spacing['3xl'],
  },
  productCard: {
    padding: Spacing.lg,
  },
  productInfo: {
    marginBottom: Spacing.lg,
  },
  productName: {
    ...Typography.styles.h3,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  productDescription: {
    ...Typography.styles.body,
    color: Colors.text.secondary,
    marginBottom: Spacing.md,
  },
  productPrice: {
    ...Typography.styles.h2,
    color: Colors.primary[500],
    fontWeight: Typography.weights.bold,
  },
  payButton: {
    alignSelf: 'flex-start',
  },
  infoCard: {
    padding: Spacing.lg,
    marginBottom: Spacing['3xl'],
  },
  infoTitle: {
    ...Typography.styles.h3,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  infoText: {
    ...Typography.styles.body,
    color: Colors.text.secondary,
    lineHeight: Typography.lineHeights.relaxed,
    marginBottom: Spacing.md,
  },
});
