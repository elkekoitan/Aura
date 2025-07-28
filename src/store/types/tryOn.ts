/**
 * Virtual Try-On TypeScript type definitions
 * Provides comprehensive typing for virtual try-on functionality, camera integration, and image processing
 */

import { Product } from './product';

// Try-on session types
export interface TryOnSession {
  id: string;
  user_id: string;
  product_id: string;
  product: Product;
  user_photo_url: string;
  overlay_photo_url?: string;
  result_photo_url?: string;
  session_type: 'photo' | 'live' | 'ar';
  status: TryOnStatus;
  created_at: string;
  updated_at: string;
  metadata?: {
    user_measurements?: Record<string, number>;
    fit_adjustments?: FitAdjustment[];
    overlay_settings?: OverlaySettings;
  };
}

export type TryOnStatus = 
  | 'initializing'    // Session created, preparing camera
  | 'capturing'       // Taking user photo
  | 'processing'      // Processing images
  | 'ready'          // Try-on result ready
  | 'failed'         // Processing failed
  | 'saved';         // Session saved to history

// Camera and photo types
export interface CameraSettings {
  quality: number;           // 0.1 to 1.0
  allowsEditing: boolean;
  aspect: [number, number];
  base64: boolean;
  exif: boolean;
}

export interface PhotoCapture {
  uri: string;
  width: number;
  height: number;
  base64?: string;
  exif?: Record<string, any>;
  type?: 'image';
}

export interface UserPhoto {
  id: string;
  user_id: string;
  photo_url: string;
  photo_type: 'full_body' | 'upper_body' | 'face' | 'custom';
  width: number;
  height: number;
  created_at: string;
  metadata?: {
    pose_detection?: PoseData;
    body_measurements?: BodyMeasurements;
    lighting_conditions?: LightingData;
  };
}

// Pose detection and body analysis
export interface PoseData {
  keypoints: PoseKeypoint[];
  confidence: number;
  body_bounds: BoundingBox;
  pose_type: 'front' | 'side' | 'back' | 'three_quarter';
}

export interface PoseKeypoint {
  name: string;
  x: number;
  y: number;
  confidence: number;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface BodyMeasurements {
  shoulder_width: number;
  chest_width: number;
  waist_width: number;
  hip_width: number;
  arm_length: number;
  torso_length: number;
  leg_length: number;
}

export interface LightingData {
  brightness: number;
  contrast: number;
  color_temperature: number;
  shadows: boolean;
}

// Overlay and fitting types
export interface OverlaySettings {
  scale: number;           // 0.5 to 2.0
  rotation: number;        // -45 to 45 degrees
  position: {
    x: number;
    y: number;
  };
  opacity: number;         // 0.0 to 1.0
  blend_mode: BlendMode;
  fit_adjustments: FitAdjustment[];
}

export type BlendMode = 
  | 'normal'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'soft_light'
  | 'hard_light';

export interface FitAdjustment {
  type: 'scale' | 'stretch' | 'skew' | 'perspective';
  area: 'shoulders' | 'chest' | 'waist' | 'sleeves' | 'length';
  value: number;
}

// Try-on result types
export interface TryOnResult {
  id: string;
  session_id: string;
  result_url: string;
  thumbnail_url: string;
  processing_time: number;
  quality_score: number;
  fit_analysis: FitAnalysis;
  user_feedback?: UserFeedback;
  created_at: string;
}

export interface FitAnalysis {
  overall_fit: 'too_small' | 'perfect' | 'too_large';
  fit_score: number;        // 0 to 100
  areas: {
    shoulders: FitRating;
    chest: FitRating;
    waist: FitRating;
    length: FitRating;
    sleeves?: FitRating;
  };
  recommendations: string[];
}

export type FitRating = 'too_tight' | 'snug' | 'perfect' | 'loose' | 'too_loose';

export interface UserFeedback {
  rating: number;           // 1 to 5 stars
  fit_feedback: FitRating;
  would_purchase: boolean;
  comments?: string;
  reported_issues?: string[];
}

// Try-on state types
export interface TryOnState {
  // Current session
  currentSession: TryOnSession | null;
  
  // Camera state
  cameraPermission: boolean;
  cameraReady: boolean;
  cameraSettings: CameraSettings;
  
  // Photo state
  userPhoto: PhotoCapture | null;
  processedPhoto: UserPhoto | null;
  
  // Processing state
  isProcessing: boolean;
  processingStep: ProcessingStep;
  processingProgress: number;
  
  // Results
  tryOnResult: TryOnResult | null;
  overlaySettings: OverlaySettings;
  
  // History
  sessionHistory: TryOnSession[];
  savedResults: TryOnResult[];
  
  // Loading states
  loading: boolean;
  uploadingPhoto: boolean;
  savingSession: boolean;
  
  // Error states
  error: string | null;
  cameraError: string | null;
  processingError: string | null;
}

export type ProcessingStep = 
  | 'uploading'
  | 'analyzing_pose'
  | 'detecting_body'
  | 'fitting_garment'
  | 'rendering_result'
  | 'optimizing_quality'
  | 'finalizing';

// Try-on operations
export interface StartTryOnParams {
  product_id: string;
  session_type: TryOnSession['session_type'];
  user_measurements?: BodyMeasurements;
}

export interface CapturePhotoParams {
  session_id: string;
  photo: PhotoCapture;
  photo_type: UserPhoto['photo_type'];
}

export interface ProcessTryOnParams {
  session_id: string;
  user_photo_id: string;
  overlay_settings?: Partial<OverlaySettings>;
}

export interface SaveTryOnParams {
  session_id: string;
  result_id: string;
  user_feedback?: UserFeedback;
}

// Component prop types
export interface TryOnCameraProps {
  onPhotoCapture: (photo: PhotoCapture) => void;
  onError: (error: string) => void;
  cameraSettings: CameraSettings;
  isActive: boolean;
}

export interface TryOnOverlayProps {
  userPhoto: UserPhoto;
  product: Product;
  overlaySettings: OverlaySettings;
  onSettingsChange: (settings: Partial<OverlaySettings>) => void;
  onProcess: () => void;
  processing: boolean;
}

export interface TryOnResultProps {
  result: TryOnResult;
  onSave: () => void;
  onRetry: () => void;
  onShare: () => void;
  onFeedback: (feedback: UserFeedback) => void;
}

export interface TryOnHistoryProps {
  sessions: TryOnSession[];
  results: TryOnResult[];
  onSessionSelect: (session: TryOnSession) => void;
  onResultSelect: (result: TryOnResult) => void;
  onDelete: (sessionId: string) => void;
}

// AR and advanced features (future)
export interface ARTryOnSettings {
  tracking_quality: 'low' | 'medium' | 'high';
  lighting_estimation: boolean;
  occlusion_handling: boolean;
  real_time_fitting: boolean;
}

export interface LiveTryOnSession {
  id: string;
  product_id: string;
  is_active: boolean;
  frame_rate: number;
  tracking_data: ARTrackingData[];
  created_at: string;
}

export interface ARTrackingData {
  timestamp: number;
  pose_data: PoseData;
  camera_transform: CameraTransform;
  lighting_data: LightingData;
}

export interface CameraTransform {
  position: [number, number, number];
  rotation: [number, number, number, number]; // quaternion
  projection_matrix: number[][];
}

// Analytics and insights
export interface TryOnAnalytics {
  total_sessions: number;
  successful_sessions: number;
  average_processing_time: number;
  popular_products: Array<{
    product_id: string;
    try_on_count: number;
    conversion_rate: number;
  }>;
  user_satisfaction: {
    average_rating: number;
    fit_accuracy: number;
    would_purchase_rate: number;
  };
  technical_metrics: {
    pose_detection_accuracy: number;
    processing_success_rate: number;
    average_quality_score: number;
  };
}

// Error types
export interface TryOnError {
  type: 'camera' | 'upload' | 'processing' | 'network' | 'permission';
  code: string;
  message: string;
  details?: Record<string, any>;
  retry_possible: boolean;
}

// Configuration types
export interface TryOnConfig {
  max_photo_size: number;
  supported_formats: string[];
  processing_timeout: number;
  quality_thresholds: {
    min_pose_confidence: number;
    min_image_quality: number;
    min_lighting_score: number;
  };
  feature_flags: {
    ar_enabled: boolean;
    live_try_on_enabled: boolean;
    pose_detection_enabled: boolean;
    fit_analysis_enabled: boolean;
  };
}
