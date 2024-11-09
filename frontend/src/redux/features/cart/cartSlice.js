import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addtoCart: (state, action) => {
      const newItem = action.payload;

      const existItem = state.cartItems.find(
        (product) => product._id === newItem._id
      );
      const cartItems = existItem
        ? state.cartItems.map((item) =>
            item._id === existItem._id ? newItem : item
          )
        : [...state.cartItems, newItem];
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      return { ...state, cartItems };
    },
    removetoCart: (state, action) => {
      const cartItems = state.cartItems.filter(
        (item) => item._id !== action.payload
      );
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      return { ...state, cartItems };
    },
    removeAllFromCart: (state, action) => {
      const cartItems = [];
      localStorage.removeItem("cartItems");
      return { ...state, cartItems };
    },
  },
});

export const { addtoCart, removetoCart, removeAllFromCart } = cartSlice.actions;
export default cartSlice.reducer;
