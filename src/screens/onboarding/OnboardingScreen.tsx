import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  FlatList,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard, GlassButton } from '../../components/ui';
import { Colors, Typography, Spacing } from '../../constants';

const { width, height } = Dimensions.get('window');

interface OnboardingScreenProps {
  onComplete: () => void;
}

const onboardingData = [
  {
    id: 1,
    title: 'Discover Your Style',
    subtitle: 'Explore thousands of fashion items curated by AI to match your unique taste and preferences.',
    icon: 'search',
    gradient: Colors.gradients.primary,
  },
  {
    id: 2,
    title: 'Virtual Try-On',
    subtitle: 'Experience clothes in AR before you buy. See how they look and fit with our advanced 3D technology.',
    icon: 'camera',
    gradient: Colors.gradients.holographic,
  },
  {
    id: 3,
    title: 'Smart Wardrobe',
    subtitle: 'Organize your digital closet, track your style analytics, and get AI-powered outfit recommendations.',
    icon: 'shirt',
    gradient: Colors.gradients.dark,
  },
  {
    id: 4,
    title: 'Seamless Shopping',
    subtitle: 'Shop with confidence using secure payments, easy returns, and personalized recommendations.',
    icon: 'card',
    gradient: Colors.gradients.light,
  },
];

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      flatListRef.current?.scrollToIndex({ index: prevIndex, animated: true });
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const renderOnboardingItem = ({ item, index }: { item: any; index: number }) => (
    <View style={styles.slide}>
      <LinearGradient
        colors={item.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      
      <View style={styles.content}>
        <GlassCard style={styles.iconCard}>
          <Ionicons name={item.icon} size={64} color={Colors.primary[500]} />
        </GlassCard>
        
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
      </View>
    </View>
  );

  const renderPagination = () => (
    <View style={styles.pagination}>
      {onboardingData.map((_, index) => {
        const inputRange = [
          (index - 1) * width,
          index * width,
          (index + 1) * width,
        ];

        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [8, 24, 8],
          extrapolate: 'clamp',
        });

        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.3, 1, 0.3],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              {
                width: dotWidth,
                opacity,
              },
            ]}
          />
        );
      })}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderOnboardingItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      />

      {renderPagination()}

      <View style={styles.footer}>
        <View style={styles.buttonContainer}>
          {currentIndex > 0 && (
            <GlassButton
              title="Previous"
              variant="outline"
              size="medium"
              onPress={handlePrevious}
              style={styles.previousButton}
            />
          )}
          
          <GlassButton
            title={currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
            variant="primary"
            size="large"
            gradient
            gradientColors={Colors.gradients.primary}
            onPress={handleNext}
            style={styles.nextButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: Spacing.component.screen.horizontal,
    paddingTop: Spacing.lg,
  },
  skipButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  skipText: {
    ...Typography.styles.button,
    color: Colors.text.secondary,
  },
  slide: {
    width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: Spacing.component.screen.horizontal,
  },
  iconCard: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing['4xl'],
  },
  title: {
    ...Typography.styles.h1,
    fontSize: Math.min(Typography.sizes['2xl'], width * 0.08),
    color: Colors.text.white,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  subtitle: {
    ...Typography.styles.body,
    fontSize: Math.min(Typography.sizes.base, width * 0.04),
    color: Colors.text.white,
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: Math.min(Typography.lineHeights.relaxed * Typography.sizes.base, width * 0.05),
    paddingHorizontal: Spacing.lg,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing['2xl'],
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.text.white,
    marginHorizontal: 4,
  },
  footer: {
    paddingHorizontal: Spacing.component.screen.horizontal,
    paddingBottom: Spacing['4xl'],
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previousButton: {
    flex: 0.3,
  },
  nextButton: {
    flex: 0.65,
  },
});
