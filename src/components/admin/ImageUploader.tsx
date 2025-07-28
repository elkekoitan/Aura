/**
 * ImageUploader Component
 * Handles image selection, upload, and preview for admin forms
 * Integrates with Expo ImagePicker and Supabase Storage
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { GlassCard } from '../ui';
import { Colors, Typography, Spacing } from '../../constants';
import { ImageUploaderProps, FileUploadResult } from '../../store/types/admin';
import { useAppDispatch, useAppSelector } from '../../store';
import { uploadImage, setUploadProgress, clearUploadError } from '../../store/slices/adminSlice';

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onUpload,
  onError,
  options = {},
  currentImage,
  placeholder = "Upload Image",
  style,
}) => {
  const dispatch = useAppDispatch();
  const { fileUpload } = useAppSelector((state) => state.admin);
  
  const [selectedImage, setSelectedImage] = useState<string | null>(currentImage || null);

  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
    quality = 0.8,
    maxWidth = 1200,
    maxHeight = 1200,
  } = options;

  /**
   * Request camera permissions
   */
  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Sorry, we need camera roll permissions to upload images.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  /**
   * Validate selected image
   */
  const validateImage = (imageInfo: any): string | null => {
    if (imageInfo.fileSize && imageInfo.fileSize > maxSize) {
      return `Image size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`;
    }

    // Note: Expo ImagePicker doesn't always provide MIME type
    // We'll rely on file extension for basic validation
    const uri = imageInfo.uri.toLowerCase();
    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const hasValidExtension = validExtensions.some(ext => uri.includes(ext));
    
    if (!hasValidExtension) {
      return 'Please select a valid image file (JPG, PNG, or WebP)';
    }

    return null;
  };

  /**
   * Handle image selection from gallery
   */
  const selectFromGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality,
        maxWidth,
        maxHeight,
      });

      if (!result.canceled && result.assets[0]) {
        const imageInfo = result.assets[0];
        
        // Validate image
        const validationError = validateImage(imageInfo);
        if (validationError) {
          onError(validationError);
          return;
        }

        setSelectedImage(imageInfo.uri);
        await handleUpload(imageInfo);
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      onError('Failed to select image. Please try again.');
    }
  };

  /**
   * Handle image capture from camera
   */
  const captureFromCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Sorry, we need camera permissions to take photos.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality,
        maxWidth,
        maxHeight,
      });

      if (!result.canceled && result.assets[0]) {
        const imageInfo = result.assets[0];
        
        // Validate image
        const validationError = validateImage(imageInfo);
        if (validationError) {
          onError(validationError);
          return;
        }

        setSelectedImage(imageInfo.uri);
        await handleUpload(imageInfo);
      }
    } catch (error) {
      console.error('Error capturing image:', error);
      onError('Failed to capture image. Please try again.');
    }
  };

  /**
   * Handle image upload to Supabase
   */
  const handleUpload = async (imageInfo: any) => {
    try {
      dispatch(clearUploadError());

      // Create file object for upload
      const fileExtension = imageInfo.uri.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}.${fileExtension}`;
      const filePath = `uploads/${fileName}`;

      // Create FormData for upload
      const formData = new FormData();
      formData.append('file', {
        uri: imageInfo.uri,
        type: `image/${fileExtension}`,
        name: fileName,
      } as any);

      // Upload to Supabase
      const result = await dispatch(uploadImage({
        file: formData.get('file'),
        bucket: 'product-images',
        path: filePath,
      })).unwrap();

      onUpload(result);
    } catch (error) {
      console.error('Upload error:', error);
      onError(error instanceof Error ? error.message : 'Upload failed');
      setSelectedImage(null);
    }
  };

  /**
   * Show image selection options
   */
  const showImageOptions = () => {
    Alert.alert(
      'Select Image',
      'Choose how you want to add an image',
      [
        { text: 'Camera', onPress: captureFromCamera },
        { text: 'Gallery', onPress: selectFromGallery },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  /**
   * Remove selected image
   */
  const removeImage = () => {
    setSelectedImage(null);
    dispatch(clearUploadError());
  };

  return (
    <View style={[styles.container, style]}>
      <GlassCard style={styles.uploaderCard}>
        {selectedImage ? (
          // Image preview
          <View style={styles.imagePreview}>
            <Image source={{ uri: selectedImage }} style={styles.previewImage} />
            
            {/* Upload progress overlay */}
            {fileUpload.uploading && (
              <View style={styles.uploadOverlay}>
                <ActivityIndicator size="large" color={Colors.primary[500]} />
                <Text style={styles.uploadText}>
                  Uploading... {Math.round(fileUpload.progress)}%
                </Text>
              </View>
            )}

            {/* Remove button */}
            {!fileUpload.uploading && (
              <TouchableOpacity
                style={styles.removeButton}
                onPress={removeImage}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={Colors.gradients.error}
                  style={styles.removeGradient}
                >
                  <Ionicons name="close" size={16} color={Colors.text.white} />
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          // Upload placeholder
          <TouchableOpacity
            style={styles.uploadPlaceholder}
            onPress={showImageOptions}
            activeOpacity={0.7}
            disabled={fileUpload.uploading}
          >
            <LinearGradient
              colors={Colors.gradients.glass}
              style={styles.placeholderGradient}
            >
              <Ionicons 
                name="camera-outline" 
                size={32} 
                color={Colors.text.secondary} 
              />
              <Text style={styles.placeholderText}>{placeholder}</Text>
              <Text style={styles.placeholderSubtext}>
                Tap to select or capture
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Error message */}
        {fileUpload.error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{fileUpload.error}</Text>
          </View>
        )}
      </GlassCard>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  uploaderCard: {
    overflow: 'hidden',
  },
  imagePreview: {
    position: 'relative',
    width: '100%',
    height: 200,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: Spacing.component.radius.md,
  },
  uploadOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Spacing.component.radius.md,
  },
  uploadText: {
    ...Typography.styles.body,
    color: Colors.text.white,
    marginTop: Spacing.sm,
  },
  removeButton: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    borderRadius: 16,
    overflow: 'hidden',
  },
  removeGradient: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadPlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: Spacing.component.radius.md,
    overflow: 'hidden',
  },
  placeholderGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border.light,
    borderStyle: 'dashed',
  },
  placeholderText: {
    ...Typography.styles.h6,
    color: Colors.text.primary,
    marginTop: Spacing.sm,
  },
  placeholderSubtext: {
    ...Typography.styles.caption,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
  },
  errorContainer: {
    padding: Spacing.md,
    backgroundColor: Colors.semantic.errorBackground,
    borderRadius: Spacing.component.radius.sm,
    marginTop: Spacing.sm,
  },
  errorText: {
    ...Typography.styles.caption,
    color: Colors.semantic.error,
    textAlign: 'center',
  },
});

export default ImageUploader;
