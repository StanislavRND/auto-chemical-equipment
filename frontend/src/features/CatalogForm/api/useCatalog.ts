import type { Category } from "@shared/api/catalog/catalog";
import { axiosInstance } from "@shared/api/instance/instance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { SubcategoriesForm } from "../types";

export interface FormCatalog {
  name: string;
  image_url: string;
  subcategories: SubcategoriesForm[];
}

export const useCreateCatalog = () => {
  const queryClient = useQueryClient();

  return useMutation<Category, Error, FormCatalog>({
    mutationKey: ["create-catalog"],
    mutationFn: async (data) => {
      const res = await axiosInstance.post<Category>("/categories", data);
      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalog"] });
    },
  });
};

export const useDeleteCatalog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-catalog"],
    mutationFn: async (catalogId: number) => {
      const res = await axiosInstance.delete(`/categories/${catalogId}`);
      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalog"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
export const useDeleteSubCatalog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-subcatalog"],
    mutationFn: async (subcatalogId: number) => {
      const res = await axiosInstance.delete(`/subcategories/${subcatalogId}`);
      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalog"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useUpdateCatalog = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Category,
    Error,
    { data: FormCatalog; categoryId: string }
  >({
    mutationKey: ["update-catalog"],
    mutationFn: async ({ data, categoryId }) => {
      const res = await axiosInstance.patch<Category>(
        `/categories/${categoryId}`,
        data,
      );
      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalog"] });
    },
  });
};
