import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { GlassCard, GlassButton } from '../../components/ui';
import { Colors, Typography, Spacing } from '../../constants';
import { useAppDispatch } from '../../store';
import { addToCart } from '../../store/slices/cartSlice';
import { mockProducts, mockCategories } from '../../data/mockProducts';
import { Product } from '../../types/product';

const { width } = Dimensions.get('window');

export default function DiscoverScreen() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<'all' | 'featured'>('all');

  const getCurrentProducts = () => {
    return activeTab === 'featured' 
      ? mockProducts.filter(p => p.is_featured)
      : mockProducts;
  };

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetail' as never, { product } as never);
  };

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      image: product.image,
      category: product.category,
      selectedSize: product.sizes?.[0],
      selectedColor: product.colors?.[0],
    }));
  };

  const renderProduct = (product: Product) => (
    <TouchableOpacity
      key={product.id}
      style={styles.productCard}
      onPress={() => handleProductPress(product)}
      activeOpacity={0.8}
    >
      <GlassCard style={styles.productContainer}>
        <Image source={{ uri: product.image }} style={styles.productImage} />
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {product.name}
          </Text>
          <Text style={styles.productBrand}>{product.brand}</Text>
          <View style={styles.productFooter}>
            <Text style={styles.productPrice}>${product.price}</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => handleAddToCart(product)}
            >
              <Ionicons name="add" size={20} color={Colors.text.white} />
            </TouchableOpacity>
          </View>
        </View>
      </GlassCard>
    </TouchableOpacity>
  );

  const renderCategory = (category: any) => (
    <TouchableOpacity
      key={category.id}
      style={styles.categoryChip}
      activeOpacity={0.7}
    >
      <GlassCard style={styles.categoryCard}>
        <Text style={styles.categoryName}>{category.name}</Text>
      </GlassCard>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={Colors.gradients.holographic}
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

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {mockCategories.map(renderCategory)}
          </ScrollView>
        </View>

        {/* Tab Selector */}
        <View style={styles.section}>
          <View style={styles.tabContainer}>
            {[
              { key: 'all', label: 'All Products' },
              { key: 'featured', label: 'Featured' },
            ].map((tab) => (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.tab,
                  activeTab === tab.key && styles.activeTab
                ]}
                onPress={() => setActiveTab(tab.key as any)}
              >
                <Text style={[
                  styles.tabText,
                  activeTab === tab.key && styles.activeTabText
                ]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Products Grid */}
        <View style={styles.productsGrid}>
          {getCurrentProducts().map(renderProduct)}
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
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    alignItems: 'center',
  },
  title: {
    ...Typography.styles.h1,
    color: Colors.text.white,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.styles.body,
    color: Colors.text.white,
    opacity: 0.8,
    textAlign: 'center',
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.styles.h3,
    color: Colors.text.white,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  categoriesContainer: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  categoryChip: {
    marginRight: Spacing.sm,
  },
  categoryCard: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  categoryName: {
    ...Typography.styles.caption,
    color: Colors.text.white,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: Spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 25,
    padding: Spacing.xs,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: Colors.primary[500],
  },
  tabText: {
    ...Typography.styles.button,
    color: Colors.text.white,
    opacity: 0.7,
  },
  activeTabText: {
    opacity: 1,
    fontWeight: '600',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.lg,
    justifyContent: 'space-between',
  },
  productCard: {
    width: (width - Spacing.lg * 2 - Spacing.md) / 2,
    marginBottom: Spacing.md,
  },
  productContainer: {
    padding: Spacing.sm,
  },
  productImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    backgroundColor: Colors.neutral[200],
    marginBottom: Spacing.sm,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    ...Typography.styles.h4,
    color: Colors.text.white,
    marginBottom: Spacing.xs,
    fontSize: 14,
  },
  productBrand: {
    ...Typography.styles.caption,
    color: Colors.text.white,
    opacity: 0.7,
    marginBottom: Spacing.sm,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    ...Typography.styles.h4,
    color: Colors.accent[400],
    fontWeight: '700',
    fontSize: 16,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
});
