import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassCard, GlassButton } from '../../components/ui';
import { Colors, Typography, Spacing } from '../../constants';
import { useAppDispatch, useAppSelector } from '../../store';
import { signOut } from '../../store/slices/authSlice';

const { width, height } = Dimensions.get('window');

export default function ProfileScreen() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { user, profile } = useAppSelector((state) => state.auth);

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(signOut()).unwrap();
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out');
            }
          },
        },
      ]
    );
  };

  const handleStripeTest = () => {
    navigation.navigate('StripeTest' as never);
  };

  const handleAdminAccess = () => {
    navigation.navigate('AdminDashboard' as never);
  };

  const handleOrderHistory = () => {
    navigation.navigate('OrderHistory' as never);
  };

  const handleEditProfile = () => {
    navigation.navigate('ProfileEdit' as never);
  };

  const handleStylePreferences = () => {
    navigation.navigate('StylePreferences' as never);
  };

  const handleBodyMeasurements = () => {
    navigation.navigate('BodyMeasurements' as never);
  };

  const handleTryOnHistory = () => {
    navigation.navigate('TryOnHistory' as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={Colors.gradients.light}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.content}>
        {/* Profile Header */}
        <GlassCard style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Image
                source={{
                  uri: profile?.avatar_url || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
                }}
                style={styles.avatar}
              />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                {profile?.full_name || user?.email?.split('@')[0] || 'Fashion Lover'}
              </Text>
              <Text style={styles.profileEmail}>{user?.email}</Text>
            </View>
          </View>
        </GlassCard>

        {/* Profile Actions */}
        <View style={styles.actionsSection}>
          <GlassCard style={styles.actionsCard}>
            <Text style={styles.actionsTitle}>Account</Text>

            <TouchableOpacity
              style={styles.actionItem}
              activeOpacity={0.7}
              onPress={handleOrderHistory}
            >
              <Ionicons name="bag-outline" size={24} color={Colors.primary[500]} />
              <Text style={styles.actionText}>Order History</Text>
              <Ionicons name="chevron-forward" size={20} color={Colors.text.secondary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionItem}
              activeOpacity={0.7}
              onPress={handleTryOnHistory}
            >
              <Ionicons name="camera-outline" size={24} color={Colors.primary[500]} />
              <Text style={styles.actionText}>Try-On History</Text>
              <Ionicons name="chevron-forward" size={20} color={Colors.text.secondary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionItem}
              activeOpacity={0.7}
              onPress={handleEditProfile}
            >
              <Ionicons name="person-outline" size={24} color={Colors.primary[500]} />
              <Text style={styles.actionText}>Edit Profile</Text>
              <Ionicons name="chevron-forward" size={20} color={Colors.text.secondary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionItem}
              activeOpacity={0.7}
              onPress={handleStylePreferences}
            >
              <Ionicons name="color-palette-outline" size={24} color={Colors.primary[500]} />
              <Text style={styles.actionText}>Style Preferences</Text>
              <Ionicons name="chevron-forward" size={20} color={Colors.text.secondary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionItem}
              activeOpacity={0.7}
              onPress={handleBodyMeasurements}
            >
              <Ionicons name="resize-outline" size={24} color={Colors.primary[500]} />
              <Text style={styles.actionText}>Body Measurements</Text>
              <Ionicons name="chevron-forward" size={20} color={Colors.text.secondary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionItem} activeOpacity={0.7}>
              <Ionicons name="settings-outline" size={24} color={Colors.primary[500]} />
              <Text style={styles.actionText}>Settings</Text>
              <Ionicons name="chevron-forward" size={20} color={Colors.text.secondary} />
            </TouchableOpacity>
          </GlassCard>
        </View>

        {/* Developer Options */}
        <View style={styles.developerSection}>
          <GlassCard style={styles.developerCard}>
            <Text style={styles.developerTitle}>🧪 Developer Options</Text>
            <GlassButton
              title="Admin Dashboard"
              variant="primary"
              size="medium"
              fullWidth
              gradient
              gradientColors={Colors.gradients.primary}
              onPress={handleAdminAccess}
              style={styles.adminButton}
            />
            <GlassButton
              title="Test Stripe Payments"
              variant="outline"
              size="medium"
              fullWidth
              onPress={handleStripeTest}
              style={styles.stripeButton}
            />
          </GlassCard>
        </View>

        {/* Sign Out */}
        <View style={styles.signOutSection}>
          <GlassButton
            title="Sign Out"
            variant="outline"
            size="large"
            fullWidth
            onPress={handleSignOut}
            style={styles.signOutButton}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Math.max(Spacing.component.screen.horizontal, width * 0.05),
    paddingVertical: Math.max(Spacing['2xl'], height * 0.03),
    justifyContent: 'space-between',
  },
  profileCard: {
    marginBottom: Math.max(Spacing['2xl'], height * 0.03),
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: Math.max(Spacing.lg, height * 0.02),
  },
  avatarContainer: {
    marginBottom: Math.max(Spacing.lg, height * 0.02),
  },
  avatar: {
    width: Math.min(100, width * 0.25),
    height: Math.min(100, width * 0.25),
    borderRadius: Math.min(50, width * 0.125),
    borderWidth: 3,
    borderColor: Colors.primary[500],
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    ...Typography.styles.h2,
    fontSize: Math.min(Typography.sizes['2xl'], width * 0.06),
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  profileEmail: {
    ...Typography.styles.body,
    fontSize: Math.min(Typography.sizes.base, width * 0.04),
    color: Colors.text.secondary,
    textAlign: 'center',
  },

  // Actions section
  actionsSection: {
    marginBottom: Spacing.lg,
  },
  actionsCard: {
    padding: Spacing.lg,
  },
  actionsTitle: {
    ...Typography.styles.h6,
    color: Colors.text.primary,
    fontWeight: Typography.weights.semiBold,
    marginBottom: Spacing.lg,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  actionText: {
    ...Typography.styles.body,
    color: Colors.text.primary,
    flex: 1,
    marginLeft: Spacing.md,
  },

  developerSection: {
    marginBottom: Math.max(Spacing['2xl'], height * 0.03),
  },
  developerCard: {
    paddingVertical: Math.max(Spacing.lg, height * 0.02),
    alignItems: 'center',
  },
  developerTitle: {
    ...Typography.styles.h5,
    fontSize: Math.min(Typography.sizes.lg, width * 0.045),
    color: Colors.text.primary,
    marginBottom: Math.max(Spacing.md, height * 0.015),
    textAlign: 'center',
  },
  adminButton: {
    marginBottom: Spacing.md,
  },
  stripeButton: {
    marginTop: 0,
  },
  signOutSection: {
    marginBottom: Math.max(Spacing['4xl'], height * 0.05),
  },
  signOutButton: {
    borderColor: Colors.semantic.error,
  },
});
