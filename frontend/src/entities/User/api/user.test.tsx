import { axiosInstance } from "@shared/api/instance/instance";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { useGetCurrentUser, useLogout } from "./user";

vi.mock("@shared/api/instance/instance", () => ({
  axiosInstance: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={createTestQueryClient()}>
    {children}
  </QueryClientProvider>
);

describe("User API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, "location", {
      value: { href: "" },
      writable: true,
    });
  });

  describe("useGetCurrentUser", () => {
    it("получает текущего пользователя", async () => {
      const mockUser = {
        id: 1,
        email: "test@test.com",
        role: "user",
        inn: null,
        kpp: null,
        legal_address: null,
        legal_name: null,
        full_name: "Тест Тестович",
        phone: null,
        user_type: "person" as const,
      };

      (axiosInstance.get as Mock).mockResolvedValueOnce({ data: mockUser });

      const { result } = renderHook(() => useGetCurrentUser(), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(axiosInstance.get).toHaveBeenCalledWith("/users/me");
      expect(result.current.data?.email).toBe("test@test.com");
    });
  });

  describe("useLogout", () => {
    it("выходит из системы", async () => {
      (axiosInstance.post as Mock).mockResolvedValueOnce({ data: {} });

      const { result } = renderHook(() => useLogout(), { wrapper });

      await act(async () => {
        await result.current.logout();
      });

      expect(axiosInstance.post).toHaveBeenCalledWith("/logout");
      expect(window.location.href).toBe("/home");
    });
  });
});
