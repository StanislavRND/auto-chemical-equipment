import {
  mapOrderDTO,
  type Order,
  type OrderDTO,
} from "@entities/Order/api/order";
import { axiosInstance } from "@shared/api/instance/instance";
import { useInfiniteQuery } from "@tanstack/react-query";

export type OrdersPagination = {
  page: number;
  per_page: number;
  has_next: boolean;
  total: number;
};

export type GetOrdersResponseDTO = {
  items: OrderDTO[];
  pagination: OrdersPagination;
};

type GetOrdersParams = {
  page?: number;
  per_page?: number;
  number_order?: string;
  full_name?: string;
  status?: string;
};

const fetchOrders = async ({
  page = 1,
  per_page = 20,
  number_order,
  full_name,
  status,
}: GetOrdersParams): Promise<{
  items: Order[];
  pagination: OrdersPagination;
}> => {
  const res = await axiosInstance.get<GetOrdersResponseDTO>("/orders/filter", {
    params: { page, per_page, number_order, full_name, status },
  });

  return {
    ...res.data,
    items: res.data.items.map(mapOrderDTO),
  };
};

export const useGetFilteredOrders = ({
  number_order,
  full_name,
  status,
  per_page = 20,
}: {
  number_order?: string;
  full_name?: string;
  status?: string;
  per_page?: number;
}) => {
  return useInfiniteQuery({
    queryKey: ["orders", number_order, full_name, status, per_page],
    queryFn: async ({ pageParam = 1 }) =>
      fetchOrders({
        page: pageParam,
        per_page,
        number_order,
        full_name,
        status,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.has_next ? lastPage.pagination.page + 1 : undefined,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: true,
  });
};
