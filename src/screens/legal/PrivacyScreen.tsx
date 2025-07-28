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

export default function PrivacyScreen() {
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
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <GlassCard style={styles.contentCard}>
          <Text style={styles.lastUpdated}>Last updated: January 1, 2024</Text>
          
          <Text style={styles.sectionTitle}>1. Information We Collect</Text>
          <Text style={styles.sectionText}>
            We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.
          </Text>

          <Text style={styles.sectionTitle}>2. Personal Information</Text>
          <Text style={styles.sectionText}>
            This includes your name, email address, phone number, payment information, and any other information you choose to provide.
          </Text>

          <Text style={styles.sectionTitle}>3. Usage Information</Text>
          <Text style={styles.sectionText}>
            We collect information about how you use our Service, including your interactions with features, preferences, and usage patterns.
          </Text>

          <Text style={styles.sectionTitle}>4. Camera and AR Data</Text>
          <Text style={styles.sectionText}>
            When you use our virtual try-on features, we may process camera data and body measurements. This data is processed locally on your device when possible.
          </Text>

          <Text style={styles.sectionTitle}>5. Device Information</Text>
          <Text style={styles.sectionText}>
            We collect information about the device you use to access our Service, including device type, operating system, and unique device identifiers.
          </Text>

          <Text style={styles.sectionTitle}>6. How We Use Your Information</Text>
          <Text style={styles.sectionText}>
            We use your information to provide, maintain, and improve our Service, process transactions, send communications, and personalize your experience.
          </Text>

          <Text style={styles.sectionTitle}>7. Information Sharing</Text>
          <Text style={styles.sectionText}>
            We do not sell, trade, or rent your personal information to third parties. We may share information with service providers who assist us in operating our Service.
          </Text>

          <Text style={styles.sectionTitle}>8. Data Security</Text>
          <Text style={styles.sectionText}>
            We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
          </Text>

          <Text style={styles.sectionTitle}>9. Data Retention</Text>
          <Text style={styles.sectionText}>
            We retain your information for as long as necessary to provide our Service and fulfill the purposes outlined in this policy.
          </Text>

          <Text style={styles.sectionTitle}>10. Your Rights</Text>
          <Text style={styles.sectionText}>
            You have the right to access, update, or delete your personal information. You may also opt out of certain communications from us.
          </Text>

          <Text style={styles.sectionTitle}>11. Cookies and Tracking</Text>
          <Text style={styles.sectionText}>
            We use cookies and similar technologies to enhance your experience, analyze usage, and provide personalized content and advertisements.
          </Text>

          <Text style={styles.sectionTitle}>12. Third-Party Services</Text>
          <Text style={styles.sectionText}>
            Our Service may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties.
          </Text>

          <Text style={styles.sectionTitle}>13. Children's Privacy</Text>
          <Text style={styles.sectionText}>
            Our Service is not intended for children under 13. We do not knowingly collect personal information from children under 13.
          </Text>

          <Text style={styles.sectionTitle}>14. International Data Transfers</Text>
          <Text style={styles.sectionText}>
            Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place.
          </Text>

          <Text style={styles.sectionTitle}>15. Changes to This Policy</Text>
          <Text style={styles.sectionText}>
            We may update this Privacy Policy from time to time. We will notify you of any material changes via email or through our Service.
          </Text>

          <Text style={styles.sectionTitle}>16. Contact Us</Text>
          <Text style={styles.sectionText}>
            If you have any questions about this Privacy Policy, please contact us at privacy@aura-fashion.com.
          </Text>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Your privacy is important to us. We are committed to protecting your personal information and being transparent about our data practices.
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
