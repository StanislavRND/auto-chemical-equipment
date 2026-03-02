import { useAppDispatch, useAppSelector } from "@app/store/hooks";
import { selectCartItemById } from "@entities/Cart/model/cartSelectors";
import { cartActions } from "@entities/Cart/model/cartSlice";
import { useDeleteProduct, type Product } from "@entities/Product/api/product";
import { useAuth } from "@entities/User/model/useAuth";
import { useBreakpoint } from "@shared/lib/hooks/useBreakpoint";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

type UseProductItemArgs = {
  product: Product;
  onEdit?: (product: Product) => void;
};

type ButtonSize = "sm" | "md" | "lg";

export const useProductItem = ({ product, onEdit }: UseProductItemArgs) => {
  const { isLaptop, isMobile, isTablet } = useBreakpoint();
  const buttonSize: ButtonSize = isMobile
    ? "sm"
    : isTablet || isLaptop
      ? "md"
      : "lg";

  const { role } = useAuth();
  const isAdmin = role === "admin";

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { mutate: deleteProduct, isPending } = useDeleteProduct();

  const cartItem = useAppSelector((state) =>
    selectCartItemById(state, product.id),
  );
  const isInCart = Boolean(cartItem);

  const productUrl = useMemo(() => {
    return product.subcategory_id !== null
      ? `/products/${product.category_id}/${product.subcategory_id}/${product.id}`
      : `/products/${product.category_id}/${product.id}`;
  }, [product]);

  const stop: React.MouseEventHandler = (e) => e.stopPropagation();

  const handleNavigate = () => navigate(productUrl);

  const handleAddToCart: React.MouseEventHandler = (e) => {
    e.stopPropagation();
    dispatch(cartActions.addToCart({ product, qty: 1 }));
  };

  const handleInc: React.MouseEventHandler = (e) => {
    e.stopPropagation();
    dispatch(cartActions.incQty({ productId: product.id }));
  };

  const handleDec: React.MouseEventHandler = (e) => {
    e.stopPropagation();
    dispatch(cartActions.decQty({ productId: product.id }));
  };

  const handleEdit: React.MouseEventHandler = (e) => {
    e.stopPropagation();
    onEdit?.(product);
  };

  const handleDeleteProduct: React.MouseEventHandler = (e) => {
    e.stopPropagation();
    deleteProduct(product.id);
  };

  return {
    isAdmin,
    isInCart,
    cartQty: cartItem?.qty ?? 0,
    buttonSize,
    isDeleting: isPending,

    stop,
    handleNavigate,
    handleAddToCart,
    handleInc,
    handleDec,
    handleEdit,
    handleDeleteProduct,
  };
};
