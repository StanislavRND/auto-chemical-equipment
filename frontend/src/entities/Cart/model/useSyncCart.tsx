import { useAppDispatch, useAppSelector } from "@app/store/hooks";
import { useGetCart } from "@entities/Cart/api/cart";
import { cartActions } from "@entities/Cart/model/store/cartSlice";
import {
  clearCartLS,
  saveCartToLS,
} from "@entities/Cart/model/store/cartStorage";
import type { CartItem, CartState } from "@entities/Cart/model/types";
import { useAuth } from "@entities/User/model/useAuth";
import { useEffect } from "react";

function arrayToCartState(items: CartItem[]): CartState {
  return {
    itemsById: items.reduce<CartState["itemsById"]>((acc, item) => {
      acc[item.productId] = item;
      return acc;
    }, {}),
  };
}

export const useSyncCart = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAuth();
  const cartState = useAppSelector((state) => state.cart);

  const { data: serverCart } = useGetCart(isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      saveCartToLS(cartState);
    }
  }, [cartState, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && serverCart) {
      dispatch(cartActions.hydrateCart(arrayToCartState(serverCart)));
    }
  }, [dispatch, isAuthenticated, serverCart]);

  useEffect(() => {
    if (isAuthenticated) {
      clearCartLS();
    }
  }, [isAuthenticated]);
};
