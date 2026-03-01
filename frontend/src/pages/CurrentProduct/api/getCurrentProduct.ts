import type { Product } from "@entities/Product/api/product";
import type { Category, Subcategory } from "@shared/api/catalog/catalog";
import { axiosInstance } from "@shared/api/instance/instance";
import { useQuery } from "@tanstack/react-query";

export type ProductById = Omit<Product, "category_id" | "subcategory_id"> & {
  category: Category;
  subcategory: Subcategory | null;
};

export const useGetCurrentProduct = (productId: number) => {
  return useQuery<ProductById>({
    queryKey: ["product", productId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/products/${productId}`);
      return res.data;
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
