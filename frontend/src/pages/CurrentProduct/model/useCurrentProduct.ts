import { useAppDispatch, useAppSelector } from "@app/store/hooks";
import { selectCartItemById } from "@entities/Cart/model/cartSelectors";
import { cartActions } from "@entities/Cart/model/cartSlice";
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

  const dispatch = useAppDispatch();

  const cartItem = useAppSelector((state) =>
    selectCartItemById(state, productInfo?.id ?? 0),
  );

  const isInCart = Boolean(cartItem);
  const cartQty = cartItem?.qty ?? 0;

  const handleAddToCart: React.MouseEventHandler = (e) => {
    e.stopPropagation();
    if (!productInfo) return;

    dispatch(
      cartActions.addToCart({
        product: productInfo,
        qty: 1,
      }),
    );
  };

  const handleInc: React.MouseEventHandler = (e) => {
    e.stopPropagation();
    if (!productInfo) return;

    dispatch(cartActions.incQty({ productId: productInfo.id }));
  };

  const handleDec: React.MouseEventHandler = (e) => {
    e.stopPropagation();
    if (!productInfo) return;

    dispatch(cartActions.decQty({ productId: productInfo.id }));
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
