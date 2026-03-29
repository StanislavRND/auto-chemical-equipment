import { useGetFilteredOrders } from "@features/OrdersFilters/api/ordersFilters";
import { useDebounce } from "@shared/lib/hooks/useDebounce";
import type { BreadcrumbItem } from "@shared/ui/BreadCrumb/BreadCrumb";
import { useEffect, useMemo, useRef, useState } from "react";

const PRELOAD_ROOT_MARGIN = "300px";

export const useOrdersItems = () => {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const [numberOrder, setNumberOrder] = useState<string | undefined>("");
  const [fullName, setFullName] = useState<string | undefined>("");
  const [status, setStatus] = useState<string | undefined>("");

  const debouncedNumberOrder = useDebounce(numberOrder, 500);
  const debouncedFullName = useDebounce(fullName, 500);
  const debouncedStatus = useDebounce(status, 500);

  const queryResult = useGetFilteredOrders({
    number_order: debouncedNumberOrder,
    full_name: debouncedFullName,
    status: debouncedStatus,
    per_page: 20,
  });

  const {
    data,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    isLoading,
    isError,
  } = queryResult;

  const orders = useMemo(
    () => data?.pages.flatMap((page) => page.items) ?? [],
    [data],
  );

  const breadcrumbs = useMemo<BreadcrumbItem[]>(
    () => [{ label: "Главная", to: "/home" }, { label: "Заказы" }],
    [],
  );

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
      { root: null, rootMargin: PRELOAD_ROOT_MARGIN, threshold: 0 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, orders.length]);

  return {
    orders,
    numberOrder,
    fullName,
    status,
    setNumberOrder,
    setFullName,
    setStatus,
    breadcrumbs,
    isLoading,
    isError,
    isFetchingNextPage,
    loadMoreRef,
  };
};
