import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard, GlassButton } from '../../components/ui';
import { Colors, Typography, Spacing } from '../../constants';

const { width, height } = Dimensions.get('window');

export default function WardrobeScreen() {
  const myLooks = [
    {
      id: 1,
      name: 'Office Chic',
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300',
      items: 3,
      lastWorn: '2 days ago',
    },
    {
      id: 2,
      name: 'Weekend Casual',
      image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300',
      items: 4,
      lastWorn: '1 week ago',
    },
    {
      id: 3,
      name: 'Date Night',
      image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=300',
      items: 5,
      lastWorn: '3 days ago',
    },
    {
      id: 4,
      name: 'Gym Ready',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300',
      items: 2,
      lastWorn: 'Yesterday',
    },
  ];

  const categories = [
    { name: 'All', count: 24, active: true },
    { name: 'Tops', count: 8, active: false },
    { name: 'Bottoms', count: 6, active: false },
    { name: 'Dresses', count: 4, active: false },
    { name: 'Shoes', count: 6, active: false },
  ];

  const renderLookItem = ({ item }: { item: any }) => (
    <GlassCard style={styles.lookCard}>
      <Image source={{ uri: item.image }} style={styles.lookImage} />
      <View style={styles.lookInfo}>
        <Text style={styles.lookName}>{item.name}</Text>
        <Text style={styles.lookDetails}>{item.items} items</Text>
        <Text style={styles.lookLastWorn}>Last worn: {item.lastWorn}</Text>
      </View>
      <View style={styles.lookActions}>
        <GlassButton
          title="Try On"
          variant="primary"
          size="small"
          onPress={() => {}}
        />
        <GlassButton
          title="Edit"
          variant="outline"
          size="small"
          onPress={() => {}}
        />
      </View>
    </GlassCard>
  );

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
          <Text style={styles.title}>My Wardrobe</Text>
          <Text style={styles.subtitle}>Your digital fashion collection</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <GlassCard style={styles.statCard}>
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statLabel}>Items</Text>
          </GlassCard>
          <GlassCard style={styles.statCard}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Looks</Text>
          </GlassCard>
          <GlassCard style={styles.statCard}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Brands</Text>
          </GlassCard>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <GlassButton
            title="Add Item"
            variant="primary"
            size="medium"
            gradient
            gradientColors={Colors.gradients.primary}
            icon={<Ionicons name="add" size={16} color={Colors.text.white} />}
            onPress={() => {}}
          />
          <GlassButton
            title="Create Look"
            variant="secondary"
            size="medium"
            icon={<Ionicons name="color-palette" size={16} color={Colors.text.primary} />}
            onPress={() => {}}
          />
          <GlassButton
            title="AI Suggest"
            variant="outline"
            size="medium"
            icon={<Ionicons name="sparkles" size={16} color={Colors.primary[500]} />}
            onPress={() => {}}
          />
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category, index) => (
              <GlassCard
                key={index}
                style={[
                  styles.categoryCard,
                  category.active && styles.activeCategoryCard,
                ] as any}
              >
                <Text
                  style={[
                    styles.categoryName,
                    category.active && styles.activeCategoryName,
                  ]}
                >
                  {category.name}
                </Text>
                <Text
                  style={[
                    styles.categoryCount,
                    category.active && styles.activeCategoryCount,
                  ]}
                >
                  {category.count}
                </Text>
              </GlassCard>
            ))}
          </ScrollView>
        </View>

        {/* My Looks */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Looks</Text>
            <GlassButton
              title="See All"
              variant="ghost"
              size="small"
              onPress={() => {}}
            />
          </View>
          <FlatList
            data={myLooks}
            renderItem={renderLookItem}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            contentContainerStyle={styles.looksContainer}
          />
        </View>

        {/* Wardrobe Analytics */}
        <GlassCard style={styles.analyticsCard}>
          <Text style={styles.analyticsTitle}>📊 Wardrobe Analytics</Text>
          <View style={styles.analyticsGrid}>
            <View style={styles.analyticsItem}>
              <Text style={styles.analyticsValue}>85%</Text>
              <Text style={styles.analyticsLabel}>Utilization Rate</Text>
            </View>
            <View style={styles.analyticsItem}>
              <Text style={styles.analyticsValue}>$2,450</Text>
              <Text style={styles.analyticsLabel}>Total Value</Text>
            </View>
            <View style={styles.analyticsItem}>
              <Text style={styles.analyticsValue}>3.2</Text>
              <Text style={styles.analyticsLabel}>Avg. Wears/Item</Text>
            </View>
            <View style={styles.analyticsItem}>
              <Text style={styles.analyticsValue}>12</Text>
              <Text style={styles.analyticsLabel}>New This Month</Text>
            </View>
          </View>
        </GlassCard>

        {/* Recommendations */}
        <GlassCard style={styles.recommendationsCard}>
          <Text style={styles.recommendationsTitle}>✨ Smart Recommendations</Text>
          <Text style={styles.recommendationText}>
            • You haven't worn your blue dress in 2 weeks
          </Text>
          <Text style={styles.recommendationText}>
            • Consider adding a blazer to complete your office looks
          </Text>
          <Text style={styles.recommendationText}>
            • Your summer collection could use more accessories
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
    paddingHorizontal: Math.max(Spacing.component.screen.horizontal, width * 0.05),
    paddingVertical: Math.max(Spacing['2xl'], height * 0.03),
  },
  title: {
    ...Typography.styles.h1,
    fontSize: Math.min(Typography.sizes['2xl'], width * 0.08),
    color: Colors.text.primary,
  },
  subtitle: {
    ...Typography.styles.body,
    fontSize: Math.min(Typography.sizes.base, width * 0.04),
    color: Colors.text.secondary,
    marginTop: Spacing.sm,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Math.max(Spacing.component.screen.horizontal, width * 0.05),
    gap: Spacing.md,
    marginBottom: Math.max(Spacing['2xl'], height * 0.03),
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Math.max(Spacing.lg, height * 0.02),
  },
  statNumber: {
    ...Typography.styles.h2,
    fontSize: Math.min(Typography.sizes.xl, width * 0.06),
    color: Colors.primary[500],
  },
  statLabel: {
    ...Typography.styles.caption,
    fontSize: Math.min(Typography.sizes.sm, width * 0.03),
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
  },
  quickActions: {
    flexDirection: width > 600 ? 'row' : 'column',
    paddingHorizontal: Math.max(Spacing.component.screen.horizontal, width * 0.05),
    gap: Spacing.md,
    marginBottom: Math.max(Spacing['2xl'], height * 0.03),
  },
  section: {
    marginBottom: Math.max(Spacing['2xl'], height * 0.03),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Math.max(Spacing.component.screen.horizontal, width * 0.05),
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.styles.h3,
    fontSize: Math.min(Typography.sizes.lg, width * 0.05),
    color: Colors.text.primary,
    paddingHorizontal: Math.max(Spacing.component.screen.horizontal, width * 0.05),
    marginBottom: Spacing.lg,
  },
  categoryCard: {
    paddingHorizontal: Math.max(Spacing.lg, width * 0.04),
    paddingVertical: Math.max(Spacing.md, height * 0.015),
    marginLeft: Math.max(Spacing.component.screen.horizontal, width * 0.05),
    marginRight: Spacing.md,
    alignItems: 'center',
    minWidth: Math.max(80, width * 0.2),
  },
  activeCategoryCard: {
    backgroundColor: Colors.primary[500],
  },
  categoryName: {
    ...Typography.styles.button,
    fontSize: Math.min(Typography.sizes.base, width * 0.04),
    color: Colors.text.primary,
  },
  activeCategoryName: {
    color: Colors.text.white,
  },
  categoryCount: {
    ...Typography.styles.caption,
    fontSize: Math.min(Typography.sizes.sm, width * 0.03),
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
  },
  activeCategoryCount: {
    color: Colors.text.white,
  },
  looksContainer: {
    paddingHorizontal: Math.max(Spacing.component.screen.horizontal, width * 0.05),
    gap: Spacing.md,
  },
  lookCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Math.max(Spacing.md, height * 0.015),
    marginBottom: Spacing.md,
  },
  lookImage: {
    width: Math.min(60, width * 0.15),
    height: Math.min(60, width * 0.15),
    borderRadius: Spacing.component.radius.md,
    marginRight: Spacing.md,
  },
  lookInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  lookName: {
    ...Typography.styles.h6,
    fontSize: Math.min(Typography.sizes.base, width * 0.04),
    color: Colors.text.primary,
  },
  lookDetails: {
    ...Typography.styles.caption,
    fontSize: Math.min(Typography.sizes.sm, width * 0.03),
    color: Colors.text.secondary,
  },
  lookLastWorn: {
    ...Typography.styles.caption,
    fontSize: Math.min(Typography.sizes.sm, width * 0.03),
    color: Colors.text.muted,
  },
  lookActions: {
    flexDirection: width > 400 ? 'row' : 'column',
    gap: Spacing.sm,
  },
  analyticsCard: {
    marginHorizontal: Math.max(Spacing.component.screen.horizontal, width * 0.05),
    marginBottom: Math.max(Spacing['2xl'], height * 0.03),
  },
  analyticsTitle: {
    ...Typography.styles.h4,
    fontSize: Math.min(Typography.sizes.lg, width * 0.045),
    color: Colors.text.primary,
    marginBottom: Math.max(Spacing.lg, height * 0.02),
  },
  analyticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Math.max(Spacing.lg, width * 0.04),
  },
  analyticsItem: {
    flex: 1,
    minWidth: width > 600 ? '22%' : '45%',
    alignItems: 'center',
  },
  analyticsValue: {
    ...Typography.styles.h3,
    fontSize: Math.min(Typography.sizes.lg, width * 0.05),
    color: Colors.primary[500],
  },
  analyticsLabel: {
    ...Typography.styles.caption,
    fontSize: Math.min(Typography.sizes.sm, width * 0.03),
    color: Colors.text.secondary,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  recommendationsCard: {
    marginHorizontal: Math.max(Spacing.component.screen.horizontal, width * 0.05),
    marginBottom: Math.max(Spacing['2xl'], height * 0.03),
  },
  recommendationsTitle: {
    ...Typography.styles.h4,
    fontSize: Math.min(Typography.sizes.lg, width * 0.045),
    color: Colors.text.primary,
    marginBottom: Math.max(Spacing.lg, height * 0.02),
  },
  recommendationText: {
    ...Typography.styles.body,
    fontSize: Math.min(Typography.sizes.base, width * 0.04),
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
    lineHeight: Math.min(Typography.lineHeights.relaxed * Typography.sizes.base, width * 0.05),
  },
});
