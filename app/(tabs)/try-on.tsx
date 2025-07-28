import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard, GlassButton } from '../../src/components/ui';
import { Colors, Typography, Spacing } from '../../src/constants';

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
    paddingHorizontal: Spacing.component.screen.horizontal,
    paddingVertical: Spacing['2xl'],
    alignItems: 'center',
  },
  title: {
    ...Typography.styles.h1,
    color: Colors.text.white,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.styles.body,
    color: Colors.text.white,
    textAlign: 'center',
    marginTop: Spacing.sm,
    opacity: 0.9,
  },
  featureCard: {
    marginHorizontal: Spacing.component.screen.horizontal,
    marginBottom: Spacing['2xl'],
    alignItems: 'center',
    paddingVertical: Spacing['3xl'],
  },
  featureIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.glass.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  featureTitle: {
    ...Typography.styles.h3,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  featureDescription: {
    ...Typography.styles.body,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: Typography.lineHeights.relaxed * Typography.sizes.base,
    marginBottom: Spacing.lg,
  },
  featureButton: {
    marginTop: Spacing.md,
  },
  comingSoon: {
    marginHorizontal: Spacing.component.screen.horizontal,
    marginBottom: Spacing['2xl'],
    alignItems: 'center',
  },
  comingSoonTitle: {
    ...Typography.styles.h4,
    color: Colors.text.white,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  comingSoonText: {
    ...Typography.styles.body,
    color: Colors.text.white,
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: Typography.lineHeights.relaxed * Typography.sizes.base,
  },
});
