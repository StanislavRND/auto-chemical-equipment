import { axiosInstance } from "@shared/api/instance/instance";
import { useInfiniteQuery } from "@tanstack/react-query";
import { type Product } from "@entities/Product/api/product";

export type ProductsPagination = {
  page: number;
  per_page: number;
  has_next: boolean;
  total: number;
};

export type SearchProductsResponse = {
  items: Product[];
  pagination: ProductsPagination;
};

type SearchProductsParams = {
  query: string;
  page?: number;
  per_page?: number;
};

const fetchSearchProducts = async ({
  query,
  page = 1,
  per_page = 20,
}: SearchProductsParams): Promise<SearchProductsResponse> => {
  const res = await axiosInstance.get("/products/search", {
    params: {
      query,
      page,
      per_page,
    },
  });

  return res.data;
};

export const useSearchProducts = ({
  query,
  per_page = 20,
}: {
  query: string;
  per_page?: number;
}) => {
  return useInfiniteQuery({
    queryKey: ["products", "search", query, per_page],
    queryFn: async ({ pageParam = 1 }) => {
      return fetchSearchProducts({
        query,
        page: pageParam,
        per_page,
      });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.has_next
        ? lastPage.pagination.page + 1
        : undefined;
    },
    enabled: Boolean(query.trim()),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};