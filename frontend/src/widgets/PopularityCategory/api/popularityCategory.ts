import type { Category } from "@shared/api/catalog/catalog";
import { axiosInstance } from "@shared/api/instance/instance";
import { useQuery } from "@tanstack/react-query";

export const useGetPopularityCategory = () => {
  return useQuery<Category[]>({
    queryKey: ["popularity-category"],
    queryFn: async () => {
      const res = await axiosInstance.get("/categories/popularity");
      return res.data;
    },
    staleTime: 1 * 60 * 1000,
  });
};
