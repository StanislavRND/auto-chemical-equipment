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

  const breadcrumbs = useMemo<BreadcrumbItem[]>(() => {
    if (!productInfo) return [];

    const categoryId = productInfo.category.id;
    const subcategoryId = productInfo.subcategory?.id;

    const items: BreadcrumbItem[] = [
      {
        label: "Главная",
        to: "/home",
      },
      {
        label: productInfo.category.name ?? "Категория",
        to: `/products/${categoryId}`,
      },
    ];

    if (subcategoryId !== null && productInfo.subcategory) {
      items.push({
        label: productInfo.subcategory.name,
        to: `/products/${categoryId}/${subcategoryId}`,
      });
    }

    items.push({
      label: productInfo.name,
    });

    return items;
  }, [productInfo]);

  return {
    breadcrumbs,
    productInfo,
    isLoading,
    error,
  };
};
