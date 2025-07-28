/**
 * Camera Web Stub
 * Provides web-compatible implementations of camera functions
 * Uses HTML5 getUserMedia API for web camera access
 */

import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Mock Camera component for web
export const Camera = React.forwardRef(({ style, onCameraReady, type, flashMode, children, ...props }, ref) => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initialize web camera
    const initCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: type === 'front' ? 'user' : 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          setStream(mediaStream);
          
          // Call onCameraReady when video is loaded
          videoRef.current.onloadedmetadata = () => {
            if (onCameraReady) {
              onCameraReady();
            }
          };
        }
      } catch (err) {
        console.error('Camera access error:', err);
        setError('Camera access denied or not available');
      }
    };

    initCamera();

    // Cleanup
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [type, onCameraReady]);

  // Expose takePictureAsync method
  React.useImperativeHandle(ref, () => ({
    takePictureAsync: async (options = {}) => {
      if (!videoRef.current || !stream) {
        throw new Error('Camera not ready');
      }

      // Create canvas to capture frame
      const canvas = document.createElement('canvas');
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      
      // Convert to blob
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          resolve({
            uri: url,
            width: canvas.width,
            height: canvas.height,
            type: 'image'
          });
        }, 'image/jpeg', options.quality || 0.8);
      });
    }
  }));

  if (error) {
    return (
      <View style={[style, styles.errorContainer]}>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.errorSubtext}>
          Please allow camera access or use the gallery option
        </Text>
      </View>
    );
  }

  return (
    <View style={[style, styles.container]}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={styles.video}
      />
      {children}
    </View>
  );
});

// Mock camera permission functions
export const requestCameraPermissionsAsync = async () => {
  try {
    await navigator.mediaDevices.getUserMedia({ video: true });
    return { status: 'granted' };
  } catch (error) {
    return { status: 'denied' };
  }
};

// Mock camera types
export const CameraType = {
  front: 'front',
  back: 'back'
};

// Mock flash modes
export const FlashMode = {
  on: 'on',
  off: 'off',
  auto: 'auto'
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20,
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  errorSubtext: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default Camera;
