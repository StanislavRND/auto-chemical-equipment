import { useAppSelector } from "@app/store/hooks";
import { selectCartItemsArray } from "@entities/Cart/model/store/cartSelectors";
import { CartItem } from "@entities/Cart/ui/CartItem";
import styles from "./CartList.module.scss";

interface CartListProps {
  title?: string;
}

export const CartList = ({ title = "Корзина" }: CartListProps) => {
  const items = useAppSelector(selectCartItemsArray);
  return (
    <section className={styles.card}>
      <div className={styles.title}>{title}</div>
      <div className={styles.items}>
        {items.map((i) => (
          <CartItem key={i.productId} item={i} />
        ))}
      </div>
    </section>
  );
};
