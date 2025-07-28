/**
 * SearchBar Component
 * Glassmorphism search input with suggestions and debounced search
 * Integrates with product search functionality
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Text,
  Keyboard,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { GlassCard } from './GlassCard';
import { Colors, Typography, Spacing } from '../../constants';

const { width } = Dimensions.get('window');

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSearch: (query: string) => void;
  suggestions?: string[];
  loading?: boolean;
  placeholder?: string;
  showSuggestions?: boolean;
  onSuggestionPress?: (suggestion: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  debounceMs?: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  query,
  onQueryChange,
  onSearch,
  suggestions = [],
  loading = false,
  placeholder = "Search products...",
  showSuggestions = true,
  onSuggestionPress,
  onFocus,
  onBlur,
  debounceMs = 300,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestionsList, setShowSuggestionsList] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  /**
   * Handle input change with debouncing
   */
  const handleInputChange = (text: string) => {
    onQueryChange(text);

    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Set new debounce
    debounceRef.current = setTimeout(() => {
      if (text.trim()) {
        onSearch(text.trim());
      }
    }, debounceMs);
  };

  /**
   * Handle search submission
   */
  const handleSubmit = () => {
    if (query.trim()) {
      onSearch(query.trim());
      setShowSuggestionsList(false);
      Keyboard.dismiss();
    }
  };

  /**
   * Handle clear search
   */
  const handleClear = () => {
    onQueryChange('');
    setShowSuggestionsList(false);
    inputRef.current?.focus();
  };

  /**
   * Handle focus
   */
  const handleFocus = () => {
    setIsFocused(true);
    setShowSuggestionsList(showSuggestions && suggestions.length > 0);
    onFocus?.();
  };

  /**
   * Handle blur
   */
  const handleBlur = () => {
    setIsFocused(false);
    // Delay hiding suggestions to allow for suggestion tap
    setTimeout(() => {
      setShowSuggestionsList(false);
    }, 150);
    onBlur?.();
  };

  /**
   * Handle suggestion press
   */
  const handleSuggestionPress = (suggestion: string) => {
    onQueryChange(suggestion);
    onSearch(suggestion);
    setShowSuggestionsList(false);
    onSuggestionPress?.(suggestion);
    Keyboard.dismiss();
  };

  /**
   * Render suggestion item
   */
  const renderSuggestion = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleSuggestionPress(item)}
      activeOpacity={0.7}
    >
      <Ionicons name="search" size={16} color={Colors.text.secondary} />
      <Text style={styles.suggestionText}>{item}</Text>
    </TouchableOpacity>
  );

  // Update suggestions visibility when suggestions change
  useEffect(() => {
    if (isFocused && showSuggestions && suggestions.length > 0 && query.trim()) {
      setShowSuggestionsList(true);
    } else {
      setShowSuggestionsList(false);
    }
  }, [suggestions, isFocused, showSuggestions, query]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <GlassCard style={[styles.searchCard, isFocused && styles.searchCardFocused]}>
        <View style={styles.searchContainer}>
          {/* Search Icon */}
          <TouchableOpacity
            style={styles.searchIcon}
            onPress={handleSubmit}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={isFocused ? Colors.gradients.primary : Colors.gradients.glass}
              style={styles.searchIconGradient}
            >
              <Ionicons
                name="search"
                size={20}
                color={isFocused ? Colors.text.white : Colors.text.secondary}
              />
            </LinearGradient>
          </TouchableOpacity>

          {/* Text Input */}
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={query}
            onChangeText={handleInputChange}
            onSubmitEditing={handleSubmit}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            placeholderTextColor={Colors.text.muted}
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
          />

          {/* Clear Button */}
          {query.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClear}
              activeOpacity={0.7}
            >
              <Ionicons name="close-circle" size={20} color={Colors.text.secondary} />
            </TouchableOpacity>
          )}

          {/* Loading Indicator */}
          {loading && (
            <View style={styles.loadingContainer}>
              <Ionicons name="refresh" size={16} color={Colors.primary[500]} />
            </View>
          )}
        </View>
      </GlassCard>

      {/* Suggestions List */}
      {showSuggestionsList && suggestions.length > 0 && (
        <GlassCard style={styles.suggestionsCard}>
          <FlatList
            data={suggestions}
            renderItem={renderSuggestion}
            keyExtractor={(item, index) => `${item}-${index}`}
            style={styles.suggestionsList}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            maxToRenderPerBatch={5}
            windowSize={5}
          />
        </GlassCard>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1000,
  },
  searchCard: {
    marginBottom: Spacing.md,
  },
  searchCardFocused: {
    borderWidth: 1,
    borderColor: Colors.primary[500],
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  searchIcon: {
    marginRight: Spacing.md,
    borderRadius: 20,
    overflow: 'hidden',
  },
  searchIconGradient: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    ...Typography.styles.body,
    color: Colors.text.primary,
    paddingVertical: Spacing.sm,
  },
  clearButton: {
    marginLeft: Spacing.md,
    padding: Spacing.xs,
  },
  loadingContainer: {
    marginLeft: Spacing.md,
    padding: Spacing.xs,
  },
  
  // Suggestions styles
  suggestionsCard: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    maxHeight: 200,
    zIndex: 1001,
  },
  suggestionsList: {
    maxHeight: 200,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  suggestionText: {
    ...Typography.styles.body,
    color: Colors.text.primary,
    marginLeft: Spacing.md,
    flex: 1,
  },
});

export default SearchBar;
