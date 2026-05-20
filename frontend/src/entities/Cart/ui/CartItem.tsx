import { useAppSelector } from "@app/store/hooks";
import { Button } from "@shared/ui/Button/Button";
import { Minus, Plus, Trash } from "lucide-react";
import { formatRub, parsePrice } from "../lib/formating";
import { selectCartItemById } from "../model/store/cartSelectors";
import type { CartItem as CartItemType } from "../model/types";
import { useCartActions } from "../model/useCartActions";
import styles from "./CartItem.module.scss";

interface CartItemProps {
  item: CartItemType;
}

export const CartItem = ({ item }: CartItemProps) => {
  const { incQty, decQty, removeFromCart } = useCartActions();
  const cartItem = useAppSelector((state) =>
    selectCartItemById(state, item.productId),
  );

  const unitPrice = parsePrice(item.price);
  const discountPercent = Number(item.discount_percent) || 0;
  const hasDiscount = discountPercent > 0;

  const discountedUnitPrice = hasDiscount
    ? Math.round(unitPrice - (unitPrice * discountPercent) / 100)
    : unitPrice;

  const total = discountedUnitPrice * item.qty;
  const oldTotal = unitPrice * item.qty;

  const currentQty = cartItem?.qty ?? 0;

  return (
    <div className={styles.item}>
      <div className={styles.product}>
        <img loading="lazy" src={item.image_url} alt={item.name} />
        <div className={styles.productInfo}>
          <h4 className={styles.productName}>{item.name}</h4>
          <h5 className={styles.productActicle}>
            Артикул: <span>{item.article}</span>
          </h5>

          <div className={styles.productPriceBlock}>
            {hasDiscount && (
              <div className={styles.oldPrice}>{formatRub(unitPrice)}</div>
            )}

            <div className={styles.productPrice}>
              {formatRub(discountedUnitPrice)}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <Button
          size="md"
          variant="outline"
          className={styles.actionsBtn}
          onClick={() => decQty(item.productId)}
          data-testid="dec-btn"
        >
          <Minus className={styles.icon} size={20} color="var(--blue-500)" />
        </Button>

        <div className={styles.actionsCount}>{item.qty}</div>

        <Button
          size="md"
          variant="outline"
          className={styles.actionsBtn}
          onClick={() => incQty(item.productId)}
          data-testid="inc-btn"
          disabled={currentQty >= 99}
        >
          <Plus className={styles.icon} size={20} color="var(--blue-500)" />
        </Button>
      </div>

      <div className={styles.price}>
        <div className={styles.priceBlock}>
          {hasDiscount && (
            <div className={styles.oldPrice}>{formatRub(oldTotal)}</div>
          )}

          <div className={styles.priceText}>{formatRub(total)}</div>
        </div>

        <Button
          size="md"
          variant="outline"
          className={styles.priceBtn}
          onClick={() => removeFromCart(item.productId)}
          data-testid="remove-btn"
        >
          <Trash className={styles.icon} size={20} color="var(--red-500)" />
        </Button>
      </div>
    </div>
  );
};
