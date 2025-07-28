import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard, GlassButton } from '../../components/ui';
import { Colors, Typography, Spacing } from '../../constants';

const { width, height } = Dimensions.get('window');

export default function TryOnScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={Colors.gradients.holographic}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Virtual Try-On</Text>
          <Text style={styles.subtitle}>Experience fashion in AR</Text>
        </View>

        <GlassCard style={styles.featureCard}>
          <View style={styles.featureIcon}>
            <Ionicons name="camera" size={48} color={Colors.primary[500]} />
          </View>
          <Text style={styles.featureTitle}>3D Avatar Try-On</Text>
          <Text style={styles.featureDescription}>
            Create your digital avatar and try on clothes in real-time with advanced AR technology
          </Text>
          <GlassButton
            title="Create Avatar"
            variant="primary"
            size="large"
            fullWidth
            gradient
            gradientColors={Colors.gradients.primary}
            style={styles.featureButton}
            onPress={() => {}}
          />
        </GlassCard>

        <GlassCard style={styles.featureCard}>
          <View style={styles.featureIcon}>
            <Ionicons name="scan" size={48} color={Colors.holographic.purple} />
          </View>
          <Text style={styles.featureTitle}>AI Body Scan</Text>
          <Text style={styles.featureDescription}>
            Get accurate measurements and perfect fit recommendations using AI body scanning
          </Text>
          <GlassButton
            title="Start Scan"
            variant="secondary"
            size="large"
            fullWidth
            style={styles.featureButton}
            onPress={() => {}}
          />
        </GlassCard>

        <GlassCard style={styles.featureCard}>
          <View style={styles.featureIcon}>
            <Ionicons name="color-palette" size={48} color={Colors.holographic.pink} />
          </View>
          <Text style={styles.featureTitle}>Style Mixer</Text>
          <Text style={styles.featureDescription}>
            Mix and match different pieces to create unique looks and see how they work together
          </Text>
          <GlassButton
            title="Mix Styles"
            variant="outline"
            size="large"
            fullWidth
            style={styles.featureButton}
            onPress={() => {}}
          />
        </GlassCard>

        <View style={styles.comingSoon}>
          <Text style={styles.comingSoonTitle}>🚀 Coming Soon</Text>
          <Text style={styles.comingSoonText}>
            • Real-time fabric simulation{'\n'}
            • Social try-on sessions{'\n'}
            • AI style recommendations{'\n'}
            • Virtual fashion shows
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Math.max(Spacing.component.screen.horizontal, width * 0.05),
    paddingVertical: Math.max(Spacing['2xl'], height * 0.03),
    alignItems: 'center',
  },
  title: {
    ...Typography.styles.h1,
    fontSize: Math.min(Typography.sizes['2xl'], width * 0.08),
    color: Colors.text.white,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.styles.body,
    fontSize: Math.min(Typography.sizes.base, width * 0.04),
    color: Colors.text.white,
    textAlign: 'center',
    marginTop: Spacing.sm,
    opacity: 0.9,
  },
  featureCard: {
    marginHorizontal: Math.max(Spacing.component.screen.horizontal, width * 0.05),
    marginBottom: Math.max(Spacing['2xl'], height * 0.03),
    alignItems: 'center',
    paddingVertical: Math.max(Spacing['3xl'], height * 0.04),
  },
  featureIcon: {
    width: Math.min(80, width * 0.2),
    height: Math.min(80, width * 0.2),
    borderRadius: Math.min(40, width * 0.1),
    backgroundColor: Colors.glass.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Math.max(Spacing.lg, height * 0.02),
  },
  featureTitle: {
    ...Typography.styles.h3,
    fontSize: Math.min(Typography.sizes.lg, width * 0.05),
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  featureDescription: {
    ...Typography.styles.body,
    fontSize: Math.min(Typography.sizes.base, width * 0.04),
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: Math.min(Typography.lineHeights.relaxed * Typography.sizes.base, width * 0.05),
    marginBottom: Math.max(Spacing.lg, height * 0.02),
    paddingHorizontal: width * 0.05,
  },
  featureButton: {
    marginTop: Math.max(Spacing.md, height * 0.015),
  },
  comingSoon: {
    marginHorizontal: Math.max(Spacing.component.screen.horizontal, width * 0.05),
    marginBottom: Math.max(Spacing['2xl'], height * 0.03),
    alignItems: 'center',
  },
  comingSoonTitle: {
    ...Typography.styles.h4,
    fontSize: Math.min(Typography.sizes.lg, width * 0.045),
    color: Colors.text.white,
    textAlign: 'center',
    marginBottom: Math.max(Spacing.lg, height * 0.02),
  },
  comingSoonText: {
    ...Typography.styles.body,
    fontSize: Math.min(Typography.sizes.base, width * 0.04),
    color: Colors.text.white,
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: Math.min(Typography.lineHeights.relaxed * Typography.sizes.base, width * 0.05),
  },
});
