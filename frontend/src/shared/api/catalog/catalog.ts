import { axiosInstance } from "@shared/api/instance/instance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type Category = {
  id: number;
  name: string;
  image_url: string;
  rating: number;
  subcategories?: Subcategory[];
};

export type Subcategory = {
  id: number;
  name: string;
  categoryId: number;
};

export type UpdateCategory = Omit<Category, "subcategories">;

export const useGetCatalog = () => {
  return useQuery<Category[]>({
    queryKey: ["catalog"],
    queryFn: async () => {
      const res = await axiosInstance.get("/categories");
      return res.data;
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useUpdateСatalog = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Category,
    Error,
    { data: UpdateCategory; сategoryId: string }
  >({
    mutationKey: ["update-category"],
    mutationFn: async ({ data, сategoryId }) => {
      const res = await axiosInstance.put<Category>(
        `/categories/${сategoryId}`,
        data,
      );
      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalog"] });
    },
  });
};
