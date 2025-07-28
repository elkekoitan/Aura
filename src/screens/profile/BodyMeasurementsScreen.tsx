/**
 * BodyMeasurementsScreen
 * Comprehensive body measurements and size management
 * Helps users track their measurements for better size recommendations
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
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { GlassCard, GlassButton } from '../../components/ui';
import { Colors, Typography, Spacing } from '../../constants';
import { useAppDispatch, useAppSelector } from '../../store';
import { 
  updateBodyMeasurements,
  setEditingSection,
} from '../../store/slices/profileSlice';
import { 
  UpdateBodyMeasurementsParams,
  FitPreference
} from '../../store/types/profile';

const FIT_PREFERENCES: Array<{ key: FitPreference; label: string; description: string }> = [
  { key: 'tight', label: 'Tight', description: 'Form-fitting, shows body shape' },
  { key: 'fitted', label: 'Fitted', description: 'Close to body, comfortable' },
  { key: 'regular', label: 'Regular', description: 'Standard fit, not tight or loose' },
  { key: 'loose', label: 'Loose', description: 'Relaxed fit, more room' },
  { key: 'oversized', label: 'Oversized', description: 'Very loose, trendy fit' },
  { key: 'tailored', label: 'Tailored', description: 'Custom-fitted appearance' },
];

const BODY_TYPES = [
  { key: 'pear', label: 'Pear', description: 'Hips wider than shoulders' },
  { key: 'apple', label: 'Apple', description: 'Shoulders wider than hips' },
  { key: 'hourglass', label: 'Hourglass', description: 'Balanced shoulders and hips' },
  { key: 'rectangle', label: 'Rectangle', description: 'Similar shoulder and hip width' },
  { key: 'inverted-triangle', label: 'Inverted Triangle', description: 'Broad shoulders, narrow hips' },
];

export default function BodyMeasurementsScreen() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  
  const { 
    bodyMeasurements, 
    saving,
    error 
  } = useAppSelector((state) => state.profile);

  // Form state
  const [measurements, setMeasurements] = useState<UpdateBodyMeasurementsParams>({
    height: bodyMeasurements?.height || 0,
    weight: bodyMeasurements?.weight || 0,
    dress_size: bodyMeasurements?.dress_size || '',
    top_size: bodyMeasurements?.top_size || '',
    bottom_size: bodyMeasurements?.bottom_size || '',
    shoe_size: bodyMeasurements?.shoe_size || '',
    bra_size: bodyMeasurements?.bra_size || '',
    bust: bodyMeasurements?.bust || 0,
    waist: bodyMeasurements?.waist || 0,
    hips: bodyMeasurements?.hips || 0,
    inseam: bodyMeasurements?.inseam || 0,
    shoulder_width: bodyMeasurements?.shoulder_width || 0,
    arm_length: bodyMeasurements?.arm_length || 0,
    neck: bodyMeasurements?.neck || 0,
    preferred_fit: bodyMeasurements?.preferred_fit || {
      tops: 'fitted',
      bottoms: 'regular',
      dresses: 'fitted',
    },
    body_type: bodyMeasurements?.body_type || undefined,
  });

  /**
   * Set editing section on mount
   */
  useEffect(() => {
    dispatch(setEditingSection('measurements'));
    return () => {
      dispatch(setEditingSection(null));
    };
  }, []);

  /**
   * Handle field change
   */
  const handleFieldChange = (field: keyof UpdateBodyMeasurementsParams, value: any) => {
    setMeasurements(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  /**
   * Handle fit preference change
   */
  const handleFitPreferenceChange = (
    category: 'tops' | 'bottoms' | 'dresses',
    preference: FitPreference
  ) => {
    setMeasurements(prev => ({
      ...prev,
      preferred_fit: {
        ...prev.preferred_fit!,
        [category]: preference,
      },
    }));
  };

  /**
   * Handle save measurements
   */
  const handleSave = async () => {
    try {
      await dispatch(updateBodyMeasurements(measurements)).unwrap();
      Alert.alert('Success', 'Body measurements updated successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to update body measurements. Please try again.');
    }
  };

  /**
   * Render measurement input
   */
  const renderMeasurementInput = (
    label: string,
    field: keyof UpdateBodyMeasurementsParams,
    unit: string,
    placeholder: string,
    keyboardType: 'numeric' | 'default' = 'numeric'
  ) => (
    <View style={styles.measurementField}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <GlassCard style={styles.inputCard}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={measurements[field]?.toString() || ''}
            onChangeText={(text) => {
              const value = keyboardType === 'numeric' ? parseFloat(text) || 0 : text;
              handleFieldChange(field, value);
            }}
            placeholder={placeholder}
            placeholderTextColor={Colors.text.muted}
            keyboardType={keyboardType}
          />
          <Text style={styles.unitText}>{unit}</Text>
        </View>
      </GlassCard>
    </View>
  );

  /**
   * Render fit preference selector
   */
  const renderFitPreferenceSelector = (
    title: string,
    category: 'tops' | 'bottoms' | 'dresses'
  ) => (
    <View style={styles.fitSection}>
      <Text style={styles.fitTitle}>{title}</Text>
      <View style={styles.fitOptions}>
        {FIT_PREFERENCES.map((fit) => {
          const isSelected = measurements.preferred_fit?.[category] === fit.key;
          
          return (
            <TouchableOpacity
              key={fit.key}
              style={[
                styles.fitOption,
                isSelected && styles.selectedFitOption
              ]}
              onPress={() => handleFitPreferenceChange(category, fit.key)}
              activeOpacity={0.7}
            >
              <GlassCard style={[
                styles.fitCard,
                isSelected && styles.selectedFitCard
              ]}>
                <Text style={[
                  styles.fitLabel,
                  isSelected && styles.selectedFitLabel
                ]}>
                  {fit.label}
                </Text>
                <Text style={[
                  styles.fitDescription,
                  isSelected && styles.selectedFitDescription
                ]}>
                  {fit.description}
                </Text>
              </GlassCard>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
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
          <Text style={styles.title}>Body Measurements</Text>
          <Text style={styles.subtitle}>Get better size recommendations</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Basic Measurements */}
        <GlassCard style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <View style={styles.measurementRow}>
            {renderMeasurementInput('Height', 'height', 'cm', '165')}
            {renderMeasurementInput('Weight', 'weight', 'kg', '60')}
          </View>
        </GlassCard>

        {/* Clothing Sizes */}
        <GlassCard style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Clothing Sizes</Text>
          
          <View style={styles.measurementRow}>
            {renderMeasurementInput('Dress Size', 'dress_size', '', 'M', 'default')}
            {renderMeasurementInput('Top Size', 'top_size', '', 'M', 'default')}
          </View>
          
          <View style={styles.measurementRow}>
            {renderMeasurementInput('Bottom Size', 'bottom_size', '', '28', 'default')}
            {renderMeasurementInput('Shoe Size', 'shoe_size', '', '8', 'default')}
          </View>
          
          {renderMeasurementInput('Bra Size', 'bra_size', '', '34B', 'default')}
        </GlassCard>

        {/* Detailed Measurements */}
        <GlassCard style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Detailed Measurements</Text>
          
          <View style={styles.measurementRow}>
            {renderMeasurementInput('Bust', 'bust', 'cm', '86')}
            {renderMeasurementInput('Waist', 'waist', 'cm', '68')}
          </View>
          
          <View style={styles.measurementRow}>
            {renderMeasurementInput('Hips', 'hips', 'cm', '94')}
            {renderMeasurementInput('Inseam', 'inseam', 'cm', '76')}
          </View>
          
          <View style={styles.measurementRow}>
            {renderMeasurementInput('Shoulder Width', 'shoulder_width', 'cm', '38')}
            {renderMeasurementInput('Arm Length', 'arm_length', 'cm', '58')}
          </View>
          
          {renderMeasurementInput('Neck', 'neck', 'cm', '32')}
        </GlassCard>

        {/* Fit Preferences */}
        <GlassCard style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Fit Preferences</Text>
          
          {renderFitPreferenceSelector('Tops', 'tops')}
          {renderFitPreferenceSelector('Bottoms', 'bottoms')}
          {renderFitPreferenceSelector('Dresses', 'dresses')}
        </GlassCard>

        {/* Body Type */}
        <GlassCard style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Body Type (Optional)</Text>
          
          <View style={styles.bodyTypeGrid}>
            {BODY_TYPES.map((type) => {
              const isSelected = measurements.body_type === type.key;
              
              return (
                <TouchableOpacity
                  key={type.key}
                  style={[
                    styles.bodyTypeOption,
                    isSelected && styles.selectedBodyType
                  ]}
                  onPress={() => handleFieldChange('body_type', type.key)}
                  activeOpacity={0.7}
                >
                  <GlassCard style={[
                    styles.bodyTypeCard,
                    isSelected && styles.selectedBodyTypeCard
                  ]}>
                    <Text style={[
                      styles.bodyTypeLabel,
                      isSelected && styles.selectedBodyTypeLabel
                    ]}>
                      {type.label}
                    </Text>
                    <Text style={[
                      styles.bodyTypeDescription,
                      isSelected && styles.selectedBodyTypeDescription
                    ]}>
                      {type.description}
                    </Text>
                  </GlassCard>
                </TouchableOpacity>
              );
            })}
          </View>
        </GlassCard>

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
            title={saving ? "Saving..." : "Save Measurements"}
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

  // Measurement fields
  measurementRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  measurementField: {
    flex: 1,
    marginBottom: Spacing.md,
  },
  fieldLabel: {
    ...Typography.styles.button,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
    fontWeight: Typography.weights.semiBold,
  },
  inputCard: {
    padding: Spacing.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    ...Typography.styles.body,
    color: Colors.text.primary,
    fontSize: 16,
    flex: 1,
  },
  unitText: {
    ...Typography.styles.caption,
    color: Colors.text.secondary,
    marginLeft: Spacing.sm,
  },

  // Fit preferences
  fitSection: {
    marginBottom: Spacing.lg,
  },
  fitTitle: {
    ...Typography.styles.h6,
    color: Colors.text.primary,
    fontWeight: Typography.weights.semiBold,
    marginBottom: Spacing.md,
  },
  fitOptions: {
    gap: Spacing.sm,
  },
  fitOption: {
    marginBottom: Spacing.sm,
  },
  fitCard: {
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  selectedFitOption: {},
  selectedFitCard: {
    backgroundColor: Colors.primary[500],
    borderColor: Colors.primary[500],
  },
  fitLabel: {
    ...Typography.styles.button,
    color: Colors.text.primary,
    fontWeight: Typography.weights.semiBold,
    marginBottom: Spacing.xs,
  },
  selectedFitLabel: {
    color: Colors.text.white,
  },
  fitDescription: {
    ...Typography.styles.caption,
    color: Colors.text.secondary,
  },
  selectedFitDescription: {
    color: Colors.text.white,
    opacity: 0.9,
  },

  // Body type
  bodyTypeGrid: {
    gap: Spacing.md,
  },
  bodyTypeOption: {
    marginBottom: Spacing.md,
  },
  bodyTypeCard: {
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  selectedBodyType: {},
  selectedBodyTypeCard: {
    backgroundColor: Colors.primary[500],
    borderColor: Colors.primary[500],
  },
  bodyTypeLabel: {
    ...Typography.styles.button,
    color: Colors.text.primary,
    fontWeight: Typography.weights.semiBold,
    marginBottom: Spacing.xs,
  },
  selectedBodyTypeLabel: {
    color: Colors.text.white,
  },
  bodyTypeDescription: {
    ...Typography.styles.caption,
    color: Colors.text.secondary,
  },
  selectedBodyTypeDescription: {
    color: Colors.text.white,
    opacity: 0.9,
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
