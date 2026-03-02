import { cartReducer } from "@entities/Cart/model/cartSlice";
import { loadCartFromLS, saveCartToLS } from "@entities/Cart/model/cartStorage";
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


let prevCartJson = "";
store.subscribe(() => {
  const cart = store.getState().cart;
  const json = JSON.stringify(cart);
  if (json !== prevCartJson) {
    prevCartJson = json;
    saveCartToLS(cart);
  }
});