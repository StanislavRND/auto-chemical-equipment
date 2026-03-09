import { useAppDispatch } from "@app/store/hooks";
import { useAuth } from "@entities/User/model/useAuth";
import {
  useAddToCartApi,
  useDecrementCartItemApi,
  useIncrementCartItemApi,
  useRemoveFromCartApi,
} from "../api/cart";
import { cartActions } from "./store/cartSlice";
import type { CartProduct } from "./types";

export const useCartActions = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAuth();

  const addApi = useAddToCartApi();
  const incApi = useIncrementCartItemApi();
  const decApi = useDecrementCartItemApi();
  const removeApi = useRemoveFromCartApi();

  const addToCart = async (product: CartProduct, qty = 1) => {
    if (isAuthenticated) {
      const item = await addApi.mutateAsync({
        productId: product.id,
        qty,
      });

      dispatch(cartActions.upsertCartItem(item));
      return;
    }

    dispatch(cartActions.addToCart({ product, qty }));
  };

  const incQty = async (productId: number) => {
    if (isAuthenticated) {
      const item = await incApi.mutateAsync(productId);
      dispatch(cartActions.upsertCartItem(item));
      return;
    }

    dispatch(cartActions.incQty({ productId }));
  };

  const decQty = async (productId: number) => {
    if (isAuthenticated) {
      const result = await decApi.mutateAsync(productId);

      if ("detail" in result) {
        dispatch(cartActions.removeFromCart({ productId }));
        return;
      }

      dispatch(cartActions.upsertCartItem(result));
      return;
    }

    dispatch(cartActions.decQty({ productId }));
  };

  const removeFromCart = async (productId: number) => {
    if (isAuthenticated) {
      await removeApi.mutateAsync(productId);
      dispatch(cartActions.removeFromCart({ productId }));
      return;
    }

    dispatch(cartActions.removeFromCart({ productId }));
  };

  return {
    addToCart,
    incQty,
    decQty,
    removeFromCart,
  };
};
