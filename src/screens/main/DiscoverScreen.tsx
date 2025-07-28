import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard, GlassButton } from '../../components/ui';
import { Colors, Typography, Spacing } from '../../constants';

const { width, height } = Dimensions.get('window');

export default function DiscoverScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 1, name: 'Dresses', icon: '👗', color: Colors.holographic.pink },
    { id: 2, name: 'Tops', icon: '👚', color: Colors.holographic.purple },
    { id: 3, name: 'Bottoms', icon: '👖', color: Colors.holographic.blue },
    { id: 4, name: 'Shoes', icon: '👠', color: Colors.holographic.cyan },
    { id: 5, name: 'Accessories', icon: '👜', color: Colors.holographic.green },
    { id: 6, name: 'Outerwear', icon: '🧥', color: Colors.holographic.yellow },
  ];

  const trendingProducts = [
    {
      id: 1,
      name: 'Turquoise Silk Dress',
      brand: 'Zara',
      price: '$299',
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300',
      rating: 4.8,
    },
    {
      id: 2,
      name: 'Holographic Sneakers',
      brand: 'Nike',
      price: '$159',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300',
      rating: 4.9,
    },
    {
      id: 3,
      name: 'Glass Effect Jacket',
      brand: 'H&M',
      price: '$199',
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300',
      rating: 4.7,
    },
    {
      id: 4,
      name: 'Crystal Handbag',
      brand: 'Gucci',
      price: '$899',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300',
      rating: 4.9,
    },
  ];

  const renderCategoryItem = ({ item }: { item: any }) => (
    <GlassCard style={[styles.categoryCard, { borderColor: item.color } as any]}>
      <Text style={styles.categoryIcon}>{item.icon}</Text>
      <Text style={styles.categoryName}>{item.name}</Text>
    </GlassCard>
  );

  const renderProductItem = ({ item }: { item: any }) => (
    <GlassCard style={styles.productCard}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productBrand}>{item.brand}</Text>
        <View style={styles.productFooter}>
          <Text style={styles.productPrice}>{item.price}</Text>
          <View style={styles.rating}>
            <Ionicons name="star" size={14} color={Colors.holographic.yellow} />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>
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
          <Text style={styles.title}>Discover</Text>
          <Text style={styles.subtitle}>Find your next favorite piece</Text>
        </View>

        {/* Search Bar */}
        <GlassCard style={styles.searchCard}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={Colors.text.muted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for fashion items..."
              placeholderTextColor={Colors.text.muted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <GlassButton
              title="Filter"
              variant="outline"
              size="small"
              onPress={() => {}}
              icon={<Ionicons name="options" size={16} color={Colors.primary[500]} />}
            />
          </View>
        </GlassCard>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={width > 600 ? 4 : 3}
            scrollEnabled={false}
            contentContainerStyle={styles.categoriesGrid}
          />
        </View>

        {/* Trending Now */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trending Now</Text>
            <GlassButton
              title="See All"
              variant="ghost"
              size="small"
              onPress={() => {}}
            />
          </View>
          <FlatList
            data={trendingProducts}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={width > 600 ? 3 : 2}
            scrollEnabled={false}
            contentContainerStyle={styles.productsGrid}
          />
        </View>

        {/* AI Recommendations */}
        <GlassCard style={styles.aiCard}>
          <View style={styles.aiHeader}>
            <Text style={styles.aiTitle}>🤖 AI Curated for You</Text>
            <Text style={styles.aiSubtitle}>
              Personalized recommendations based on your style DNA
            </Text>
          </View>
          <GlassButton
            title="Explore AI Picks"
            variant="primary"
            size="large"
            fullWidth
            gradient
            gradientColors={Colors.gradients.primary}
            onPress={() => {}}
          />
        </GlassCard>

        {/* Brands */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Brands</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['Zara', 'H&M', 'Nike', 'Adidas', 'Gucci', 'Prada'].map((brand) => (
              <GlassCard key={brand} style={styles.brandCard}>
                <Text style={styles.brandName}>{brand}</Text>
              </GlassCard>
            ))}
          </ScrollView>
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
  searchCard: {
    marginHorizontal: Math.max(Spacing.component.screen.horizontal, width * 0.05),
    marginBottom: Math.max(Spacing['2xl'], height * 0.03),
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  searchInput: {
    flex: 1,
    ...Typography.styles.body,
    fontSize: Math.min(Typography.sizes.base, width * 0.04),
    color: Colors.text.primary,
    paddingVertical: Spacing.sm,
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
  categoriesGrid: {
    paddingHorizontal: Math.max(Spacing.component.screen.horizontal, width * 0.05),
    gap: Spacing.md,
  },
  categoryCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Math.max(Spacing.lg, height * 0.02),
    marginHorizontal: Spacing.xs,
    marginBottom: Spacing.md,
    borderWidth: 1,
    minHeight: height * 0.1,
    justifyContent: 'center',
  },
  categoryIcon: {
    fontSize: Math.min(24, width * 0.06),
    marginBottom: Spacing.sm,
  },
  categoryName: {
    ...Typography.styles.caption,
    fontSize: Math.min(Typography.sizes.sm, width * 0.03),
    color: Colors.text.primary,
    textAlign: 'center',
  },
  productsGrid: {
    paddingHorizontal: Math.max(Spacing.component.screen.horizontal, width * 0.05),
    gap: Spacing.md,
  },
  productCard: {
    flex: 1,
    marginHorizontal: Spacing.xs,
    marginBottom: Spacing.md,
  },
  productImage: {
    width: '100%',
    height: Math.min(150, height * 0.2),
    borderRadius: Spacing.component.radius.md,
    marginBottom: Spacing.md,
  },
  productInfo: {
    gap: Spacing.xs,
  },
  productName: {
    ...Typography.styles.h6,
    fontSize: Math.min(Typography.sizes.base, width * 0.04),
    color: Colors.text.primary,
  },
  productBrand: {
    ...Typography.styles.caption,
    fontSize: Math.min(Typography.sizes.sm, width * 0.03),
    color: Colors.text.secondary,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  productPrice: {
    ...Typography.styles.button,
    fontSize: Math.min(Typography.sizes.base, width * 0.04),
    color: Colors.primary[500],
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  ratingText: {
    ...Typography.styles.caption,
    fontSize: Math.min(Typography.sizes.sm, width * 0.03),
    color: Colors.text.secondary,
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
  },
  brandCard: {
    paddingHorizontal: Math.max(Spacing.lg, width * 0.04),
    paddingVertical: Math.max(Spacing.md, height * 0.015),
    marginLeft: Math.max(Spacing.component.screen.horizontal, width * 0.05),
    marginRight: Spacing.md,
    minWidth: Math.max(100, width * 0.25),
    alignItems: 'center',
  },
  brandName: {
    ...Typography.styles.button,
    fontSize: Math.min(Typography.sizes.base, width * 0.04),
    color: Colors.text.primary,
  },
});
