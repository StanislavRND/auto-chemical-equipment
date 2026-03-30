import { useAuth } from "@entities/User/model/useAuth";
import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { ProductItem } from "./ProductItem";

vi.mock("@entities/User/model/useAuth");
vi.mock("@entities/Product/model/useProductItem", () => ({
  useProductItem: vi.fn(),
}));

import { useProductItem } from "@entities/Product/model/useProductItem";

const mockProduct = {
  id: 1,
  category_id: 1,
  subcategory_id: null,
  article: "110000",
  name: "Тестовый товар",
  image_url: "img.jpg",
  description: "Описание",
  compound: "Состав",
  discount_percent: 10,
  method_of_application: "Применение",
  existence: true,
  price: "1000",
};

const mockUseProductItemReturn = {
  isAdmin: false,
  isInCart: false,
  cartQty: 0,
  buttonSize: "md",
  isDeleting: false,
  stop: vi.fn(),
  confirmOpen: false,
  setConfirmOpen: vi.fn(),
  handleNavigate: vi.fn(),
  handleAddToCart: vi.fn(),
  handleInc: vi.fn(),
  handleDec: vi.fn(),
  handleEdit: vi.fn(),
  handleDeleteProductConfirmed: vi.fn(),
};

describe("ProductItem", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as Mock).mockReturnValue({ role: "user" });
    (useProductItem as Mock).mockReturnValue(mockUseProductItemReturn);
  });

  it("рендерит данные товара", () => {
    render(
      <BrowserRouter>
        <ProductItem product={mockProduct} />
      </BrowserRouter>,
    );

    expect(screen.getByText("Тестовый товар")).toBeInTheDocument();
    expect(screen.getByText("арт:")).toBeInTheDocument();
    expect(screen.getByText("110000")).toBeInTheDocument();
    expect(screen.getAllByText(/₽/).length).toBeGreaterThan(0);
  });

  it("отображает скидку если есть", () => {
    render(
      <BrowserRouter>
        <ProductItem product={mockProduct} />
      </BrowserRouter>,
    );

    expect(screen.getByText(/-10%/)).toBeInTheDocument();
  });

  it("вызывает handleAddToCart при клике на кнопку", () => {
    const handleAddToCart = vi.fn();
    (useProductItem as Mock).mockReturnValue({
      ...mockUseProductItemReturn,
      handleAddToCart,
    });

    render(
      <BrowserRouter>
        <ProductItem product={mockProduct} />
      </BrowserRouter>,
    );

    const addButton = screen.getByText("В корзину");
    fireEvent.click(addButton);

    expect(handleAddToCart).toHaveBeenCalled();
  });

  it("для админа отображаются кнопки редактирования и удаления", () => {
    (useAuth as Mock).mockReturnValue({ role: "admin" });

    (useProductItem as Mock).mockReturnValue({
      ...mockUseProductItemReturn,
      isAdmin: true,
    });

    render(
      <BrowserRouter>
        <ProductItem product={mockProduct} />
      </BrowserRouter>,
    );

    expect(
      screen.getByRole("button", { name: /Изменить товар/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Удалить товар/ }),
    ).toBeInTheDocument();
  });

  it("вызывает handleEdit при клике на редактирование", () => {
    (useAuth as Mock).mockReturnValue({ role: "admin" });
    const handleEdit = vi.fn();
    (useProductItem as Mock).mockReturnValue({
      ...mockUseProductItemReturn,
      isAdmin: true,
      handleEdit,
    });

    render(
      <BrowserRouter>
        <ProductItem product={mockProduct} />
      </BrowserRouter>,
    );

    const editButton = screen.getByRole("button", { name: /Изменить товар/ });
    fireEvent.click(editButton);

    expect(handleEdit).toHaveBeenCalled();
  });

  it("открывает модалку удаления при клике на удаление", () => {
    (useAuth as Mock).mockReturnValue({ role: "admin" });
    const setConfirmOpen = vi.fn();
    (useProductItem as Mock).mockReturnValue({
      ...mockUseProductItemReturn,
      isAdmin: true,
      setConfirmOpen,
    });

    render(
      <BrowserRouter>
        <ProductItem product={mockProduct} />
      </BrowserRouter>,
    );

    const deleteButton = screen.getByRole("button", { name: /Удалить товар/ });
    fireEvent.click(deleteButton);

    expect(setConfirmOpen).toHaveBeenCalledWith(true);
  });
});
