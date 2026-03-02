import type { RootState } from "@app/store/store";
import type { CartItem } from "./types";

const parsePrice = (price: string) => {
  const n = Number(String(price).replace(",", "."));
  return Number.isFinite(n) ? n : 0;
};

export const selectCartState = (state: RootState) => state.cart;

export const selectCartItemsArray = (state: RootState): CartItem[] =>
  Object.values(state.cart.itemsById);

export const selectCartTotalCount = (state: RootState): number =>
  Object.values(state.cart.itemsById).reduce((sum, item) => sum + item.qty, 0);

export const selectCartItemById = (
  state: RootState,
  productId: number,
): CartItem | undefined => state.cart.itemsById[productId];

export const selectCartTotalPrice = (state: RootState): number =>
  Object.values(state.cart.itemsById).reduce(
    (sum, item) => sum + parsePrice(item.price) * item.qty,
    0,
  );
