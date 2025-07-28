/**
 * StylePreferencesScreen
 * Comprehensive style preferences management with visual selection
 * Allows users to set style categories, colors, brands, and shopping preferences
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { GlassCard, GlassButton } from '../../components/ui';
import { Colors, Typography, Spacing } from '../../constants';
import { useAppDispatch, useAppSelector } from '../../store';
import { 
  updateStylePreferences,
  setEditingSection,
} from '../../store/slices/profileSlice';
import { 
  StyleCategory,
  LifestyleType,
  OccasionType,
  FitPreference,
  MaterialType,
  PatternType,
  UpdateStylePreferencesParams
} from '../../store/types/profile';

// Style options data
const STYLE_CATEGORIES: Array<{ key: StyleCategory; label: string; icon: string }> = [
  { key: 'casual', label: 'Casual', icon: 'shirt-outline' },
  { key: 'formal', label: 'Formal', icon: 'business-outline' },
  { key: 'business', label: 'Business', icon: 'briefcase-outline' },
  { key: 'streetwear', label: 'Streetwear', icon: 'walk-outline' },
  { key: 'bohemian', label: 'Bohemian', icon: 'flower-outline' },
  { key: 'minimalist', label: 'Minimalist', icon: 'remove-outline' },
  { key: 'vintage', label: 'Vintage', icon: 'time-outline' },
  { key: 'sporty', label: 'Sporty', icon: 'fitness-outline' },
  { key: 'glamorous', label: 'Glamorous', icon: 'diamond-outline' },
  { key: 'edgy', label: 'Edgy', icon: 'flash-outline' },
];

const LIFESTYLE_TYPES: Array<{ key: LifestyleType; label: string; icon: string }> = [
  { key: 'professional', label: 'Professional', icon: 'briefcase-outline' },
  { key: 'student', label: 'Student', icon: 'school-outline' },
  { key: 'parent', label: 'Parent', icon: 'heart-outline' },
  { key: 'traveler', label: 'Traveler', icon: 'airplane-outline' },
  { key: 'athlete', label: 'Athlete', icon: 'fitness-outline' },
  { key: 'artist', label: 'Artist', icon: 'brush-outline' },
  { key: 'entrepreneur', label: 'Entrepreneur', icon: 'bulb-outline' },
  { key: 'socialite', label: 'Socialite', icon: 'people-outline' },
];

const OCCASION_TYPES: Array<{ key: OccasionType; label: string; icon: string }> = [
  { key: 'work', label: 'Work', icon: 'briefcase-outline' },
  { key: 'casual', label: 'Casual', icon: 'cafe-outline' },
  { key: 'date-night', label: 'Date Night', icon: 'heart-outline' },
  { key: 'party', label: 'Party', icon: 'musical-notes-outline' },
  { key: 'wedding', label: 'Wedding', icon: 'flower-outline' },
  { key: 'vacation', label: 'Vacation', icon: 'airplane-outline' },
  { key: 'gym', label: 'Gym', icon: 'fitness-outline' },
  { key: 'formal-event', label: 'Formal Event', icon: 'wine-outline' },
];

const COLOR_PALETTE = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
  '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
  '#FFC0CB', '#A52A2A', '#808080', '#000080', '#008000',
  '#FF69B4', '#DC143C', '#4B0082', '#FF1493', '#00CED1',
];

export default function StylePreferencesScreen() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  
  const { 
    stylePreferences, 
    saving,
    error 
  } = useAppSelector((state) => state.profile);

  // Form state
  const [preferences, setPreferences] = useState<UpdateStylePreferencesParams>({
    preferred_styles: stylePreferences?.preferred_styles || [],
    favorite_colors: stylePreferences?.favorite_colors || [],
    preferred_brands: stylePreferences?.preferred_brands || [],
    price_range: stylePreferences?.price_range || { min: 50, max: 300 },
    lifestyle: stylePreferences?.lifestyle || [],
    occasions: stylePreferences?.occasions || [],
    fit_preferences: stylePreferences?.fit_preferences || [],
    material_preferences: stylePreferences?.material_preferences || [],
    pattern_preferences: stylePreferences?.pattern_preferences || [],
    shopping_frequency: stylePreferences?.shopping_frequency || 'monthly',
    preferred_shopping_time: stylePreferences?.preferred_shopping_time || 'weekend',
  });

  /**
   * Set editing section on mount
   */
  useEffect(() => {
    dispatch(setEditingSection('style'));
    return () => {
      dispatch(setEditingSection(null));
    };
  }, []);

  /**
   * Handle multi-select toggle
   */
  const handleMultiSelectToggle = <T extends string>(
    field: keyof UpdateStylePreferencesParams,
    value: T
  ) => {
    const currentValues = (preferences[field] as T[]) || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(item => item !== value)
      : [...currentValues, value];
    
    setPreferences(prev => ({
      ...prev,
      [field]: newValues,
    }));
  };

  /**
   * Handle color selection
   */
  const handleColorToggle = (color: string) => {
    const currentColors = preferences.favorite_colors || [];
    const newColors = currentColors.includes(color)
      ? currentColors.filter(c => c !== color)
      : [...currentColors, color];
    
    setPreferences(prev => ({
      ...prev,
      favorite_colors: newColors,
    }));
  };

  /**
   * Handle price range change
   */
  const handlePriceRangeChange = (type: 'min' | 'max', value: number) => {
    setPreferences(prev => ({
      ...prev,
      price_range: {
        ...prev.price_range!,
        [type]: value,
      },
    }));
  };

  /**
   * Handle save preferences
   */
  const handleSave = async () => {
    try {
      await dispatch(updateStylePreferences(preferences)).unwrap();
      Alert.alert('Success', 'Style preferences updated successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to update style preferences. Please try again.');
    }
  };

  /**
   * Render multi-select section
   */
  const renderMultiSelectSection = <T extends string>(
    title: string,
    field: keyof UpdateStylePreferencesParams,
    options: Array<{ key: T; label: string; icon?: string }>,
    maxColumns: number = 2
  ) => (
    <GlassCard style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>{title}</Text>
      
      <View style={styles.optionsGrid}>
        {options.map((option) => {
          const isSelected = ((preferences[field] as T[]) || []).includes(option.key);
          
          return (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.optionButton,
                { width: `${100 / maxColumns - 2}%` },
                isSelected && styles.selectedOption
              ]}
              onPress={() => handleMultiSelectToggle(field, option.key)}
              activeOpacity={0.7}
            >
              <GlassCard style={[
                styles.optionCard,
                isSelected && styles.selectedOptionCard
              ]}>
                {option.icon && (
                  <Ionicons 
                    name={option.icon as any} 
                    size={20} 
                    color={isSelected ? Colors.text.white : Colors.primary[500]} 
                    style={styles.optionIcon}
                  />
                )}
                <Text style={[
                  styles.optionText,
                  isSelected && styles.selectedOptionText
                ]}>
                  {option.label}
                </Text>
              </GlassCard>
            </TouchableOpacity>
          );
        })}
      </View>
    </GlassCard>
  );

  /**
   * Render color palette
   */
  const renderColorPalette = () => (
    <GlassCard style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>Favorite Colors</Text>
      
      <View style={styles.colorGrid}>
        {COLOR_PALETTE.map((color) => {
          const isSelected = (preferences.favorite_colors || []).includes(color);
          
          return (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorButton,
                { backgroundColor: color },
                isSelected && styles.selectedColor
              ]}
              onPress={() => handleColorToggle(color)}
              activeOpacity={0.7}
            >
              {isSelected && (
                <Ionicons 
                  name="checkmark" 
                  size={16} 
                  color={color === '#FFFFFF' ? Colors.text.primary : Colors.text.white} 
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </GlassCard>
  );

  /**
   * Render price range
   */
  const renderPriceRange = () => (
    <GlassCard style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>Price Range</Text>
      
      <View style={styles.priceRangeContainer}>
        <View style={styles.priceInputContainer}>
          <Text style={styles.priceLabel}>Min: ${preferences.price_range?.min || 0}</Text>
          <View style={styles.priceButtons}>
            <TouchableOpacity
              style={styles.priceButton}
              onPress={() => handlePriceRangeChange('min', Math.max(0, (preferences.price_range?.min || 0) - 25))}
              activeOpacity={0.7}
            >
              <Ionicons name="remove" size={16} color={Colors.primary[500]} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.priceButton}
              onPress={() => handlePriceRangeChange('min', (preferences.price_range?.min || 0) + 25)}
              activeOpacity={0.7}
            >
              <Ionicons name="add" size={16} color={Colors.primary[500]} />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.priceInputContainer}>
          <Text style={styles.priceLabel}>Max: ${preferences.price_range?.max || 0}</Text>
          <View style={styles.priceButtons}>
            <TouchableOpacity
              style={styles.priceButton}
              onPress={() => handlePriceRangeChange('max', Math.max((preferences.price_range?.min || 0) + 25, (preferences.price_range?.max || 0) - 25))}
              activeOpacity={0.7}
            >
              <Ionicons name="remove" size={16} color={Colors.primary[500]} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.priceButton}
              onPress={() => handlePriceRangeChange('max', (preferences.price_range?.max || 0) + 25)}
              activeOpacity={0.7}
            >
              <Ionicons name="add" size={16} color={Colors.primary[500]} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </GlassCard>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={Colors.gradients.holographic}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={Colors.gradients.glass}
            style={styles.backGradient}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
          </LinearGradient>
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.title}>Style Preferences</Text>
          <Text style={styles.subtitle}>Personalize your fashion experience</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Style Categories */}
        {renderMultiSelectSection(
          'Style Categories',
          'preferred_styles',
          STYLE_CATEGORIES,
          2
        )}

        {/* Favorite Colors */}
        {renderColorPalette()}

        {/* Price Range */}
        {renderPriceRange()}

        {/* Lifestyle */}
        {renderMultiSelectSection(
          'Lifestyle',
          'lifestyle',
          LIFESTYLE_TYPES,
          2
        )}

        {/* Occasions */}
        {renderMultiSelectSection(
          'Occasions',
          'occasions',
          OCCASION_TYPES,
          2
        )}

        {/* Error Display */}
        {error && (
          <GlassCard style={styles.errorCard}>
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={20} color={Colors.semantic.error} />
              <Text style={styles.errorMessage}>{error}</Text>
            </View>
          </GlassCard>
        )}

        {/* Save Button */}
        <View style={styles.saveSection}>
          <GlassButton
            title={saving ? "Saving..." : "Save Preferences"}
            onPress={handleSave}
            variant="primary"
            size="large"
            fullWidth
            gradient
            gradientColors={Colors.gradients.primary}
            disabled={saving}
          />
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
    alignItems: 'center',
    paddingHorizontal: Spacing.component.screen.horizontal,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    marginRight: Spacing.md,
  },
  backGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
  },
  title: {
    ...Typography.styles.h1,
    color: Colors.text.white,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.styles.body,
    color: Colors.text.white,
    opacity: 0.8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.component.screen.horizontal,
    paddingBottom: Spacing['3xl'],
  },

  // Section styles
  sectionCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.styles.h3,
    color: Colors.text.primary,
    fontWeight: Typography.weights.semiBold,
    marginBottom: Spacing.lg,
  },

  // Options grid
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  optionButton: {
    marginBottom: Spacing.md,
  },
  optionCard: {
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border.light,
    minHeight: 80,
    justifyContent: 'center',
  },
  selectedOption: {},
  selectedOptionCard: {
    backgroundColor: Colors.primary[500],
    borderColor: Colors.primary[500],
  },
  optionIcon: {
    marginBottom: Spacing.sm,
  },
  optionText: {
    ...Typography.styles.button,
    color: Colors.text.primary,
    textAlign: 'center',
    fontSize: 12,
  },
  selectedOptionText: {
    color: Colors.text.white,
  },

  // Color palette
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border.light,
  },
  selectedColor: {
    borderColor: Colors.primary[500],
    borderWidth: 3,
  },

  // Price range
  priceRangeContainer: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  priceInputContainer: {
    flex: 1,
    alignItems: 'center',
  },
  priceLabel: {
    ...Typography.styles.button,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
    fontWeight: Typography.weights.semiBold,
  },
  priceButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  priceButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.glass.light,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Error handling
  errorCard: {
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    backgroundColor: Colors.semantic.error + '10',
    borderWidth: 1,
    borderColor: Colors.semantic.error + '30',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  errorMessage: {
    ...Typography.styles.body,
    color: Colors.semantic.error,
    flex: 1,
  },

  // Save section
  saveSection: {
    marginTop: Spacing.lg,
  },
});
