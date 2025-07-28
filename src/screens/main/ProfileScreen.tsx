import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassCard, GlassButton } from '../../components/ui';
import { Colors, Typography, Spacing } from '../../constants';
import { useAppDispatch, useAppSelector } from '../../store';
import { signOut } from '../../store/slices/authSlice';

export default function ProfileScreen() {
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
    paddingHorizontal: Spacing.component.screen.horizontal,
    paddingVertical: Spacing['2xl'],
    justifyContent: 'space-between',
  },
  profileCard: {
    marginBottom: Spacing['2xl'],
  },
  profileHeader: {
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: Spacing.lg,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: Colors.primary[500],
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    ...Typography.styles.h2,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  profileEmail: {
    ...Typography.styles.body,
    color: Colors.text.secondary,
  },
  signOutSection: {
    marginBottom: Spacing['4xl'],
  },
  signOutButton: {
    borderColor: Colors.semantic.error,
  },
});
