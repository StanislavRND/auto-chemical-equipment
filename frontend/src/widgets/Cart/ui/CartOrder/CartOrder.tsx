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

  const handleNavigate = () => {
    if (isAuthenticated) {
      navigate("/registration/orders");
    } else {
      navigate("/login");
    }
  };

  return (
    <section className={styles.order}>
      <Button onClick={handleNavigate} className={styles.button} size="md">
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
