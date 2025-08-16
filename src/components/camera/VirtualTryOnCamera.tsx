import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ExpoCamera from 'expo-camera';
import { GlassCard } from '../ui';
import { Colors, Typography, Spacing } from '../../constants';

const { width, height } = Dimensions.get('window');

interface VirtualTryOnCameraProps {
  productId: string;
  productName: string;
  onClose: () => void;
  onCapture: (imageUri: string) => void;
}

export default function VirtualTryOnCamera({
  productId,
  productName,
  onClose,
  onCapture,
}: VirtualTryOnCameraProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const cameraRef = useRef<any>(null);

  useEffect(() => {
    (async () => {
      // Request camera permissions
      const [cameraPermissions, requestCameraPermissions] = ExpoCamera.useCameraPermissions();
      const status = cameraPermissions?.status;
      setHasPermission(status === 'granted');
      
      // Request media library permissions
      if (Platform.OS !== 'web') {
        const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        console.log('Media library permission:', mediaStatus);
      }
    })();
  }, []);

  const takePicture = async () => {
    try {
      setIsRecording(true);
      
      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        const photoUri = result.assets[0].uri;
        
        // Simulate AI processing
        setTimeout(() => {
          setIsRecording(false);
          onCapture(photoUri);
          Alert.alert(
            'Virtual Try-On Complete!',
            `AI has processed your try-on for ${productName}. Check the results!`,
            [{ text: 'OK', onPress: onClose }]
          );
        }, 2000);
      } else {
        setIsRecording(false);
      }
    } catch (error) {
      setIsRecording(false);
      Alert.alert('Error', 'Failed to select photo. Please try again.');
    }
  };

  const openCamera = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        const photoUri = result.assets[0].uri;
        setIsRecording(false);
        onCapture(photoUri);
        Alert.alert(
          'Virtual Try-On Complete!',
          `AI has processed your try-on for ${productName}. Check the results!`,
          [{ text: 'OK', onPress: onClose }]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to capture photo. Please try again.');
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[Colors.primary[600], Colors.primary[800]]}
          style={styles.loadingContainer}
        >
          <Text style={styles.loadingText}>Requesting camera permission...</Text>
        </LinearGradient>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[Colors.primary[600], Colors.primary[800]]}
          style={styles.permissionContainer}
        >
          <Ionicons name="camera-outline" size={64} color={Colors.text.white} />
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionText}>
            Please enable camera access to use Virtual Try-On feature
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={onClose}>
            <Text style={styles.permissionButtonText}>Go Back</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.primary[600], Colors.primary[800]]}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={Colors.text.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Virtual Try-On</Text>
          <View style={styles.headerButton} />
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          <GlassCard style={styles.productCard}>
            <Text style={styles.productText}>Trying on: {productName}</Text>
          </GlassCard>
        </View>

        {/* AI Overlay Simulation */}
        <View style={styles.aiOverlay}>
          <View style={styles.scanLine} />
          <Text style={styles.aiText}>AI Fashion Analysis Active</Text>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={openCamera}
          >
            <Ionicons name="camera" size={32} color={Colors.text.white} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.captureButton,
              isRecording && styles.captureButtonRecording
            ]}
            onPress={takePicture}
            disabled={isRecording}
          >
            {isRecording ? (
              <View style={styles.recordingIndicator}>
                <Text style={styles.recordingText}>Processing...</Text>
              </View>
            ) : (
              <Ionicons name="image" size={32} color={Colors.text.white} />
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton}>
            <Ionicons name="images" size={32} color={Colors.text.white} />
          </TouchableOpacity>
        </View>

        {/* Instructions */}
        <View style={styles.instructions}>
          <GlassCard style={styles.instructionCard}>
            <Text style={styles.instructionText}>
              Select a photo from your gallery or take a new one
            </Text>
          </GlassCard>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...Typography.styles.body,
    color: Colors.text.white,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  permissionTitle: {
    ...Typography.styles.h2,
    color: Colors.text.white,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  permissionText: {
    ...Typography.styles.body,
    color: Colors.text.white,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  permissionButton: {
    backgroundColor: Colors.accent[500],
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: 25,
  },
  permissionButtonText: {
    ...Typography.styles.button,
    color: Colors.text.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...Typography.styles.h3,
    color: Colors.text.white,
  },
  productInfo: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 120 : 100,
    left: Spacing.lg,
    right: Spacing.lg,
  },
  productCard: {
    padding: Spacing.md,
    alignItems: 'center',
  },
  productText: {
    ...Typography.styles.body,
    color: Colors.text.white,
    fontWeight: '600',
  },
  aiOverlay: {
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  scanLine: {
    width: width * 0.8,
    height: 2,
    backgroundColor: Colors.accent[400],
    opacity: 0.8,
  },
  aiText: {
    ...Typography.styles.caption,
    color: Colors.accent[400],
    marginTop: Spacing.sm,
    fontWeight: '600',
  },
  controls: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 100 : 80,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.accent[500],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: Colors.text.white,
  },
  captureButtonRecording: {
    backgroundColor: Colors.semantic.error,
  },
  recordingIndicator: {
    alignItems: 'center',
  },
  recordingText: {
    ...Typography.styles.caption,
    color: Colors.text.white,
    fontWeight: '600',
  },
  instructions: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 30 : 20,
    left: Spacing.lg,
    right: Spacing.lg,
  },
  instructionCard: {
    padding: Spacing.md,
    alignItems: 'center',
  },
  instructionText: {
    ...Typography.styles.caption,
    color: Colors.text.white,
    textAlign: 'center',
  },
});
