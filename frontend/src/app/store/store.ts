import { cartReducer } from "@entities/Cart/model/store/cartSlice";
import { loadCartFromLS } from "@entities/Cart/model/store/cartStorage";
import registrationReducer from "@features/ConfirmCodeForm/model/registrationSlice";
import { configureStore } from "@reduxjs/toolkit";

const preloadedCart = loadCartFromLS();

export const store = configureStore({
  reducer: {
    registration: registrationReducer,
    cart: cartReducer,
  },
  preloadedState: preloadedCart
    ? {
        cart: preloadedCart,
      }
    : undefined,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
