import { axiosInstance } from "@shared/api/instance/instance";
import { useQuery } from "@tanstack/react-query";

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
  status: string;
  created_at: Date;
}

const mapOrderDTO = (dto: OrderDTO) => ({
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

export const useGetOrders = () => {
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
