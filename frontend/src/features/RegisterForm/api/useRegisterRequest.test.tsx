import { axiosInstance } from "@shared/api/instance/instance";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { useRegisterRequest } from "./useRegisterRequest";

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

describe("useRegisterRequest", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("отправляет запрос на регистрацию для физического лица", async () => {
    const mockData = {
      user_type: "person",
      full_name: "Иван Иванов",
      phone: "+79991234567",
      email: "test@test.com",
      password: "123456",
      password_confirm: "123456",
    } as const;

    const mockResponse = { success: true, message: "Запрос отправлен" };

    (axiosInstance.post as Mock).mockResolvedValueOnce({ data: mockResponse });

    const { result } = renderHook(() => useRegisterRequest(), { wrapper });

    result.current.mutate(mockData);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(axiosInstance.post).toHaveBeenCalledWith(
      "/register/request",
      mockData,
    );
    expect(result.current.data).toEqual(mockResponse);
  });

  it("отправляет запрос на регистрацию для юридического лица", async () => {
    const mockData = {
      user_type: "legal",
      inn: "1234567890",
      kpp: "123456789",
      legal_name: "ООО Ромашка",
      legal_address: "г. Москва, ул. Ленина, д.1",
      email: "company@test.com",
      password: "123456",
      password_confirm: "123456",
    } as const;

    const mockResponse = { success: true, message: "Запрос отправлен" };

    (axiosInstance.post as Mock).mockResolvedValueOnce({ data: mockResponse });

    const { result } = renderHook(() => useRegisterRequest(), { wrapper });

    result.current.mutate(mockData);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(axiosInstance.post).toHaveBeenCalledWith(
      "/register/request",
      mockData,
    );
    expect(result.current.data).toEqual(mockResponse);
  });

  it("обрабатывает ошибку при регистрации", async () => {
    const mockData = {
      user_type: "person",
      full_name: "Иван Иванов",
      phone: "+79991234567",
      email: "test@test.com",
      password: "123456",
      password_confirm: "123456",
    } as const;

    const mockError = new Error("Email уже существует");

    (axiosInstance.post as Mock).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useRegisterRequest(), { wrapper });

    result.current.mutate(mockData);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBe(mockError);
  });
});
