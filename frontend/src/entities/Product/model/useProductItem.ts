import { useAppSelector } from "@app/store/hooks";
import { selectCartItemById } from "@entities/Cart/model/store/cartSelectors";
import { useCartActions } from "@entities/Cart/model/useCartActions";
import { useDeleteProduct, type Product } from "@entities/Product/api/product";
import { useAuth } from "@entities/User/model/useAuth";
import { useBreakpoint } from "@shared/lib/hooks/useBreakpoint";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type UseProductItemArgs = {
  product: Product;
  onEdit?: (product: Product) => void;
};

type ButtonSize = "sm" | "md" | "lg";

export const useProductItem = ({ product, onEdit }: UseProductItemArgs) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { isLaptop, isMobile, isTablet } = useBreakpoint();
  const buttonSize: ButtonSize = isMobile
    ? "sm"
    : isTablet || isLaptop
      ? "md"
      : "lg";

  const { role } = useAuth();
  const isAdmin = role === "admin";

  const navigate = useNavigate();
  const { addToCart, incQty, decQty } = useCartActions();

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

  const handleAddToCart: React.MouseEventHandler = async (e) => {
    e.stopPropagation();
    await addToCart(
      {
        ...product,
        discount_percent: product.discount_percent.toString(),
      },
      1,
    );
  };

  const handleInc: React.MouseEventHandler = async (e) => {
    e.stopPropagation();
    await incQty(product.id);
  };

  const handleDec: React.MouseEventHandler = async (e) => {
    e.stopPropagation();
    await decQty(product.id);
  };

  const handleEdit: React.MouseEventHandler = (e) => {
    e.stopPropagation();
    onEdit?.(product);
  };

  const handleDeleteProductConfirmed = () => {
    deleteProduct(product.id);
    setConfirmOpen(false);
  };

  return {
    isAdmin,
    isInCart,
    cartQty: cartItem?.qty ?? 0,
    buttonSize,
    isDeleting: isPending,
    confirmOpen,
    setConfirmOpen,

    stop,
    handleNavigate,
    handleAddToCart,
    handleInc,
    handleDec,
    handleEdit,
    handleDeleteProductConfirmed,
  };
};
