/**
 * @module store/slices/adminSlice
 * @description A Redux slice for managing the state of the admin dashboard, including statistics,
 * recent activity, and admin operations like creating, updating, and deleting products.
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../../config/supabase';
import { 
  AdminState, 
  AdminDashboardStats, 
  AdminActivity,
  ProductFormData,
  BrandFormData,
  CategoryFormData,
  FileUploadResult,
  AdminOperationResponse
} from '../types/admin';

// Initial state
const initialState: AdminState = {
  // Dashboard data
  dashboardStats: null,
  recentActivity: [],
  
  // Current admin user
  currentAdmin: null,
  
  // Form states
  productForm: {
    data: {},
    errors: {},
    isSubmitting: false,
  },
  
  brandForm: {
    data: {},
    errors: {},
    isSubmitting: false,
  },
  
  categoryForm: {
    data: {},
    errors: {},
    isSubmitting: false,
  },
  
  // File upload state
  fileUpload: {
    uploading: false,
    progress: 0,
    error: null,
  },
  
  // Loading states
  dashboardLoading: false,
  activityLoading: false,
  
  // Error states
  dashboardError: null,
  activityError: null,
  operationError: null,
};

/**
 * An async thunk to fetch statistics for the admin dashboard.
 * @returns {Promise<AdminDashboardStats>} A promise that resolves with the dashboard statistics.
 */
export const fetchDashboardStats = createAsyncThunk(
  'admin/fetchDashboardStats',
  async () => {
    // Fetch products count
    const { count: totalProducts } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    // Fetch brands count
    const { count: totalBrands } = await supabase
      .from('brands')
      .select('*', { count: 'exact', head: true });

    // Fetch categories count
    const { count: totalCategories } = await supabase
      .from('categories')
      .select('*', { count: 'exact', head: true });

    // Fetch featured products count
    const { count: featuredProducts } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('is_featured', true);

    // Fetch out of stock products
    const { count: outOfStockProducts } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('stock_quantity', 0);

    // Fetch low stock products (less than 10)
    const { count: lowStockProducts } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .lt('stock_quantity', 10)
      .gt('stock_quantity', 0);

    // Fetch top selling products (mock data for now)
    const { data: topProducts } = await supabase
      .from('products')
      .select(`
        *,
        brand:brands(*)
      `)
      .eq('is_featured', true)
      .limit(5);

    // Fetch top brands by product count
    const { data: topBrandsData } = await supabase
      .from('brands')
      .select(`
        *,
        products(count)
      `)
      .limit(5);

    const stats: AdminDashboardStats = {
      totalProducts: totalProducts || 0,
      totalBrands: totalBrands || 0,
      totalCategories: totalCategories || 0,
      totalUsers: 0, // TODO: Implement user counting
      featuredProducts: featuredProducts || 0,
      outOfStockProducts: outOfStockProducts || 0,
      lowStockProducts: lowStockProducts || 0,
      recentOrders: 0, // TODO: Implement order counting
      totalRevenue: 0, // TODO: Implement revenue calculation
      averageOrderValue: 0, // TODO: Implement AOV calculation
      conversionRate: 0, // TODO: Implement conversion rate
      topSellingProducts: (topProducts || []).map(product => ({
        product,
        salesCount: Math.floor(Math.random() * 100) + 10, // Mock data
        revenue: product.price * (Math.floor(Math.random() * 50) + 5), // Mock data
      })),
      topBrands: (topBrandsData || []).map(brand => ({
        brand,
        productCount: brand.products?.[0]?.count || 0,
        revenue: Math.floor(Math.random() * 10000) + 1000, // Mock data
      })),
      recentActivity: [], // Will be fetched separately
    };

    return stats;
  }
);

/**
 * An async thunk to fetch recent admin activity.
 * @returns {Promise<AdminActivity[]>} A promise that resolves with a list of recent activities.
 */
export const fetchRecentActivity = createAsyncThunk(
  'admin/fetchRecentActivity',
  async () => {
    // Mock activity data for now
    // TODO: Implement proper activity logging in database
    const mockActivity: AdminActivity[] = [
      {
        id: '1',
        type: 'product_created',
        description: 'New product "Holographic Dress" was created',
        entity_id: 'prod-001',
        entity_type: 'product',
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      },
      {
        id: '2',
        type: 'brand_updated',
        description: 'Brand "Aura Couture" was updated',
        entity_id: '550e8400-e29b-41d4-a716-446655440001',
        entity_type: 'brand',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      },
      {
        id: '3',
        type: 'product_updated',
        description: 'Product "Neon LED Jacket" stock updated',
        entity_id: 'prod-002',
        entity_type: 'product',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
      },
    ];

    return mockActivity;
  }
);

/**
 * An async thunk to upload an image to Supabase Storage.
 * @param {object} params - The parameters for the upload.
 * @param {any} params.file - The file to upload.
 * @param {string} [params.bucket='product-images'] - The storage bucket to upload to.
 * @param {string} params.path - The path to upload the file to.
 * @returns {Promise<FileUploadResult>} A promise that resolves with the result of the file upload.
 */
export const uploadImage = createAsyncThunk(
  'admin/uploadImage',
  async ({ file, bucket = 'product-images', path }: { 
    file: any; 
    bucket?: string; 
    path: string; 
  }) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file);

    if (error) {
      throw new Error(error.message);
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    const result: FileUploadResult = {
      url: publicUrl,
      path: data.path,
      size: file.size || 0,
      type: file.type || 'image/jpeg',
    };

    return result;
  }
);

/**
 * An async thunk to create a new product.
 * @param {ProductFormData} productData - The data for the new product.
 * @returns {Promise<any>} A promise that resolves with the newly created product data.
 */
export const createProduct = createAsyncThunk(
  'admin/createProduct',
  async (productData: ProductFormData) => {
    const { data, error } = await supabase
      .from('products')
      .insert([{
        ...productData,
        id: `prod-${Date.now()}`, // Generate unique ID
      }])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }
);

/**
 * An async thunk to update an existing product.
 * @param {object} params - The parameters for the update.
 * @param {string} params.id - The ID of the product to update.
 * @param {Partial<ProductFormData>} params.updateData - The data to update.
 * @returns {Promise<any>} A promise that resolves with the updated product data.
 */
export const updateProduct = createAsyncThunk(
  'admin/updateProduct',
  async ({ id, ...updateData }: { id: string } & Partial<ProductFormData>) => {
    const { data, error } = await supabase
      .from('products')
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
 * An async thunk to delete a product.
 * @param {string} productId - The ID of the product to delete.
 * @returns {Promise<string>} A promise that resolves with the ID of the deleted product.
 */
export const deleteProduct = createAsyncThunk(
  'admin/deleteProduct',
  async (productId: string) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) {
      throw new Error(error.message);
    }

    return productId;
  }
);

// Admin slice
const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    /**
     * Sets the data for the product form.
     * @param {AdminState} state - The current state.
     * @param {PayloadAction<Partial<ProductFormData>>} action - The action containing the form data.
     */
    setProductFormData: (state, action: PayloadAction<Partial<ProductFormData>>) => {
      state.productForm.data = { ...state.productForm.data, ...action.payload };
    },
    
    /**
     * Sets the errors for the product form.
     * @param {AdminState} state - The current state.
     * @param {PayloadAction<Record<string, string>>} action - The action containing the form errors.
     */
    setProductFormErrors: (state, action: PayloadAction<Record<string, string>>) => {
      state.productForm.errors = action.payload;
    },
    
    /**
     * Clears the product form data and errors.
     * @param {AdminState} state - The current state.
     */
    clearProductForm: (state) => {
      state.productForm = {
        data: {},
        errors: {},
        isSubmitting: false,
      };
    },
    
    /**
     * Sets the data for the brand form.
     * @param {AdminState} state - The current state.
     * @param {PayloadAction<Partial<BrandFormData>>} action - The action containing the form data.
     */
    setBrandFormData: (state, action: PayloadAction<Partial<BrandFormData>>) => {
      state.brandForm.data = { ...state.brandForm.data, ...action.payload };
    },
    
    /**
     * Sets the errors for the brand form.
     * @param {AdminState} state - The current state.
     * @param {PayloadAction<Record<string, string>>} action - The action containing the form errors.
     */
    setBrandFormErrors: (state, action: PayloadAction<Record<string, string>>) => {
      state.brandForm.errors = action.payload;
    },
    
    /**
     * Clears the brand form data and errors.
     * @param {AdminState} state - The current state.
     */
    clearBrandForm: (state) => {
      state.brandForm = {
        data: {},
        errors: {},
        isSubmitting: false,
      };
    },
    
    /**
     * Sets the progress of a file upload.
     * @param {AdminState} state - The current state.
     * @param {PayloadAction<number>} action - The action containing the upload progress.
     */
    setUploadProgress: (state, action: PayloadAction<number>) => {
      state.fileUpload.progress = action.payload;
    },
    
    /**
     * Clears any file upload errors.
     * @param {AdminState} state - The current state.
     */
    clearUploadError: (state) => {
      state.fileUpload.error = null;
    },
    
    /**
     * Clears any dashboard-related errors.
     * @param {AdminState} state - The current state.
     */
    clearDashboardError: (state) => {
      state.dashboardError = null;
    },
    
    /**
     * Clears any operation-related errors.
     * @param {AdminState} state - The current state.
     */
    clearOperationError: (state) => {
      state.operationError = null;
    },
    
    /**
     * Resets the admin state to its initial state.
     * @param {AdminState} state - The current state.
     */
    resetAdminState: (state) => {
      return { ...initialState };
    },
  },
  extraReducers: (builder) => {
    // Fetch dashboard stats
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.dashboardLoading = true;
        state.dashboardError = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.dashboardLoading = false;
        state.dashboardStats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.dashboardLoading = false;
        state.dashboardError = action.error.message || 'Failed to fetch dashboard stats';
      });

    // Fetch recent activity
    builder
      .addCase(fetchRecentActivity.pending, (state) => {
        state.activityLoading = true;
        state.activityError = null;
      })
      .addCase(fetchRecentActivity.fulfilled, (state, action) => {
        state.activityLoading = false;
        state.recentActivity = action.payload;
      })
      .addCase(fetchRecentActivity.rejected, (state, action) => {
        state.activityLoading = false;
        state.activityError = action.error.message || 'Failed to fetch activity';
      });

    // Upload image
    builder
      .addCase(uploadImage.pending, (state) => {
        state.fileUpload.uploading = true;
        state.fileUpload.error = null;
        state.fileUpload.progress = 0;
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.fileUpload.uploading = false;
        state.fileUpload.progress = 100;
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.fileUpload.uploading = false;
        state.fileUpload.error = action.error.message || 'Upload failed';
        state.fileUpload.progress = 0;
      });

    // Create product
    builder
      .addCase(createProduct.pending, (state) => {
        state.productForm.isSubmitting = true;
        state.operationError = null;
      })
      .addCase(createProduct.fulfilled, (state) => {
        state.productForm.isSubmitting = false;
        state.productForm = {
          data: {},
          errors: {},
          isSubmitting: false,
        };
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.productForm.isSubmitting = false;
        state.operationError = action.error.message || 'Failed to create product';
      });
  },
});

// Export actions
export const {
  setProductFormData,
  setProductFormErrors,
  clearProductForm,
  setBrandFormData,
  setBrandFormErrors,
  clearBrandForm,
  setUploadProgress,
  clearUploadError,
  clearDashboardError,
  clearOperationError,
  resetAdminState,
} = adminSlice.actions;

// Export reducer
export default adminSlice.reducer;
