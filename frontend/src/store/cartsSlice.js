import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import SummaryApi from "../common";

// Async thunk for fetching products

export const fetchUserCartData = createAsyncThunk(
  "carts/fetchUserCartData",
  async (_, { rejectWithValue, getState }) => {
    const state = getState();
    const userId = state.user.user?._id;
    const products = state.products.products;
    if (!userId) {
      // Handle unauthenticated case
      const localCart = JSON.parse(localStorage.getItem("cart"));
      if (localCart && localCart.items) {
        const productIds = localCart.items.map((item) => item.productId);
        const productsData = products?.data?.filter((product) =>
          productIds.includes(product._id)
        );
        const cartData = localCart.items.map((item) => ({
          ...item,
          productId: productsData?.find((p) => p._id === item.productId),
        }));
        return { data: cartData };
      }
      return { data: [] };
    }

    try {
      const response = await fetch(SummaryApi.addToCartProductView.url, {
        method: SummaryApi.addToCartProductView.method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const cartData = await response.json();
      if (cartData.error) {
        return { data: [] };
      }
      return cartData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserAddToCartCount = createAsyncThunk(
  "carts/fetchUserAddToCartCount",
  async (_, { rejectWithValue, getState }) => {
    const state = getState();
    const userId = state.user.user?._id;

    if (!userId) {
      // Handle unauthenticated case
      const localCart = JSON.parse(localStorage.getItem("cart"));
      if (localCart && localCart.items) {
        // For unauthorized users: Get cart count from local storage
        const localCart = JSON.parse(localStorage.getItem("cart"));
        const cartProductCount = localCart
          ? localCart?.items?.reduce((acc, item) => acc + item.quantity, 0)
          : 0;
        return { data: { count: cartProductCount } };
      }
      return { data: { count: 0 } };
    }

    try {
      const dataResponse = await fetch(SummaryApi.addToCartProductCount.url, {
        method: SummaryApi.addToCartProductCount.method,
        credentials: "include",
      });

      const dataApi = await dataResponse.json();
      return dataApi;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  cartsData: [],
  cartsCount: 0,
  loading: false,
  error: null,
};

// Create slice
const cartsSlice = createSlice({
  name: "carts",
  initialState,
  reducers: {
    setCartsCount: (state, action) => {
      state.cartsCount = action.payload;
    },
    setCartsData: (state, action) => {
      state.cartsData = action.payload;
    },

    // Reducer to reset the state (optional)
    resetState(state) {
      state.products = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserCartData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserCartData.fulfilled, (state, action) => {
        state.loading = false;
        state.cartsData = action.payload.data;
      })
      .addCase(fetchUserCartData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder
      .addCase(fetchUserAddToCartCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserAddToCartCount.fulfilled, (state, action) => {
        state.loading = false;
        state.cartsCount = action.payload.data.count;
      })
      .addCase(fetchUserAddToCartCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const { resetState, setCartsCount, setCartsData } = cartsSlice.actions;

// Export reducer
export default cartsSlice.reducer;
