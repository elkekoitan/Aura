/**
 * @module store/slices/brandSlice
 * @description A Redux slice for managing brand-related state, including fetching, searching,
 * filtering, and performing CRUD operations on brands.
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
 * An async thunk to fetch a paginated and filtered list of brands.
 * @param {BrandSearchParams} [params={}] - The parameters for fetching brands.
 * @returns {Promise<BrandsResponse>} A promise that resolves with the list of brands and pagination information.
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
 * An async thunk to fetch a list of featured brands.
 * @param {number} [limit=6] - The maximum number of featured brands to fetch.
 * @returns {Promise<Brand[]>} A promise that resolves with the list of featured brands.
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
 * An async thunk to fetch a single brand by its ID.
 * @param {string} brandId - The ID of the brand to fetch.
 * @returns {Promise<any>} A promise that resolves with the brand data.
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
 * An async thunk to search for brands based on a query.
 * @param {string} query - The search query.
 * @returns {Promise<Brand[]>} A promise that resolves with a list of matching brands.
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
 * An async thunk to fetch statistics for all brands.
 * @returns {Promise<BrandStats[]>} A promise that resolves with a list of brand statistics.
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
 * An async thunk to create a new brand (admin function).
 * @param {Omit<Brand, 'id' | 'created_at' | 'updated_at'>} brandData - The data for the new brand.
 * @returns {Promise<any>} A promise that resolves with the newly created brand data.
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
 * An async thunk to update an existing brand (admin function).
 * @param {object} params - The parameters for the update.
 * @param {string} params.id - The ID of the brand to update.
 * @param {Partial<Brand>} params.updateData - The data to update.
 * @returns {Promise<any>} A promise that resolves with the updated brand data.
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
 * An async thunk to delete a brand (admin function).
 * @param {string} brandId - The ID of the brand to delete.
 * @returns {Promise<string>} A promise that resolves with the ID of the deleted brand.
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
    /**
     * Sets the search query for brands.
     * @param {BrandState} state - The current state.
     * @param {PayloadAction<string>} action - The action containing the search query.
     */
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    
    /**
     * Sets the filters for brands.
     * @param {BrandState} state - The current state.
     * @param {PayloadAction<BrandFilters>} action - The action containing the brand filters.
     */
    setFilters: (state, action: PayloadAction<BrandFilters>) => {
      state.filters = action.payload;
    },
    
    /**
     * Updates existing brand filters.
     * @param {BrandState} state - The current state.
     * @param {PayloadAction<Partial<BrandFilters>>} action - The action containing the partial brand filters.
     */
    updateFilters: (state, action: PayloadAction<Partial<BrandFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    /**
     * Clears all brand filters.
     * @param {BrandState} state - The current state.
     */
    clearFilters: (state) => {
      state.filters = {};
    },
    
    /**
     * Sets the sorting option for brands.
     * @param {BrandState} state - The current state.
     * @param {PayloadAction<BrandSortOption>} action - The action containing the sort option.
     */
    setSortBy: (state, action: PayloadAction<BrandSortOption>) => {
      state.sortBy = action.payload;
    },
    
    /**
     * Sets the sort order for brands.
     * @param {BrandState} state - The current state.
     * @param {PayloadAction<'asc' | 'desc'>} action - The action containing the sort order.
     */
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortOrder = action.payload;
    },
    
    /**
     * Sets the currently selected brand.
     * @param {BrandState} state - The current state.
     * @param {PayloadAction<Brand | null>} action - The action containing the selected brand.
     */
    setSelectedBrand: (state, action: PayloadAction<Brand | null>) => {
      state.selectedBrand = action.payload;
    },
    
    /**
     * Sets the current page for brand pagination.
     * @param {BrandState} state - The current state.
     * @param {PayloadAction<number>} action - The action containing the page number.
     */
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    
    /**
     * Clears the main error state.
     * @param {BrandState} state - The current state.
     */
    clearError: (state) => {
      state.error = null;
    },
    
    /**
     * Clears the search error state.
     * @param {BrandState} state - The current state.
     */
    clearSearchError: (state) => {
      state.searchError = null;
    },
    
    /**
     * Clears the stats error state.
     * @param {BrandState} state - The current state.
     */
    clearStatsError: (state) => {
      state.statsError = null;
    },
    
    /**
     * Resets the brand state to its initial values.
     * @param {BrandState} state - The current state.
     * @returns {BrandState} The initial state.
     */
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
