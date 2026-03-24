import { type Product } from "@entities/Product/api/product";
import { ProductItem } from "@entities/Product/ui/ProductItem/ProductItem";
import { FilterProducts } from "@features/FilterProducts/ui/FilterProducts";
import { useBreakpoint } from "@shared/lib/hooks/useBreakpoint";
import { Breadcrumbs } from "@shared/ui/BreadCrumb/BreadCrumb";
import { Button } from "@shared/ui/Button/Button";
import { ErrorMessage } from "@shared/ui/ErrorMessage/ErrorMessage";
import { Loader } from "@shared/ui/Loader/Loader";
import { SortTabs } from "@shared/ui/SortTabs/SortTabs";
import { ListFilter, PackageX } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useProductItems } from "../model/useProductItems";
import styles from "./ProductItems.module.scss";

type ProductItemsProps = {
  onEdit?: (product: Product) => void;
  isCatalog?: boolean;
};

export const ProductItems = ({
  onEdit,
  isCatalog = false,
}: ProductItemsProps) => {
  const { isLaptop, isMobile, isTablet } = useBreakpoint();
  const location = useLocation();
  const isCatalogRoute = location.pathname.includes("catalog");
  const navigate = useNavigate();

  const {
    isFilterOpen,
    activeQuery,
    breadcrumbs,
    filters,
    sort,
    setSort,
    toggleFilter,
    setFilters,
    resetFilters,
    handleCloseFilter,
  } = useProductItems({
    isCatalog,
  });

  const { data: products, isLoading, error } = activeQuery;

  const buttonSize = isMobile ? "sm" : isTablet || isLaptop ? "md" : "lg";

  if (isLoading) {
    return (
      <section className={styles.loading}>
        <Loader size={64} text="Загрузка товаров..." />
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.error}>
        <ErrorMessage message="Ошибка загрузки товаров" />
      </section>
    );
  }

  if (!products || products.length === 0) {
    return (
      <section className={styles.empty}>
        <div className={styles.emptyContent}>
          <PackageX size={64} strokeWidth={1.5} />
          <h2>Товары не найдены</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className={styles.backButton}
          >
            Назад
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.product}>
      <div className={styles.container}>
        {isCatalogRoute && !isTablet && !isMobile && (
          <FilterProducts
            initialFilters={filters}
            onApply={setFilters}
            onReset={resetFilters}
            handleCloseFilter={handleCloseFilter}
          />
        )}

        <div className={styles.wrapperRight}>
          {isCatalogRoute && (
            <div className={styles.breadcrumbs}>
              <Breadcrumbs items={breadcrumbs} />
            </div>
          )}

          <div className={styles.actions}>
            <SortTabs value={sort} onChange={setSort} />

            {isCatalogRoute && (isTablet || isMobile) && (
              <Button
                size={buttonSize}
                className={styles.btnFilter}
                onClick={toggleFilter}
              >
                <ListFilter className={styles.filterIcon} size={20} />
                Фильтры
              </Button>
            )}
          </div>

          {(isTablet || isMobile) && isFilterOpen && (
            <div className={styles.filterDropdown}>
              <FilterProducts
                handleCloseFilter={handleCloseFilter}
                initialFilters={filters}
                onApply={setFilters}
                onReset={resetFilters}
              />
            </div>
          )}

          <div className={styles.items}>
            {products.map((p) => (
              <ProductItem key={p.id} product={p} onEdit={() => onEdit?.(p)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
