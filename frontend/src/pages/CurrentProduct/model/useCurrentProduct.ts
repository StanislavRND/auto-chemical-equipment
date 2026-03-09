import { useAppSelector } from "@app/store/hooks";
import { selectCartItemById } from "@entities/Cart/model/store/cartSelectors";
import { useCartActions } from "@entities/Cart/model/useCartActions";
import type { BreadcrumbItem } from "@shared/ui/BreadCrumb/BreadCrumb";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useGetCurrentProduct } from "../api/getCurrentProduct";

export const useCurrentProduct = () => {
  const { productId } = useParams<{ productId: string }>();

  const {
    data: productInfo,
    isLoading,
    error,
  } = useGetCurrentProduct(Number(productId));

  const { addToCart, incQty, decQty } = useCartActions();

  const cartItem = useAppSelector((state) =>
    selectCartItemById(state, productInfo?.id ?? 0),
  );

  const isInCart = Boolean(cartItem);
  const cartQty = cartItem?.qty ?? 0;

  const handleAddToCart: React.MouseEventHandler = async (e) => {
    e.stopPropagation();
    if (!productInfo) return;

    await addToCart(productInfo, 1);
  };

  const handleInc: React.MouseEventHandler = async (e) => {
    e.stopPropagation();
    if (!productInfo) return;

    await incQty(productInfo.id);
  };

  const handleDec: React.MouseEventHandler = async (e) => {
    e.stopPropagation();
    if (!productInfo) return;

    await decQty(productInfo.id);
  };

  const breadcrumbs = useMemo<BreadcrumbItem[]>(() => {
    if (!productInfo) return [];

    const categoryId = productInfo.category.id;
    const subcategoryId = productInfo.subcategory?.id;

    const items: BreadcrumbItem[] = [
      { label: "Главная", to: "/home" },
      {
        label: productInfo.category.name ?? "Категория",
        to: `/catalog/${categoryId}`,
      },
    ];

    if (subcategoryId && productInfo.subcategory) {
      items.push({
        label: productInfo.subcategory.name,
        to: `/catalog/${categoryId}/${subcategoryId}`,
      });
    }

    items.push({ label: productInfo.name });

    return items;
  }, [productInfo]);

  return {
    breadcrumbs,
    productInfo,
    isLoading,
    error,

    isInCart,
    cartQty,
    handleAddToCart,
    handleInc,
    handleDec,
  };
};
