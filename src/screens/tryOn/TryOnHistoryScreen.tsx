/**
 * TryOnHistoryScreen
 * History of virtual try-on sessions with results and management
 * Displays saved try-on results with sharing and re-try options
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { GlassCard, GlassButton } from '../../components/ui';
import { Colors, Typography, Spacing } from '../../constants';
import { useAppDispatch, useAppSelector } from '../../store';
import { 
  fetchTryOnHistory,
  clearCurrentSession,
} from '../../store/slices/tryOnSlice';
import { TryOnSession, TryOnResult } from '../../store/types/tryOn';

export default function TryOnHistoryScreen() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  
  const { 
    sessionHistory,
    savedResults,
    loading,
    error 
  } = useAppSelector((state) => state.tryOn);
  
  const { user } = useAppSelector((state) => state.auth);

  const [refreshing, setRefreshing] = useState(false);

  /**
   * Load history on mount
   */
  useEffect(() => {
    loadHistory();
  }, []);

  /**
   * Load try-on history
   */
  const loadHistory = async () => {
    if (!user) return;

    try {
      await dispatch(fetchTryOnHistory(user.id));
    } catch (error) {
      console.error('Failed to load try-on history:', error);
    }
  };

  /**
   * Handle refresh
   */
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadHistory();
    } finally {
      setRefreshing(false);
    }
  };

  /**
   * Handle session select
   */
  const handleSessionSelect = (session: TryOnSession) => {
    // Navigate to result view or re-process
    if (session.result_photo_url) {
      // Show result
      Alert.alert(
        'Try-On Result',
        'View your saved try-on result?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'View Result', onPress: () => {/* Navigate to result view */} },
        ]
      );
    } else {
      // Re-process or retry
      Alert.alert(
        'Incomplete Session',
        'This try-on session was not completed. Would you like to try again?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Try Again', onPress: () => handleRetrySession(session) },
        ]
      );
    }
  };

  /**
   * Handle retry session
   */
  const handleRetrySession = (session: TryOnSession) => {
    dispatch(clearCurrentSession());
    navigation.navigate('TryOnCamera', {
      productId: session.product_id,
      product: session.product,
    });
  };

  /**
   * Handle share result
   */
  const handleShareResult = (result: TryOnResult) => {
    // TODO: Implement sharing functionality
    Alert.alert('Coming Soon', 'Sharing feature will be available soon!');
  };

  /**
   * Handle delete session
   */
  const handleDeleteSession = (session: TryOnSession) => {
    Alert.alert(
      'Delete Try-On',
      'Are you sure you want to delete this try-on session?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            // TODO: Implement delete functionality
            console.log('Delete session:', session.id);
          }
        },
      ]
    );
  };

  /**
   * Format date
   */
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  /**
   * Get status color
   */
  const getStatusColor = (status: TryOnSession['status']): string => {
    switch (status) {
      case 'saved':
        return Colors.semantic.success;
      case 'ready':
        return Colors.primary[500];
      case 'processing':
        return Colors.semantic.warning;
      case 'failed':
        return Colors.semantic.error;
      default:
        return Colors.text.secondary;
    }
  };

  /**
   * Render session item
   */
  const renderSessionItem = ({ item }: { item: TryOnSession }) => (
    <TouchableOpacity
      style={styles.sessionItem}
      onPress={() => handleSessionSelect(item)}
      activeOpacity={0.7}
    >
      <GlassCard style={styles.sessionCard}>
        <View style={styles.sessionContent}>
          {/* Session Image */}
          <View style={styles.imageContainer}>
            {item.result_photo_url ? (
              <Image
                source={{ uri: item.result_photo_url }}
                style={styles.sessionImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.placeholderImage}>
                <Ionicons name="camera-outline" size={32} color={Colors.text.muted} />
              </View>
            )}
            
            {/* Status Badge */}
            <View style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.status) }
            ]}>
              <Text style={styles.statusText}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Text>
            </View>
          </View>

          {/* Session Info */}
          <View style={styles.sessionInfo}>
            <Text style={styles.productName} numberOfLines={2}>
              {item.product?.name || 'Unknown Product'}
            </Text>
            <Text style={styles.sessionDate}>
              {formatDate(item.created_at)}
            </Text>
            <Text style={styles.sessionType}>
              {item.session_type === 'photo' ? 'Photo Try-On' : 'Live Try-On'}
            </Text>
          </View>

          {/* Actions */}
          <View style={styles.sessionActions}>
            {item.result_photo_url && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleShareResult(savedResults.find(r => r.session_id === item.id)!)}
                activeOpacity={0.7}
              >
                <Ionicons name="share-outline" size={16} color={Colors.primary[500]} />
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleRetrySession(item)}
              activeOpacity={0.7}
            >
              <Ionicons name="refresh-outline" size={16} color={Colors.primary[500]} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleDeleteSession(item)}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={16} color={Colors.semantic.error} />
            </TouchableOpacity>
          </View>
        </View>
      </GlassCard>
    </TouchableOpacity>
  );

  /**
   * Render empty state
   */
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <GlassCard style={styles.emptyCard}>
        <Text style={styles.emptyIcon}>📸</Text>
        <Text style={styles.emptyTitle}>No Try-Ons Yet</Text>
        <Text style={styles.emptyMessage}>
          Start trying on clothes virtually to see your history here.
        </Text>
        <GlassButton
          title="Start Try-On"
          onPress={() => navigation.navigate('Discover')}
          variant="primary"
          size="medium"
          gradient
          gradientColors={Colors.gradients.primary}
          style={styles.startButton}
        />
      </GlassCard>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={Colors.gradients.holographic}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={Colors.gradients.glass}
            style={styles.backGradient}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
          </LinearGradient>
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.title}>Try-On History</Text>
          <Text style={styles.subtitle}>
            {sessionHistory.length} {sessionHistory.length === 1 ? 'session' : 'sessions'}
          </Text>
        </View>
      </View>

      {/* History List */}
      {sessionHistory.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={sessionHistory}
          renderItem={renderSessionItem}
          keyExtractor={(item) => item.id}
          style={styles.historyList}
          contentContainerStyle={styles.historyContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={Colors.primary[500]}
              colors={[Colors.primary[500]]}
            />
          }
        />
      )}

      {/* Error Display */}
      {error && (
        <View style={styles.errorContainer}>
          <GlassCard style={styles.errorCard}>
            <Ionicons name="alert-circle" size={20} color={Colors.semantic.error} />
            <Text style={styles.errorText}>{error}</Text>
          </GlassCard>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.component.screen.horizontal,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    marginRight: Spacing.md,
  },
  backGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
  },
  title: {
    ...Typography.styles.h1,
    color: Colors.text.white,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.styles.body,
    color: Colors.text.white,
    opacity: 0.8,
  },

  // History list
  historyList: {
    flex: 1,
  },
  historyContent: {
    paddingHorizontal: Spacing.component.screen.horizontal,
    paddingBottom: Spacing['3xl'],
  },
  sessionItem: {
    marginBottom: Spacing.md,
  },
  sessionCard: {
    padding: Spacing.lg,
  },
  sessionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Session image
  imageContainer: {
    position: 'relative',
    marginRight: Spacing.md,
  },
  sessionImage: {
    width: 60,
    height: 80,
    borderRadius: Spacing.component.radius.sm,
  },
  placeholderImage: {
    width: 60,
    height: 80,
    borderRadius: Spacing.component.radius.sm,
    backgroundColor: Colors.glass.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: Spacing.component.radius.xs,
  },
  statusText: {
    ...Typography.styles.caption,
    color: Colors.text.white,
    fontSize: 10,
    fontWeight: Typography.weights.semiBold,
  },

  // Session info
  sessionInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  productName: {
    ...Typography.styles.button,
    color: Colors.text.primary,
    fontWeight: Typography.weights.semiBold,
    marginBottom: Spacing.xs,
  },
  sessionDate: {
    ...Typography.styles.caption,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  sessionType: {
    ...Typography.styles.caption,
    color: Colors.primary[500],
    fontSize: 12,
  },

  // Session actions
  sessionActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.glass.light,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Empty state
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.component.screen.horizontal,
  },
  emptyCard: {
    padding: Spacing['2xl'],
    alignItems: 'center',
    width: '100%',
    maxWidth: 300,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    ...Typography.styles.h2,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  emptyMessage: {
    ...Typography.styles.body,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: Typography.lineHeights.relaxed,
    marginBottom: Spacing['2xl'],
  },
  startButton: {
    minWidth: 150,
  },

  // Error display
  errorContainer: {
    position: 'absolute',
    bottom: Spacing.lg,
    left: Spacing.lg,
    right: Spacing.lg,
  },
  errorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.semantic.error + '20',
    borderWidth: 1,
    borderColor: Colors.semantic.error + '40',
  },
  errorText: {
    ...Typography.styles.body,
    color: Colors.semantic.error,
    marginLeft: Spacing.sm,
    flex: 1,
  },
});
