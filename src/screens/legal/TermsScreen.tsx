import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { GlassCard } from '../../components/ui';
import { Colors, Typography, Spacing } from '../../constants';

const { width, height } = Dimensions.get('window');

export default function TermsScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={Colors.gradients.light}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms of Service</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <GlassCard style={styles.contentCard}>
          <Text style={styles.lastUpdated}>Last updated: January 1, 2024</Text>
          
          <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
          <Text style={styles.sectionText}>
            By accessing and using the Aura Digital Fashion application ("Service"), you accept and agree to be bound by the terms and provision of this agreement.
          </Text>

          <Text style={styles.sectionTitle}>2. Description of Service</Text>
          <Text style={styles.sectionText}>
            Aura is a digital fashion platform that provides virtual try-on experiences, AI-powered style recommendations, and digital wardrobe management tools.
          </Text>

          <Text style={styles.sectionTitle}>3. User Accounts</Text>
          <Text style={styles.sectionText}>
            You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
          </Text>

          <Text style={styles.sectionTitle}>4. Privacy and Data Protection</Text>
          <Text style={styles.sectionText}>
            Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.
          </Text>

          <Text style={styles.sectionTitle}>5. Virtual Try-On Technology</Text>
          <Text style={styles.sectionText}>
            Our AR and 3D try-on features are provided for entertainment and informational purposes. Actual fit and appearance may vary from virtual representations.
          </Text>

          <Text style={styles.sectionTitle}>6. Payment and Purchases</Text>
          <Text style={styles.sectionText}>
            All purchases are processed through secure payment providers. You agree to provide accurate payment information and authorize charges for your purchases.
          </Text>

          <Text style={styles.sectionTitle}>7. Intellectual Property</Text>
          <Text style={styles.sectionText}>
            The Service and its original content, features, and functionality are owned by Aura and are protected by international copyright, trademark, and other intellectual property laws.
          </Text>

          <Text style={styles.sectionTitle}>8. User Content</Text>
          <Text style={styles.sectionText}>
            You retain ownership of content you submit to the Service. By submitting content, you grant us a worldwide, non-exclusive license to use, modify, and display your content.
          </Text>

          <Text style={styles.sectionTitle}>9. Prohibited Uses</Text>
          <Text style={styles.sectionText}>
            You may not use the Service for any unlawful purpose or to solicit others to perform unlawful acts. You may not violate any local, state, national, or international law.
          </Text>

          <Text style={styles.sectionTitle}>10. Termination</Text>
          <Text style={styles.sectionText}>
            We may terminate or suspend your account and bar access to the Service immediately, without prior notice, for conduct that we believe violates these Terms.
          </Text>

          <Text style={styles.sectionTitle}>11. Disclaimer</Text>
          <Text style={styles.sectionText}>
            The information on this Service is provided on an "as is" basis. To the fullest extent permitted by law, we exclude all representations, warranties, and conditions.
          </Text>

          <Text style={styles.sectionTitle}>12. Limitation of Liability</Text>
          <Text style={styles.sectionText}>
            In no event shall Aura be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits or data.
          </Text>

          <Text style={styles.sectionTitle}>13. Changes to Terms</Text>
          <Text style={styles.sectionText}>
            We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through the Service.
          </Text>

          <Text style={styles.sectionTitle}>14. Contact Information</Text>
          <Text style={styles.sectionText}>
            If you have any questions about these Terms of Service, please contact us at legal@aura-fashion.com.
          </Text>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By continuing to use Aura, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Math.max(Spacing.component.screen.horizontal, width * 0.05),
    paddingVertical: Math.max(Spacing.lg, height * 0.02),
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  backButton: {
    padding: Spacing.sm,
  },
  headerTitle: {
    ...Typography.styles.h3,
    fontSize: Math.min(Typography.sizes.lg, width * 0.05),
    color: Colors.text.primary,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  contentCard: {
    margin: Math.max(Spacing.component.screen.horizontal, width * 0.05),
    marginBottom: Math.max(Spacing['4xl'], height * 0.05),
  },
  lastUpdated: {
    ...Typography.styles.caption,
    fontSize: Math.min(Typography.sizes.sm, width * 0.035),
    color: Colors.text.secondary,
    marginBottom: Math.max(Spacing['2xl'], height * 0.03),
    textAlign: 'center',
  },
  sectionTitle: {
    ...Typography.styles.h5,
    fontSize: Math.min(Typography.sizes.base, width * 0.04),
    color: Colors.text.primary,
    marginTop: Math.max(Spacing.lg, height * 0.02),
    marginBottom: Math.max(Spacing.md, height * 0.015),
  },
  sectionText: {
    ...Typography.styles.body,
    fontSize: Math.min(Typography.sizes.sm, width * 0.035),
    color: Colors.text.secondary,
    lineHeight: Math.min(Typography.lineHeights.relaxed * Typography.sizes.sm, width * 0.045),
    marginBottom: Math.max(Spacing.md, height * 0.015),
  },
  footer: {
    marginTop: Math.max(Spacing['2xl'], height * 0.03),
    paddingTop: Math.max(Spacing.lg, height * 0.02),
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  footerText: {
    ...Typography.styles.bodySmall,
    fontSize: Math.min(Typography.sizes.sm, width * 0.035),
    color: Colors.text.primary,
    textAlign: 'center',
    fontWeight: Typography.weights.medium,
  },
});
