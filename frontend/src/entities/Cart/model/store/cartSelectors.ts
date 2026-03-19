import type { RootState } from "@app/store/store";
import { parsePrice } from "@entities/Cart/lib/formating";
import { getDiscountPercent } from "@entities/Cart/lib/saleData";
import { createSelector } from "@reduxjs/toolkit";
import type { CartItem } from "../types";

export const selectCartState = (state: RootState) => state.cart;

export const selectCartItemsById = (state: RootState) => state.cart.itemsById;

export const selectCartItemsArray = createSelector(
  [selectCartItemsById],
  (itemsById): CartItem[] => Object.values(itemsById),
);

export const selectCartTotalCount = createSelector(
  [selectCartItemsArray],
  (items): number => items.reduce((sum, item) => sum + item.qty, 0),
);

export const selectCartItemById = (
  state: RootState,
  productId: number,
): CartItem | undefined => state.cart.itemsById[productId];

export const selectCartPriceData = createSelector(
  [selectCartItemsArray],
  (items) => {
    const totalPrice = Math.round(
      items.reduce((sum, item) => {
        const price = parsePrice(item.price);
        return sum + price * item.qty;
      }, 0),
    );

    const productsDiscountedPrice = Math.round(
      items.reduce((sum, item) => {
        const price = parsePrice(item.price);
        const productDiscountPercent = Number(item.discount_percent) || 0;

        const finalPrice = price * (1 - productDiscountPercent / 100);

        return sum + finalPrice * item.qty;
      }, 0),
    );

    const cartDiscountPercent = getDiscountPercent(productsDiscountedPrice);

    const discountedPrice = Math.round(
      productsDiscountedPrice * (1 - cartDiscountPercent / 100),
    );

    const discountPercent =
      totalPrice > 0
        ? Math.round(((totalPrice - discountedPrice) / totalPrice) * 100)
        : 0;

    return {
      totalPrice,
      discountedPrice,
      discountPercent,
      cartDiscountPercent,
      productsDiscountedPrice,
    };
  },
);
