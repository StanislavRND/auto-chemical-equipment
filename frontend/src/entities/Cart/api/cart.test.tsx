import { axiosInstance } from "@shared/api/instance/instance";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import {
  useAddToCartApi,
  useDecrementCartItemApi,
  useGetCart,
  useGetCartTotalPrice,
  useIncrementCartItemApi,
  useRemoveFromCartApi,
} from "./cart";

vi.mock("@shared/api/instance/instance", () => ({
  axiosInstance: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
  },
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={createTestQueryClient()}>
    {children}
  </QueryClientProvider>
);

describe("Cart API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("useGetCart", () => {
    it("получает корзину", async () => {
      const mockData = [
        {
          id: 1,
          user_id: 1,
          product_id: 1,
          category_id: 1,
          article: "A1",
          name: "Товар",
          image_url: "img.jpg",
          price: 100,
          discount_percent: "10",
          qty: 2,
        },
      ];

      (axiosInstance.get as Mock).mockResolvedValueOnce({ data: mockData });

      const { result } = renderHook(() => useGetCart(true), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(axiosInstance.get).toHaveBeenCalledWith("/cart");
      expect(result.current.data?.[0].productId).toBe(1);
    });
  });

  describe("useGetCartTotalPrice", () => {
    it("получает общую стоимость", async () => {
      (axiosInstance.get as Mock).mockResolvedValueOnce({ data: "1500" });

      const { result } = renderHook(() => useGetCartTotalPrice(true), {
        wrapper,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(axiosInstance.get).toHaveBeenCalledWith("/cart/total-price");
      expect(result.current.data).toBe("1500");
    });
  });

  describe("useAddToCartApi", () => {
    it("добавляет товар", async () => {
      (axiosInstance.post as Mock).mockResolvedValueOnce({ data: {} });

      const { result } = renderHook(() => useAddToCartApi(), { wrapper });

      result.current.mutate({ productId: 1, qty: 1 });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(axiosInstance.post).toHaveBeenCalledWith("/cart", {
        product_id: 1,
        qty: 1,
      });
    });
  });

  describe("useRemoveFromCartApi", () => {
    it("удаляет товар", async () => {
      (axiosInstance.delete as Mock).mockResolvedValueOnce({ data: {} });

      const { result } = renderHook(() => useRemoveFromCartApi(), { wrapper });

      result.current.mutate(1);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(axiosInstance.delete).toHaveBeenCalledWith("/cart/1");
    });
  });

  describe("useIncrementCartItemApi", () => {
    it("увеличивает количество", async () => {
      (axiosInstance.patch as Mock).mockResolvedValueOnce({ data: {} });

      const { result } = renderHook(() => useIncrementCartItemApi(), {
        wrapper,
      });

      result.current.mutate(1);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(axiosInstance.patch).toHaveBeenCalledWith("/cart/1/increment");
    });
  });

  describe("useDecrementCartItemApi", () => {
    it("уменьшает количество", async () => {
      (axiosInstance.patch as Mock).mockResolvedValueOnce({ data: {} });

      const { result } = renderHook(() => useDecrementCartItemApi(), {
        wrapper,
      });

      result.current.mutate(1);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(axiosInstance.patch).toHaveBeenCalledWith("/cart/1/decrement");
    });
  });
});
