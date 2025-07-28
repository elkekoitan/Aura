export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  category: string;
  description: string;
  sizes?: string[];
  colors?: string[];
  stock_quantity: number;
  rating: number;
  reviews_count: number;
  is_featured: boolean;
  tags: string[];
}

export interface CartItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  category: string;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
}

export interface Brand {
  id: string;
  name: string;
  logo?: string;
}
