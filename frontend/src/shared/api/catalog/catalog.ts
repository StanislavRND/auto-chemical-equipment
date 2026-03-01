import { axiosInstance } from "@shared/api/instance/instance";
import { useQuery } from "@tanstack/react-query";

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
