import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassCard, GlassButton } from '../../components/ui';
import { Colors, Typography, Spacing } from '../../constants';
import { useAppSelector } from '../../store';

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
    paddingHorizontal: Spacing.component.screen.horizontal,
    paddingVertical: Spacing['2xl'],
  },
  greeting: {
    ...Typography.styles.body,
    color: Colors.text.secondary,
  },
  userName: {
    ...Typography.styles.h2,
    color: Colors.text.primary,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Colors.primary[500],
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  quickActionsCard: {
    marginHorizontal: Spacing.component.screen.horizontal,
    marginBottom: Spacing['2xl'],
  },
  quickActions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  quickActionButton: {
    flex: 1,
  },
  sectionTitle: {
    ...Typography.styles.h3,
    color: Colors.text.primary,
  },
  aiCard: {
    marginHorizontal: Spacing.component.screen.horizontal,
    marginBottom: Spacing['2xl'],
  },
  aiHeader: {
    marginBottom: Spacing.lg,
  },
  aiTitle: {
    ...Typography.styles.h4,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  aiSubtitle: {
    ...Typography.styles.bodySmall,
    color: Colors.text.secondary,
  },
  aiRecommendations: {
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  aiRecommendation: {
    ...Typography.styles.body,
    color: Colors.text.primary,
  },
  aiButton: {
    marginTop: Spacing.md,
  },
});
