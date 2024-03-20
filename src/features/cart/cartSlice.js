import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import cartItems from "../../cartItems";
import axios from "axios";
// import { openModal } from "../modal/modalSlice";

const url = "https://course-api.com/react-useReducer-cart-project";

const initialState = {
  cartItems: cartItems,
  amount: 4,
  total: 0,
  isLoading: true,
};

// basic setup
// export const getCartItems = createAsyncThunk("cart/getCartItems", () => {
//   return fetch(url)
//     .then((resp) => resp.json())
//     .catch((err) => console.log(err));
// });

export const getCartItems = createAsyncThunk(
  "cart/getCartItems",
  async (name, thunkAPI) => {
    try {
      console.log(name); // just to show that you can pass parameters to this
      console.log(thunkAPI);
      console.log(thunkAPI.getState());
      // thunkAPI.dispatch(openModal());
      const resp = await axios(url);
      return resp.data; // how response is structured in axios
    } catch (err) {
      return thunkAPI.rejectWithValue("something went wrong"); // usually err
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cartItems = [];
    },
    removeItem: (state, action) => {
      const itemId = action.payload;
      state.cartItems = state.cartItems.filter((item) => item.id !== itemId);
    },
    toggleAmount: (state, { payload }) => {
      const itemId = payload.id;
      const cartItem = state.cartItems.find((item) => item.id === itemId);
      if (payload.type === "INCREASE") {
        cartItem.amount = cartItem.amount + 1;
      } else if (payload.type === "DECREASE") {
        cartItem.amount = cartItem.amount - 1;
      }
    },
    calculateTotals: (state) => {
      let amount = 0;
      let total = 0;
      state.cartItems.forEach((item) => {
        amount += item.amount;
        total += item.amount * item.price;
      });
      state.amount = amount;
      state.total = total;
    },
  },
  // extraReducers: {
  //   // this way  is deprecated, builder callback notation is what is next
  //   [getCartItems.pending]: (state) => {
  //     state.isLoading = true;
  //   },
  //   [getCartItems.fulfilled]: (state, action) => {
  //     // The action will contain the result if we are successful
  //     console.log(action);
  //     state.cartItems = action.payload;
  //     state.isLoading = false;
  //   },
  //   [getCartItems.rejected]: (state, action) => {
  //     console.log(action);
  //     state.isLoading = false;
  //   },
  // },
  extraReducers: (builder) => {
    builder
      .addCase(getCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCartItems.fulfilled, (state, action) => {
        // The action will contain the result if we are successful
        console.log(action);
        state.cartItems = action.payload;
        state.isLoading = false;
      })
      .addCase(getCartItems.rejected, (state, action) => {
        console.log(action);
        state.isLoading = false;
      });
  },
});

export const { clearCart, removeItem, toggleAmount, calculateTotals } =
  cartSlice.actions;

export default cartSlice.reducer;
