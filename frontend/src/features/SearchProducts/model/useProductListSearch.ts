import type { BreadcrumbItem } from "@shared/ui/BreadCrumb/BreadCrumb";
import { useEffect, useMemo, useRef } from "react";
import { useSearchProducts } from "../api/searchProducts";

const PRELOAD_ROOT_MARGIN = "400px";

export const useProductListSearch = (query: string, perPage = 20) => {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const queryResult = useSearchProducts({
    query,
    per_page: perPage,
  });

  const {
    data,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    ...restQueryResult
  } = queryResult;

  const items = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) ?? [];
  }, [data]);

  const total = data?.pages[0]?.pagination.total ?? 0;

  const breadcrumbs = useMemo<BreadcrumbItem[]>(() => {
    return [{ label: "Главная", to: "/home" }, { label: "Результаты поиска" }];
  }, []);

  useEffect(() => {
    const target = loadMoreRef.current;

    if (!target || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];

        if (!firstEntry?.isIntersecting) return;
        if (isFetchingNextPage) return;

        fetchNextPage();
      },
      {
        root: null,
        rootMargin: PRELOAD_ROOT_MARGIN,
        threshold: 0,
      },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, items.length]);

  return {
    data,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    ...restQueryResult,
    items,
    total,
    breadcrumbs,
    loadMoreRef,
  };
};
