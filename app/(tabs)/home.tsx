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
import { GlassCard, GlassButton } from '../../src/components/ui';
import { Colors, Typography, Spacing } from '../../src/constants';
import { useAppSelector } from '../../src/store';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { user, profile } = useAppSelector((state) => state.auth);

  const featuredLooks = [
    {
      id: 1,
      title: 'Summer Vibes',
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300',
      brand: 'Zara',
      price: '$299',
    },
    {
      id: 2,
      title: 'Urban Chic',
      image: 'https://images.unsplash.com/photo-1566479179817-c0b5b4b8b1c8?w=300',
      brand: 'H&M',
      price: '$199',
    },
    {
      id: 3,
      title: 'Sporty Elegance',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300',
      brand: 'Nike',
      price: '$159',
    },
  ];

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

        {/* Featured Looks */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Looks</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {featuredLooks.map((look) => (
              <GlassCard key={look.id} style={styles.lookCard}>
                <Image source={{ uri: look.image }} style={styles.lookImage} />
                <View style={styles.lookInfo}>
                  <Text style={styles.lookTitle}>{look.title}</Text>
                  <Text style={styles.lookBrand}>{look.brand}</Text>
                  <Text style={styles.lookPrice}>{look.price}</Text>
                </View>
              </GlassCard>
            ))}
          </ScrollView>
        </View>

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

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <GlassCard style={styles.activityCard}>
            <Text style={styles.activityText}>
              You tried on 3 new looks this week! 🎉
            </Text>
            <Text style={styles.activityText}>
              2 items in your wishlist are now on sale
            </Text>
            <Text style={styles.activityText}>
              Your style DNA has been updated with new preferences
            </Text>
          </GlassCard>
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
  section: {
    marginBottom: Spacing['2xl'],
  },
  sectionTitle: {
    ...Typography.styles.h3,
    color: Colors.text.primary,
    marginHorizontal: Spacing.component.screen.horizontal,
    marginBottom: Spacing.lg,
  },
  lookCard: {
    width: 200,
    marginLeft: Spacing.component.screen.horizontal,
    marginRight: Spacing.md,
  },
  lookImage: {
    width: '100%',
    height: 150,
    borderRadius: Spacing.component.radius.md,
    marginBottom: Spacing.md,
  },
  lookInfo: {
    gap: Spacing.xs,
  },
  lookTitle: {
    ...Typography.styles.h5,
    color: Colors.text.primary,
  },
  lookBrand: {
    ...Typography.styles.caption,
    color: Colors.text.secondary,
  },
  lookPrice: {
    ...Typography.styles.button,
    color: Colors.primary[500],
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
  activityCard: {
    marginHorizontal: Spacing.component.screen.horizontal,
    gap: Spacing.md,
  },
  activityText: {
    ...Typography.styles.body,
    color: Colors.text.primary,
  },
});
