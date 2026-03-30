import { useAuth } from "@entities/User/model/useAuth";
import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { useOrder } from "../model/useOrder";
import { OrderItem } from "./OrderItem";

vi.mock("@entities/User/model/useAuth");
vi.mock("../model/useOrder");

const mockOrder = {
  id: 1,
  numberOrder: "100",
  userId: 42,
  firstName: "Иван",
  lastName: "Иванов",
  middleName: "Иванович",
  createdAt: new Date("2024-01-01T10:00:00Z"),
  totalPrice: 1500,
  totalProductsCount: 3,
  comment: "Тестовый комментарий",
  status: "pending" as const,
};

const mockUseOrderReturn = {
  status: "pending" as const,
  isModalOpen: false,
  setIsModalOpen: vi.fn(),
  statusTextMap: { pending: "В ожидание" },
  statusOptions: [],
  handleOpenProducts: vi.fn(),
  handleDelete: vi.fn(),
  handleStatusChange: vi.fn(),
};

describe("OrderItem", () => {
  beforeEach(() => {
    (useAuth as Mock).mockReturnValue({ role: "user" });
    (useOrder as Mock).mockReturnValue(mockUseOrderReturn);
    vi.clearAllMocks();
  });

  it("рендерит данные заказа", () => {
    render(
      <BrowserRouter>
        <OrderItem order={mockOrder} />
      </BrowserRouter>,
    );

    expect(screen.getAllByText(/#100/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Иванов Иван Иванович/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/1500 ₽/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/3 шт/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Тестовый комментарий/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/В ожидание/).length).toBeGreaterThan(0);
  });

  it("вызывает handleOpenProducts при клике на кнопку просмотра", () => {
    render(
      <BrowserRouter>
        <OrderItem order={mockOrder} />
      </BrowserRouter>,
    );

    const viewButtons = screen.getAllByRole("button", {
      name: /Просмотр заказа/,
    });
    fireEvent.click(viewButtons[0]);

    expect(mockUseOrderReturn.handleOpenProducts).toHaveBeenCalledWith(mockOrder.id);
  });

  it("для админа отображается кнопка удаления", () => {
    (useAuth as Mock).mockReturnValue({ role: "admin" });

    render(
      <BrowserRouter>
        <OrderItem order={mockOrder} />
      </BrowserRouter>,
    );

    const deleteButtons = screen.getAllByRole("button", {
      name: /Удаление заказа/,
    });
    expect(deleteButtons.length).toBeGreaterThan(0);
  });

  it("для админа открывает модалку удаления при клике на корзину", () => {
    (useAuth as Mock).mockReturnValue({ role: "admin" });
    const setIsModalOpen = vi.fn();
    (useOrder as Mock).mockReturnValue({
      ...mockUseOrderReturn,
      setIsModalOpen,
    });

    render(
      <BrowserRouter>
        <OrderItem order={mockOrder} />
      </BrowserRouter>,
    );

    const deleteButtons = screen.getAllByRole("button", {
      name: /Удаление заказа/,
    });
    fireEvent.click(deleteButtons[0]);

    expect(setIsModalOpen).toHaveBeenCalledWith(true);
  });

  it("вызывает handleDelete при подтверждении удаления", () => {
    (useAuth as Mock).mockReturnValue({ role: "admin" });
    const handleDelete = vi.fn();
    (useOrder as Mock).mockReturnValue({
      ...mockUseOrderReturn,
      isModalOpen: true,
      handleDelete,
    });

    render(
      <BrowserRouter>
        <OrderItem order={mockOrder} />
      </BrowserRouter>,
    );

    const confirmButton = screen.getByText("Подтвердить");
    fireEvent.click(confirmButton);

    expect(handleDelete).toHaveBeenCalled();
  });
});