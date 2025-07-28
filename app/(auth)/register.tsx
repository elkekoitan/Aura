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
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassCard, GlassButton } from '../../src/components/ui';
import { Colors, Typography, Spacing } from '../../src/constants';
import { useAppDispatch, useAppSelector } from '../../src/store';
import { signUp } from '../../src/store/slices/authSlice';

export default function RegisterScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    const { fullName, email, password, confirmPassword } = formData;

    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    try {
      await dispatch(signUp({ email, password, fullName })).unwrap();
      Alert.alert(
        'Success',
        'Account created successfully! Please check your email to verify your account.',
        [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }]
      );
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message || 'An error occurred');
    }
  };

  const handleLogin = () => {
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
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join the Aura fashion community</Text>
          </View>

          <GlassCard style={styles.formCard}>
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  value={formData.fullName}
                  onChangeText={(value) => handleInputChange('fullName', value)}
                  placeholder="Enter your full name"
                  placeholderTextColor={Colors.text.muted}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
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
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  placeholder="Create a password"
                  placeholderTextColor={Colors.text.muted}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                  style={styles.input}
                  value={formData.confirmPassword}
                  onChangeText={(value) => handleInputChange('confirmPassword', value)}
                  placeholder="Confirm your password"
                  placeholderTextColor={Colors.text.muted}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>

              {error && (
                <Text style={styles.errorText}>{error}</Text>
              )}

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
            </View>
          </GlassCard>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <GlassButton
              title="Sign In"
              onPress={handleLogin}
              variant="outline"
              size="medium"
              fullWidth
              style={styles.loginButton}
            />
          </View>
        </ScrollView>
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
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing['4xl'],
    marginTop: Spacing['2xl'],
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
  registerButton: {
    marginTop: Spacing.lg,
  },
  footer: {
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing['2xl'],
  },
  footerText: {
    ...Typography.styles.body,
    color: Colors.text.white,
    textAlign: 'center',
  },
  loginButton: {
    marginTop: Spacing.sm,
  },
});
