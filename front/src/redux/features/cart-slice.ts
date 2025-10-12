import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { CartItem } from '@/types/cart';
import {
  getCartAction,
  addToCartAction,
  removeFromCartAction,
  updateQuantityAction,
  clearCartAction,
} from '@/get-api-data/cart';
import { RootState } from '../store';

// Define common types for payloads
interface Identifiers {
  user?: string;
  guestUid?: string;
}

interface CartState {
  items: CartItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CartState = {
  items: [],
  status: 'idle',
  error: null,
};

// Async Thunks
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (payload: { user?: string; guestUid?: string }, { rejectWithValue }) => {
    try {
      const response = await getCartAction(payload);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (
    payload: { productId: string; qty: number; user?: string; guestUid?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await addToCartAction(payload);
      toast.success('Product added to cart!');
      return response;
    } catch (error: any) {
      toast.error('Failed to add product to cart.');
      return rejectWithValue(error.message);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (payload: { productId: string; user?: string; guestUid?: string }, { rejectWithValue }) => {
    try {
      const response = await removeFromCartAction(payload);
      toast.error('Product removed from cart.');
      return response;
    } catch (error: any) {
      toast.error('Failed to remove product from cart.');
      return rejectWithValue(error.message);
    }
  }
);

export const updateQuantity = createAsyncThunk(
  'cart/updateQuantity',
  async (
    payload: { productId: string; qty: number; user?: string; guestUid?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await updateQuantityAction(payload);
      toast.success('Cart quantity updated!');
      return response;
    } catch (error: any) {
      toast.error('Failed to update quantity.');
      return rejectWithValue(error.message);
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (payload: { user?: string; guestUid?: string; silent?: boolean }, { rejectWithValue }) => {
    try {
      const response = await clearCartAction(payload);
      if (!payload.silent) {
        toast.success('Cart cleared!');
      }
      return response;
    } catch (error: any) {
      if (!payload.silent) {
        toast.error('Failed to clear cart.');
      }
      return rejectWithValue(error.message);
    }
  }
);

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
    resetCartStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCart.fulfilled, (state, action: PayloadAction<CartItem[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(addToCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addToCart.fulfilled, (state, action: PayloadAction<CartItem[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(removeFromCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(removeFromCart.fulfilled, (state, action: PayloadAction<CartItem[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(updateQuantity.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateQuantity.fulfilled, (state, action: PayloadAction<CartItem[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(updateQuantity.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(clearCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(clearCart.fulfilled, (state, action: PayloadAction<CartItem[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { setCartItems, resetCartStatus } = cartSlice.actions;
export default cartSlice.reducer;

// Selectors
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartStatus = (state: RootState) => state.cart.status;
export const selectCartError = (state: RootState) => state.cart.error;