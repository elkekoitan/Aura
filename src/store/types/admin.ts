/**
 * Admin-related TypeScript type definitions
 * Provides comprehensive typing for admin operations and dashboard functionality
 */

import { Product, Brand, Category } from './product';

// Admin user types
export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'super_admin' | 'moderator';
  permissions: AdminPermission[];
  created_at: string;
  last_login: string;
}

export type AdminPermission = 
  | 'products.create'
  | 'products.read'
  | 'products.update'
  | 'products.delete'
  | 'brands.create'
  | 'brands.read'
  | 'brands.update'
  | 'brands.delete'
  | 'categories.create'
  | 'categories.read'
  | 'categories.update'
  | 'categories.delete'
  | 'users.read'
  | 'users.update'
  | 'analytics.read';

// Dashboard statistics
export interface AdminDashboardStats {
  totalProducts: number;
  totalBrands: number;
  totalCategories: number;
  totalUsers: number;
  featuredProducts: number;
  outOfStockProducts: number;
  lowStockProducts: number;
  recentOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  conversionRate: number;
  topSellingProducts: Array<{
    product: Product;
    salesCount: number;
    revenue: number;
  }>;
  topBrands: Array<{
    brand: Brand;
    productCount: number;
    revenue: number;
  }>;
  recentActivity: AdminActivity[];
}

export interface AdminActivity {
  id: string;
  type: 'product_created' | 'product_updated' | 'brand_created' | 'brand_updated' | 'user_registered' | 'order_placed';
  description: string;
  user_id?: string;
  entity_id?: string;
  entity_type?: 'product' | 'brand' | 'category' | 'user' | 'order';
  created_at: string;
  metadata?: Record<string, any>;
}

// Form types for admin operations
export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  brand_id: string;
  category: string;
  sizes: string[];
  colors: string[];
  images: string[];
  is_featured: boolean;
  stock_quantity: number;
}

export interface BrandFormData {
  name: string;
  description: string;
  logo_url: string;
  website_url: string;
  is_featured: boolean;
}

export interface CategoryFormData {
  name: string;
  description: string;
  parent_id?: string;
}

// File upload types
export interface FileUploadResult {
  url: string;
  path: string;
  size: number;
  type: string;
}

export interface ImageUploadOptions {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  quality?: number; // 0-1 for compression
  maxWidth?: number;
  maxHeight?: number;
}

// Admin state types
export interface AdminState {
  // Dashboard data
  dashboardStats: AdminDashboardStats | null;
  recentActivity: AdminActivity[];
  
  // Current admin user
  currentAdmin: AdminUser | null;
  
  // Form states
  productForm: {
    data: Partial<ProductFormData>;
    errors: Record<string, string>;
    isSubmitting: boolean;
  };
  
  brandForm: {
    data: Partial<BrandFormData>;
    errors: Record<string, string>;
    isSubmitting: boolean;
  };
  
  categoryForm: {
    data: Partial<CategoryFormData>;
    errors: Record<string, string>;
    isSubmitting: boolean;
  };
  
  // File upload state
  fileUpload: {
    uploading: boolean;
    progress: number;
    error: string | null;
  };
  
  // Loading states
  dashboardLoading: boolean;
  activityLoading: boolean;
  
  // Error states
  dashboardError: string | null;
  activityError: string | null;
  operationError: string | null;
}

// API response types
export interface AdminDashboardResponse {
  stats: AdminDashboardStats;
  activity: AdminActivity[];
}

export interface AdminOperationResponse {
  success: boolean;
  message: string;
  data?: any;
}

// Component prop types
export interface AdminCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onPress?: () => void;
}

export interface AdminStatsGridProps {
  stats: AdminDashboardStats;
  loading?: boolean;
  onStatPress?: (statType: string) => void;
}

export interface ProductFormProps {
  initialData?: Partial<ProductFormData>;
  onSubmit: (data: ProductFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  brands: Brand[];
  categories: Category[];
}

export interface BrandFormProps {
  initialData?: Partial<BrandFormData>;
  onSubmit: (data: BrandFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export interface ImageUploaderProps {
  onUpload: (result: FileUploadResult) => void;
  onError: (error: string) => void;
  options?: ImageUploadOptions;
  currentImage?: string;
  placeholder?: string;
  style?: any;
}

export interface AdminListProps<T> {
  items: T[];
  loading?: boolean;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onAdd?: () => void;
  renderItem: (item: T) => React.ReactNode;
  emptyMessage?: string;
  searchQuery?: string;
  onSearch?: (query: string) => void;
}

// Validation types
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface ValidationSchema {
  [key: string]: ValidationRule;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// Permission checking
export interface PermissionCheck {
  hasPermission: (permission: AdminPermission) => boolean;
  hasAnyPermission: (permissions: AdminPermission[]) => boolean;
  hasAllPermissions: (permissions: AdminPermission[]) => boolean;
  canManageProducts: () => boolean;
  canManageBrands: () => boolean;
  canManageCategories: () => boolean;
  canViewAnalytics: () => boolean;
}

// Error types
export interface AdminError {
  code: string;
  message: string;
  field?: string;
  details?: any;
}

export interface AdminValidationError {
  field: string;
  message: string;
  value?: any;
}
