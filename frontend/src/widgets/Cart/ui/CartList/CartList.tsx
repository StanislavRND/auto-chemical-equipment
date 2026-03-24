import { useAppSelector } from "@app/store/hooks";
import { selectCartItemsArray } from "@entities/Cart/model/store/cartSelectors";
import { CartItem } from "@entities/Cart/ui/CartItem";
import { useState } from "react";
import styles from "./CartList.module.scss";

interface CartListProps {
  title?: string;
}

export const CartList = ({ title = "Корзина" }: CartListProps) => {
  const items = useAppSelector(selectCartItemsArray);
  const [showAll, setShowAll] = useState(false);

  const visibleItems = showAll ? items : items.slice(0, 2);
  const hasMore = items.length > 2;

  const toggleShowAll = () => setShowAll((prev) => !prev);

  return (
    <section className={styles.card}>
      <div className={styles.title}>{title}</div>
      <div className={styles.items}>
        {visibleItems.map((i) => (
          <CartItem key={i.productId} item={i} />
        ))}
      </div>
      {hasMore && (
        <div className={styles.wrapperBtn}>
          <button className={styles.showMoreBtn} onClick={toggleShowAll}>
            {showAll ? "Скрыть" : "Показать ещё"}
          </button>
        </div>
      )}
    </section>
  );
};
