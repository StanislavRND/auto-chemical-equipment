import { axiosInstance } from "@shared/api/instance/instance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface Product {
  id: number;
  category_id: number;
  subcategory_id: number | null;
  article: string;
  name: string;
  image_url: string;
  description: string;
  compound: string;
  method_of_application: string;
  existence: boolean;
  price: string;
}

export type UpdateProduct = Omit<Product, "id" | "article" | "existence">;

export type SortValue = "name" | "price_desc" | "price_asc";

type UseGetProductsParams = {
  sort?: SortValue;
  categoryId?: number;
  subcategoryId?: number;
};

export const useGetProductsCatalog = (
  { sort = "name", categoryId, subcategoryId }: UseGetProductsParams = {},
  options?: { enabled: boolean },
) => {
  return useQuery<Product[]>({
    queryKey: ["products", { sort, categoryId, subcategoryId }],
    queryFn: async () => {
      const res = await axiosInstance.get("/products/catalog", {
        params: {
          sort,
          category_id: categoryId,
          subcategory_id: subcategoryId,
        },
      });
      return res.data;
    },
    enabled: options?.enabled ?? true,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

export const useGetProductsLimit = (
  sort: SortValue,
  options?: { enabled: boolean },
) => {
  return useQuery<Product[]>({
    queryKey: ["products", sort],
    queryFn: async () => {
      const res = await axiosInstance.get("/products/limit", {
        params: { sort },
      });
      return res.data;
    },
    enabled: options?.enabled ?? true,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-product"],
    mutationFn: async (productId: number) => {
      const res = await axiosInstance.delete(`/products/${productId}`);
      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Product,
    Error,
    { data: UpdateProduct; productId: string }
  >({
    mutationKey: ["update-product"],
    mutationFn: async ({ data, productId }) => {
      const res = await axiosInstance.put<Product>(
        `/products/${productId}`,
        data,
      );
      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
