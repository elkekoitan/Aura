/**
 * Category-related TypeScript type definitions
 * Provides comprehensive typing for category entities and operations
 */

import { Product } from './product';

export interface Category {
  id: string;
  name: string;
  description: string;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
  
  // Populated relationships
  parent?: Category;
  children?: Category[];
  products?: Product[];
  product_count?: number;
}

export interface CategoryTree extends Category {
  children: CategoryTree[];
  level: number;
}

export interface CategoryStats {
  id: string;
  name: string;
  product_count: number;
  subcategory_count: number;
  average_price: number;
  price_range: {
    min: number;
    max: number;
  };
  top_brands: string[];
}

export interface CategoryFilters {
  parentId?: string;
  hasProducts?: boolean;
  searchQuery?: string;
  level?: number;
}

export interface CategorySearchParams {
  query?: string;
  filters?: CategoryFilters;
  sortBy?: CategorySortOption;
  sortOrder?: 'asc' | 'desc';
  includeChildren?: boolean;
  includeProducts?: boolean;
}

export type CategorySortOption = 
  | 'name'
  | 'created_at'
  | 'product_count'
  | 'level';

export interface CategoriesResponse {
  categories: Category[];
  total: number;
  tree?: CategoryTree[];
}

export interface CategoryState {
  categories: Category[];
  categoryTree: CategoryTree[];
  selectedCategory: Category | null;
  categoryStats: CategoryStats[];
  
  // Search and filtering
  searchQuery: string;
  filters: CategoryFilters;
  sortBy: CategorySortOption;
  sortOrder: 'asc' | 'desc';
  
  // Loading states
  loading: boolean;
  searchLoading: boolean;
  statsLoading: boolean;
  
  // Error states
  error: string | null;
  searchError: string | null;
  statsError: string | null;
}

export interface CategorySelectorProps {
  categories: Category[];
  selectedCategories: string[];
  onSelectionChange: (categoryIds: string[]) => void;
  multiSelect?: boolean;
  showTree?: boolean;
  showProductCount?: boolean;
  maxSelections?: number;
}

export interface CategoryTreeProps {
  categories: CategoryTree[];
  selectedCategories: string[];
  onSelectionChange: (categoryIds: string[]) => void;
  expandedCategories: string[];
  onToggleExpand: (categoryId: string) => void;
  showProductCount?: boolean;
  maxDepth?: number;
}

export interface CategoryCreateInput {
  name: string;
  description: string;
  parent_id?: string;
}

export interface CategoryUpdateInput extends Partial<CategoryCreateInput> {
  id: string;
}
