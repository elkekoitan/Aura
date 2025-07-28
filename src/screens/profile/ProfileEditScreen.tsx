/**
 * ProfileEditScreen
 * Comprehensive profile editing with personal information, avatar upload, and validation
 * Integrates with Redux profile state and image picker
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
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { GlassCard, GlassButton } from '../../components/ui';
import { Colors, Typography, Spacing } from '../../constants';
import { useAppDispatch, useAppSelector } from '../../store';
import { 
  updateUserProfile,
  uploadAvatarImage,
  setEditing,
  clearError,
  clearValidationErrors,
} from '../../store/slices/profileSlice';
import { UpdateProfileParams } from '../../store/types/profile';

export default function ProfileEditScreen() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  
  const { 
    profile, 
    saving, 
    uploadingAvatar,
    error,
    validationErrors 
  } = useAppSelector((state) => state.profile);

  // Form state
  const [formData, setFormData] = useState<UpdateProfileParams>({
    full_name: profile?.full_name || '',
    display_name: profile?.display_name || '',
    bio: profile?.bio || '',
    date_of_birth: profile?.date_of_birth || '',
    gender: profile?.gender || undefined,
    location: profile?.location || {},
    phone: profile?.phone || '',
    website: profile?.website || '',
    social_links: profile?.social_links || {},
  });

  const [localAvatarUri, setLocalAvatarUri] = useState<string | null>(null);

  /**
   * Initialize form data when profile loads
   */
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name,
        display_name: profile.display_name,
        bio: profile.bio,
        date_of_birth: profile.date_of_birth,
        gender: profile.gender,
        location: profile.location,
        phone: profile.phone,
        website: profile.website,
        social_links: profile.social_links,
      });
    }
  }, [profile]);

  /**
   * Set editing mode on mount
   */
  useEffect(() => {
    dispatch(setEditing(true));
    return () => {
      dispatch(setEditing(false));
    };
  }, []);

  /**
   * Handle form field changes
   */
  const handleFieldChange = (field: keyof UpdateProfileParams, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      dispatch(clearValidationErrors());
    }
  };

  /**
   * Handle nested field changes (location, social_links)
   */
  const handleNestedFieldChange = (
    parentField: 'location' | 'social_links',
    field: string,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [parentField]: {
        ...prev[parentField],
        [field]: value,
      },
    }));
  };

  /**
   * Handle avatar image selection
   */
  const handleAvatarPress = async () => {
    try {
      // Request permission
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Please allow access to your photo library to upload an avatar.');
        return;
      }

      // Show action sheet
      Alert.alert(
        'Change Avatar',
        'Choose how you want to update your profile picture',
        [
          { text: 'Camera', onPress: () => openCamera() },
          { text: 'Photo Library', onPress: () => openImagePicker() },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    } catch (error) {
      console.error('Error requesting permission:', error);
    }
  };

  /**
   * Open camera for avatar
   */
  const openCamera = async () => {
    try {
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      
      if (cameraPermission.granted === false) {
        Alert.alert('Permission Required', 'Please allow camera access to take a photo.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setLocalAvatarUri(imageUri);
        await dispatch(uploadAvatarImage(imageUri));
      }
    } catch (error) {
      console.error('Error opening camera:', error);
      Alert.alert('Error', 'Failed to open camera. Please try again.');
    }
  };

  /**
   * Open image picker for avatar
   */
  const openImagePicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setLocalAvatarUri(imageUri);
        await dispatch(uploadAvatarImage(imageUri));
      }
    } catch (error) {
      console.error('Error opening image picker:', error);
      Alert.alert('Error', 'Failed to open photo library. Please try again.');
    }
  };

  /**
   * Handle save profile
   */
  const handleSave = async () => {
    try {
      await dispatch(updateUserProfile(formData)).unwrap();
      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  /**
   * Handle cancel
   */
  const handleCancel = () => {
    if (JSON.stringify(formData) !== JSON.stringify({
      full_name: profile?.full_name || '',
      display_name: profile?.display_name || '',
      bio: profile?.bio || '',
      date_of_birth: profile?.date_of_birth || '',
      gender: profile?.gender || undefined,
      location: profile?.location || {},
      phone: profile?.phone || '',
      website: profile?.website || '',
      social_links: profile?.social_links || {},
    })) {
      Alert.alert(
        'Discard Changes',
        'You have unsaved changes. Are you sure you want to discard them?',
        [
          { text: 'Keep Editing', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  /**
   * Get avatar source
   */
  const getAvatarSource = () => {
    if (localAvatarUri) return { uri: localAvatarUri };
    if (profile?.avatar_url) return { uri: profile.avatar_url };
    return { uri: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150' };
  };

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
          style={styles.cancelButton}
          onPress={handleCancel}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={Colors.gradients.glass}
            style={styles.headerButtonGradient}
          >
            <Ionicons name="close" size={24} color={Colors.text.primary} />
          </LinearGradient>
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.title}>Edit Profile</Text>
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={saving ? Colors.gradients.glass : Colors.gradients.primary}
            style={styles.headerButtonGradient}
          >
            <Ionicons 
              name={saving ? "hourglass-outline" : "checkmark"} 
              size={24} 
              color={saving ? Colors.text.secondary : Colors.text.white} 
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Avatar Section */}
          <GlassCard style={styles.avatarSection}>
            <Text style={styles.sectionTitle}>Profile Photo</Text>
            
            <TouchableOpacity
              style={styles.avatarContainer}
              onPress={handleAvatarPress}
              disabled={uploadingAvatar}
              activeOpacity={0.7}
            >
              <Image
                source={getAvatarSource()}
                style={styles.avatar}
                resizeMode="cover"
              />
              
              <View style={styles.avatarOverlay}>
                {uploadingAvatar ? (
                  <Ionicons name="hourglass-outline" size={24} color={Colors.text.white} />
                ) : (
                  <Ionicons name="camera" size={24} color={Colors.text.white} />
                )}
              </View>
            </TouchableOpacity>
            
            <Text style={styles.avatarHint}>
              Tap to change your profile photo
            </Text>
          </GlassCard>

          {/* Basic Information */}
          <GlassCard style={styles.formSection}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            
            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Full Name *</Text>
              <GlassCard style={styles.inputCard}>
                <TextInput
                  style={styles.input}
                  value={formData.full_name}
                  onChangeText={(text) => handleFieldChange('full_name', text)}
                  placeholder="Enter your full name"
                  placeholderTextColor={Colors.text.muted}
                />
              </GlassCard>
              {validationErrors.full_name && (
                <Text style={styles.errorText}>{validationErrors.full_name}</Text>
              )}
            </View>

            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Display Name</Text>
              <GlassCard style={styles.inputCard}>
                <TextInput
                  style={styles.input}
                  value={formData.display_name}
                  onChangeText={(text) => handleFieldChange('display_name', text)}
                  placeholder="How others see you"
                  placeholderTextColor={Colors.text.muted}
                />
              </GlassCard>
            </View>

            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Bio</Text>
              <GlassCard style={styles.inputCard}>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.bio}
                  onChangeText={(text) => handleFieldChange('bio', text)}
                  placeholder="Tell us about yourself..."
                  placeholderTextColor={Colors.text.muted}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </GlassCard>
            </View>

            <View style={styles.formRow}>
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Date of Birth</Text>
                <GlassCard style={styles.inputCard}>
                  <TextInput
                    style={styles.input}
                    value={formData.date_of_birth}
                    onChangeText={(text) => handleFieldChange('date_of_birth', text)}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={Colors.text.muted}
                  />
                </GlassCard>
              </View>
              
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>Gender</Text>
                <GlassCard style={styles.inputCard}>
                  <TextInput
                    style={styles.input}
                    value={formData.gender || ''}
                    onChangeText={(text) => handleFieldChange('gender', text as any)}
                    placeholder="Optional"
                    placeholderTextColor={Colors.text.muted}
                  />
                </GlassCard>
              </View>
            </View>
          </GlassCard>

          {/* Contact Information */}
          <GlassCard style={styles.formSection}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            
            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Phone</Text>
              <GlassCard style={styles.inputCard}>
                <TextInput
                  style={styles.input}
                  value={formData.phone}
                  onChangeText={(text) => handleFieldChange('phone', text)}
                  placeholder="+1 (555) 123-4567"
                  placeholderTextColor={Colors.text.muted}
                  keyboardType="phone-pad"
                />
              </GlassCard>
              {validationErrors.phone && (
                <Text style={styles.errorText}>{validationErrors.phone}</Text>
              )}
            </View>

            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Website</Text>
              <GlassCard style={styles.inputCard}>
                <TextInput
                  style={styles.input}
                  value={formData.website}
                  onChangeText={(text) => handleFieldChange('website', text)}
                  placeholder="https://yourwebsite.com"
                  placeholderTextColor={Colors.text.muted}
                  keyboardType="url"
                  autoCapitalize="none"
                />
              </GlassCard>
              {validationErrors.website && (
                <Text style={styles.errorText}>{validationErrors.website}</Text>
              )}
            </View>
          </GlassCard>

          {/* Location */}
          <GlassCard style={styles.formSection}>
            <Text style={styles.sectionTitle}>Location</Text>
            
            <View style={styles.formRow}>
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>City</Text>
                <GlassCard style={styles.inputCard}>
                  <TextInput
                    style={styles.input}
                    value={formData.location?.city || ''}
                    onChangeText={(text) => handleNestedFieldChange('location', 'city', text)}
                    placeholder="New York"
                    placeholderTextColor={Colors.text.muted}
                  />
                </GlassCard>
              </View>
              
              <View style={styles.formField}>
                <Text style={styles.fieldLabel}>State</Text>
                <GlassCard style={styles.inputCard}>
                  <TextInput
                    style={styles.input}
                    value={formData.location?.state || ''}
                    onChangeText={(text) => handleNestedFieldChange('location', 'state', text)}
                    placeholder="NY"
                    placeholderTextColor={Colors.text.muted}
                  />
                </GlassCard>
              </View>
            </View>

            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Country</Text>
              <GlassCard style={styles.inputCard}>
                <TextInput
                  style={styles.input}
                  value={formData.location?.country || ''}
                  onChangeText={(text) => handleNestedFieldChange('location', 'country', text)}
                  placeholder="United States"
                  placeholderTextColor={Colors.text.muted}
                />
              </GlassCard>
            </View>
          </GlassCard>

          {/* Social Links */}
          <GlassCard style={styles.formSection}>
            <Text style={styles.sectionTitle}>Social Media</Text>
            
            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Instagram</Text>
              <GlassCard style={styles.inputCard}>
                <View style={styles.socialInputContainer}>
                  <Text style={styles.socialPrefix}>@</Text>
                  <TextInput
                    style={[styles.input, styles.socialInput]}
                    value={formData.social_links?.instagram || ''}
                    onChangeText={(text) => handleNestedFieldChange('social_links', 'instagram', text)}
                    placeholder="username"
                    placeholderTextColor={Colors.text.muted}
                    autoCapitalize="none"
                  />
                </View>
              </GlassCard>
            </View>

            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>TikTok</Text>
              <GlassCard style={styles.inputCard}>
                <View style={styles.socialInputContainer}>
                  <Text style={styles.socialPrefix}>@</Text>
                  <TextInput
                    style={[styles.input, styles.socialInput]}
                    value={formData.social_links?.tiktok || ''}
                    onChangeText={(text) => handleNestedFieldChange('social_links', 'tiktok', text)}
                    placeholder="username"
                    placeholderTextColor={Colors.text.muted}
                    autoCapitalize="none"
                  />
                </View>
              </GlassCard>
            </View>

            <View style={styles.formField}>
              <Text style={styles.fieldLabel}>Pinterest</Text>
              <GlassCard style={styles.inputCard}>
                <TextInput
                  style={styles.input}
                  value={formData.social_links?.pinterest || ''}
                  onChangeText={(text) => handleNestedFieldChange('social_links', 'pinterest', text)}
                  placeholder="username"
                  placeholderTextColor={Colors.text.muted}
                  autoCapitalize="none"
                />
              </GlassCard>
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
              title={saving ? "Saving..." : "Save Changes"}
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
      </KeyboardAvoidingView>
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
  cancelButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    marginRight: Spacing.md,
  },
  saveButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    marginLeft: Spacing.md,
  },
  headerButtonGradient: {
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
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.component.screen.horizontal,
    paddingBottom: Spacing['3xl'],
  },

  // Avatar section
  avatarSection: {
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.styles.h3,
    color: Colors.text.primary,
    fontWeight: Typography.weights.semiBold,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: Colors.primary[500],
  },
  avatarOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.text.white,
  },
  avatarHint: {
    ...Typography.styles.caption,
    color: Colors.text.secondary,
    textAlign: 'center',
  },

  // Form sections
  formSection: {
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  formField: {
    marginBottom: Spacing.lg,
  },
  formRow: {
    flexDirection: 'row',
    gap: Spacing.md,
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
  input: {
    ...Typography.styles.body,
    color: Colors.text.primary,
    fontSize: 16,
    minHeight: 24,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  socialInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  socialPrefix: {
    ...Typography.styles.body,
    color: Colors.text.secondary,
    marginRight: Spacing.xs,
    fontSize: 16,
  },
  socialInput: {
    flex: 1,
  },

  // Error handling
  errorText: {
    ...Typography.styles.caption,
    color: Colors.semantic.error,
    marginTop: Spacing.xs,
  },
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
