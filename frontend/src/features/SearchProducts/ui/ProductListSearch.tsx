import type { Product } from "@entities/Product/api/product";
import { ProductItem } from "@entities/Product/ui/ProductItem/ProductItem";
import { Breadcrumbs } from "@shared/ui/BreadCrumb/BreadCrumb";
import { Button } from "@shared/ui/Button/Button";
import { ErrorMessage } from "@shared/ui/ErrorMessage/ErrorMessage";
import { Loader } from "@shared/ui/Loader/Loader";
import { PackageX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProductListSearch } from "../model/useProductListSearch";
import styles from "./ProductListSearch.module.scss";

type ProductListSearchProps = {
  query: string;
  onEdit?: (product: Product) => void;
};

export const ProductListSearch = ({
  query,
  onEdit,
}: ProductListSearchProps) => {
  const navigate = useNavigate();

  const {
    items,
    breadcrumbs,
    total,
    isLoading,
    error,
    isFetchingNextPage,
    hasNextPage,
    loadMoreRef,
  } = useProductListSearch(query, 20);

  if (!query.trim()) {
    return (
      <section className={styles.empty}>
        <div className={styles.emptyContent}>
          <h2>Введите название или артикул товара</h2>

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

  if (!items.length) {
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
        <div className={styles.breadcrumbs}>
          <Breadcrumbs items={breadcrumbs} />
        </div>

        <div className={styles.meta}>Найдено товаров: {total}</div>

        <div className={styles.items}>
          {items.map((product) => (
            <ProductItem
              key={product.id}
              product={product}
              onEdit={() => onEdit?.(product)}
            />
          ))}
        </div>

        {hasNextPage && (
          <div ref={loadMoreRef} className={styles.loadMoreTrigger} />
        )}

        {isFetchingNextPage && (
          <div className={styles.loading}>
            <Loader size={28} text="Загружаем ещё товары..." />
          </div>
        )}
      </div>
    </section>
  );
};
