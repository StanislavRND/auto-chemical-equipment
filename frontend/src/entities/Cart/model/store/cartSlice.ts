import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CartItem, CartProduct, CartState } from "../types";

const initialState: CartState = {
  itemsById: {},
};

function toCartItem(product: CartProduct, qty: number): CartItem {
  return {
    productId: product.id,
    name: product.name,
    category_id: product.category_id,
    article: product.article,
    image_url: product.image_url,
    price: product.price,
    discount_percent: product.discount_percent,
    qty,
  };
}

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    hydrateCart(_, action: PayloadAction<CartState>) {
      return action.payload;
    },

    clearCart(state) {
      state.itemsById = {};
    },

    upsertCartItem(state, action: PayloadAction<CartItem>) {
      const item = action.payload;
      state.itemsById[item.productId] = item;
    },

    addToCart(
      state,
      action: PayloadAction<{ product: CartProduct; qty?: number }>,
    ) {
      const { product, qty = 1 } = action.payload;
      const existing = state.itemsById[product.id];

      if (existing) {
        existing.qty += qty;
      } else {
        state.itemsById[product.id] = toCartItem(product, qty);
      }
    },

    removeFromCart(state, action: PayloadAction<{ productId: number }>) {
      delete state.itemsById[action.payload.productId];
    },

    incQty(state, action: PayloadAction<{ productId: number }>) {
      const item = state.itemsById[action.payload.productId];
      if (!item) return;
      item.qty += 1;
    },

    decQty(state, action: PayloadAction<{ productId: number }>) {
      const item = state.itemsById[action.payload.productId];
      if (!item) return;
      item.qty -= 1;

      if (item.qty <= 0) {
        delete state.itemsById[action.payload.productId];
      }
    },

    setQty(state, action: PayloadAction<{ productId: number; qty: number }>) {
      const { productId, qty } = action.payload;
      const item = state.itemsById[productId];
      if (!item) return;

      if (qty <= 0) {
        delete state.itemsById[productId];
      } else {
        item.qty = qty;
      }
    },
  },
});

export const cartActions = cartSlice.actions;
export const cartReducer = cartSlice.reducer;
