import type { Product } from "@entities/Product/api/product";
import { axiosInstance } from "@shared/api/instance/instance";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export type CreateProduct = Omit<Product, "id" | "article" | "existence">;

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation<Product, Error, CreateProduct>({
    mutationKey: ["create-product"],
    mutationFn: async (data) => {
      const res = await axiosInstance.post<Product>("/products", data);
      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
