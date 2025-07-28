/**
 * Product Redux Slice
 * Manages product state, search, filtering, and CRUD operations
 * Integrates with Supabase for real-time data synchronization
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../../config/supabase';
import { 
  Product, 
  ProductState, 
  ProductFilters, 
  ProductSearchParams, 
  ProductsResponse,
  ProductSortOption 
} from '../types/product';

// Initial state
const initialState: ProductState = {
  // Product data
  products: [],
  selectedProduct: null,
  featuredProducts: [],
  
  // Brands data
  brands: [],
  selectedBrand: null,
  featuredBrands: [],
  
  // Categories data
  categories: [],
  selectedCategory: null,
  
  // Search and filtering
  searchQuery: '',
  filters: {},
  sortBy: 'created_at',
  sortOrder: 'desc',
  
  // Pagination
  currentPage: 1,
  totalPages: 1,
  hasMore: false,
  
  // Loading states
  loading: false,
  searchLoading: false,
  brandsLoading: false,
  categoriesLoading: false,
  
  // Error states
  error: null,
  searchError: null,
  brandsError: null,
  categoriesError: null,
};

/**
 * Fetch products with optional filtering and pagination
 * Integrates with Supabase PostgreSQL for efficient querying
 */
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params: ProductSearchParams = {}) => {
    const {
      query = '',
      filters = {},
      sortBy = 'created_at',
      sortOrder = 'desc',
      page = 1,
      limit = 20
    } = params;

    let queryBuilder = supabase
      .from('products')
      .select(`
        *,
        brand:brands(*),
        product_images(*)
      `);

    // Apply search query
    if (query) {
      queryBuilder = queryBuilder.or(`name.ilike.%${query}%,description.ilike.%${query}%`);
    }

    // Apply filters
    if (filters.brands && filters.brands.length > 0) {
      queryBuilder = queryBuilder.in('brand_id', filters.brands);
    }

    if (filters.categories && filters.categories.length > 0) {
      queryBuilder = queryBuilder.in('category', filters.categories);
    }

    if (filters.priceRange) {
      queryBuilder = queryBuilder
        .gte('price', filters.priceRange.min)
        .lte('price', filters.priceRange.max);
    }

    if (filters.isFeatured !== undefined) {
      queryBuilder = queryBuilder.eq('is_featured', filters.isFeatured);
    }

    if (filters.inStock) {
      queryBuilder = queryBuilder.gt('stock_quantity', 0);
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
      products: data || [],
      total: count || 0,
      page,
      limit,
      hasMore,
      totalPages
    } as ProductsResponse;
  }
);

/**
 * Fetch featured products for homepage display
 */
export const fetchFeaturedProducts = createAsyncThunk(
  'products/fetchFeaturedProducts',
  async (limit: number = 10) => {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        brand:brands(*),
        product_images(*)
      `)
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }
);

/**
 * Fetch single product by ID with full details
 */
export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (productId: string) => {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        brand:brands(*),
        product_images(*),
        product_categories(
          category:categories(*)
        )
      `)
      .eq('id', productId)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }
);

/**
 * Search products with debounced query
 */
export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async (query: string) => {
    if (!query.trim()) {
      return [];
    }

    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        brand:brands(*),
        product_images(*)
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
 * Fetch products by brand
 */
export const fetchProductsByBrand = createAsyncThunk(
  'products/fetchProductsByBrand',
  async (brandId: string) => {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        brand:brands(*),
        product_images(*)
      `)
      .eq('brand_id', brandId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }
);

/**
 * Fetch products by category
 */
export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchProductsByCategory',
  async (category: string) => {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        brand:brands(*),
        product_images(*)
      `)
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }
);

// Product slice
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // Search and filtering actions
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    
    setFilters: (state, action: PayloadAction<ProductFilters>) => {
      state.filters = action.payload;
    },
    
    updateFilters: (state, action: PayloadAction<Partial<ProductFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    clearFilters: (state) => {
      state.filters = {};
    },
    
    setSortBy: (state, action: PayloadAction<ProductSortOption>) => {
      state.sortBy = action.payload;
    },
    
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortOrder = action.payload;
    },
    
    // Product selection actions
    setSelectedProduct: (state, action: PayloadAction<Product | null>) => {
      state.selectedProduct = action.payload;
    },
    
    setSelectedBrand: (state, action: PayloadAction<any | null>) => {
      state.selectedBrand = action.payload;
    },
    
    setSelectedCategory: (state, action: PayloadAction<any | null>) => {
      state.selectedCategory = action.payload;
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
    
    // Reset state
    resetProductState: (state) => {
      return { ...initialState };
    },
  },
  extraReducers: (builder) => {
    // Fetch products
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.currentPage = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.hasMore = action.payload.hasMore;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      });

    // Fetch featured products
    builder
      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.featuredProducts = action.payload;
      })
      .addCase(fetchFeaturedProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch featured products';
      });

    // Fetch product by ID
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch product';
      });

    // Search products
    builder
      .addCase(searchProducts.pending, (state) => {
        state.searchLoading = true;
        state.searchError = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.products = action.payload;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.searchLoading = false;
        state.searchError = action.error.message || 'Search failed';
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
  setSelectedProduct,
  setSelectedBrand,
  setSelectedCategory,
  setCurrentPage,
  clearError,
  clearSearchError,
  resetProductState,
} = productSlice.actions;

// Export reducer
export default productSlice.reducer;
