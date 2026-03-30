import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FilterProducts } from "./FilterProducts";

const mockProps = {
  initialFilters: {
    priceFrom: 100,
    priceTo: 1000,
    inStock: true,
    withDiscount: false,
  },
  onApply: vi.fn(),
  onReset: vi.fn(),
  handleCloseFilter: vi.fn(),
};

describe("FilterProducts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("рендерит фильтры с начальными значениями", () => {
    render(<FilterProducts {...mockProps} />);

    expect(screen.getByPlaceholderText("от")).toHaveValue(100);
    expect(screen.getByPlaceholderText("до")).toHaveValue(1000);
    
    const inStockYes = screen.getAllByLabelText("Да")[0];
    const inStockNo = screen.getAllByLabelText("Нет")[0];
    expect(inStockYes).toBeChecked();
    expect(inStockNo).not.toBeChecked();
  });

  it("вызывает onApply и handleCloseFilter при клике на Применить", () => {
    render(<FilterProducts {...mockProps} />);

    const applyButton = screen.getByText("Применить");
    fireEvent.click(applyButton);

    expect(mockProps.onApply).toHaveBeenCalledWith({
      priceFrom: 100,
      priceTo: 1000,
      inStock: true,
      withDiscount: false,
    });
    expect(mockProps.handleCloseFilter).toHaveBeenCalled();
  });

  it("вызывает onReset и handleCloseFilter при клике на Сбросить", () => {
    render(<FilterProducts {...mockProps} />);

    const resetButton = screen.getByText("Сбросить");
    fireEvent.click(resetButton);

    expect(mockProps.onReset).toHaveBeenCalled();
    expect(mockProps.handleCloseFilter).toHaveBeenCalled();
  });

  it("изменяет значения фильтров", () => {
    render(<FilterProducts {...mockProps} />);

    const priceFrom = screen.getByPlaceholderText("от");
    const priceTo = screen.getByPlaceholderText("до");
    
    const inStockNo = screen.getAllByLabelText("Нет")[0];
    const withDiscountYes = screen.getAllByLabelText("Да")[1];

    fireEvent.change(priceFrom, { target: { value: "200" } });
    fireEvent.change(priceTo, { target: { value: "2000" } });
    fireEvent.click(inStockNo);
    fireEvent.click(withDiscountYes);

    expect(priceFrom).toHaveValue(200);
    expect(priceTo).toHaveValue(2000);
    expect(inStockNo).toBeChecked();
    expect(withDiscountYes).toBeChecked();
  });

  it("применяет измененные фильтры", () => {
    render(<FilterProducts {...mockProps} />);

    const priceFrom = screen.getByPlaceholderText("от");
    const priceTo = screen.getByPlaceholderText("до");
    const inStockNo = screen.getAllByLabelText("Нет")[0];
    const withDiscountYes = screen.getAllByLabelText("Да")[1];

    fireEvent.change(priceFrom, { target: { value: "200" } });
    fireEvent.change(priceTo, { target: { value: "2000" } });
    fireEvent.click(inStockNo);
    fireEvent.click(withDiscountYes);

    const applyButton = screen.getByText("Применить");
    fireEvent.click(applyButton);

    expect(mockProps.onApply).toHaveBeenCalledWith({
      priceFrom: 200,
      priceTo: 2000,
      inStock: false,
      withDiscount: true,
    });
  });
});