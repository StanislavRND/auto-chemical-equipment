import { useGetOrdersUser } from "@entities/Order/api/order";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { UserOrders } from "./UserOrders";

vi.mock("@entities/Order/api/order", () => ({
  useGetOrdersUser: vi.fn(),
}));

vi.mock("@entities/Order/ui/OrderItem", () => ({
  OrderItem: () => <div data-testid="order-item">Заказ</div>,
}));

vi.mock("@shared/ui/BreadCrumb/BreadCrumb", () => ({
  Breadcrumbs: () => <div>Хлебные крошки</div>,
}));

vi.mock("@shared/ui/UserActions/UserActions", () => ({
  UserActions: () => <div>Действия пользователя</div>,
}));

vi.mock("@shared/ui/ErrorMessage/ErrorMessage", () => ({
  ErrorMessage: () => <div>Ошибка</div>,
}));

vi.mock("@shared/ui/Loader/Loader", () => ({
  Loader: () => <div>Загрузка...</div>,
}));

describe("UserOrders", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("отображает список заказов", () => {
    (useGetOrdersUser as Mock).mockReturnValue({
      data: [{ id: 1 }, { id: 2 }],
      isLoading: false,
      isError: false,
    });

    render(
      <BrowserRouter>
        <UserOrders />
      </BrowserRouter>,
    );

    expect(screen.getAllByTestId("order-item")).toHaveLength(2);
  });

  it("отображает загрузку", () => {
    (useGetOrdersUser as Mock).mockReturnValue({
      data: [],
      isLoading: true,
      isError: false,
    });

    render(
      <BrowserRouter>
        <UserOrders />
      </BrowserRouter>,
    );

    expect(screen.getByText("Загрузка...")).toBeInTheDocument();
  });

  it("отображает ошибку", () => {
    (useGetOrdersUser as Mock).mockReturnValue({
      data: [],
      isLoading: false,
      isError: true,
    });

    render(
      <BrowserRouter>
        <UserOrders />
      </BrowserRouter>,
    );

    expect(screen.getByText("Ошибка")).toBeInTheDocument();
  });

  it("отображает сообщение если нет заказов", () => {
    (useGetOrdersUser as Mock).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    });

    render(
      <BrowserRouter>
        <UserOrders />
      </BrowserRouter>,
    );

    expect(screen.getByText("У вас пока нет заказов")).toBeInTheDocument();
  });
});
