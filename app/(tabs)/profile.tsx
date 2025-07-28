import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard, GlassButton } from '../../src/components/ui';
import { Colors, Typography, Spacing } from '../../src/constants';
import { useAppDispatch, useAppSelector } from '../../src/store';
import { signOut } from '../../src/store/slices/authSlice';

export default function ProfileScreen() {
  const router = useRouter();
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
              router.replace('/');
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out');
            }
          },
        },
      ]
    );
  };

  const menuItems = [
    {
      icon: 'person-outline',
      title: 'Edit Profile',
      subtitle: 'Update your personal information',
      onPress: () => {},
    },
    {
      icon: 'body-outline',
      title: 'Body Measurements',
      subtitle: 'Manage your size preferences',
      onPress: () => {},
    },
    {
      icon: 'color-palette-outline',
      title: 'Style Preferences',
      subtitle: 'Customize your fashion taste',
      onPress: () => {},
    },
    {
      icon: 'card-outline',
      title: 'Payment Methods',
      subtitle: 'Manage your payment options',
      onPress: () => {},
    },
    {
      icon: 'location-outline',
      title: 'Addresses',
      subtitle: 'Shipping and billing addresses',
      onPress: () => {},
    },
    {
      icon: 'notifications-outline',
      title: 'Notifications',
      subtitle: 'Manage your notification preferences',
      onPress: () => {},
    },
    {
      icon: 'shield-outline',
      title: 'Privacy & Security',
      subtitle: 'Account security settings',
      onPress: () => {},
    },
    {
      icon: 'help-circle-outline',
      title: 'Help & Support',
      subtitle: 'Get help and contact support',
      onPress: () => {},
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={Colors.gradients.light}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
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
              <View style={styles.avatarBadge}>
                <Ionicons name="camera" size={16} color={Colors.text.white} />
              </View>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                {profile?.full_name || user?.email?.split('@')[0] || 'Fashion Lover'}
              </Text>
              <Text style={styles.profileEmail}>{user?.email}</Text>
              <View style={styles.profileStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>24</Text>
                  <Text style={styles.statLabel}>Items</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>12</Text>
                  <Text style={styles.statLabel}>Looks</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>156</Text>
                  <Text style={styles.statLabel}>Followers</Text>
                </View>
              </View>
            </View>
          </View>
        </GlassCard>

        {/* Style DNA */}
        <GlassCard style={styles.styleDnaCard}>
          <Text style={styles.styleDnaTitle}>🧬 Your Style DNA</Text>
          <View style={styles.styleTags}>
            <View style={styles.styleTag}>
              <Text style={styles.styleTagText}>Minimalist</Text>
            </View>
            <View style={styles.styleTag}>
              <Text style={styles.styleTagText}>Elegant</Text>
            </View>
            <View style={styles.styleTag}>
              <Text style={styles.styleTagText}>Modern</Text>
            </View>
            <View style={styles.styleTag}>
              <Text style={styles.styleTagText}>Sustainable</Text>
            </View>
          </View>
          <GlassButton
            title="Update Style Profile"
            variant="outline"
            size="medium"
            fullWidth
            style={styles.styleDnaButton}
            onPress={() => {}}
          />
        </GlassCard>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <GlassCard key={index} style={styles.menuItem}>
              <View style={styles.menuItemContent}>
                <View style={styles.menuItemIcon}>
                  <Ionicons name={item.icon as any} size={24} color={Colors.primary[500]} />
                </View>
                <View style={styles.menuItemText}>
                  <Text style={styles.menuItemTitle}>{item.title}</Text>
                  <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={Colors.text.muted} />
              </View>
            </GlassCard>
          ))}
        </View>

        {/* App Info */}
        <GlassCard style={styles.appInfoCard}>
          <Text style={styles.appInfoTitle}>Aura - Digital Fashion</Text>
          <Text style={styles.appInfoVersion}>Version 1.0.0</Text>
          <View style={styles.appInfoLinks}>
            <GlassButton
              title="Terms of Service"
              variant="ghost"
              size="small"
              onPress={() => {}}
            />
            <GlassButton
              title="Privacy Policy"
              variant="ghost"
              size="small"
              onPress={() => {}}
            />
            <GlassButton
              title="About"
              variant="ghost"
              size="small"
              onPress={() => {}}
            />
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileCard: {
    marginHorizontal: Spacing.component.screen.horizontal,
    marginTop: Spacing['2xl'],
    marginBottom: Spacing['2xl'],
  },
  profileHeader: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Spacing.lg,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: Colors.primary[500],
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.background.primary,
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
    marginBottom: Spacing.lg,
  },
  profileStats: {
    flexDirection: 'row',
    gap: Spacing['2xl'],
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    ...Typography.styles.h3,
    color: Colors.primary[500],
  },
  statLabel: {
    ...Typography.styles.caption,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
  },
  styleDnaCard: {
    marginHorizontal: Spacing.component.screen.horizontal,
    marginBottom: Spacing['2xl'],
  },
  styleDnaTitle: {
    ...Typography.styles.h4,
    color: Colors.text.primary,
    marginBottom: Spacing.lg,
  },
  styleTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  styleTag: {
    backgroundColor: Colors.primary[100],
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Spacing.component.radius.full,
  },
  styleTagText: {
    ...Typography.styles.caption,
    color: Colors.primary[700],
    fontWeight: Typography.weights.medium,
  },
  styleDnaButton: {
    marginTop: Spacing.md,
  },
  menuSection: {
    marginHorizontal: Spacing.component.screen.horizontal,
    gap: Spacing.md,
    marginBottom: Spacing['2xl'],
  },
  menuItem: {
    paddingVertical: Spacing.md,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    ...Typography.styles.h6,
    color: Colors.text.primary,
  },
  menuItemSubtitle: {
    ...Typography.styles.caption,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
  },
  appInfoCard: {
    marginHorizontal: Spacing.component.screen.horizontal,
    marginBottom: Spacing['2xl'],
    alignItems: 'center',
  },
  appInfoTitle: {
    ...Typography.styles.h5,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  appInfoVersion: {
    ...Typography.styles.caption,
    color: Colors.text.secondary,
    marginBottom: Spacing.lg,
  },
  appInfoLinks: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  signOutSection: {
    marginHorizontal: Spacing.component.screen.horizontal,
    marginBottom: Spacing['4xl'],
  },
  signOutButton: {
    borderColor: Colors.semantic.error,
  },
});
