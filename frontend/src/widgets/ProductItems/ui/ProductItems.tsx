import { useGetProducts, type Product } from "@entities/Product/api/product";
import { ProductItem } from "@entities/Product/ui/ProductItem/ProductItem";
import { ErrorMessage } from "@shared/ui/ErrorMessage/ErrorMessage";
import { Loader } from "@shared/ui/Loader/Loader";
import { SortTabs, type SortValue } from "@shared/ui/SortTabs/SortTabs";
import { useState } from "react";
import styles from "./ProductItems.module.scss";

type ProductItemsProps = {
  onEdit?: (product: Product) => void;
};

export const ProductItems = ({ onEdit }: ProductItemsProps) => {
  const [sort, setSort] = useState<SortValue>("name");

  const { data: products, isLoading, error } = useGetProducts(sort);

  if (isLoading)
    return (
      <section className={styles.loading}>
        <Loader size={64} text="Загрузка товаров..." />
      </section>
    );

  if (error)
    return (
      <section className={styles.error}>
        <ErrorMessage message="Ошибка загрузки товаров" />
      </section>
    );

  return (
    <section className={styles.product}>
      <div className={styles.container}>
        <SortTabs value={sort} onChange={setSort} />
        <div className={styles.items}>
          {products?.map((p) => (
            <ProductItem key={p.id} product={p} onEdit={() => onEdit?.(p)} />
          ))}
        </div>
      </div>
    </section>
  );
};
