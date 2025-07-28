/**
 * TryOnCameraScreen
 * Camera interface for virtual try-on with photo capture and processing
 * Integrates with Expo Camera and image processing pipeline
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Camera, CameraType, FlashMode } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { GlassCard, GlassButton } from '../../components/ui';
import { Colors, Typography, Spacing } from '../../constants';
import { useAppDispatch, useAppSelector } from '../../store';
import { 
  startTryOnSession,
  captureUserPhoto,
  setCameraPermission,
  setCameraReady,
  setUserPhoto,
  setCameraError,
  clearAllErrors,
} from '../../store/slices/tryOnSlice';
import { PhotoCapture } from '../../store/types/tryOn';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

type TryOnCameraRouteProp = RouteProp<{
  TryOnCamera: { productId: string; product: any };
}, 'TryOnCamera'>;

export default function TryOnCameraScreen() {
  const navigation = useNavigation();
  const route = useRoute<TryOnCameraRouteProp>();
  const dispatch = useAppDispatch();
  
  const { productId, product } = route.params;
  
  const { 
    currentSession,
    cameraPermission,
    cameraReady,
    userPhoto,
    uploadingPhoto,
    cameraError,
    error 
  } = useAppSelector((state) => state.tryOn);

  // Camera state
  const cameraRef = useRef<Camera>(null);
  const [cameraType, setCameraType] = useState(CameraType.front);
  const [flashMode, setFlashMode] = useState(FlashMode.off);
  const [isReady, setIsReady] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  /**
   * Initialize camera and session
   */
  useEffect(() => {
    initializeCamera();
    initializeTryOnSession();
    
    return () => {
      dispatch(clearAllErrors());
    };
  }, []);

  /**
   * Initialize camera permissions
   */
  const initializeCamera = async () => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      dispatch(setCameraPermission(status === 'granted'));
      
      if (status !== 'granted') {
        Alert.alert(
          'Camera Permission Required',
          'Please allow camera access to use the virtual try-on feature.',
          [
            { text: 'Cancel', onPress: () => navigation.goBack() },
            { text: 'Settings', onPress: () => {/* Open settings */} },
          ]
        );
      }
    } catch (error) {
      console.error('Camera permission error:', error);
      dispatch(setCameraError('Failed to request camera permission'));
    }
  };

  /**
   * Initialize try-on session
   */
  const initializeTryOnSession = async () => {
    if (!currentSession) {
      try {
        await dispatch(startTryOnSession({
          product_id: productId,
          session_type: 'photo',
        }));
      } catch (error) {
        console.error('Failed to start try-on session:', error);
      }
    }
  };

  /**
   * Handle camera ready
   */
  const handleCameraReady = () => {
    setIsReady(true);
    dispatch(setCameraReady(true));
  };

  /**
   * Capture photo
   */
  const capturePhoto = async () => {
    if (!cameraRef.current || !isReady) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        exif: false,
      });

      const photoCapture: PhotoCapture = {
        uri: photo.uri,
        width: photo.width,
        height: photo.height,
        type: 'image',
      };

      dispatch(setUserPhoto(photoCapture));
      setShowPreview(true);
    } catch (error) {
      console.error('Photo capture error:', error);
      dispatch(setCameraError('Failed to capture photo'));
    }
  };

  /**
   * Use photo from gallery
   */
  const useGalleryPhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Please allow access to your photo library.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const photoCapture: PhotoCapture = {
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
          type: 'image',
        };

        dispatch(setUserPhoto(photoCapture));
        setShowPreview(true);
      }
    } catch (error) {
      console.error('Gallery photo error:', error);
      Alert.alert('Error', 'Failed to select photo from gallery.');
    }
  };

  /**
   * Confirm photo and proceed
   */
  const confirmPhoto = async () => {
    if (!userPhoto || !currentSession) return;

    try {
      await dispatch(captureUserPhoto({
        session_id: currentSession.id,
        photo: userPhoto,
        photo_type: 'full_body',
      })).unwrap();

      // Navigate to try-on processing screen
      navigation.navigate('TryOnProcessing', {
        sessionId: currentSession.id,
        productId,
        product,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to process photo. Please try again.');
    }
  };

  /**
   * Retake photo
   */
  const retakePhoto = () => {
    dispatch(setUserPhoto(null));
    setShowPreview(false);
  };

  /**
   * Toggle camera type
   */
  const toggleCameraType = () => {
    setCameraType(current => 
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  };

  /**
   * Toggle flash
   */
  const toggleFlash = () => {
    setFlashMode(current => 
      current === FlashMode.off ? FlashMode.on : FlashMode.off
    );
  };

  /**
   * Render camera controls
   */
  const renderCameraControls = () => (
    <View style={styles.controlsContainer}>
      {/* Top Controls */}
      <View style={styles.topControls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={Colors.gradients.glass}
            style={styles.controlGradient}
          >
            <Ionicons name="close" size={24} color={Colors.text.white} />
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={1}>
            {product?.name || 'Try On'}
          </Text>
          <Text style={styles.instructionText}>
            Position yourself in the frame
          </Text>
        </View>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={toggleFlash}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={Colors.gradients.glass}
            style={styles.controlGradient}
          >
            <Ionicons 
              name={flashMode === FlashMode.on ? "flash" : "flash-off"} 
              size={24} 
              color={Colors.text.white} 
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Bottom Controls */}
      <View style={styles.bottomControls}>
        <TouchableOpacity
          style={styles.galleryButton}
          onPress={useGalleryPhoto}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={Colors.gradients.glass}
            style={styles.galleryGradient}
          >
            <Ionicons name="images" size={24} color={Colors.text.white} />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.captureButton}
          onPress={capturePhoto}
          disabled={!isReady}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={isReady ? Colors.gradients.primary : Colors.gradients.glass}
            style={styles.captureGradient}
          >
            <View style={styles.captureInner} />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.flipButton}
          onPress={toggleCameraType}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={Colors.gradients.glass}
            style={styles.flipGradient}
          >
            <Ionicons name="camera-reverse" size={24} color={Colors.text.white} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  /**
   * Render photo preview
   */
  const renderPhotoPreview = () => (
    <View style={styles.previewContainer}>
      <Image
        source={{ uri: userPhoto?.uri }}
        style={styles.previewImage}
        resizeMode="cover"
      />
      
      <View style={styles.previewOverlay}>
        <View style={styles.previewHeader}>
          <Text style={styles.previewTitle}>How does this look?</Text>
          <Text style={styles.previewSubtitle}>
            Make sure you're clearly visible in the photo
          </Text>
        </View>

        <View style={styles.previewActions}>
          <GlassButton
            title="Retake"
            onPress={retakePhoto}
            variant="outline"
            size="medium"
            style={styles.retakeButton}
          />
          
          <GlassButton
            title={uploadingPhoto ? "Processing..." : "Use This Photo"}
            onPress={confirmPhoto}
            variant="primary"
            size="medium"
            gradient
            gradientColors={Colors.gradients.primary}
            disabled={uploadingPhoto}
            style={styles.confirmButton}
          />
        </View>
      </View>
    </View>
  );

  /**
   * Render camera guidelines
   */
  const renderGuidelines = () => (
    <View style={styles.guidelinesContainer}>
      <View style={styles.bodyOutline}>
        <View style={styles.headGuide} />
        <View style={styles.shoulderGuide} />
        <View style={styles.bodyGuide} />
        <View style={styles.legGuide} />
      </View>
      
      <View style={styles.guideText}>
        <Text style={styles.guideTitle}>Perfect Pose Tips</Text>
        <Text style={styles.guideItem}>• Stand straight with arms at your sides</Text>
        <Text style={styles.guideItem}>• Face the camera directly</Text>
        <Text style={styles.guideItem}>• Ensure good lighting</Text>
        <Text style={styles.guideItem}>• Keep your full body in frame</Text>
      </View>
    </View>
  );

  if (!cameraPermission) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={Colors.gradients.holographic}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
        
        <View style={styles.permissionContainer}>
          <GlassCard style={styles.permissionCard}>
            <Ionicons name="camera-outline" size={64} color={Colors.primary[500]} />
            <Text style={styles.permissionTitle}>Camera Access Required</Text>
            <Text style={styles.permissionMessage}>
              To use the virtual try-on feature, please allow camera access in your device settings.
            </Text>
            <GlassButton
              title="Go to Settings"
              onPress={() => {/* Open settings */}}
              variant="primary"
              size="medium"
              gradient
              gradientColors={Colors.gradients.primary}
            />
          </GlassCard>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {showPreview ? (
        renderPhotoPreview()
      ) : (
        <>
          <Camera
            ref={cameraRef}
            style={styles.camera}
            type={cameraType}
            flashMode={flashMode}
            onCameraReady={handleCameraReady}
          />
          
          {renderGuidelines()}
          {renderCameraControls()}
        </>
      )}

      {/* Error Display */}
      {(error || cameraError) && (
        <View style={styles.errorContainer}>
          <GlassCard style={styles.errorCard}>
            <Ionicons name="alert-circle" size={20} color={Colors.semantic.error} />
            <Text style={styles.errorText}>{error || cameraError}</Text>
          </GlassCard>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  camera: {
    flex: 1,
  },

  // Permission screen
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.component.screen.horizontal,
  },
  permissionCard: {
    padding: Spacing['2xl'],
    alignItems: 'center',
    width: '100%',
    maxWidth: 300,
  },
  permissionTitle: {
    ...Typography.styles.h2,
    color: Colors.text.primary,
    textAlign: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  permissionMessage: {
    ...Typography.styles.body,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: Typography.lineHeights.relaxed,
    marginBottom: Spacing['2xl'],
  },

  // Camera controls
  controlsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  topControls: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
  },
  controlGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: Spacing.md,
  },
  productName: {
    ...Typography.styles.h6,
    color: Colors.text.white,
    fontWeight: Typography.weights.semiBold,
    textAlign: 'center',
  },
  instructionText: {
    ...Typography.styles.caption,
    color: Colors.text.white,
    opacity: 0.8,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },

  // Bottom controls
  bottomControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing['2xl'],
  },
  galleryButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  galleryGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
  },
  captureGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.text.white,
  },
  flipButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  flipGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Guidelines
  guidelinesContainer: {
    position: 'absolute',
    top: '20%',
    left: '50%',
    transform: [{ translateX: -screenWidth * 0.15 }],
    alignItems: 'center',
  },
  bodyOutline: {
    width: screenWidth * 0.3,
    height: screenHeight * 0.5,
    borderWidth: 2,
    borderColor: Colors.text.white,
    borderStyle: 'dashed',
    borderRadius: Spacing.md,
    opacity: 0.6,
    position: 'relative',
  },
  headGuide: {
    position: 'absolute',
    top: -10,
    left: '50%',
    transform: [{ translateX: -15 }],
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: Colors.text.white,
    borderStyle: 'dashed',
  },
  shoulderGuide: {
    position: 'absolute',
    top: '15%',
    left: -10,
    right: -10,
    height: 2,
    backgroundColor: Colors.text.white,
    opacity: 0.6,
  },
  bodyGuide: {
    position: 'absolute',
    top: '40%',
    left: '25%',
    right: '25%',
    height: 2,
    backgroundColor: Colors.text.white,
    opacity: 0.6,
  },
  legGuide: {
    position: 'absolute',
    bottom: '20%',
    left: '30%',
    right: '30%',
    height: 2,
    backgroundColor: Colors.text.white,
    opacity: 0.6,
  },
  guideText: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.glass.dark,
    padding: Spacing.md,
    borderRadius: Spacing.component.radius.md,
    maxWidth: screenWidth * 0.8,
  },
  guideTitle: {
    ...Typography.styles.button,
    color: Colors.text.white,
    fontWeight: Typography.weights.semiBold,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  guideItem: {
    ...Typography.styles.caption,
    color: Colors.text.white,
    opacity: 0.9,
    marginBottom: Spacing.xs,
  },

  // Photo preview
  previewContainer: {
    flex: 1,
  },
  previewImage: {
    flex: 1,
    width: '100%',
  },
  previewOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.glass.dark,
    padding: Spacing.lg,
  },
  previewHeader: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  previewTitle: {
    ...Typography.styles.h3,
    color: Colors.text.white,
    fontWeight: Typography.weights.semiBold,
    marginBottom: Spacing.sm,
  },
  previewSubtitle: {
    ...Typography.styles.body,
    color: Colors.text.white,
    opacity: 0.8,
    textAlign: 'center',
  },
  previewActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  retakeButton: {
    flex: 1,
  },
  confirmButton: {
    flex: 2,
  },

  // Error display
  errorContainer: {
    position: 'absolute',
    top: '50%',
    left: Spacing.lg,
    right: Spacing.lg,
    transform: [{ translateY: -50 }],
  },
  errorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.semantic.error + '20',
    borderWidth: 1,
    borderColor: Colors.semantic.error + '40',
  },
  errorText: {
    ...Typography.styles.body,
    color: Colors.semantic.error,
    marginLeft: Spacing.sm,
    flex: 1,
  },
});
