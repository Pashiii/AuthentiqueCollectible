import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  checkoutItems: [],
  token: null,
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setCheckout: (state, action) => {
      state.checkoutItems = action.payload;
    },
  },
});
