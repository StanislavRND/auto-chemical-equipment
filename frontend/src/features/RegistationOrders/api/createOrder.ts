import { axiosInstance } from "@shared/api/instance/instance";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export type OrderProduct = {
  product_id: number;
  name: string;
  article: string;
  image_url: string;
  quantity: number;
  price: string;
  total_price: number;
};

export type CreateOrder = {
  first_name: string;
  last_name: string;
  middle_name?: string | null;
  comment?: string | null;
  products: OrderProduct[];
};

export type Order = CreateOrder & {
  id: number;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useCreateOrder = () => {
  const navigate = useNavigate();

  return useMutation<Order, Error, CreateOrder>({
    mutationKey: ["create-order"],
    mutationFn: async (data) => {
      await delay(500);

      const res = await axiosInstance.post<Order>("/orders", data);
      return res.data;
    },
    onSuccess: () => {
      navigate("/profile/orders");
    },
  });
};
