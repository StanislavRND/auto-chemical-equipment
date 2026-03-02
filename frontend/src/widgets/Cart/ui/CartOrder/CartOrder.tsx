import { useAppSelector } from "@app/store/hooks";
import { selectCartTotalPrice } from "@entities/Cart/model/cartSelectors";
import { Button } from "@shared/ui/Button/Button";
import styles from "./CartOrder.module.scss";
import { formatPrice } from "@shared/lib/formatting/formatPrice";

export const CartOrder = () => {
  const totalPrice = useAppSelector(selectCartTotalPrice);
  return (
    <section className={styles.order}>
      <Button className={styles.button} size="md">
        Оформить заказ
      </Button>
      <div className={styles.totalPrice}>{formatPrice(totalPrice)} ₽</div>
    </section>
  );
};
