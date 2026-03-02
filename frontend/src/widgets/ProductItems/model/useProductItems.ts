import {
  type SortValue,
  useGetProductsCatalog,
  useGetProductsLimit,
} from "@entities/Product/api/product";
import { useGetCatalog } from "@shared/api/catalog/catalog";
import { toNumberOrUndefined } from "@shared/lib/formatting/toNumberOrUndefined";
import type { BreadcrumbItem } from "@shared/ui/BreadCrumb/BreadCrumb";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

type CatalogParams = {
  categoryId?: string;
  subcategoryId?: string;
};

type Props = {
  isCatalog: boolean;
};

export const useProductItems = ({ isCatalog }: Props) => {
  const [sort, setSort] = useState<SortValue>("name");

  const { categoryId, subcategoryId } = useParams<CatalogParams>();

  const limitQuery = useGetProductsLimit(sort, {
    enabled: !isCatalog,
  });

  const catalogQuery = useGetProductsCatalog(
    {
      sort,
      categoryId: toNumberOrUndefined(categoryId),
      subcategoryId: toNumberOrUndefined(subcategoryId),
    },
    {
      enabled: isCatalog,
    },
  );

  const activeQuery = isCatalog ? catalogQuery : limitQuery;


  const { data: catalog } = useGetCatalog();

  const breadcrumbs = useMemo<BreadcrumbItem[]>(() => {
    const items: BreadcrumbItem[] = [{ label: "Главная", to: "/home" }];

    if (!catalog || !categoryId) return items;

    const category = catalog.find((c) => c.id === Number(categoryId));

    if (!category) return items;

    items.push({
      label: category.name,
      to: `/catalog/${category.id}`,
    });

    if (subcategoryId && category.subcategories?.length) {
      const subcategory = category.subcategories.find(
        (s) => s.id === Number(subcategoryId),
      );

      if (subcategory) {
        items.push({
          label: subcategory.name,
          to: `/catalog/${category.id}/${subcategory.id}`,
        });
      }
    }

    return items;
  }, [catalog, categoryId, subcategoryId]);

  return {
    sort, setSort, activeQuery, breadcrumbs
  }
};
