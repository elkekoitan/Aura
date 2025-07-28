/**
 * Brand-related TypeScript type definitions
 * Provides comprehensive typing for brand entities and operations
 */

import { Product } from './product';

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
  product_count?: number;
}

export interface BrandStats {
  id: string;
  name: string;
  product_count: number;
  average_price: number;
  price_range: {
    min: number;
    max: number;
  };
  categories: string[];
  featured_products: Product[];
}

export interface BrandFilters {
  featured?: boolean;
  hasProducts?: boolean;
  searchQuery?: string;
}

export interface BrandSearchParams {
  query?: string;
  filters?: BrandFilters;
  sortBy?: BrandSortOption;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export type BrandSortOption = 
  | 'name'
  | 'created_at'
  | 'product_count'
  | 'popularity';

export interface BrandsResponse {
  brands: Brand[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface BrandState {
  brands: Brand[];
  selectedBrand: Brand | null;
  featuredBrands: Brand[];
  brandStats: BrandStats[];
  
  // Search and filtering
  searchQuery: string;
  filters: BrandFilters;
  sortBy: BrandSortOption;
  sortOrder: 'asc' | 'desc';
  
  // Pagination
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  
  // Loading states
  loading: boolean;
  searchLoading: boolean;
  statsLoading: boolean;
  
  // Error states
  error: string | null;
  searchError: string | null;
  statsError: string | null;
}

export interface BrandCardProps {
  brand: Brand;
  onPress?: (brand: Brand) => void;
  onFollow?: (brand: Brand) => void;
  showStats?: boolean;
  showProducts?: boolean;
  compact?: boolean;
}

export interface BrandGridProps {
  brands: Brand[];
  onBrandPress?: (brand: Brand) => void;
  onFollow?: (brand: Brand) => void;
  loading?: boolean;
  numColumns?: number;
  showLoadMore?: boolean;
  onLoadMore?: () => void;
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
