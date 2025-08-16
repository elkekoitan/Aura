import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing } from '../constants';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });

    // Here you could send error to error tracking service
    // logErrorToService(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.title}>Oops! Something went wrong</Text>
            <Text style={styles.message}>
              We're sorry, but something unexpected happened. Please try again.
            </Text>
            
            {__DEV__ && this.state.error && (
              <View style={styles.debugContainer}>
                <Text style={styles.debugTitle}>Error Details:</Text>
                <Text style={styles.debugError} numberOfLines={10}>
                  {this.state.error.toString()}
                </Text>
                {this.state.errorInfo && (
                  <Text style={styles.debugInfo} numberOfLines={10}>
                    {this.state.errorInfo.componentStack}
                  </Text>
                )}
              </View>
            )}
            
            <TouchableOpacity
              style={styles.retryButton}
              onPress={this.handleRetry}
            >
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.primary,
    padding: Spacing.lg,
  },
  content: {
    alignItems: 'center',
    maxWidth: 300,
  },
  title: {
    ...Typography.styles.h2,
    color: Colors.semantic.error,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  message: {
    ...Typography.styles.body,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: Typography.lineHeights.relaxed,
    marginBottom: Spacing['2xl'],
  },
  debugContainer: {
    backgroundColor: Colors.glass.dark,
    padding: Spacing.md,
    borderRadius: Spacing.component.radius.md,
    marginBottom: Spacing.lg,
    width: '100%',
  },
  debugTitle: {
    ...Typography.styles.button,
    color: Colors.text.white,
    fontWeight: Typography.weights.semiBold,
    marginBottom: Spacing.sm,
  },
  debugError: {
    ...Typography.styles.caption,
    color: Colors.semantic.error,
    fontFamily: 'monospace',
    marginBottom: Spacing.sm,
  },
  debugInfo: {
    ...Typography.styles.caption,
    color: Colors.text.white,
    fontFamily: 'monospace',
    opacity: 0.8,
  },
  retryButton: {
    backgroundColor: Colors.primary[500],
    paddingHorizontal: Spacing['2xl'],
    paddingVertical: Spacing.md,
    borderRadius: Spacing.component.radius.md,
  },
  retryButtonText: {
    ...Typography.styles.button,
    color: Colors.text.white,
    fontWeight: Typography.weights.semiBold,
  },
});

// Higher-order component for easy error boundary usage
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function ErrorBoundaryWrapper(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}

// Hook for error handling
export function useErrorHandler() {
  return (error: Error, errorInfo?: ErrorInfo) => {
    console.error('Handled error:', error, errorInfo);
    // Here you could send error to error tracking service
    // logErrorToService(error, errorInfo);
  };
}