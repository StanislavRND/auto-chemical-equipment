import { axiosInstance } from "@shared/api/instance/instance";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { useLogin } from "./useLogin";

vi.mock("@shared/api/instance/instance", () => ({
  axiosInstance: {
    post: vi.fn(),
  },
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      mutations: { retry: false },
    },
  });

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={createTestQueryClient()}>
    {children}
  </QueryClientProvider>
);

describe("useLogin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("отправляет запрос на логин", async () => {
    const mockUser = { email: "test@test.com", password: "123456" };
    const mockResponse = {
      token: "fake-token",
      user: { id: 1, email: "test@test.com" },
    };

    (axiosInstance.post as Mock).mockResolvedValueOnce({ data: mockResponse });

    const { result } = renderHook(() => useLogin(), { wrapper });

    result.current.mutate(mockUser);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(axiosInstance.post).toHaveBeenCalledWith("/login", mockUser);
    expect(result.current.data).toEqual(mockResponse);
  });

  it("обрабатывает ошибку при логине", async () => {
    const mockUser = { email: "wrong@test.com", password: "wrong" };
    const mockError = new Error("Invalid credentials");

    (axiosInstance.post as Mock).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useLogin(), { wrapper });

    result.current.mutate(mockUser);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBe(mockError);
  });
});
