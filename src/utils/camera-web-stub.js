/**
 * @module utils/camera-web-stub
 * @description Provides a web-compatible mock implementation of the React Native Camera component
 * and its related functions. It uses the HTML5 `getUserMedia` API to access the camera on web platforms.
 */
import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * A mock Camera component for web platforms that mimics the behavior of `expo-camera`.
 * It uses a `<video>` element to display the camera stream.
 * @param {object} props - The component props.
 * @param {object} props.style - The style for the component's container.
 * @param {function} props.onCameraReady - A callback function that is called when the camera is ready.
 * @param {string} props.type - The camera type ('front' or 'back').
 * @param {string} props.flashMode - The flash mode (not implemented for web).
 * @param {React.ReactNode} props.children - Children to be rendered on top of the camera view.
 * @param {React.Ref} ref - The ref to expose the component's imperative methods.
 * @returns {React.Component} A camera view component for the web.
 */
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
    /**
     * Takes a picture and returns the captured image data.
     * @param {object} [options={}] - Options for taking the picture.
     * @param {number} [options.quality=0.8] - The quality of the captured image (0 to 1).
     * @returns {Promise<{uri: string, width: number, height: number, type: string}>} A promise that resolves with the image data.
     */
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

/**
 * A mock function to request camera permissions on the web.
 * @returns {Promise<{status: 'granted' | 'denied'}>} A promise that resolves with the permission status.
 */
export const requestCameraPermissionsAsync = async () => {
  try {
    await navigator.mediaDevices.getUserMedia({ video: true });
    return { status: 'granted' };
  } catch (error) {
    return { status: 'denied' };
  }
};

/**
 * An object containing mock camera types.
 * @type {{front: string, back: string}}
 */
export const CameraType = {
  front: 'front',
  back: 'back'
};

/**
 * An object containing mock flash modes.
 * @type {{on: string, off: string, auto: string}}
 */
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
