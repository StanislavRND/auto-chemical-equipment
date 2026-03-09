import type { RootState } from "@app/store/store";
import { parsePrice } from "@entities/Cart/lib/formating";
import { getDiscountPercent } from "@entities/Cart/lib/saleData";
import type { CartItem } from "../types";

export const selectCartState = (state: RootState) => state.cart;

export const selectCartItemsArray = (state: RootState): CartItem[] =>
  Object.values(state.cart.itemsById);

export const selectCartTotalCount = (state: RootState): number =>
  Object.values(state.cart.itemsById).reduce((sum, item) => sum + item.qty, 0);

export const selectCartItemById = (
  state: RootState,
  productId: number,
): CartItem | undefined => state.cart.itemsById[productId];

export const selectCartPriceData = (state: RootState) => {
  const totalPrice = Math.round(
    Object.values(state.cart.itemsById).reduce(
      (sum, item) => sum + parsePrice(item.price) * item.qty,
      0,
    ),
  );

  const discountPercent = getDiscountPercent(totalPrice);
  const discountedPrice = Math.round(totalPrice * (1 - discountPercent / 100));

  return {
    totalPrice,
    discountedPrice,
    discountPercent,
  };
};
