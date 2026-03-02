import { useAppDispatch } from "@app/store/hooks";
import { Button } from "@shared/ui/Button/Button";
import { Minus, Plus, Trash } from "lucide-react";
import { formatRub, parsePrice } from "../lib/formating";
import { cartActions } from "../model/cartSlice";
import type { CartItem as CartItemType } from "../model/types";
import styles from "./CartItem.module.scss";

interface CartItemProps {
  item: CartItemType;
}

export const CartItem = ({ item }: CartItemProps) => {
  const dispatch = useAppDispatch();

  const unitPrice = parsePrice(item.price);
  const total = unitPrice * item.qty;

  return (
    <div className={styles.item}>
      <div className={styles.product}>
        <img src={item.image_url} alt={item.name} />
        <div className={styles.productInfo}>
          <h4 className={styles.productName}>{item.name}</h4>
          <h5 className={styles.productActicle}>
            Артикул: <span>{item.article}</span>
          </h5>
          <div className={styles.productPrice}>{formatRub(unitPrice)}</div>
        </div>
      </div>

      <div className={styles.actions}>
        <Button
          size="md"
          variant="outline"
          className={styles.actionsBtn}
          onClick={() =>
            dispatch(cartActions.decQty({ productId: item.productId }))
          }
        >
          <Minus className={styles.icon} size={20} color="var(--blue-500)" />
        </Button>

        <div className={styles.actionsCount}>{item.qty}</div>

        <Button
          size="md"
          variant="outline"
          className={styles.actionsBtn}
          onClick={() =>
            dispatch(cartActions.incQty({ productId: item.productId }))
          }
        >
          <Plus className={styles.icon} size={20} color="var(--blue-500)" />
        </Button>
      </div>

      <div className={styles.price}>
        <div className={styles.priceText}>{formatRub(total)}</div>
        <Button
          size="md"
          variant="outline"
          className={styles.priceBtn}
          onClick={() =>
            dispatch(cartActions.removeFromCart({ productId: item.productId }))
          }
        >
          <Trash className={styles.icon} size={20} color="var(--red-500)" />
        </Button>
      </div>
    </div>
  );
};
