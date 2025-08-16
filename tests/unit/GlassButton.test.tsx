import React from 'react';
import { View, Text } from 'react-native';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { GlassButton } from '../../src/components/ui/GlassButton';
import { Colors, Typography, Spacing } from '../../src/constants';

describe('GlassButton', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    mockOnPress.mockClear();
  });

  describe('Rendering', () => {
    it('renders correctly with default props', () => {
      render(<GlassButton title="Test Button" onPress={mockOnPress} />);
      
      expect(screen.getByText('Test Button')).toBeTruthy();
      expect(screen.getByTestId('glass-button')).toBeTruthy();
    });

    it('renders with different variants', () => {
      const { rerender } = render(<GlassButton title="Test" onPress={mockOnPress} />);
      
      // Test primary variant
      rerender(<GlassButton title="Test" onPress={mockOnPress} variant="primary" />);
      expect(screen.getByTestId('glass-button')).toBeTruthy();
      
      // Test secondary variant
      rerender(<GlassButton title="Test" onPress={mockOnPress} variant="secondary" />);
      expect(screen.getByTestId('glass-button')).toBeTruthy();
      
      // Test outline variant
      rerender(<GlassButton title="Test" onPress={mockOnPress} variant="outline" />);
      expect(screen.getByTestId('glass-button')).toBeTruthy();
      
      // Test ghost variant
      rerender(<GlassButton title="Test" onPress={mockOnPress} variant="ghost" />);
      expect(screen.getByTestId('glass-button')).toBeTruthy();
    });

    it('renders with different sizes', () => {
      const { rerender } = render(<GlassButton title="Test" onPress={mockOnPress} />);
      
      // Test small size
      rerender(<GlassButton title="Test" onPress={mockOnPress} size="small" />);
      expect(screen.getByTestId('glass-button')).toBeTruthy();
      
      // Test medium size (default)
      rerender(<GlassButton title="Test" onPress={mockOnPress} size="medium" />);
      expect(screen.getByTestId('glass-button')).toBeTruthy();
      
      // Test large size
      rerender(<GlassButton title="Test" onPress={mockOnPress} size="large" />);
      expect(screen.getByTestId('glass-button')).toBeTruthy();
    });

    it('renders with icon', () => {
      const mockIcon = <TestIcon />;
      render(<GlassButton title="Test" onPress={mockOnPress} icon={mockIcon} />);
      
      expect(screen.getByText('Test')).toBeTruthy();
      expect(screen.getByTestId('test-icon')).toBeTruthy();
    });

    it('renders with loading state', () => {
      render(<GlassButton title="Test" onPress={mockOnPress} loading={true} />);
      
      expect(screen.getByText('Test')).toBeTruthy();
      expect(screen.getByTestId('activity-indicator')).toBeTruthy();
    });

    it('renders with disabled state', () => {
      render(<GlassButton title="Test" onPress={mockOnPress} disabled={true} />);
      
      expect(screen.getByText('Test')).toBeTruthy();
      expect(screen.getByTestId('glass-button')).toBeDisabled();
    });

    it('renders with gradient', () => {
      render(
        <GlassButton 
          title="Test" 
          onPress={mockOnPress} 
          gradient={true}
          gradientColors={Colors.gradients.primary}
        />
      );
      
      expect(screen.getByText('Test')).toBeTruthy();
      expect(screen.getByTestId('glass-button')).toBeTruthy();
    });
  });

  describe('Functionality', () => {
    it('calls onPress when pressed', () => {
      render(<GlassButton title="Test Button" onPress={mockOnPress} />);
      
      fireEvent.press(screen.getByText('Test Button'));
      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('does not call onPress when disabled', () => {
      render(<GlassButton title="Test Button" onPress={mockOnPress} disabled={true} />);
      
      fireEvent.press(screen.getByText('Test Button'));
      expect(mockOnPress).not.toHaveBeenCalled();
    });

    it('does not call onPress when loading', () => {
      render(<GlassButton title="Test Button" onPress={mockOnPress} loading={true} />);
      
      fireEvent.press(screen.getByText('Test Button'));
      expect(mockOnPress).not.toHaveBeenCalled();
    });

    it('handles icon position correctly', () => {
      const mockIcon = <TestIcon />;
      const { rerender } = render(
        <GlassButton title="Test" onPress={mockOnPress} icon={mockIcon} />
      );
      
      // Test left icon position (default)
      expect(screen.getByTestId('test-icon').props.style).toEqual(
        expect.arrayContaining([{ marginRight: Spacing.sm }])
      );
      
      // Test right icon position
      rerender(
        <GlassButton 
          title="Test" 
          onPress={mockOnPress} 
          icon={mockIcon} 
          iconPosition="right" 
        />
      );
      
      expect(screen.getByTestId('test-icon').props.style).toEqual(
        expect.arrayContaining([{ marginLeft: Spacing.sm }])
      );
    });
  });

  describe('Styling', () => {
    it('applies correct base styles', () => {
      render(<GlassButton title="Test" onPress={mockOnPress} />);
      
      const button = screen.getByTestId('glass-button');
      expect(button.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            borderRadius: Spacing.component.radius.md,
            overflow: 'hidden',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            borderWidth: 1,
          })
        ])
      );
    });

    it('applies full width style when fullWidth is true', () => {
      render(<GlassButton title="Test" onPress={mockOnPress} fullWidth={true} />);
      
      const button = screen.getByTestId('glass-button');
      expect(button.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ width: '100%' })
        ])
      );
    });

    it('applies correct text styles for different variants', () => {
      const { rerender } = render(<GlassButton title="Test" onPress={mockOnPress} />);
      
      // Test primary variant text color
      rerender(<GlassButton title="Test" onPress={mockOnPress} variant="primary" />);
      expect(screen.getByText('Test').props.style).toEqual(
        expect.arrayContaining([expect.objectContaining({ color: Colors.text.white })])
      );
      
      // Test secondary variant text color
      rerender(<GlassButton title="Test" onPress={mockOnPress} variant="secondary" />);
      expect(screen.getByText('Test').props.style).toEqual(
        expect.arrayContaining([expect.objectContaining({ color: Colors.text.primary })])
      );
      
      // Test outline variant text color
      rerender(<GlassButton title="Test" onPress={mockOnPress} variant="outline" />);
      expect(screen.getByText('Test').props.style).toEqual(
        expect.arrayContaining([expect.objectContaining({ color: Colors.primary[500] })])
      );
    });

    it('applies correct size styles', () => {
      const { rerender } = render(<GlassButton title="Test" onPress={mockOnPress} />);
      
      // Test small size
      rerender(<GlassButton title="Test" onPress={mockOnPress} size="small" />);
      const smallButton = screen.getByTestId('glass-button');
      expect(smallButton.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            paddingHorizontal: Spacing.component.button.paddingHorizontal * 0.75,
            paddingVertical: Spacing.component.button.paddingVertical * 0.75,
            minHeight: 36,
          })
        ])
      );
      
      // Test large size
      rerender(<GlassButton title="Test" onPress={mockOnPress} size="large" />);
      const largeButton = screen.getByTestId('glass-button');
      expect(largeButton.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            paddingHorizontal: Spacing.component.button.paddingHorizontal * 1.25,
            paddingVertical: Spacing.component.button.paddingVertical * 1.25,
            minHeight: 56,
          })
        ])
      );
    });
  });

  describe('Accessibility', () => {
    it('has correct accessibility properties', () => {
      render(<GlassButton title="Test Button" onPress={mockOnPress} />);
      
      const button = screen.getByText('Test Button');
      expect(button.props.accessibilityRole).toBe('button');
      expect(button.props.accessibilityLabel).toBe('Test Button');
    });

    it('has accessibility label when provided', () => {
      render(
        <GlassButton 
          title="Test" 
          onPress={mockOnPress} 
          accessibilityLabel="Custom Button Label"
        />
      );
      
      const button = screen.getByText('Test');
      expect(button.props.accessibilityLabel).toBe('Custom Button Label');
    });

    it('is accessible when disabled', () => {
      render(<GlassButton title="Test" onPress={mockOnPress} disabled={true} />);
      
      const button = screen.getByText('Test');
      expect(button.props.accessibilityState).toEqual(
        expect.objectContaining({ disabled: true })
      );
    });
  });
});

// Mock icon component for testing
const TestIcon = () => <View testID="test-icon"><Text>Icon</Text></View>;