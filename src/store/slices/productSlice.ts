/**
 * @module store/slices/productSlice
 * @description A Redux slice for managing product-related state, including fetching, searching,
 * filtering, and selecting products. It interfaces with a Supabase backend for data retrieval.
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

/**
 * The initial state of the product slice.
 * @type {ProductState}
 */
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
 * An async thunk to fetch a paginated and filtered list of products.
 * @param {ProductSearchParams} [params={}] - The parameters for fetching products.
 * @returns {Promise<ProductsResponse>} A promise that resolves with the list of products and pagination information.
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
 * An async thunk to fetch a list of featured products.
 * @param {number} [limit=10] - The maximum number of featured products to fetch.
 * @returns {Promise<Product[]>} A promise that resolves with the list of featured products.
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
 * An async thunk to fetch a single product by its ID.
 * @param {string} productId - The ID of the product to fetch.
 * @returns {Promise<any>} A promise that resolves with the product data.
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
 * An async thunk to search for products based on a query.
 * @param {string} query - The search query.
 * @returns {Promise<Product[]>} A promise that resolves with a list of matching products.
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
 * An async thunk to fetch products belonging to a specific brand.
 * @param {string} brandId - The ID of the brand.
 * @returns {Promise<Product[]>} A promise that resolves with a list of products.
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
 * An async thunk to fetch products belonging to a specific category.
 * @param {string} category - The name of the category.
 * @returns {Promise<Product[]>} A promise that resolves with a list of products.
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

/**
 * The Redux slice for managing products.
 */
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    /**
     * Sets the search query for products.
     * @param {ProductState} state - The current state.
     * @param {PayloadAction<string>} action - The action containing the search query.
     */
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    
    /**
     * Sets the filters for products.
     * @param {ProductState} state - The current state.
     * @param {PayloadAction<ProductFilters>} action - The action containing the product filters.
     */
    setFilters: (state, action: PayloadAction<ProductFilters>) => {
      state.filters = action.payload;
    },
    
    /**
     * Updates existing product filters.
     * @param {ProductState} state - The current state.
     * @param {PayloadAction<Partial<ProductFilters>>} action - The action containing the partial product filters.
     */
    updateFilters: (state, action: PayloadAction<Partial<ProductFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    /**
     * Clears all product filters.
     * @param {ProductState} state - The current state.
     */
    clearFilters: (state) => {
      state.filters = {};
    },
    
    /**
     * Sets the sorting option for products.
     * @param {ProductState} state - The current state.
     * @param {PayloadAction<ProductSortOption>} action - The action containing the sort option.
     */
    setSortBy: (state, action: PayloadAction<ProductSortOption>) => {
      state.sortBy = action.payload;
    },
    
    /**
     * Sets the sort order for products.
     * @param {ProductState} state - The current state.
     * @param {PayloadAction<'asc' | 'desc'>} action - The action containing the sort order.
     */
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortOrder = action.payload;
    },
    
    /**
     * Sets the currently selected product.
     * @param {ProductState} state - The current state.
     * @param {PayloadAction<Product | null>} action - The action containing the selected product.
     */
    setSelectedProduct: (state, action: PayloadAction<Product | null>) => {
      state.selectedProduct = action.payload;
    },
    
    /**
     * Sets the currently selected brand.
     * @param {ProductState} state - The current state.
     * @param {PayloadAction<any | null>} action - The action containing the selected brand.
     */
    setSelectedBrand: (state, action: PayloadAction<any | null>) => {
      state.selectedBrand = action.payload;
    },
    
    /**
     * Sets the currently selected category.
     * @param {ProductState} state - The current state.
     * @param {PayloadAction<any | null>} action - The action containing the selected category.
     */
    setSelectedCategory: (state, action: PayloadAction<any | null>) => {
      state.selectedCategory = action.payload;
    },
    
    /**
     * Sets the current page for product pagination.
     * @param {ProductState} state - The current state.
     * @param {PayloadAction<number>} action - The action containing the page number.
     */
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    
    /**
     * Clears the main error state.
     * @param {ProductState} state - The current state.
     */
    clearError: (state) => {
      state.error = null;
    },
    
    /**
     * Clears the search error state.
     * @param {ProductState} state - The current state.
     */
    clearSearchError: (state) => {
      state.searchError = null;
    },
    
    /**
     * Resets the product state to its initial values.
     * @param {ProductState} state - The current state.
     * @returns {ProductState} The initial state.
     */
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
