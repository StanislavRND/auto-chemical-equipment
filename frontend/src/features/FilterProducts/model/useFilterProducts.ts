import { useState } from "react";

export type CatalogFilters = {
  priceFrom?: number;
  priceTo?: number;
  inStock?: boolean;
  withDiscount?: boolean;
};

type Props = {
  initialFilters: CatalogFilters;
  onApply: (filters: CatalogFilters) => void;
  onReset: () => void;
  handleCloseFilter: () => void;
};

type FilterFormState = {
  priceFrom: string;
  priceTo: string;
  inStock: boolean | undefined;
  withDiscount: boolean | undefined;
};

const mapFiltersToState = (filters: CatalogFilters): FilterFormState => ({
  priceFrom: filters.priceFrom !== undefined ? String(filters.priceFrom) : "",
  priceTo: filters.priceTo !== undefined ? String(filters.priceTo) : "",
  inStock: filters.inStock,
  withDiscount: filters.withDiscount,
});

export const useFilterProducts = ({
  initialFilters,
  onApply,
  onReset,
  handleCloseFilter,
}: Props) => {
  const [prevInitialFilters, setPrevInitialFilters] = useState(initialFilters);
  const [form, setForm] = useState<FilterFormState>(() =>
    mapFiltersToState(initialFilters),
  );

  if (initialFilters !== prevInitialFilters) {
    setPrevInitialFilters(initialFilters);
    setForm(mapFiltersToState(initialFilters));
  }

  const handleApply = () => {
    onApply({
      priceFrom: form.priceFrom ? Number(form.priceFrom) : undefined,
      priceTo: form.priceTo ? Number(form.priceTo) : undefined,
      inStock: form.inStock,
      withDiscount: form.withDiscount,
    });
    handleCloseFilter();
  };

  const handleReset = () => {
    setForm({
      priceFrom: "",
      priceTo: "",
      inStock: undefined,
      withDiscount: undefined,
    });
    onReset();
    handleCloseFilter();
  };

  return {
    priceFrom: form.priceFrom,
    priceTo: form.priceTo,
    inStock: form.inStock,
    withDiscount: form.withDiscount,

    setPriceFrom: (value: string) =>
      setForm((prev) => ({ ...prev, priceFrom: value })),
    setPriceTo: (value: string) =>
      setForm((prev) => ({ ...prev, priceTo: value })),
    setInStock: (value: boolean | undefined) =>
      setForm((prev) => ({ ...prev, inStock: value })),
    setWithDiscount: (value: boolean | undefined) =>
      setForm((prev) => ({ ...prev, withDiscount: value })),

    handleApply,
    handleReset,
  };
};
