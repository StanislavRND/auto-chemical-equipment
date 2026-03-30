import { axiosInstance } from "@shared/api/instance/instance";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { useDeleteProduct, useGetProductsLimit } from "./product";

vi.mock("@shared/api/instance/instance", () => ({
  axiosInstance: {
    get: vi.fn(),
    delete: vi.fn(),
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

describe("Product API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("useGetProductsLimit", () => {
    it("получает ограниченный список товаров", async () => {
      const mockData = [
        {
          id: 1,
          category_id: 1,
          subcategory_id: null,
          article: "A1",
          name: "Товар",
          image_url: "img.jpg",
          description: "Описание",
          compound: "Состав",
          discount_percent: 10,
          method_of_application: "Применение",
          existence: true,
          price: "100",
        },
      ];

      (axiosInstance.get as Mock).mockResolvedValueOnce({ data: mockData });

      const { result } = renderHook(() => useGetProductsLimit("name"), {
        wrapper,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(axiosInstance.get).toHaveBeenCalledWith("/products/limit", {
        params: { sort: "name" },
      });
      expect(result.current.data?.[0].name).toBe("Товар");
    });
  });

  describe("useDeleteProduct", () => {
    it("удаляет товар", async () => {
      (axiosInstance.delete as Mock).mockResolvedValueOnce({ data: {} });

      const { result } = renderHook(() => useDeleteProduct(), { wrapper });

      result.current.mutate(1);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(axiosInstance.delete).toHaveBeenCalledWith("/products/1");
    });
  });
});
