/**
 * Product-related TypeScript type definitions
 * Provides comprehensive typing for all product entities and operations
 */

export interface Product {
  id: string;
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
  created_at: string;
  updated_at: string;
  
  // Populated relationships
  brand?: Brand;
  product_images?: ProductImage[];
  categories?: Category[];
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string;
  is_primary: boolean;
  sort_order: number;
  created_at: string;
}

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
}

export interface Brand {
  id: string;
  name: string;
  description: string;
  logo_url: string;
  website_url: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  
  // Populated relationships
  products?: Product[];
}

// Filter and search types
export interface ProductFilters {
  brands?: string[];
  categories?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  sizes?: string[];
  colors?: string[];
  isFeatured?: boolean;
  inStock?: boolean;
}

export interface ProductSearchParams {
  query?: string;
  filters?: ProductFilters;
  sortBy?: ProductSortOption;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export type ProductSortOption = 
  | 'name'
  | 'price'
  | 'created_at'
  | 'updated_at'
  | 'popularity'
  | 'brand';

// API response types
export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface BrandsResponse {
  brands: Brand[];
  total: number;
}

export interface CategoriesResponse {
  categories: Category[];
  total: number;
}

// Redux state types
export interface ProductState {
  // Product data
  products: Product[];
  selectedProduct: Product | null;
  featuredProducts: Product[];
  
  // Brands data
  brands: Brand[];
  selectedBrand: Brand | null;
  featuredBrands: Brand[];
  
  // Categories data
  categories: Category[];
  selectedCategory: Category | null;
  
  // Search and filtering
  searchQuery: string;
  filters: ProductFilters;
  sortBy: ProductSortOption;
  sortOrder: 'asc' | 'desc';
  
  // Pagination
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  
  // Loading states
  loading: boolean;
  searchLoading: boolean;
  brandsLoading: boolean;
  categoriesLoading: boolean;
  
  // Error states
  error: string | null;
  searchError: string | null;
  brandsError: string | null;
  categoriesError: string | null;
}

// Component prop types
export interface ProductCardProps {
  product: Product;
  onPress?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  onToggleFavorite?: (product: Product) => void;
  showBrand?: boolean;
  showPrice?: boolean;
  compact?: boolean;
}

export interface ProductGridProps {
  products: Product[];
  onProductPress?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  onToggleFavorite?: (product: Product) => void;
  loading?: boolean;
  numColumns?: number;
  showLoadMore?: boolean;
  onLoadMore?: () => void;
}

export interface ProductFilterProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  brands: Brand[];
  categories: Category[];
  priceRange: { min: number; max: number };
  onApply: () => void;
  onReset: () => void;
}

export interface ProductSearchProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSearch: (query: string) => void;
  suggestions?: string[];
  loading?: boolean;
  placeholder?: string;
}

// Utility types
export interface ProductCreateInput {
  name: string;
  description: string;
  price: number;
  brand_id: string;
  category: string;
  sizes: string[];
  colors: string[];
  images: string[];
  is_featured?: boolean;
  stock_quantity: number;
}

export interface ProductUpdateInput extends Partial<ProductCreateInput> {
  id: string;
}

export interface BrandCreateInput {
  name: string;
  description: string;
  logo_url: string;
  website_url: string;
  is_featured?: boolean;
}

export interface BrandUpdateInput extends Partial<BrandCreateInput> {
  id: string;
}

export interface CategoryCreateInput {
  name: string;
  description: string;
  parent_id?: string;
}

export interface CategoryUpdateInput extends Partial<CategoryCreateInput> {
  id: string;
}

// Error types
export interface ProductError {
  code: string;
  message: string;
  field?: string;
}

export interface ProductValidationError {
  field: string;
  message: string;
}

// Admin types
export interface ProductStats {
  totalProducts: number;
  totalBrands: number;
  totalCategories: number;
  featuredProducts: number;
  outOfStock: number;
  lowStock: number;
  averagePrice: number;
  topBrands: Array<{
    brand: Brand;
    productCount: number;
  }>;
  topCategories: Array<{
    category: Category;
    productCount: number;
  }>;
}
