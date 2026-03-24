import type { CartItem } from "@entities/Cart/model/types";
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

export const useUpdateCatalogRatingBatch = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    { detail: string },
    Error,
    { categoryIds: number[] }
  >({
    mutationKey: ["increment-categories-rating"],
    mutationFn: async ({ categoryIds }) => {
      const res = await axiosInstance.patch("/categories/increment-rating", {
        category_ids: categoryIds,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["catalog"] });
    },
  });

  const increaseRating = (items: CartItem[]) => {
    return new Promise<void>((resolve, reject) => {
      const uniqueCategoryIds = Array.from(
        new Set(items.map((i) => i.categoryId)),
      );
      if (uniqueCategoryIds.length === 0) {
        resolve();
        return;
      }

      mutation.mutate(
        { categoryIds: uniqueCategoryIds },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["catalog"] });
            resolve();
          },
          onError: (err) => reject(err),
        },
      );
    });
  };

  return { increaseRating, isPending: mutation.isPending };
};
