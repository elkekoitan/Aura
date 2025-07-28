import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard, GlassButton } from '../../components/ui';
import { Colors, Typography, Spacing } from '../../constants';
import { useAppDispatch, useAppSelector } from '../../store';
import { resetPassword, clearError } from '../../store/slices/authSlice';

const { width, height } = Dimensions.get('window');

export default function ForgotPasswordScreen() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  // Form state management
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [validationError, setValidationError] = useState<string | undefined>();

  // Email validation regex pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Clear any existing errors when component mounts
  React.useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  /**
   * Validates email format
   * Returns error message if invalid, undefined if valid
   */
  const validateEmail = (emailValue: string): string | undefined => {
    if (!emailValue.trim()) {
      return 'Email is required';
    }
    if (!emailRegex.test(emailValue.trim())) {
      return 'Please enter a valid email address';
    }
    return undefined;
  };

  /**
   * Handles email input changes with real-time validation
   */
  const handleEmailChange = (value: string) => {
    setEmail(value);
    // Clear validation error when user starts typing
    if (validationError) {
      setValidationError(undefined);
    }
  };

  /**
   * Handles password reset request with Supabase integration
   * Uses Redux Toolkit async thunk for state management
   * Implements comprehensive error handling and user feedback
   */
  const handleResetPassword = async () => {
    // Validate email before submission
    const emailError = validateEmail(email);
    if (emailError) {
      setValidationError(emailError);
      return;
    }

    try {
      // Dispatch resetPassword action using Redux Toolkit
      // This integrates with Supabase auth to send reset email
      await dispatch(resetPassword({ email: email.trim() })).unwrap();

      // Show success state
      setEmailSent(true);

      // Show success alert with instructions
      Alert.alert(
        'Reset Email Sent! 📧',
        `We've sent password reset instructions to ${email.trim()}.\n\nPlease check your email and follow the link to reset your password.`,
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login' as never),
          },
        ]
      );
    } catch (error: any) {
      // Handle reset password errors with user-friendly messages
      let errorMessage = 'Failed to send reset email. Please try again.';

      if (error.message?.includes('not found') || error.message?.includes('invalid email')) {
        errorMessage = 'No account found with this email address. Please check your email or create a new account.';
      } else if (error.message?.includes('rate limit')) {
        errorMessage = 'Too many reset attempts. Please wait a few minutes before trying again.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert('Reset Failed', errorMessage);
    }
  };

  /**
   * Handles back navigation to login screen
   */
  const handleBackToLogin = () => {
    navigation.navigate('Login' as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={Colors.gradients.holographic}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackToLogin}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.text.white} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>
              {emailSent
                ? 'Check your email for reset instructions'
                : 'Enter your email to receive reset instructions'
              }
            </Text>
          </View>
        </View>

        {!emailSent ? (
          // Email input form
          <GlassCard style={styles.formCard}>
            <View style={styles.form}>
              {/* Email Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={[
                    styles.input,
                    validationError && styles.inputError
                  ]}
                  value={email}
                  onChangeText={handleEmailChange}
                  placeholder="Enter your email address"
                  placeholderTextColor={Colors.text.muted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoFocus
                />
                {validationError && (
                  <Text style={styles.fieldErrorText}>{validationError}</Text>
                )}
              </View>

              {/* Global Error Display */}
              {error && (
                <Text style={styles.errorText}>{error}</Text>
              )}

              {/* Reset Button */}
              <GlassButton
                title="Send Reset Email"
                onPress={handleResetPassword}
                loading={loading}
                variant="primary"
                size="large"
                fullWidth
                gradient
                gradientColors={Colors.gradients.primary}
                style={styles.resetButton}
              />

              {/* Help Text */}
              <View style={styles.helpContainer}>
                <Text style={styles.helpText}>
                  Remember your password?{' '}
                </Text>
                <TouchableOpacity onPress={handleBackToLogin}>
                  <Text style={styles.linkText}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>
          </GlassCard>
        ) : (
          // Success state
          <GlassCard style={styles.successCard}>
            <View style={styles.successContent}>
              <View style={styles.successIcon}>
                <Ionicons name="mail" size={48} color={Colors.primary[500]} />
              </View>
              <Text style={styles.successTitle}>Email Sent!</Text>
              <Text style={styles.successMessage}>
                We've sent password reset instructions to:
              </Text>
              <Text style={styles.emailDisplay}>{email}</Text>
              <Text style={styles.successInstructions}>
                Please check your email and click the reset link to create a new password.
              </Text>

              <GlassButton
                title="Back to Sign In"
                onPress={handleBackToLogin}
                variant="primary"
                size="large"
                fullWidth
                gradient
                gradientColors={Colors.gradients.primary}
                style={styles.backButton}
              />
            </View>
          </GlassCard>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/**
 * StyleSheet following established design patterns
 * Uses consistent spacing, typography, and color schemes
 * Implements responsive design and glassmorphism effects
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.component.screen.horizontal,
    paddingVertical: Spacing.component.screen.vertical,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing['4xl'],
  },
  backButton: {
    padding: Spacing.md,
    marginRight: Spacing.lg,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    ...Typography.styles.h1,
    color: Colors.text.white,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  subtitle: {
    ...Typography.styles.body,
    color: Colors.text.white,
    textAlign: 'center',
    opacity: 0.9,
  },
  formCard: {
    marginBottom: Spacing['3xl'],
  },
  form: {
    gap: Spacing.lg,
  },
  inputGroup: {
    gap: Spacing.sm,
  },
  label: {
    ...Typography.styles.label,
    color: Colors.text.primary,
  },
  input: {
    ...Typography.styles.body,
    backgroundColor: Colors.background.secondary,
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderRadius: Spacing.component.radius.md,
    paddingHorizontal: Spacing.component.input.paddingHorizontal,
    paddingVertical: Spacing.component.input.paddingVertical,
    color: Colors.text.primary,
  },
  inputError: {
    borderColor: Colors.semantic.error,
    borderWidth: 2,
  },
  fieldErrorText: {
    ...Typography.styles.caption,
    color: Colors.semantic.error,
    marginTop: Spacing.xs,
  },
  errorText: {
    ...Typography.styles.caption,
    color: Colors.semantic.error,
    textAlign: 'center',
    backgroundColor: Colors.semantic.errorBackground,
    padding: Spacing.md,
    borderRadius: Spacing.component.radius.sm,
  },
  resetButton: {
    marginTop: Spacing.lg,
  },
  helpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  helpText: {
    ...Typography.styles.body,
    fontSize: Math.min(Typography.sizes.sm, width * 0.035),
    color: Colors.text.secondary,
  },
  linkText: {
    ...Typography.styles.button,
    fontSize: Math.min(Typography.sizes.sm, width * 0.035),
    color: Colors.primary[500],
    textDecorationLine: 'underline',
  },
  successCard: {
    marginBottom: Spacing['3xl'],
  },
  successContent: {
    alignItems: 'center',
    gap: Spacing.lg,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.glass.turquoise,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  successTitle: {
    ...Typography.styles.h2,
    color: Colors.text.primary,
    textAlign: 'center',
  },
  successMessage: {
    ...Typography.styles.body,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  emailDisplay: {
    ...Typography.styles.body,
    color: Colors.primary[500],
    fontWeight: Typography.weights.semiBold,
    textAlign: 'center',
  },
  successInstructions: {
    ...Typography.styles.body,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: Typography.lineHeights.relaxed,
  },
});
