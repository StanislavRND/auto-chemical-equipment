import { useAppSelector } from "@app/store/hooks";
import { selectCartPriceData } from "@entities/Cart/model/store/cartSelectors";
import { formatPrice } from "@shared/lib/formatting/formatPrice";
import { Button } from "@shared/ui/Button/Button";
import styles from "./CartOrder.module.scss";

export const CartOrder = () => {
  const { totalPrice, discountedPrice, discountPercent } =
    useAppSelector(selectCartPriceData);

  const hasDiscount = discountPercent > 0;

  return (
    <section className={styles.order}>
      <Button className={styles.button} size="md">
        Оформить заказ
      </Button>

      <div className={styles.totalPrice}>
        {hasDiscount && (
          <span className={styles.oldPrice}>{formatPrice(totalPrice)} ₽</span>
        )}

        <span className={styles.price}>{formatPrice(discountedPrice)} ₽</span>
      </div>
    </section>
  );
};
