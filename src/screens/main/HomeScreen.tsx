import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassCard, GlassButton } from '../../components/ui';
import { Colors, Typography, Spacing } from '../../constants';
import { useAppSelector } from '../../store';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const { user, profile } = useAppSelector((state) => state.auth);

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
          <View>
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.userName}>
              {profile?.full_name || user?.email?.split('@')[0] || 'Fashion Lover'}
            </Text>
          </View>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: profile?.avatar_url || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
              }}
              style={styles.avatar}
            />
          </View>
        </View>

        {/* Quick Actions */}
        <GlassCard style={styles.quickActionsCard}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <GlassButton
              title="Try On"
              variant="primary"
              size="medium"
              gradient
              gradientColors={Colors.gradients.primary}
              style={styles.quickActionButton}
              onPress={() => {}}
            />
            <GlassButton
              title="Discover"
              variant="secondary"
              size="medium"
              style={styles.quickActionButton}
              onPress={() => {}}
            />
            <GlassButton
              title="My Looks"
              variant="outline"
              size="medium"
              style={styles.quickActionButton}
              onPress={() => {}}
            />
          </View>
        </GlassCard>

        {/* AI Recommendations */}
        <GlassCard style={styles.aiCard}>
          <View style={styles.aiHeader}>
            <Text style={styles.aiTitle}>✨ AI Style Recommendations</Text>
            <Text style={styles.aiSubtitle}>
              Based on your style preferences and recent activity
            </Text>
          </View>
          <View style={styles.aiRecommendations}>
            <Text style={styles.aiRecommendation}>
              🎨 Try turquoise accessories to complement your style
            </Text>
            <Text style={styles.aiRecommendation}>
              👗 Summer dresses are trending in your size
            </Text>
            <Text style={styles.aiRecommendation}>
              ⭐ New arrivals from your favorite brands
            </Text>
          </View>
          <GlassButton
            title="See All Recommendations"
            variant="primary"
            size="medium"
            fullWidth
            gradient
            gradientColors={Colors.gradients.primary}
            style={styles.aiButton}
            onPress={() => {}}
          />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Math.max(Spacing.component.screen.horizontal, width * 0.05),
    paddingVertical: Math.max(Spacing['2xl'], height * 0.03),
  },
  greeting: {
    ...Typography.styles.body,
    fontSize: Math.min(Typography.sizes.base, width * 0.04),
    color: Colors.text.secondary,
  },
  userName: {
    ...Typography.styles.h2,
    fontSize: Math.min(Typography.sizes.xl, width * 0.055),
    color: Colors.text.primary,
  },
  avatarContainer: {
    width: Math.min(50, width * 0.12),
    height: Math.min(50, width * 0.12),
    borderRadius: Math.min(25, width * 0.06),
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Colors.primary[500],
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  quickActionsCard: {
    marginHorizontal: Math.max(Spacing.component.screen.horizontal, width * 0.05),
    marginBottom: Math.max(Spacing['2xl'], height * 0.03),
  },
  quickActions: {
    flexDirection: width > 600 ? 'row' : 'column',
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  quickActionButton: {
    flex: width > 600 ? 1 : undefined,
    minHeight: height * 0.06,
  },
  sectionTitle: {
    ...Typography.styles.h3,
    fontSize: Math.min(Typography.sizes.lg, width * 0.05),
    color: Colors.text.primary,
  },
  aiCard: {
    marginHorizontal: Math.max(Spacing.component.screen.horizontal, width * 0.05),
    marginBottom: Math.max(Spacing['2xl'], height * 0.03),
  },
  aiHeader: {
    marginBottom: Math.max(Spacing.lg, height * 0.02),
  },
  aiTitle: {
    ...Typography.styles.h4,
    fontSize: Math.min(Typography.sizes.lg, width * 0.045),
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  aiSubtitle: {
    ...Typography.styles.bodySmall,
    fontSize: Math.min(Typography.sizes.sm, width * 0.035),
    color: Colors.text.secondary,
    lineHeight: Math.min(Typography.lineHeights.relaxed * Typography.sizes.sm, width * 0.045),
  },
  aiRecommendations: {
    gap: Math.max(Spacing.md, height * 0.015),
    marginBottom: Math.max(Spacing.lg, height * 0.02),
  },
  aiRecommendation: {
    ...Typography.styles.body,
    fontSize: Math.min(Typography.sizes.base, width * 0.04),
    color: Colors.text.primary,
    lineHeight: Math.min(Typography.lineHeights.relaxed * Typography.sizes.base, width * 0.05),
  },
  aiButton: {
    marginTop: Math.max(Spacing.md, height * 0.015),
  },
});
