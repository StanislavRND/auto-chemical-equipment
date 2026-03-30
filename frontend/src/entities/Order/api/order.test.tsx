import { axiosInstance } from "@shared/api/instance/instance";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { useDeleteOrder, useGetOrdersUser } from "./order";

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

describe("Order API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("useGetOrdersUser", () => {
    it("получает список заказов", async () => {
      const mockData = [
        {
          id: 1,
          number_order: "100",
          user_id: 1,
          first_name: "Иван",
          last_name: "Иванов",
          middle_name: "Иванович",
          comment: "Комментарий",
          total_products_count: 3,
          total_price: 1500,
          status: "pending",
          created_at: "2024-01-01T10:00:00Z",
        },
      ];

      (axiosInstance.get as Mock).mockResolvedValueOnce({ data: mockData });

      const { result } = renderHook(() => useGetOrdersUser(), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(axiosInstance.get).toHaveBeenCalledWith("/orders");
      expect(result.current.data?.[0].numberOrder).toBe("100");
    });
  });

  describe("useDeleteOrder", () => {
    it("удаляет заказ", async () => {
      (axiosInstance.delete as Mock).mockResolvedValueOnce({ data: {} });

      const { result } = renderHook(() => useDeleteOrder(), { wrapper });

      result.current.mutate(1);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(axiosInstance.delete).toHaveBeenCalledWith("/orders/1");
    });
  });
});
