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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard, GlassButton } from '../../src/components/ui';
import { Colors, Typography, Spacing } from '../../src/constants';

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
    <GlassCard style={[styles.categoryCard, { borderColor: item.color }]}>
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
            numColumns={3}
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
            numColumns={2}
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
    paddingHorizontal: Spacing.component.screen.horizontal,
    paddingVertical: Spacing['2xl'],
  },
  title: {
    ...Typography.styles.h1,
    color: Colors.text.primary,
  },
  subtitle: {
    ...Typography.styles.body,
    color: Colors.text.secondary,
    marginTop: Spacing.sm,
  },
  searchCard: {
    marginHorizontal: Spacing.component.screen.horizontal,
    marginBottom: Spacing['2xl'],
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  searchInput: {
    flex: 1,
    ...Typography.styles.body,
    color: Colors.text.primary,
    paddingVertical: Spacing.sm,
  },
  section: {
    marginBottom: Spacing['2xl'],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.component.screen.horizontal,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.styles.h3,
    color: Colors.text.primary,
    paddingHorizontal: Spacing.component.screen.horizontal,
    marginBottom: Spacing.lg,
  },
  categoriesGrid: {
    paddingHorizontal: Spacing.component.screen.horizontal,
    gap: Spacing.md,
  },
  categoryCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    marginHorizontal: Spacing.xs,
    marginBottom: Spacing.md,
    borderWidth: 1,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: Spacing.sm,
  },
  categoryName: {
    ...Typography.styles.caption,
    color: Colors.text.primary,
    textAlign: 'center',
  },
  productsGrid: {
    paddingHorizontal: Spacing.component.screen.horizontal,
    gap: Spacing.md,
  },
  productCard: {
    flex: 1,
    marginHorizontal: Spacing.xs,
    marginBottom: Spacing.md,
  },
  productImage: {
    width: '100%',
    height: 150,
    borderRadius: Spacing.component.radius.md,
    marginBottom: Spacing.md,
  },
  productInfo: {
    gap: Spacing.xs,
  },
  productName: {
    ...Typography.styles.h6,
    color: Colors.text.primary,
  },
  productBrand: {
    ...Typography.styles.caption,
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
    color: Colors.primary[500],
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  ratingText: {
    ...Typography.styles.caption,
    color: Colors.text.secondary,
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
  brandCard: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    marginLeft: Spacing.component.screen.horizontal,
    marginRight: Spacing.md,
    minWidth: 100,
    alignItems: 'center',
  },
  brandName: {
    ...Typography.styles.button,
    color: Colors.text.primary,
  },
});
