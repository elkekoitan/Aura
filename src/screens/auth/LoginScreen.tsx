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
import { GlassCard, GlassButton } from '../../components/ui';
import { Colors, Typography, Spacing } from '../../constants';
import { useAppDispatch, useAppSelector } from '../../store';
import { signIn, clearError } from '../../store/slices/authSlice';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Clear any existing errors when component mounts
  React.useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await dispatch(signIn({ email, password })).unwrap();
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'An error occurred');
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

            {/* Navigation Links */}
            <View style={styles.linkContainer}>
              <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword' as never)}>
                <Text style={styles.linkText}>Forgot Password?</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => navigation.navigate('Register' as never)}>
                <Text style={styles.linkText}>Create Account</Text>
              </TouchableOpacity>
            </View>

            {/* Legal Links */}
            <View style={styles.legalContainer}>
              <Text style={styles.legalText}>By signing in, you agree to our </Text>
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
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Math.max(Spacing.lg, height * 0.02),
    paddingHorizontal: Spacing.md,
  },
  linkText: {
    ...Typography.styles.button,
    fontSize: Math.min(Typography.sizes.sm, width * 0.035),
    color: Colors.primary[500],
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
