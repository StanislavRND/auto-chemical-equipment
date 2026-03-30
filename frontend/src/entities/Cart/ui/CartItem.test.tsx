import { configureStore } from "@reduxjs/toolkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { cartReducer } from "../model/store/cartSlice";
import { CartItem } from "./CartItem";

const mockActions = {
  incQty: vi.fn(),
  decQty: vi.fn(),
  removeFromCart: vi.fn(),
};

vi.mock("../model/useCartActions", () => ({
  useCartActions: () => mockActions,
}));

const mockItem = {
  productId: 1,
  article: "A1",
  categoryId: 10,
  name: "Товар",
  image_url: "img.jpg",
  price: "100",
  discount_percent: "10",
  qty: 2,
};

describe("CartItem", () => {
  const store = configureStore({
    reducer: {
      cart: cartReducer,
    },
  });

  const queryClient = new QueryClient();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("рендерит данные товара и цену со скидкой", () => {
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <CartItem item={mockItem} />
        </QueryClientProvider>
      </Provider>,
    );
    expect(screen.getByText("Товар")).toBeInTheDocument();
    expect(screen.getByText("A1")).toBeInTheDocument();
    const priceElements = screen.getAllByText(/₽/);
    expect(priceElements.length).toBe(4);
  });

  it("клики на кнопки вызывают нужные действия", async () => {
    render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <CartItem item={mockItem} />
        </QueryClientProvider>
      </Provider>,
    );

    const decBtn = screen.getByTestId("dec-btn");
    const incBtn = screen.getByTestId("inc-btn");
    const removeBtn = screen.getByTestId("remove-btn");
    
    fireEvent.click(decBtn);
    fireEvent.click(incBtn);
    fireEvent.click(removeBtn);

    expect(mockActions.decQty).toHaveBeenCalledTimes(1);
    expect(mockActions.decQty).toHaveBeenCalledWith(mockItem.productId);
    
    expect(mockActions.incQty).toHaveBeenCalledTimes(1);
    expect(mockActions.incQty).toHaveBeenCalledWith(mockItem.productId);
    
    expect(mockActions.removeFromCart).toHaveBeenCalledTimes(1);
    expect(mockActions.removeFromCart).toHaveBeenCalledWith(mockItem.productId);
  });
});