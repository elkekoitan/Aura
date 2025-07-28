import React, { useState, useEffect } from 'react';
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
  Animated,
  StatusBar,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { GlassCard, GlassButton } from '../../components/ui';
import { Colors, Typography, Spacing } from '../../constants';

const { width, height } = Dimensions.get('window');

export default function ForgotPasswordScreen() {
  const navigation = useNavigation();
  
  const [email, setEmail] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Animations
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setIsEmailSent(true);
    }, 2000);
  };

  const handleResendEmail = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', 'Reset email sent again!');
    }, 1000);
  };

  if (isEmailSent) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <LinearGradient
          colors={Colors.gradients.holographic}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />

        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={Colors.text.white} />
            </TouchableOpacity>
          </View>

          {/* Success Content */}
          <View style={styles.successContainer}>
            <View style={styles.successIcon}>
              <Ionicons name="mail" size={60} color={Colors.accent[400]} />
            </View>
            
            <Text style={styles.successTitle}>Check Your Email</Text>
            <Text style={styles.successSubtitle}>
              We've sent a password reset link to{'\n'}
              <Text style={styles.emailText}>{email}</Text>
            </Text>

            <GlassCard style={styles.instructionCard}>
              <Text style={styles.instructionTitle}>What's next?</Text>
              <View style={styles.instructionStep}>
                <Ionicons name="checkmark-circle" size={20} color={Colors.accent[400]} />
                <Text style={styles.instructionText}>Check your email inbox</Text>
              </View>
              <View style={styles.instructionStep}>
                <Ionicons name="checkmark-circle" size={20} color={Colors.accent[400]} />
                <Text style={styles.instructionText}>Click the reset link</Text>
              </View>
              <View style={styles.instructionStep}>
                <Ionicons name="checkmark-circle" size={20} color={Colors.accent[400]} />
                <Text style={styles.instructionText}>Create a new password</Text>
              </View>
            </GlassCard>

            <View style={styles.actionButtons}>
              <GlassButton
                title="Open Email App"
                onPress={() => Alert.alert('Info', 'This would open your email app')}
                gradient
                gradientColors={Colors.gradients.primary}
                style={styles.emailButton}
              />

              <GlassButton
                title={loading ? "Sending..." : "Resend Email"}
                onPress={handleResendEmail}
                variant="outline"
                disabled={loading}
                style={styles.resendButton}
              />
            </View>

            <TouchableOpacity
              style={styles.backToLogin}
              onPress={() => navigation.navigate('Login' as never)}
            >
              <Text style={styles.backToLoginText}>Back to Sign In</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={Colors.gradients.holographic}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="arrow-back" size={24} color={Colors.text.white} />
              </TouchableOpacity>
            </View>

            {/* Main Content */}
            <View style={styles.mainContent}>
              <View style={styles.iconContainer}>
                <Ionicons name="lock-closed" size={60} color={Colors.accent[400]} />
              </View>

              <Text style={styles.title}>Forgot Password?</Text>
              <Text style={styles.subtitle}>
                No worries! Enter your email address and we'll send you a link to reset your password.
              </Text>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <GlassCard style={[
                  styles.inputCard,
                  focusedField === 'email' && styles.inputCardFocused
                ]}>
                  <View style={styles.inputWrapper}>
                    <Ionicons 
                      name="mail" 
                      size={20} 
                      color={focusedField === 'email' ? Colors.accent[400] : Colors.text.white} 
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your email"
                      placeholderTextColor={Colors.text.white + '60'}
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                    />
                  </View>
                </GlassCard>
              </View>

              {/* Reset Button */}
              <GlassButton
                title={loading ? "Sending Reset Link..." : "Send Reset Link"}
                onPress={handleResetPassword}
                disabled={loading}
                gradient
                gradientColors={Colors.gradients.primary}
                style={styles.resetButton}
              />

              {/* Back to Login */}
              <TouchableOpacity
                style={styles.backToLogin}
                onPress={() => navigation.navigate('Login' as never)}
              >
                <Ionicons name="arrow-back" size={16} color={Colors.accent[400]} />
                <Text style={styles.backToLoginText}>Back to Sign In</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    position: 'absolute',
    top: Spacing.lg,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContent: {
    alignItems: 'center',
    paddingTop: Spacing.xl * 2,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    ...Typography.styles.h1,
    color: Colors.text.white,
    textAlign: 'center',
    marginBottom: Spacing.md,
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    ...Typography.styles.body,
    color: Colors.text.white,
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: Spacing.xl,
    lineHeight: 24,
    paddingHorizontal: Spacing.md,
  },
  inputContainer: {
    width: '100%',
    marginBottom: Spacing.xl,
  },
  inputCard: {
    padding: 0,
    overflow: 'hidden',
  },
  inputCardFocused: {
    borderColor: Colors.accent[400],
    borderWidth: 2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  inputIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    color: Colors.text.white,
    fontSize: 16,
    fontWeight: '500',
  },
  resetButton: {
    width: '100%',
    marginBottom: Spacing.xl,
  },
  backToLogin: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  backToLoginText: {
    ...Typography.styles.body,
    color: Colors.accent[400],
    fontWeight: '600',
  },
  // Success screen styles
  successContainer: {
    alignItems: 'center',
    paddingTop: Spacing.xl * 2,
    paddingHorizontal: Spacing.lg,
  },
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  successTitle: {
    ...Typography.styles.h1,
    color: Colors.text.white,
    textAlign: 'center',
    marginBottom: Spacing.md,
    fontSize: 28,
    fontWeight: '700',
  },
  successSubtitle: {
    ...Typography.styles.body,
    color: Colors.text.white,
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: Spacing.xl,
    lineHeight: 24,
  },
  emailText: {
    color: Colors.accent[400],
    fontWeight: '600',
  },
  instructionCard: {
    width: '100%',
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  instructionTitle: {
    ...Typography.styles.h3,
    color: Colors.text.white,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  instructionStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  instructionText: {
    ...Typography.styles.body,
    color: Colors.text.white,
    marginLeft: Spacing.sm,
    opacity: 0.9,
  },
  actionButtons: {
    width: '100%',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  emailButton: {
    width: '100%',
  },
  resendButton: {
    width: '100%',
  },
});
