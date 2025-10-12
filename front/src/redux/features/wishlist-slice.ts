import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import { WishlistItem } from '@/types/wishlist';
import {
  getWishlistAction,
  addToWishlistAction,
  removeFromWishlistAction,
} from '@/get-api-data/wishlist';
import { RootState } from '../store';

interface WishlistState {
  items: WishlistItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: WishlistState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (identifiers: { user?: string; guestUid?: string }, { rejectWithValue }) => {
    try {
      const response = await getWishlistAction(identifiers);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (
    payload: { productId: string; user?: string; guestUid?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await addToWishlistAction(payload);
      toast.success('Product added to wishlist!');
      return response;
    } catch (error: any) {
      toast.error('Failed to add product to wishlist.');
      return rejectWithValue(error.message);
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (
    payload: { productId: string; user?: string; guestUid?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await removeFromWishlistAction(payload);
      toast.error('Product removed from wishlist!');
      return response;
    } catch (error: any) {
      toast.error('Failed to remove product from wishlist.');
      return rejectWithValue(error.message);
    }
  }
);

export const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    setWishlistItems: (state, action: PayloadAction<WishlistItem[]>) => {
      state.items = action.payload;
    },
    resetWishlistStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWishlist.fulfilled, (state, action: PayloadAction<WishlistItem[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(addToWishlist.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addToWishlist.fulfilled, (state, action: PayloadAction<WishlistItem[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(removeFromWishlist.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(removeFromWishlist.fulfilled, (state, action: PayloadAction<WishlistItem[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { setWishlistItems, resetWishlistStatus } = wishlistSlice.actions;
export default wishlistSlice.reducer;

// Selectors
export const selectWishlistItems = (state: RootState) => state.wishlist.items;
export const selectWishlistStatus = (state: RootState) => state.wishlist.status;
export const selectWishlistError = (state: RootState) => state.wishlist.error;
