import { axiosInstance } from "@shared/api/instance/instance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface OrderDTO {
  id: number;
  number_order: string;
  user_id: number;
  first_name: string;
  last_name: string;
  middle_name: string;
  comment: string;
  total_products_count: number;
  total_price: number;
  status: "success" | "ready" | "pending";
  created_at: Date;
}

export const mapOrderDTO = (dto: OrderDTO) => ({
  id: dto.id,
  numberOrder: dto.number_order,
  userId: dto.user_id,
  firstName: dto.first_name,
  lastName: dto.last_name,
  middleName: dto.middle_name,
  comment: dto.comment,
  totalProductsCount: dto.total_products_count,
  totalPrice: dto.total_price,
  status: dto.status,
  createdAt: dto.created_at,
});

export interface ProductInOrder {
  product_id: number;
  name: string;
  article: string;
  image_url: string;
  quantity: number;
  price: number;
  total_price: number;
}

export interface ProductsInOrderResponse {
  products: ProductInOrder[];
}
export type Order = ReturnType<typeof mapOrderDTO>;

export type Status = "success" | "ready" | "pending";

export const useGetOrdersUser = () => {
  return useQuery<Order[]>({
    queryKey: ["order"],
    queryFn: async () => {
      const res = await axiosInstance.get<OrderDTO[]>("/orders");
      return res.data.map(mapOrderDTO);
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useGetProductInOrder = (orderId: number) => {
  return useQuery<ProductsInOrderResponse>({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const res = await axiosInstance.get<ProductsInOrderResponse>(
        `/orders/${orderId}/products`,
      );
      return res.data;
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useUpdateStatusOrder = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ProductsInOrderResponse,
    Error,
    { status: Status; orderId: number }
  >({
    mutationKey: ["update-orders"],
    mutationFn: async ({ status, orderId }) => {
      const res = await axiosInstance.patch(`/orders/${orderId}/status`, {
        status,
      });
      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-order"],
    mutationFn: async (orderId: number) => {
      const res = await axiosInstance.delete(`/orders/${orderId}`);
      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};
