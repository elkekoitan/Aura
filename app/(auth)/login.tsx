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
import { signIn } from '../../src/store/slices/authSlice';

export default function LoginScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await dispatch(signIn({ email, password })).unwrap();
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'An error occurred');
    }
  };

  const handleRegister = () => {
    router.push('/(auth)/register');
  };

  const handleForgotPassword = () => {
    router.push('/(auth)/forgot-password');
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
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to your Aura account</Text>
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

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor={Colors.text.muted}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}

            <GlassButton
              title="Sign In"
              onPress={handleLogin}
              loading={loading}
              variant="primary"
              size="large"
              fullWidth
              gradient
              gradientColors={Colors.gradients.primary}
              style={styles.loginButton}
            />

            <GlassButton
              title="Forgot Password?"
              onPress={handleForgotPassword}
              variant="ghost"
              size="medium"
              fullWidth
              style={styles.forgotButton}
            />
          </View>
        </GlassCard>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <GlassButton
            title="Create Account"
            onPress={handleRegister}
            variant="outline"
            size="medium"
            fullWidth
            style={styles.registerButton}
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
  loginButton: {
    marginTop: Spacing.lg,
  },
  forgotButton: {
    marginTop: Spacing.sm,
  },
  footer: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  footerText: {
    ...Typography.styles.body,
    color: Colors.text.white,
    textAlign: 'center',
  },
  registerButton: {
    marginTop: Spacing.sm,
  },
});
