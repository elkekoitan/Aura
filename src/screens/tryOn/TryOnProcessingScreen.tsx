/**
 * @module screens/tryOn/TryOnProcessingScreen
 * @description A screen that displays the real-time progress of a virtual try-on session
 * and shows the final result once processing is complete.
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  Alert,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { GlassCard, GlassButton } from '../../components/ui';
import { Colors, Typography, Spacing } from '../../constants';
import { useAppDispatch, useAppSelector } from '../../store';
import { 
  processTryOn,
  saveTryOnSession,
  clearCurrentSession,
} from '../../store/slices/tryOnSlice';
import { ProcessingStep } from '../../store/types/tryOn';

const { width: screenWidth } = Dimensions.get('window');

type TryOnProcessingRouteProp = RouteProp<{
  TryOnProcessing: { sessionId: string; productId: string; product: any };
}, 'TryOnProcessing'>;

const PROCESSING_STEPS: Array<{ key: ProcessingStep; label: string; icon: string }> = [
  { key: 'uploading', label: 'Uploading Photo', icon: 'cloud-upload-outline' },
  { key: 'analyzing_pose', label: 'Analyzing Pose', icon: 'body-outline' },
  { key: 'detecting_body', label: 'Detecting Body', icon: 'scan-outline' },
  { key: 'fitting_garment', label: 'Fitting Garment', icon: 'shirt-outline' },
  { key: 'rendering_result', label: 'Rendering Result', icon: 'image-outline' },
  { key: 'optimizing_quality', label: 'Optimizing Quality', icon: 'diamond-outline' },
  { key: 'finalizing', label: 'Finalizing', icon: 'checkmark-circle-outline' },
];

/**
 * A screen that displays the real-time progress of a virtual try-on session
 * and shows the final result once processing is complete.
 * @returns {React.FC} A React component.
 */
export default function TryOnProcessingScreen() {
  const navigation = useNavigation();
  const route = useRoute<TryOnProcessingRouteProp>();
  const dispatch = useAppDispatch();
  
  const { sessionId, productId, product } = route.params;
  
  const { 
    currentSession,
    processedPhoto,
    isProcessing,
    processingStep,
    processingProgress,
    tryOnResult,
    savingSession,
    processingError,
    error 
  } = useAppSelector((state) => state.tryOn);

  // Animation values
  const [progressAnim] = useState(new Animated.Value(0));
  const [pulseAnim] = useState(new Animated.Value(1));

  /**
   * Starts the try-on processing when the component mounts.
   */
  useEffect(() => {
    if (currentSession && processedPhoto && !isProcessing && !tryOnResult) {
      startProcessing();
    }
  }, [currentSession, processedPhoto]);

  /**
   * Animates the progress bar as the processing progress updates.
   */
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: processingProgress / 100,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [processingProgress]);

  /**
   * Creates a pulsing animation effect while processing is active.
   */
  useEffect(() => {
    if (isProcessing) {
      const pulse = () => {
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]).start(() => {
          if (isProcessing) pulse();
        });
      };
      pulse();
    }
  }, [isProcessing]);

  /**
   * Starts the try-on processing by dispatching the processTryOn action.
   */
  const startProcessing = async () => {
    if (!currentSession || !processedPhoto) return;

    try {
      await dispatch(processTryOn({
        session_id: currentSession.id,
        user_photo_id: processedPhoto.id,
      })).unwrap();
    } catch (error) {
      console.error('Processing failed:', error);
      Alert.alert(
        'Processing Failed',
        'We encountered an issue processing your try-on. Please try again.',
        [
          { text: 'Retry', onPress: startProcessing },
          { text: 'Cancel', onPress: () => navigation.goBack() },
        ]
      );
    }
  };

  /**
   * Handles saving the try-on result.
   */
  const handleSaveResult = async () => {
    if (!currentSession || !tryOnResult) return;

    try {
      await dispatch(saveTryOnSession({
        session_id: currentSession.id,
        result_id: tryOnResult.id,
      })).unwrap();

      Alert.alert(
        'Saved!',
        'Your try-on has been saved to your history.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save try-on. Please try again.');
    }
  };

  /**
   * Handles sharing the try-on result.
   * @todo Implement sharing functionality.
   */
  const handleShareResult = () => {
    // TODO: Implement sharing functionality
    Alert.alert('Coming Soon', 'Sharing feature will be available soon!');
  };

  /**
   * Handles retrying the try-on session.
   */
  const handleTryAgain = () => {
    dispatch(clearCurrentSession());
    navigation.navigate('TryOnCamera', { productId, product });
  };

  /**
   * Handles finishing the try-on process and navigating away.
   */
  const handleDone = () => {
    dispatch(clearCurrentSession());
    navigation.navigate('Discover');
  };

  /**
   * Gets the index of the current processing step.
   * @returns {number} The index of the current step.
   */
  const getCurrentStepIndex = (): number => {
    return PROCESSING_STEPS.findIndex(step => step.key === processingStep);
  };

  /**
   * Renders the list of processing steps with their current status.
   * @returns {React.ReactElement} The processing steps component.
   */
  const renderProcessingSteps = () => {
    const currentStepIndex = getCurrentStepIndex();

    return (
      <View style={styles.stepsContainer}>
        {PROCESSING_STEPS.map((step, index) => {
          const isActive = index === currentStepIndex;
          const isCompleted = index < currentStepIndex;
          const isUpcoming = index > currentStepIndex;

          return (
            <View key={step.key} style={styles.stepItem}>
              <View style={[
                styles.stepIcon,
                isCompleted && styles.completedStepIcon,
                isActive && styles.activeStepIcon,
                isUpcoming && styles.upcomingStepIcon,
              ]}>
                <Ionicons 
                  name={isCompleted ? "checkmark" : step.icon as any} 
                  size={20} 
                  color={
                    isCompleted ? Colors.semantic.success :
                    isActive ? Colors.primary[500] :
                    Colors.text.muted
                  } 
                />
              </View>
              <Text style={[
                styles.stepLabel,
                isActive && styles.activeStepLabel,
                isCompleted && styles.completedStepLabel,
              ]}>
                {step.label}
              </Text>
            </View>
          );
        })}
      </View>
    );
  };

  /**
   * Renders the progress bar for the processing steps.
   * @returns {React.ReactElement} The progress bar component.
   */
  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <Animated.View 
          style={[
            styles.progressFill,
            {
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]} 
        />
      </View>
      <Text style={styles.progressText}>
        {Math.round(processingProgress)}% Complete
      </Text>
    </View>
  );

  /**
   * Renders the view displayed during the processing phase.
   * @returns {React.ReactElement} The processing view component.
   */
  const renderProcessingView = () => (
    <View style={styles.processingContainer}>
      <GlassCard style={styles.processingCard}>
        {/* User Photo */}
        <Animated.View style={[
          styles.photoContainer,
          { transform: [{ scale: pulseAnim }] }
        ]}>
          <Image
            source={{ uri: processedPhoto?.photo_url }}
            style={styles.userPhoto}
            resizeMode="cover"
          />
          <View style={styles.photoOverlay}>
            <Ionicons name="sparkles" size={32} color={Colors.primary[500]} />
          </View>
        </Animated.View>

        {/* Processing Info */}
        <View style={styles.processingInfo}>
          <Text style={styles.processingTitle}>Creating Your Try-On</Text>
          <Text style={styles.processingSubtitle}>
            We're fitting {product?.name} just for you
          </Text>
        </View>

        {/* Progress */}
        {renderProgressBar()}

        {/* Steps */}
        {renderProcessingSteps()}
      </GlassCard>
    </View>
  );

  /**
   * Renders the view displayed when the try-on result is ready.
   * @returns {React.ReactElement} The result view component.
   */
  const renderResultView = () => (
    <View style={styles.resultContainer}>
      <GlassCard style={styles.resultCard}>
        {/* Result Image */}
        <View style={styles.resultImageContainer}>
          <Image
            source={{ uri: tryOnResult?.result_url }}
            style={styles.resultImage}
            resizeMode="cover"
          />
          
          {/* Fit Analysis */}
          <View style={styles.fitAnalysisOverlay}>
            <View style={styles.fitScore}>
              <Text style={styles.fitScoreText}>
                {tryOnResult?.fit_analysis.fit_score}%
              </Text>
              <Text style={styles.fitScoreLabel}>Fit Score</Text>
            </View>
          </View>
        </View>

        {/* Result Info */}
        <View style={styles.resultInfo}>
          <Text style={styles.resultTitle}>How does it look?</Text>
          <Text style={styles.resultSubtitle}>
            {tryOnResult?.fit_analysis.overall_fit === 'perfect' 
              ? 'Perfect fit! This size looks great on you.'
              : tryOnResult?.fit_analysis.recommendations?.[0] || 'Try-on complete!'
            }
          </Text>
        </View>

        {/* Actions */}
        <View style={styles.resultActions}>
          <GlassButton
            title="Try Again"
            onPress={handleTryAgain}
            variant="outline"
            size="medium"
            style={styles.actionButton}
          />
          
          <GlassButton
            title="Share"
            onPress={handleShareResult}
            variant="outline"
            size="medium"
            style={styles.actionButton}
          />
          
          <GlassButton
            title={savingSession ? "Saving..." : "Save"}
            onPress={handleSaveResult}
            variant="primary"
            size="medium"
            gradient
            gradientColors={Colors.gradients.primary}
            disabled={savingSession}
            style={styles.actionButton}
          />
        </View>

        {/* Done Button */}
        <GlassButton
          title="Done"
          onPress={handleDone}
          variant="outline"
          size="large"
          fullWidth
          style={styles.doneButton}
        />
      </GlassCard>
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
        <Text style={styles.headerTitle}>Virtual Try-On</Text>
        <Text style={styles.headerSubtitle}>
          {isProcessing ? 'Processing...' : 'Result Ready!'}
        </Text>
      </View>

      {/* Content */}
      {tryOnResult ? renderResultView() : renderProcessingView()}

      {/* Error Display */}
      {(error || processingError) && (
        <View style={styles.errorContainer}>
          <GlassCard style={styles.errorCard}>
            <Ionicons name="alert-circle" size={20} color={Colors.semantic.error} />
            <Text style={styles.errorText}>{error || processingError}</Text>
            <GlassButton
              title="Retry"
              onPress={startProcessing}
              variant="outline"
              size="small"
              style={styles.retryButton}
            />
          </GlassCard>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: Spacing.component.screen.horizontal,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerTitle: {
    ...Typography.styles.h1,
    color: Colors.text.white,
    marginBottom: Spacing.xs,
  },
  headerSubtitle: {
    ...Typography.styles.body,
    color: Colors.text.white,
    opacity: 0.8,
  },

  // Processing view
  processingContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.component.screen.horizontal,
  },
  processingCard: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  photoContainer: {
    position: 'relative',
    marginBottom: Spacing.lg,
  },
  userPhoto: {
    width: 120,
    height: 160,
    borderRadius: Spacing.component.radius.lg,
    borderWidth: 3,
    borderColor: Colors.primary[500],
  },
  photoOverlay: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.glass.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingInfo: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  processingTitle: {
    ...Typography.styles.h3,
    color: Colors.text.primary,
    fontWeight: Typography.weights.semiBold,
    marginBottom: Spacing.sm,
  },
  processingSubtitle: {
    ...Typography.styles.body,
    color: Colors.text.secondary,
    textAlign: 'center',
  },

  // Progress
  progressContainer: {
    width: '100%',
    marginBottom: Spacing.lg,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.glass.light,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary[500],
    borderRadius: 3,
  },
  progressText: {
    ...Typography.styles.caption,
    color: Colors.text.secondary,
    textAlign: 'center',
  },

  // Processing steps
  stepsContainer: {
    width: '100%',
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  stepIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.glass.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  activeStepIcon: {
    backgroundColor: Colors.primary[500] + '20',
    borderWidth: 2,
    borderColor: Colors.primary[500],
  },
  completedStepIcon: {
    backgroundColor: Colors.semantic.success + '20',
    borderWidth: 2,
    borderColor: Colors.semantic.success,
  },
  upcomingStepIcon: {
    backgroundColor: Colors.glass.light,
  },
  stepLabel: {
    ...Typography.styles.body,
    color: Colors.text.secondary,
  },
  activeStepLabel: {
    color: Colors.primary[500],
    fontWeight: Typography.weights.semiBold,
  },
  completedStepLabel: {
    color: Colors.semantic.success,
  },

  // Result view
  resultContainer: {
    flex: 1,
    paddingHorizontal: Spacing.component.screen.horizontal,
  },
  resultCard: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  resultImageContainer: {
    position: 'relative',
    marginBottom: Spacing.lg,
  },
  resultImage: {
    width: screenWidth * 0.6,
    height: screenWidth * 0.8,
    borderRadius: Spacing.component.radius.lg,
    borderWidth: 3,
    borderColor: Colors.primary[500],
  },
  fitAnalysisOverlay: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
  },
  fitScore: {
    backgroundColor: Colors.glass.dark,
    padding: Spacing.sm,
    borderRadius: Spacing.component.radius.sm,
    alignItems: 'center',
    minWidth: 60,
  },
  fitScoreText: {
    ...Typography.styles.h6,
    color: Colors.text.white,
    fontWeight: Typography.weights.bold,
  },
  fitScoreLabel: {
    ...Typography.styles.caption,
    color: Colors.text.white,
    opacity: 0.8,
    fontSize: 10,
  },
  resultInfo: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  resultTitle: {
    ...Typography.styles.h3,
    color: Colors.text.primary,
    fontWeight: Typography.weights.semiBold,
    marginBottom: Spacing.sm,
  },
  resultSubtitle: {
    ...Typography.styles.body,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: Typography.lineHeights.relaxed,
  },
  resultActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
    width: '100%',
  },
  actionButton: {
    flex: 1,
  },
  doneButton: {
    width: '100%',
  },

  // Error display
  errorContainer: {
    position: 'absolute',
    bottom: Spacing.lg,
    left: Spacing.lg,
    right: Spacing.lg,
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
  retryButton: {
    marginLeft: Spacing.sm,
  },
});
