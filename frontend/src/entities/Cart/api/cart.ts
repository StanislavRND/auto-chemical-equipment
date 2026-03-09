import { axiosInstance } from "@shared/api/instance/instance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CartItem } from "../model/types";



type CartItemDto = {
  id: number;
  user_id: number;
  product_id: number;
  article: string;
  name: string;
  image_url: string;
  price: number;
  qty: number;
};

const mapCartItemDto = (dto: CartItemDto): CartItem => {
  return {
    productId: dto.product_id,
    article: dto.article,
    name: dto.name,
    image_url: dto.image_url,
    price: String(dto.price),
    qty: dto.qty,
  };
};

export const useGetCart = (enabled: boolean) => {
  return useQuery<CartItem[]>({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await axiosInstance.get("/cart");
      return (res.data as CartItemDto[]).map(mapCartItemDto);
    },
    enabled,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

export const useGetCartTotalPrice = (enabled: boolean) => {
  return useQuery<string>({
    queryKey: ["cart", "total-price"],
    queryFn: async () => {
      const res = await axiosInstance.get("/cart/total-price");
      return res.data;
    },
    enabled,
    staleTime: 1000 * 30,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

export const useAddToCartApi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["cart", "add"],
    mutationFn: async ({
      productId,
      qty,
    }: {
      productId: number;
      qty: number;
    }) => {
      const res = await axiosInstance.post("/cart", {
        product_id: productId,
        qty,
      });
      return mapCartItemDto(res.data as CartItemDto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cart", "total-price"] });
    },
  });
};

export const useRemoveFromCartApi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["cart", "remove"],
    mutationFn: async (productId: number) => {
      await axiosInstance.delete(`/cart/${productId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cart", "total-price"] });
    },
  });
};

export const useIncrementCartItemApi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["cart", "increment"],
    mutationFn: async (productId: number) => {
      const res = await axiosInstance.patch(`/cart/${productId}/increment`);
      return mapCartItemDto(res.data as CartItemDto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cart", "total-price"] });
    },
  });
};

export const useDecrementCartItemApi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["cart", "decrement"],
    mutationFn: async (productId: number) => {
      const res = await axiosInstance.patch(`/cart/${productId}/decrement`);

      if (res.data?.detail) {
        return { detail: res.data.detail as string };
      }

      return mapCartItemDto(res.data as CartItemDto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cart", "total-price"] });
    },
  });
};