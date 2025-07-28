/**
 * Category Redux Slice
 * Manages category state, hierarchical structure, and CRUD operations
 * Integrates with Supabase for real-time category data
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../../config/supabase';
import { 
  Category, 
  CategoryState, 
  CategoryFilters, 
  CategorySearchParams, 
  CategoriesResponse,
  CategorySortOption,
  CategoryTree,
  CategoryStats 
} from '../types/category';

// Initial state
const initialState: CategoryState = {
  categories: [],
  categoryTree: [],
  selectedCategory: null,
  categoryStats: [],
  
  // Search and filtering
  searchQuery: '',
  filters: {},
  sortBy: 'name',
  sortOrder: 'asc',
  
  // Loading states
  loading: false,
  searchLoading: false,
  statsLoading: false,
  
  // Error states
  error: null,
  searchError: null,
  statsError: null,
};

/**
 * Fetch all categories with optional filtering
 */
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (params: CategorySearchParams = {}) => {
    const {
      query = '',
      filters = {},
      sortBy = 'name',
      sortOrder = 'asc',
      includeChildren = true,
      includeProducts = false
    } = params;

    let selectQuery = '*';
    if (includeProducts) {
      selectQuery += ', products(count)';
    }

    let queryBuilder = supabase
      .from('categories')
      .select(selectQuery);

    // Apply search query
    if (query) {
      queryBuilder = queryBuilder.or(`name.ilike.%${query}%,description.ilike.%${query}%`);
    }

    // Apply filters
    if (filters.parentId !== undefined) {
      if (filters.parentId === null) {
        queryBuilder = queryBuilder.is('parent_id', null);
      } else {
        queryBuilder = queryBuilder.eq('parent_id', filters.parentId);
      }
    }

    // Apply sorting
    queryBuilder = queryBuilder.order(sortBy, { ascending: sortOrder === 'asc' });

    const { data, error } = await queryBuilder;

    if (error) {
      throw new Error(error.message);
    }

    return {
      categories: data || [],
      total: data?.length || 0,
    } as CategoriesResponse;
  }
);

/**
 * Fetch category tree structure for hierarchical display
 */
export const fetchCategoryTree = createAsyncThunk(
  'categories/fetchCategoryTree',
  async () => {
    const { data, error } = await supabase
      .from('categories')
      .select(`
        *,
        products(count)
      `)
      .order('name');

    if (error) {
      throw new Error(error.message);
    }

    // Build tree structure
    const categories = data || [];
    const categoryMap = new Map<string, CategoryTree>();
    const rootCategories: CategoryTree[] = [];

    // First pass: create all category nodes
    categories.forEach(category => {
      categoryMap.set(category.id, {
        ...category,
        children: [],
        level: 0,
      });
    });

    // Second pass: build parent-child relationships
    categories.forEach(category => {
      const categoryNode = categoryMap.get(category.id)!;
      
      if (category.parent_id) {
        const parent = categoryMap.get(category.parent_id);
        if (parent) {
          parent.children.push(categoryNode);
          categoryNode.level = parent.level + 1;
        }
      } else {
        rootCategories.push(categoryNode);
      }
    });

    return rootCategories;
  }
);

/**
 * Fetch single category by ID with full details
 */
export const fetchCategoryById = createAsyncThunk(
  'categories/fetchCategoryById',
  async (categoryId: string) => {
    const { data, error } = await supabase
      .from('categories')
      .select(`
        *,
        parent:categories!parent_id(*),
        children:categories!parent_id(*),
        products(*)
      `)
      .eq('id', categoryId)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }
);

/**
 * Search categories with debounced query
 */
export const searchCategories = createAsyncThunk(
  'categories/searchCategories',
  async (query: string) => {
    if (!query.trim()) {
      return [];
    }

    const { data, error } = await supabase
      .from('categories')
      .select(`
        *,
        products(count)
      `)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order('name')
      .limit(20);

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }
);

/**
 * Fetch category statistics including product counts
 */
export const fetchCategoryStats = createAsyncThunk(
  'categories/fetchCategoryStats',
  async () => {
    const { data, error } = await supabase
      .from('categories')
      .select(`
        id,
        name,
        parent_id,
        products(
          id,
          price,
          brand:brands(name)
        ),
        children:categories!parent_id(count)
      `);

    if (error) {
      throw new Error(error.message);
    }

    // Process category statistics
    const categoryStats: CategoryStats[] = (data || []).map(category => {
      const products = category.products || [];
      const prices = products.map(p => p.price);
      const brands = [...new Set(products.map(p => p.brand?.name).filter(Boolean))];

      return {
        id: category.id,
        name: category.name,
        product_count: products.length,
        subcategory_count: category.children?.[0]?.count || 0,
        average_price: prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0,
        price_range: {
          min: prices.length > 0 ? Math.min(...prices) : 0,
          max: prices.length > 0 ? Math.max(...prices) : 0,
        },
        top_brands: brands.slice(0, 5),
      };
    });

    return categoryStats;
  }
);

/**
 * Create new category (admin function)
 */
export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (categoryData: Omit<Category, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('categories')
      .insert([categoryData])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }
);

/**
 * Update existing category (admin function)
 */
export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, ...updateData }: { id: string } & Partial<Category>) => {
    const { data, error } = await supabase
      .from('categories')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }
);

/**
 * Delete category (admin function)
 */
export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (categoryId: string) => {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryId);

    if (error) {
      throw new Error(error.message);
    }

    return categoryId;
  }
);

// Category slice
const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    // Search and filtering actions
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    
    setFilters: (state, action: PayloadAction<CategoryFilters>) => {
      state.filters = action.payload;
    },
    
    updateFilters: (state, action: PayloadAction<Partial<CategoryFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    clearFilters: (state) => {
      state.filters = {};
    },
    
    setSortBy: (state, action: PayloadAction<CategorySortOption>) => {
      state.sortBy = action.payload;
    },
    
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortOrder = action.payload;
    },
    
    // Category selection actions
    setSelectedCategory: (state, action: PayloadAction<Category | null>) => {
      state.selectedCategory = action.payload;
    },
    
    // Error clearing actions
    clearError: (state) => {
      state.error = null;
    },
    
    clearSearchError: (state) => {
      state.searchError = null;
    },
    
    clearStatsError: (state) => {
      state.statsError = null;
    },
    
    // Reset state
    resetCategoryState: (state) => {
      return { ...initialState };
    },
  },
  extraReducers: (builder) => {
    // Fetch categories
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.categories;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch categories';
      });

    // Fetch category tree
    builder
      .addCase(fetchCategoryTree.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategoryTree.fulfilled, (state, action) => {
        state.loading = false;
        state.categoryTree = action.payload;
      })
      .addCase(fetchCategoryTree.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch category tree';
      });

    // Fetch category by ID
    builder
      .addCase(fetchCategoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCategory = action.payload;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch category';
      });

    // Search categories
    builder
      .addCase(searchCategories.pending, (state) => {
        state.searchLoading = true;
        state.searchError = null;
      })
      .addCase(searchCategories.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.categories = action.payload;
      })
      .addCase(searchCategories.rejected, (state, action) => {
        state.searchLoading = false;
        state.searchError = action.error.message || 'Search failed';
      });

    // Fetch category stats
    builder
      .addCase(fetchCategoryStats.pending, (state) => {
        state.statsLoading = true;
        state.statsError = null;
      })
      .addCase(fetchCategoryStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.categoryStats = action.payload;
      })
      .addCase(fetchCategoryStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.statsError = action.error.message || 'Failed to fetch category stats';
      });

    // Create category
    builder
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      });

    // Update category
    builder
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(category => category.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
        if (state.selectedCategory?.id === action.payload.id) {
          state.selectedCategory = action.payload;
        }
      });

    // Delete category
    builder
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(category => category.id !== action.payload);
        if (state.selectedCategory?.id === action.payload) {
          state.selectedCategory = null;
        }
      });
  },
});

// Export actions
export const {
  setSearchQuery,
  setFilters,
  updateFilters,
  clearFilters,
  setSortBy,
  setSortOrder,
  setSelectedCategory,
  clearError,
  clearSearchError,
  clearStatsError,
  resetCategoryState,
} = categorySlice.actions;

// Export reducer
export default categorySlice.reducer;
