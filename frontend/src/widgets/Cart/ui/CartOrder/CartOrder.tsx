import { useAppSelector } from "@app/store/hooks";
import { selectCartPriceData } from "@entities/Cart/model/store/cartSelectors";
import { useAuth } from "@entities/User/model/useAuth";
import { formatPrice } from "@shared/lib/formatting/formatPrice";
import { Button } from "@shared/ui/Button/Button";
import { useNavigate } from "react-router-dom";
import styles from "./CartOrder.module.scss";

export const CartOrder = () => {
  const { totalPrice, discountedPrice, discountPercent } =
    useAppSelector(selectCartPriceData);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const hasDiscount = discountPercent > 0;

  const MIN_ORDER_PRICE = 10000;
  const isMinOrderReached = discountedPrice >= MIN_ORDER_PRICE;

  const handleNavigate = () => {
    if (isAuthenticated) {
      navigate("/registration/orders");
    } else {
      navigate("/login");
    }
  };

  return (
    <section className={styles.order}>
      <div className={styles.totalPrice}>
        <div className={styles.pricesRow}>
          {hasDiscount && (
            <span className={styles.oldPrice}>
              {formatPrice(totalPrice)} ₽
            </span>
          )}

          <span className={styles.price}>
            {formatPrice(discountedPrice)} ₽
          </span>
        </div>

        {!isMinOrderReached && (
          <span className={styles.minOrder}>
            Минимальный заказ — {formatPrice(MIN_ORDER_PRICE)} ₽
          </span>
        )}
      </div>

      <Button
        onClick={handleNavigate}
        className={styles.button}
        size="md"
        disabled={!isMinOrderReached}
      >
        Оформить заказ
      </Button>
    </section>
  );
};