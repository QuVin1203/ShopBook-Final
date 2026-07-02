import { configureStore } from "@reduxjs/toolkit";

import { productApi } from "./api/productApi";
import { authApi } from "./api/authApi";
import { userApi } from "./api/userApi";
import { orderApi } from "./api/orderApi.js";

import userReducer from "./features/userSlice.js";
import cartReducer from "./features/cartSlice.js";
import wishlistReducer from "./features/wishlistSlice.js";
import { voucherApi } from "./api/voucherApi";

export const store = configureStore({
  reducer: {
    auth: userReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,

    [productApi.reducerPath]: productApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [voucherApi.reducerPath]: voucherApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      productApi.middleware,
      authApi.middleware,
      userApi.middleware,
      orderApi.middleware,
      voucherApi.middleware,
    ]),
});