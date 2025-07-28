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
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassCard, GlassButton } from '../../src/components/ui';
import { Colors, Typography, Spacing } from '../../src/constants';
import { useAppDispatch, useAppSelector } from '../../src/store';
import { resetPassword } from '../../src/store/slices/authSlice';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  
  const [email, setEmail] = useState('');

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    try {
      await dispatch(resetPassword({ email })).unwrap();
      Alert.alert(
        'Success',
        'Password reset instructions have been sent to your email.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'An error occurred');
    }
  };

  const handleBackToLogin = () => {
    router.back();
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
        <View style={styles.header}>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            Enter your email address and we'll send you instructions to reset your password.
          </Text>
        </View>

        <GlassCard style={styles.formCard}>
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor={Colors.text.muted}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}

            <GlassButton
              title="Send Reset Instructions"
              onPress={handleResetPassword}
              loading={loading}
              variant="primary"
              size="large"
              fullWidth
              gradient
              gradientColors={Colors.gradients.primary}
              style={styles.resetButton}
            />
          </View>
        </GlassCard>

        <View style={styles.footer}>
          <GlassButton
            title="Back to Sign In"
            onPress={handleBackToLogin}
            variant="outline"
            size="medium"
            fullWidth
            style={styles.backButton}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

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
    lineHeight: Typography.lineHeights.relaxed * Typography.sizes.base,
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
  errorText: {
    ...Typography.styles.caption,
    color: Colors.semantic.error,
    textAlign: 'center',
  },
  resetButton: {
    marginTop: Spacing.lg,
  },
  footer: {
    alignItems: 'center',
  },
  backButton: {
    marginTop: Spacing.sm,
  },
});
