/**
 * Order Redux Slice
 * Manages order state, operations, and tracking functionality
 * Integrates with backend for order management
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  OrderState, 
  Order,
  OrderTracking,
  TrackingEvent,
  OrderFilters,
  OrderSearchParams,
  CreateOrderParams,
  UpdateOrderParams,
  OrderStatus
} from '../types/order';

// Initial state
const initialState: OrderState = {
  // Orders data
  orders: [],
  selectedOrder: null,
  orderTracking: {},
  
  // Search and filters
  searchQuery: '',
  filters: {},
  sortBy: 'created_at',
  sortOrder: 'desc',
  
  // Pagination
  currentPage: 1,
  totalPages: 1,
  totalOrders: 0,
  hasMore: false,
  
  // Loading states
  loading: false,
  trackingLoading: false,
  updatingOrder: false,
  
  // Error states
  error: null,
  trackingError: null,
};

/**
 * Fetch user orders
 */
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (params: OrderSearchParams = {}) => {
    // Mock API call - replace with actual backend API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate mock orders
    const mockOrders: Order[] = [
      {
        id: 'order-001',
        orderNumber: 'ORD-2024-001',
        status: 'delivered',
        items: [], // Would be populated with actual cart items
        summary: {
          subtotal: 299.99,
          tax: 24.00,
          shipping: 9.99,
          discount: 0,
          total: 333.98,
          itemCount: 2,
        },
        shippingAddress: {
          firstName: 'John',
          lastName: 'Doe',
          address1: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'US',
        },
        paymentMethod: {
          type: 'card',
          cardLast4: '4242',
          cardBrand: 'visa',
        },
        shippingMethod: {
          id: 'standard',
          name: 'Standard Shipping',
          description: '5-7 business days',
          price: 9.99,
          estimatedDays: '5-7 days',
        },
        trackingNumber: 'TRK123456789',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedDelivery: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        actualDelivery: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        customerId: 'customer-001',
      },
      {
        id: 'order-002',
        orderNumber: 'ORD-2024-002',
        status: 'shipped',
        items: [],
        summary: {
          subtotal: 149.99,
          tax: 12.00,
          shipping: 0,
          discount: 15.00,
          total: 146.99,
          itemCount: 1,
        },
        shippingAddress: {
          firstName: 'John',
          lastName: 'Doe',
          address1: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'US',
        },
        paymentMethod: {
          type: 'card',
          cardLast4: '4242',
          cardBrand: 'visa',
        },
        shippingMethod: {
          id: 'express',
          name: 'Express Shipping',
          description: '2-3 business days',
          price: 19.99,
          estimatedDays: '2-3 days',
        },
        trackingNumber: 'TRK987654321',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedDelivery: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        customerId: 'customer-001',
      },
    ];

    return {
      orders: mockOrders,
      totalOrders: mockOrders.length,
      totalPages: 1,
      hasMore: false,
    };
  }
);

/**
 * Fetch order by ID
 */
export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (orderId: string) => {
    // Mock API call - replace with actual backend API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock order (would fetch from backend)
    const mockOrder: Order = {
      id: orderId,
      orderNumber: 'ORD-2024-001',
      status: 'delivered',
      items: [],
      summary: {
        subtotal: 299.99,
        tax: 24.00,
        shipping: 9.99,
        discount: 0,
        total: 333.98,
        itemCount: 2,
      },
      shippingAddress: {
        firstName: 'John',
        lastName: 'Doe',
        address1: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'US',
      },
      paymentMethod: {
        type: 'card',
        cardLast4: '4242',
        cardBrand: 'visa',
      },
      shippingMethod: {
        id: 'standard',
        name: 'Standard Shipping',
        description: '5-7 business days',
        price: 9.99,
        estimatedDays: '5-7 days',
      },
      trackingNumber: 'TRK123456789',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedDelivery: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      actualDelivery: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      customerId: 'customer-001',
    };

    return mockOrder;
  }
);

/**
 * Fetch order tracking
 */
export const fetchOrderTracking = createAsyncThunk(
  'orders/fetchOrderTracking',
  async (orderId: string) => {
    // Mock API call - replace with actual tracking API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockTracking: OrderTracking = {
      orderId,
      trackingNumber: 'TRK123456789',
      carrier: 'FedEx',
      status: 'delivered',
      estimatedDelivery: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      currentLocation: 'New York, NY',
      lastUpdated: new Date().toISOString(),
      events: [
        {
          id: 'event-1',
          orderId,
          status: 'confirmed',
          description: 'Order confirmed and payment processed',
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 'event-2',
          orderId,
          status: 'processing',
          description: 'Order is being prepared for shipment',
          location: 'Fulfillment Center - NJ',
          timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 'event-3',
          orderId,
          status: 'shipped',
          description: 'Package shipped and in transit',
          location: 'Newark, NJ',
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 'event-4',
          orderId,
          status: 'shipped',
          description: 'Package arrived at sorting facility',
          location: 'Queens, NY',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 'event-5',
          orderId,
          status: 'delivered',
          description: 'Package delivered successfully',
          location: 'New York, NY',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ],
    };

    return mockTracking;
  }
);

/**
 * Update order status
 */
export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async (params: UpdateOrderParams) => {
    // Mock API call - replace with actual backend API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return params;
  }
);

// Order slice
const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    // Search and filters
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    
    setFilters: (state, action: PayloadAction<OrderFilters>) => {
      state.filters = action.payload;
    },
    
    clearFilters: (state) => {
      state.filters = {};
      state.searchQuery = '';
    },
    
    setSortBy: (state, action: PayloadAction<OrderState['sortBy']>) => {
      state.sortBy = action.payload;
    },
    
    setSortOrder: (state, action: PayloadAction<OrderState['sortOrder']>) => {
      state.sortOrder = action.payload;
    },
    
    // Selected order
    setSelectedOrder: (state, action: PayloadAction<Order | null>) => {
      state.selectedOrder = action.payload;
    },
    
    // Error management
    clearError: (state) => {
      state.error = null;
    },
    
    clearTrackingError: (state) => {
      state.trackingError = null;
    },
    
    // Reset state
    resetOrderState: (state) => {
      return { ...initialState };
    },
  },
  extraReducers: (builder) => {
    // Fetch orders
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.totalOrders = action.payload.totalOrders;
        state.totalPages = action.payload.totalPages;
        state.hasMore = action.payload.hasMore;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch orders';
      });

    // Fetch order by ID
    builder
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch order';
      });

    // Fetch order tracking
    builder
      .addCase(fetchOrderTracking.pending, (state) => {
        state.trackingLoading = true;
        state.trackingError = null;
      })
      .addCase(fetchOrderTracking.fulfilled, (state, action) => {
        state.trackingLoading = false;
        state.orderTracking[action.payload.orderId] = action.payload;
      })
      .addCase(fetchOrderTracking.rejected, (state, action) => {
        state.trackingLoading = false;
        state.trackingError = action.error.message || 'Failed to fetch tracking';
      });

    // Update order status
    builder
      .addCase(updateOrderStatus.pending, (state) => {
        state.updatingOrder = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.updatingOrder = false;
        // Update order in list
        const orderIndex = state.orders.findIndex(order => order.id === action.payload.orderId);
        if (orderIndex >= 0) {
          state.orders[orderIndex] = { ...state.orders[orderIndex], ...action.payload };
        }
        // Update selected order
        if (state.selectedOrder?.id === action.payload.orderId) {
          state.selectedOrder = { ...state.selectedOrder, ...action.payload };
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.updatingOrder = false;
        state.error = action.error.message || 'Failed to update order';
      });
  },
});

// Export actions
export const {
  setSearchQuery,
  setFilters,
  clearFilters,
  setSortBy,
  setSortOrder,
  setSelectedOrder,
  clearError,
  clearTrackingError,
  resetOrderState,
} = orderSlice.actions;

// Export reducer
export default orderSlice.reducer;
