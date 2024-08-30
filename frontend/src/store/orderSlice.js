import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import SummaryApi from "../common";

export const fetchUserCartDataForOrder = createAsyncThunk(
  "order/fetchUserCartDataForOrder",
  async (_, { rejectWithValue, getState }) => {
    const state = getState();
    const userId = state.user.user?._id;
    const products = state.products.products;

    if (!userId) {
      const cart = JSON.parse(localStorage.getItem("cart")) || {
        items: [],
      };
      const cartItems = cart.items;
      // Map local storage cart items to product details from Redux
      const productsInCart = cartItems.map((item) => {
        const product = products?.data?.find((p) => p._id === item.productId);

        return {
          deleteById: item._id,
          productId: product?._id || item.productId,
          productName: product?.brandName || "Unknown Product",
          productImage: product?.productImage[0] || "",
          category: product?.category || "",
          quantity: item.quantity,
          price: product?.sellingPrice || 0,
        };
      });
      return productsInCart;
    }

    try {
      const response = await fetch(SummaryApi.addToCartProductView.url, {
        method: SummaryApi.addToCartProductView.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
      });
      const responseData = await response.json();
      const cartItems = responseData.data || [];
      const products = cartItems.map((item) => ({
        deleteById: item._id,
        productId: item.productId._id,
        productName: item.productId.brandName,
        productImage: item.productId.productImage[0],
        category: item.productId.category,
        quantity: item.quantity,
        price: item.productId.sellingPrice,
      }));
      return products;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  name: "",
  email: "",
  phone: "",
  fullAddress: "",
  district: "",
  notInsideOrOutsideOfDhaka: "",
  products: [],
  orderStatus: "Pending",
  totalAmount: 0,
  deliveryCharge: 0,

  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrderInput: (state, action) => {
      const inputData = action.payload;
      for (const key in inputData) {
        state[key] = inputData[key];
      }
    },
    calculateTotalAmount: (state, action) => {
      const total = state.products.reduce(
        (acc, product) => acc + product.quantity * product.price,
        0
      );
      const charge =
        action.payload === "ঢাকার ভিতরে"
          ? 70
          : action.payload === "ঢাকার বাহিরে"
          ? 130
          : 0;
      state.deliveryCharge = charge;
      state.totalAmount = total + charge;
    },
    increaseSetProduct: (state, action) => {
      state.products = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserCartDataForOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserCartDataForOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchUserCartDataForOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setOrderInput, calculateTotalAmount, increaseSetProduct } =
  orderSlice.actions;

// Export reducer
export default orderSlice.reducer;
