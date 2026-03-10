import {
  type SortValue,
  useGetProductsCatalogWithFilters,
  useGetProductsLimit,
} from "@entities/Product/api/product";
import { useGetCatalog } from "@shared/api/catalog/catalog";
import { toNumberOrUndefined } from "@shared/lib/formatting/toNumberOrUndefined";
import type { BreadcrumbItem } from "@shared/ui/BreadCrumb/BreadCrumb";
import { useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

type CatalogParams = {
  categoryId?: string;
  subcategoryId?: string;
};

export type CatalogFilters = {
  priceFrom?: number;
  priceTo?: number;
  inStock?: boolean;
  withDiscount?: boolean;
};

type Props = {
  isCatalog: boolean;
};

const parseBoolean = (value: string | null): boolean | undefined => {
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
};

export const useProductItems = ({ isCatalog }: Props) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { categoryId, subcategoryId } = useParams<CatalogParams>();
  const [searchParams, setSearchParams] = useSearchParams();

  const sort = (searchParams.get("sort") as SortValue) || "name";

  const filters: CatalogFilters = {
    priceFrom: toNumberOrUndefined(searchParams.get("priceFrom") ?? undefined),
    priceTo: toNumberOrUndefined(searchParams.get("priceTo") ?? undefined),
    inStock: parseBoolean(searchParams.get("inStock")),
    withDiscount: parseBoolean(searchParams.get("withDiscount")),
  };

  const setSort = (value: SortValue) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("sort", value);
      return next;
    });
  };

  const setFilters = (nextFilters: CatalogFilters) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);

      if (nextFilters.priceFrom !== undefined) {
        next.set("priceFrom", String(nextFilters.priceFrom));
      } else {
        next.delete("priceFrom");
      }

      if (nextFilters.priceTo !== undefined) {
        next.set("priceTo", String(nextFilters.priceTo));
      } else {
        next.delete("priceTo");
      }

      if (nextFilters.inStock !== undefined) {
        next.set("inStock", String(nextFilters.inStock));
      } else {
        next.delete("inStock");
      }

      if (nextFilters.withDiscount !== undefined) {
        next.set("withDiscount", String(nextFilters.withDiscount));
      } else {
        next.delete("withDiscount");
      }

      return next;
    });
  };

  const resetFilters = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("priceFrom");
      next.delete("priceTo");
      next.delete("inStock");
      next.delete("withDiscount");
      return next;
    });
  };

  const limitQuery = useGetProductsLimit(sort, {
    enabled: !isCatalog,
  });

  const catalogQuery = useGetProductsCatalogWithFilters(
    {
      sort,
      categoryId: toNumberOrUndefined(categoryId),
      subcategoryId: toNumberOrUndefined(subcategoryId),
      ...filters,
    },
    {
      enabled: isCatalog,
    },
  );

  const activeQuery = isCatalog ? catalogQuery : limitQuery;
  const { data: catalog } = useGetCatalog();

  const breadcrumbs = useMemo<BreadcrumbItem[]>(() => {
    const search = searchParams.toString();

    const items: BreadcrumbItem[] = [{ label: "Главная", to: "/home" }];

    if (!catalog || !categoryId) return items;

    const category = catalog.find((c) => c.id === Number(categoryId));
    if (!category) return items;

    items.push({
      label: category.name,
      to: `/catalog/${category.id}${search ? `?${search}` : ""}`,
    });

    if (subcategoryId && category.subcategories?.length) {
      const subcategory = category.subcategories.find(
        (s) => s.id === Number(subcategoryId),
      );

      if (subcategory) {
        items.push({
          label: subcategory.name,
          to: `/catalog/${category.id}/${subcategory.id}${search ? `?${search}` : ""}`,
        });
      }
    }

    return items;
  }, [catalog, categoryId, subcategoryId, searchParams]);

  const toggleFilter = () => {
    setIsFilterOpen((prev) => !prev);
  };

  const handleCloseFilter = () => {
    setIsFilterOpen(false);
  };

  return {
    isFilterOpen,
    activeQuery,
    breadcrumbs,
    sort,
    setSort,
    toggleFilter,
    setFilters,
    resetFilters,
    filters,
    handleCloseFilter,
  };
};
