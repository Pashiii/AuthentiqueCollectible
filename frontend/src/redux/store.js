import { configureStore } from "@reduxjs/toolkit";
import authApi from "./features/auth/authApi";
import authReducer from "./features/auth/authSlice";
import productsApi from "./features/products/productApi";
import bannerApi from "./features/banner/bannerApi";
import cartReducer from "./features/cart/cartSlice";
import notificationReducer from "./features/cart/notificationSlice";
import categoryApi from "./features/category/categoryApi";
import auctionApi from "./features/auction/auctionApi";
import orderApi from "./features/order/orderApi";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    notification: notificationReducer,
    [authApi.reducerPath]: authApi.reducer,
    auth: authReducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [bannerApi.reducerPath]: bannerApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [auctionApi.reducerPath]: auctionApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      productsApi.middleware,
      bannerApi.middleware,
      categoryApi.middleware,
      auctionApi.middleware,
      orderApi.middleware
    ),
});
