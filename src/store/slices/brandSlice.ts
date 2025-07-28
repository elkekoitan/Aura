/**
 * Brand Redux Slice
 * Manages brand state, search, filtering, and CRUD operations
 * Integrates with Supabase for real-time brand data
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../../config/supabase';
import { 
  Brand, 
  BrandState, 
  BrandFilters, 
  BrandSearchParams, 
  BrandsResponse,
  BrandSortOption,
  BrandStats 
} from '../types/brand';

// Initial state
const initialState: BrandState = {
  brands: [],
  selectedBrand: null,
  featuredBrands: [],
  brandStats: [],
  
  // Search and filtering
  searchQuery: '',
  filters: {},
  sortBy: 'name',
  sortOrder: 'asc',
  
  // Pagination
  currentPage: 1,
  totalPages: 1,
  hasMore: false,
  
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
 * Fetch all brands with optional filtering and pagination
 */
export const fetchBrands = createAsyncThunk(
  'brands/fetchBrands',
  async (params: BrandSearchParams = {}) => {
    const {
      query = '',
      filters = {},
      sortBy = 'name',
      sortOrder = 'asc',
      page = 1,
      limit = 20
    } = params;

    let queryBuilder = supabase
      .from('brands')
      .select(`
        *,
        products(count)
      `);

    // Apply search query
    if (query) {
      queryBuilder = queryBuilder.or(`name.ilike.%${query}%,description.ilike.%${query}%`);
    }

    // Apply filters
    if (filters.featured !== undefined) {
      queryBuilder = queryBuilder.eq('is_featured', filters.featured);
    }

    // Apply sorting
    queryBuilder = queryBuilder.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    queryBuilder = queryBuilder.range(from, to);

    const { data, error, count } = await queryBuilder;

    if (error) {
      throw new Error(error.message);
    }

    const totalPages = Math.ceil((count || 0) / limit);
    const hasMore = page < totalPages;

    return {
      brands: data || [],
      total: count || 0,
      page,
      limit,
      hasMore,
      totalPages
    } as BrandsResponse;
  }
);

/**
 * Fetch featured brands for homepage display
 */
export const fetchFeaturedBrands = createAsyncThunk(
  'brands/fetchFeaturedBrands',
  async (limit: number = 6) => {
    const { data, error } = await supabase
      .from('brands')
      .select(`
        *,
        products(count)
      `)
      .eq('is_featured', true)
      .order('name')
      .limit(limit);

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }
);

/**
 * Fetch single brand by ID with full details
 */
export const fetchBrandById = createAsyncThunk(
  'brands/fetchBrandById',
  async (brandId: string) => {
    const { data, error } = await supabase
      .from('brands')
      .select(`
        *,
        products(*)
      `)
      .eq('id', brandId)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }
);

/**
 * Search brands with debounced query
 */
export const searchBrands = createAsyncThunk(
  'brands/searchBrands',
  async (query: string) => {
    if (!query.trim()) {
      return [];
    }

    const { data, error } = await supabase
      .from('brands')
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
 * Fetch brand statistics including product counts and price ranges
 */
export const fetchBrandStats = createAsyncThunk(
  'brands/fetchBrandStats',
  async () => {
    const { data, error } = await supabase
      .from('brands')
      .select(`
        id,
        name,
        products(
          id,
          price,
          category,
          is_featured
        )
      `);

    if (error) {
      throw new Error(error.message);
    }

    // Process brand statistics
    const brandStats: BrandStats[] = (data || []).map(brand => {
      const products = brand.products || [];
      const prices = products.map(p => p.price);
      const categories = [...new Set(products.map(p => p.category))];
      const featuredProducts = products.filter(p => p.is_featured);

      return {
        id: brand.id,
        name: brand.name,
        product_count: products.length,
        average_price: prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0,
        price_range: {
          min: prices.length > 0 ? Math.min(...prices) : 0,
          max: prices.length > 0 ? Math.max(...prices) : 0,
        },
        categories,
        featured_products: featuredProducts,
      };
    });

    return brandStats;
  }
);

/**
 * Create new brand (admin function)
 */
export const createBrand = createAsyncThunk(
  'brands/createBrand',
  async (brandData: Omit<Brand, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('brands')
      .insert([brandData])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }
);

/**
 * Update existing brand (admin function)
 */
export const updateBrand = createAsyncThunk(
  'brands/updateBrand',
  async ({ id, ...updateData }: { id: string } & Partial<Brand>) => {
    const { data, error } = await supabase
      .from('brands')
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
 * Delete brand (admin function)
 */
export const deleteBrand = createAsyncThunk(
  'brands/deleteBrand',
  async (brandId: string) => {
    const { error } = await supabase
      .from('brands')
      .delete()
      .eq('id', brandId);

    if (error) {
      throw new Error(error.message);
    }

    return brandId;
  }
);

// Brand slice
const brandSlice = createSlice({
  name: 'brands',
  initialState,
  reducers: {
    // Search and filtering actions
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    
    setFilters: (state, action: PayloadAction<BrandFilters>) => {
      state.filters = action.payload;
    },
    
    updateFilters: (state, action: PayloadAction<Partial<BrandFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    clearFilters: (state) => {
      state.filters = {};
    },
    
    setSortBy: (state, action: PayloadAction<BrandSortOption>) => {
      state.sortBy = action.payload;
    },
    
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortOrder = action.payload;
    },
    
    // Brand selection actions
    setSelectedBrand: (state, action: PayloadAction<Brand | null>) => {
      state.selectedBrand = action.payload;
    },
    
    // Pagination actions
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
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
    resetBrandState: (state) => {
      return { ...initialState };
    },
  },
  extraReducers: (builder) => {
    // Fetch brands
    builder
      .addCase(fetchBrands.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.brands = action.payload.brands;
        state.currentPage = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.hasMore = action.payload.hasMore;
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch brands';
      });

    // Fetch featured brands
    builder
      .addCase(fetchFeaturedBrands.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeaturedBrands.fulfilled, (state, action) => {
        state.loading = false;
        state.featuredBrands = action.payload;
      })
      .addCase(fetchFeaturedBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch featured brands';
      });

    // Fetch brand by ID
    builder
      .addCase(fetchBrandById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrandById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBrand = action.payload;
      })
      .addCase(fetchBrandById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch brand';
      });

    // Search brands
    builder
      .addCase(searchBrands.pending, (state) => {
        state.searchLoading = true;
        state.searchError = null;
      })
      .addCase(searchBrands.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.brands = action.payload;
      })
      .addCase(searchBrands.rejected, (state, action) => {
        state.searchLoading = false;
        state.searchError = action.error.message || 'Search failed';
      });

    // Fetch brand stats
    builder
      .addCase(fetchBrandStats.pending, (state) => {
        state.statsLoading = true;
        state.statsError = null;
      })
      .addCase(fetchBrandStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.brandStats = action.payload;
      })
      .addCase(fetchBrandStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.statsError = action.error.message || 'Failed to fetch brand stats';
      });

    // Create brand
    builder
      .addCase(createBrand.fulfilled, (state, action) => {
        state.brands.push(action.payload);
      });

    // Update brand
    builder
      .addCase(updateBrand.fulfilled, (state, action) => {
        const index = state.brands.findIndex(brand => brand.id === action.payload.id);
        if (index !== -1) {
          state.brands[index] = action.payload;
        }
        if (state.selectedBrand?.id === action.payload.id) {
          state.selectedBrand = action.payload;
        }
      });

    // Delete brand
    builder
      .addCase(deleteBrand.fulfilled, (state, action) => {
        state.brands = state.brands.filter(brand => brand.id !== action.payload);
        if (state.selectedBrand?.id === action.payload) {
          state.selectedBrand = null;
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
  setSelectedBrand,
  setCurrentPage,
  clearError,
  clearSearchError,
  clearStatsError,
  resetBrandState,
} = brandSlice.actions;

// Export reducer
export default brandSlice.reducer;
