import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Animated } from 'react-native';
import { GlassCard, GlassButton } from '../../components/ui';
import { Colors, Typography, Spacing } from '../../constants';

const { width, height } = Dimensions.get('window');

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onGetStarted }) => {
  // Animation values
  const logoScale = React.useRef(new Animated.Value(0)).current;
  const logoOpacity = React.useRef(new Animated.Value(0)).current;
  const titleTranslateY = React.useRef(new Animated.Value(50)).current;
  const titleOpacity = React.useRef(new Animated.Value(0)).current;
  const subtitleTranslateY = React.useRef(new Animated.Value(50)).current;
  const subtitleOpacity = React.useRef(new Animated.Value(0)).current;
  const buttonTranslateY = React.useRef(new Animated.Value(50)).current;
  const buttonOpacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    // Sequence animations
    Animated.sequence([
      Animated.delay(300),
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 800, useNativeDriver: true }),
      ]),
    ]).start();

    Animated.sequence([
      Animated.delay(800),
      Animated.parallel([
        Animated.spring(titleTranslateY, { toValue: 0, useNativeDriver: true }),
        Animated.timing(titleOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
    ]).start();

    Animated.sequence([
      Animated.delay(1200),
      Animated.parallel([
        Animated.spring(subtitleTranslateY, { toValue: 0, useNativeDriver: true }),
        Animated.timing(subtitleOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
    ]).start();

    Animated.sequence([
      Animated.delay(1600),
      Animated.parallel([
        Animated.spring(buttonTranslateY, { toValue: 0, useNativeDriver: true }),
        Animated.timing(buttonOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={Colors.gradients.holographic}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Content */}
      <View style={styles.content}>
        {/* Logo Section */}
        <Animated.View style={[
          styles.logoSection,
          {
            transform: [{ scale: logoScale }],
            opacity: logoOpacity,
          }
        ]}>
          <GlassCard
            style={styles.logoCard}
            gradient={true}
            gradientColors={Colors.gradients.primary}
            intensity={30}
          >
            <Text style={styles.logoText}>AURA</Text>
            <Text style={styles.logoSubtext}>Digital Fashion</Text>
          </GlassCard>
        </Animated.View>

        {/* Title Section */}
        <Animated.View style={[
          styles.titleSection,
          {
            transform: [{ translateY: titleTranslateY }],
            opacity: titleOpacity,
          }
        ]}>
          <Text style={styles.title}>Welcome to Your{'\n'}Digital Fashion Aura</Text>
        </Animated.View>

        {/* Subtitle Section */}
        <Animated.View style={[
          styles.subtitleSection,
          {
            transform: [{ translateY: subtitleTranslateY }],
            opacity: subtitleOpacity,
          }
        ]}>
          <Text style={styles.subtitle}>
            Discover, try on, and style designer fashion with AI-powered virtual try-on technology
          </Text>
        </Animated.View>

        {/* Features */}
        <View style={styles.featuresSection}>
          <GlassCard style={styles.featureCard} intensity={15}>
            <Text style={styles.featureText}>✨ AI-Powered Styling</Text>
          </GlassCard>
          <GlassCard style={styles.featureCard} intensity={15}>
            <Text style={styles.featureText}>👗 Virtual Try-On</Text>
          </GlassCard>
          <GlassCard style={styles.featureCard} intensity={15}>
            <Text style={styles.featureText}>🎨 Personalized Looks</Text>
          </GlassCard>
        </View>

        {/* Button Section */}
        <Animated.View style={[
          styles.buttonSection,
          {
            transform: [{ translateY: buttonTranslateY }],
            opacity: buttonOpacity,
          }
        ]}>
          <GlassButton
            title="Get Started"
            onPress={onGetStarted}
            variant="primary"
            size="large"
            fullWidth
            gradient={true}
            gradientColors={Colors.gradients.primary}
          />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.component.screen.horizontal,
    paddingVertical: Spacing.component.screen.vertical,
    justifyContent: 'space-between',
  },
  logoSection: {
    alignItems: 'center',
    marginTop: height * 0.1,
  },
  logoCard: {
    paddingHorizontal: Spacing['4xl'],
    paddingVertical: Spacing['3xl'],
    alignItems: 'center',
  },
  logoText: {
    ...Typography.styles.h1,
    fontSize: Typography.sizes['5xl'],
    fontWeight: Typography.weights.black,
    color: Colors.text.white,
    letterSpacing: Typography.letterSpacing.wider,
  },
  logoSubtext: {
    ...Typography.styles.caption,
    color: Colors.text.white,
    marginTop: Spacing.xs,
    letterSpacing: Typography.letterSpacing.wide,
  },
  titleSection: {
    alignItems: 'center',
    marginTop: Spacing['4xl'],
  },
  title: {
    ...Typography.styles.h2,
    fontSize: Typography.sizes['3xl'],
    color: Colors.text.white,
    textAlign: 'center',
    lineHeight: Typography.lineHeights.tight * Typography.sizes['3xl'],
  },
  subtitleSection: {
    alignItems: 'center',
    marginTop: Spacing['2xl'],
    paddingHorizontal: Spacing.lg,
  },
  subtitle: {
    ...Typography.styles.body,
    color: Colors.text.white,
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: Typography.lineHeights.relaxed * Typography.sizes.base,
  },
  featuresSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing['4xl'],
    gap: Spacing.md,
  },
  featureCard: {
    flex: 1,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
  },
  featureText: {
    ...Typography.styles.bodySmall,
    color: Colors.text.white,
    textAlign: 'center',
    fontWeight: Typography.weights.medium,
  },
  buttonSection: {
    marginBottom: Spacing['2xl'],
  },
});

export default WelcomeScreen;
