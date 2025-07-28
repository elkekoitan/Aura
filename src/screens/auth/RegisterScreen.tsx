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
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { GlassCard, GlassButton } from '../../components/ui';
import { Colors, Typography, Spacing } from '../../constants';
import { useAppDispatch, useAppSelector } from '../../store';
import { signUp, clearError } from '../../store/slices/authSlice';

const { width, height } = Dimensions.get('window');

export default function RegisterScreen() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  // Form state management with TypeScript types
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Form validation state
  const [validationErrors, setValidationErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  // Email validation regex pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Clear any existing errors when component mounts
  React.useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  /**
   * Validates individual form fields
   * Uses comprehensive validation rules for user registration
   */
  const validateField = (field: string, value: string): string | undefined => {
    switch (field) {
      case 'fullName':
        if (!value.trim()) return 'Full name is required';
        if (value.trim().length < 2) return 'Full name must be at least 2 characters';
        return undefined;

      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!emailRegex.test(value.trim())) return 'Please enter a valid email address';
        return undefined;

      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        if (!/(?=.*[a-z])(?=.*[A-Z])/.test(value)) {
          return 'Password must contain both uppercase and lowercase letters';
        }
        return undefined;

      case 'confirmPassword':
        if (!value) return 'Please confirm your password';
        if (value !== formData.password) return 'Passwords do not match';
        return undefined;

      default:
        return undefined;
    }
  };

  /**
   * Handles form field updates with real-time validation
   * Integrates with React state management and validation system
   */
  const handleFieldChange = (field: keyof typeof formData, value: string) => {
    // Update form data
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear validation error for this field when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  /**
   * Validates entire form before submission
   * Returns true if form is valid, false otherwise
   */
  const validateForm = (): boolean => {
    const errors: typeof validationErrors = {};

    // Validate all fields
    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field as keyof typeof formData]);
      if (error) {
        errors[field as keyof typeof validationErrors] = error;
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handles user registration with Supabase integration
   * Uses Redux Toolkit async thunk for state management
   * Implements comprehensive error handling and user feedback
   */
  const handleRegister = async () => {
    // Validate form before submission
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please correct the errors below');
      return;
    }

    try {
      // Dispatch signUp action using Redux Toolkit
      // This integrates with Supabase auth and creates user profile
      const result = await dispatch(signUp({
        email: formData.email.trim(),
        password: formData.password,
        fullName: formData.fullName.trim(),
      })).unwrap();

      // Show success message with email verification instructions
      Alert.alert(
        'Registration Successful! 🎉',
        `Welcome to Aura, ${formData.fullName}!\n\nPlease check your email (${formData.email}) to verify your account before signing in.`,
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login' as never),
          },
        ]
      );
    } catch (error: any) {
      // Handle registration errors with user-friendly messages
      let errorMessage = 'Registration failed. Please try again.';

      if (error.message?.includes('already registered')) {
        errorMessage = 'This email is already registered. Please sign in instead.';
      } else if (error.message?.includes('invalid email')) {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.message?.includes('weak password')) {
        errorMessage = 'Password is too weak. Please choose a stronger password.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert('Registration Failed', errorMessage);
    }
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
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join the Aura fashion community</Text>
          </View>

          <GlassCard style={styles.formCard}>
            <View style={styles.form}>
              {/* Full Name Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={[
                    styles.input,
                    validationErrors.fullName && styles.inputError
                  ]}
                  value={formData.fullName}
                  onChangeText={(value) => handleFieldChange('fullName', value)}
                  placeholder="Enter your full name"
                  placeholderTextColor={Colors.text.muted}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
                {validationErrors.fullName && (
                  <Text style={styles.fieldErrorText}>{validationErrors.fullName}</Text>
                )}
              </View>

              {/* Email Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={[
                    styles.input,
                    validationErrors.email && styles.inputError
                  ]}
                  value={formData.email}
                  onChangeText={(value) => handleFieldChange('email', value)}
                  placeholder="Enter your email"
                  placeholderTextColor={Colors.text.muted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {validationErrors.email && (
                  <Text style={styles.fieldErrorText}>{validationErrors.email}</Text>
                )}
              </View>

              {/* Password Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={[
                    styles.input,
                    validationErrors.password && styles.inputError
                  ]}
                  value={formData.password}
                  onChangeText={(value) => handleFieldChange('password', value)}
                  placeholder="Create a strong password"
                  placeholderTextColor={Colors.text.muted}
                  secureTextEntry
                  autoCapitalize="none"
                />
                {validationErrors.password && (
                  <Text style={styles.fieldErrorText}>{validationErrors.password}</Text>
                )}
              </View>

              {/* Confirm Password Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                  style={[
                    styles.input,
                    validationErrors.confirmPassword && styles.inputError
                  ]}
                  value={formData.confirmPassword}
                  onChangeText={(value) => handleFieldChange('confirmPassword', value)}
                  placeholder="Confirm your password"
                  placeholderTextColor={Colors.text.muted}
                  secureTextEntry
                  autoCapitalize="none"
                />
                {validationErrors.confirmPassword && (
                  <Text style={styles.fieldErrorText}>{validationErrors.confirmPassword}</Text>
                )}
              </View>

              {/* Global Error Display */}
              {error && (
                <Text style={styles.errorText}>{error}</Text>
              )}

              {/* Register Button */}
              <GlassButton
                title="Create Account"
                onPress={handleRegister}
                loading={loading}
                variant="primary"
                size="large"
                fullWidth
                gradient
                gradientColors={Colors.gradients.primary}
                style={styles.registerButton}
              />

              {/* Navigation Links */}
              <View style={styles.linkContainer}>
                <Text style={styles.linkPrompt}>Already have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login' as never)}>
                  <Text style={styles.linkText}>Sign In</Text>
                </TouchableOpacity>
              </View>

              {/* Legal Agreement */}
              <View style={styles.legalContainer}>
                <Text style={styles.legalText}>By creating an account, you agree to our </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Terms' as never)}>
                  <Text style={styles.legalLink}>Terms of Service</Text>
                </TouchableOpacity>
                <Text style={styles.legalText}> and </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Privacy' as never)}>
                  <Text style={styles.legalLink}>Privacy Policy</Text>
                </TouchableOpacity>
              </View>
            </View>
          </GlassCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/**
 * StyleSheet following established design patterns from LoginScreen
 * Uses consistent spacing, typography, and color schemes
 * Implements responsive design for different screen sizes
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.component.screen.horizontal,
    paddingVertical: Spacing.component.screen.vertical,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: Spacing['2xl'], // Extra padding for keyboard
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing['4xl'],
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
  registerButton: {
    marginTop: Spacing.lg,
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Math.max(Spacing.lg, height * 0.02),
    gap: Spacing.sm,
  },
  linkPrompt: {
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
  legalContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Math.max(Spacing.lg, height * 0.02),
    paddingHorizontal: Spacing.md,
  },
  legalText: {
    ...Typography.styles.caption,
    fontSize: Math.min(Typography.sizes.xs, width * 0.03),
    color: Colors.text.secondary,
  },
  legalLink: {
    ...Typography.styles.caption,
    fontSize: Math.min(Typography.sizes.xs, width * 0.03),
    color: Colors.primary[500],
    textDecorationLine: 'underline',
  },
});
