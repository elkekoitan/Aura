/**
 * Cart Redux Slice
 * Manages shopping cart state, operations, and checkout functionality
 * Integrates with local storage for persistence
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  CartState, 
  CartItem, 
  CartSummary,
  AddToCartParams,
  UpdateCartItemParams,
  RemoveFromCartParams,
  CheckoutData,
  Order
} from '../types/cart';
import { Product } from '../types/product';

// Constants
const CART_STORAGE_KEY = '@aura_cart';
const TAX_RATE = 0.08; // 8% tax rate
const FREE_SHIPPING_THRESHOLD = 100; // Free shipping over $100
const STANDARD_SHIPPING_COST = 9.99;

// Initial state
const initialState: CartState = {
  items: [],
  summary: {
    subtotal: 0,
    tax: 0,
    shipping: 0,
    discount: 0,
    total: 0,
    itemCount: 0,
  },
  
  // Loading states
  loading: false,
  addingItem: false,
  removingItem: false,
  updatingQuantity: false,
  
  // Error states
  error: null,
  
  // Checkout state
  isCheckingOut: false,
  checkoutError: null,
};

/**
 * Calculate cart summary
 */
const calculateSummary = (items: CartItem[]): CartSummary => {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const tax = subtotal * TAX_RATE;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
  const discount = 0; // TODO: Implement promo codes
  const total = subtotal + tax + shipping - discount;

  return {
    subtotal,
    tax,
    shipping,
    discount,
    total,
    itemCount,
  };
};

/**
 * Load cart from storage
 */
export const loadCartFromStorage = createAsyncThunk(
  'cart/loadFromStorage',
  async () => {
    try {
      const cartData = await AsyncStorage.getItem(CART_STORAGE_KEY);
      if (cartData) {
        const items: CartItem[] = JSON.parse(cartData);
        return items;
      }
      return [];
    } catch (error) {
      console.error('Failed to load cart from storage:', error);
      return [];
    }
  }
);

/**
 * Save cart to storage
 */
export const saveCartToStorage = createAsyncThunk(
  'cart/saveToStorage',
  async (items: CartItem[]) => {
    try {
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      return items;
    } catch (error) {
      console.error('Failed to save cart to storage:', error);
      throw error;
    }
  }
);

/**
 * Add item to cart
 */
export const addToCart = createAsyncThunk(
  'cart/addItem',
  async (params: AddToCartParams, { getState, dispatch }) => {
    const { product, quantity, selectedSize, selectedColor } = params;
    const state = getState() as { cart: CartState };
    
    // Check if item already exists in cart
    const existingItemIndex = state.cart.items.findIndex(item => 
      item.product.id === product.id &&
      item.selectedSize === selectedSize &&
      item.selectedColor === selectedColor
    );

    let newItems: CartItem[];

    if (existingItemIndex >= 0) {
      // Update existing item quantity
      newItems = [...state.cart.items];
      newItems[existingItemIndex] = {
        ...newItems[existingItemIndex],
        quantity: newItems[existingItemIndex].quantity + quantity,
      };
    } else {
      // Add new item
      const newItem: CartItem = {
        id: `${product.id}-${selectedSize || 'no-size'}-${selectedColor || 'no-color'}-${Date.now()}`,
        product,
        quantity,
        selectedSize,
        selectedColor,
        price: product.price,
        addedAt: new Date().toISOString(),
      };
      newItems = [...state.cart.items, newItem];
    }

    // Save to storage
    await dispatch(saveCartToStorage(newItems));
    
    return newItems;
  }
);

/**
 * Update cart item quantity
 */
export const updateCartItemQuantity = createAsyncThunk(
  'cart/updateQuantity',
  async (params: UpdateCartItemParams, { getState, dispatch }) => {
    const { itemId, quantity } = params;
    const state = getState() as { cart: CartState };
    
    const newItems = state.cart.items.map(item =>
      item.id === itemId ? { ...item, quantity } : item
    );

    // Save to storage
    await dispatch(saveCartToStorage(newItems));
    
    return newItems;
  }
);

/**
 * Remove item from cart
 */
export const removeFromCart = createAsyncThunk(
  'cart/removeItem',
  async (params: RemoveFromCartParams, { getState, dispatch }) => {
    const { itemId } = params;
    const state = getState() as { cart: CartState };
    
    const newItems = state.cart.items.filter(item => item.id !== itemId);

    // Save to storage
    await dispatch(saveCartToStorage(newItems));
    
    return newItems;
  }
);

/**
 * Clear entire cart
 */
export const clearCart = createAsyncThunk(
  'cart/clear',
  async (_, { dispatch }) => {
    await dispatch(saveCartToStorage([]));
    return [];
  }
);

/**
 * Process checkout
 */
export const processCheckout = createAsyncThunk(
  'cart/processCheckout',
  async (checkoutData: CheckoutData, { getState }) => {
    const state = getState() as { cart: CartState };
    
    // Simulate checkout process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create mock order
    const order: Order = {
      id: `order-${Date.now()}`,
      orderNumber: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      status: 'confirmed',
      items: state.cart.items,
      summary: state.cart.summary,
      shippingAddress: checkoutData.shippingAddress,
      billingAddress: checkoutData.billingAddress,
      paymentMethod: checkoutData.paymentMethod,
      shippingMethod: checkoutData.shippingMethod,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    };

    return order;
  }
);

// Cart slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Clear errors
    clearError: (state) => {
      state.error = null;
    },
    
    clearCheckoutError: (state) => {
      state.checkoutError = null;
    },
    
    // Reset cart state
    resetCartState: (state) => {
      return { ...initialState };
    },
  },
  extraReducers: (builder) => {
    // Load cart from storage
    builder
      .addCase(loadCartFromStorage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadCartFromStorage.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.summary = calculateSummary(action.payload);
      })
      .addCase(loadCartFromStorage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to load cart';
      });

    // Add to cart
    builder
      .addCase(addToCart.pending, (state) => {
        state.addingItem = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.addingItem = false;
        state.items = action.payload;
        state.summary = calculateSummary(action.payload);
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.addingItem = false;
        state.error = action.error.message || 'Failed to add item to cart';
      });

    // Update quantity
    builder
      .addCase(updateCartItemQuantity.pending, (state) => {
        state.updatingQuantity = true;
        state.error = null;
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.updatingQuantity = false;
        state.items = action.payload;
        state.summary = calculateSummary(action.payload);
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.updatingQuantity = false;
        state.error = action.error.message || 'Failed to update quantity';
      });

    // Remove from cart
    builder
      .addCase(removeFromCart.pending, (state) => {
        state.removingItem = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.removingItem = false;
        state.items = action.payload;
        state.summary = calculateSummary(action.payload);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.removingItem = false;
        state.error = action.error.message || 'Failed to remove item';
      });

    // Clear cart
    builder
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.summary = calculateSummary([]);
      });

    // Process checkout
    builder
      .addCase(processCheckout.pending, (state) => {
        state.isCheckingOut = true;
        state.checkoutError = null;
      })
      .addCase(processCheckout.fulfilled, (state, action) => {
        state.isCheckingOut = false;
        // Clear cart after successful checkout
        state.items = [];
        state.summary = calculateSummary([]);
      })
      .addCase(processCheckout.rejected, (state, action) => {
        state.isCheckingOut = false;
        state.checkoutError = action.error.message || 'Checkout failed';
      });
  },
});

// Export actions
export const {
  clearError,
  clearCheckoutError,
  resetCartState,
} = cartSlice.actions;

// Export reducer
export default cartSlice.reducer;
