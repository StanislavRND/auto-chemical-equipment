import { type Product } from "@entities/Product/api/product";
import { useProductItem } from "@entities/Product/model/useProductItem";
import { formatPrice } from "@shared/lib/formatting/formatPrice";
import { Button } from "@shared/ui/Button/Button";
import { Minus, Pencil, Plus, PlusIcon, Trash } from "lucide-react";
import styles from "./ProductItem.module.scss";

interface ProductItemProps {
  product: Product;
  onEdit?: (product: Product) => void;
}

export const ProductItem = ({ product, onEdit }: ProductItemProps) => {
  const {
    isAdmin,
    isInCart,
    cartQty,
    buttonSize,
    isDeleting,
    stop,
    handleNavigate,
    handleAddToCart,
    handleInc,
    handleDec,
    handleEdit,
    handleDeleteProduct,
  } = useProductItem({ product, onEdit });

  const price = Number(product.price) || 0;
  const discountPercent = Number(product.discount_percent) || 0;
  const hasDiscount = discountPercent > 0;

  const discountedPrice = hasDiscount
    ? Math.round(price - (price * discountPercent) / 100)
    : price;

  return (
    <div onClick={handleNavigate} className={styles.item}>
      <div className={styles.inner}>
        <div className={styles.imgWrapper}>
          <img
            className={styles.img}
            src={product.image_url}
            alt="Фото товара"
          />

          {hasDiscount && (
            <div className={styles.discountBadge}>-{discountPercent}%</div>
          )}
        </div>

        <div className={styles.itemInfo}>
          <div className={styles.priceBlock}>
            {hasDiscount && (
              <span className={styles.oldPrice}>{formatPrice(price)} ₽</span>
            )}

            <h3 className={styles.price}>
              {formatPrice(discountedPrice)} ₽
            </h3>
          </div>

          <h4 className={styles.name}>{product.name}</h4>
          <h4 className={`${styles.article} ${styles.subtitle}`}>
            арт: <span>{product.article}</span>
          </h4>
        </div>

        {isAdmin ? (
          <div className={styles.actions}>
            <Button onClick={handleEdit} className={styles.btnEdit}>
              <Pencil size={18} />
            </Button>

            <Button
              disabled={isDeleting}
              loading={isDeleting}
              onClick={handleDeleteProduct}
              className={styles.btnDelete}
            >
              <Trash size={18} />
            </Button>
          </div>
        ) : (
          <>
            {!isInCart ? (
              <Button
                onClick={handleAddToCart}
                size={buttonSize}
                className={styles.btn}
                variant="outline"
              >
                <PlusIcon className={styles.plus} />
                В корзину
              </Button>
            ) : (
              <div className={styles.cartActions} onClick={stop}>
                <Button
                  size={buttonSize}
                  variant="outline"
                  className={styles.actionsBtn}
                  onClick={handleDec}
                >
                  <Minus className={styles.cartIcon} size={24} />
                </Button>

                <div className={styles.actionsCount}>{cartQty}</div>

                <Button
                  size={buttonSize}
                  variant="outline"
                  className={styles.actionsBtn}
                  onClick={handleInc}
                >
                  <Plus className={styles.cartIcon} size={24} />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};