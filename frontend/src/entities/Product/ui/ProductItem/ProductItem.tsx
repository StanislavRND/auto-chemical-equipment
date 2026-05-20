import { type Product } from "@entities/Product/api/product";
import { useProductItem } from "@entities/Product/model/useProductItem";
import { formatPrice } from "@shared/lib/formatting/formatPrice";
import { Button } from "@shared/ui/Button/Button";
import { ConfirmModal } from "@shared/ui/ConfirmModal/ConfirmModal";
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
    confirmOpen,
    setConfirmOpen,
    handleNavigate,
    handleAddToCart,
    handleInc,
    handleDec,
    handleEdit,
    handleDeleteProductConfirmed,
  } = useProductItem({ product, onEdit });

  const price = Number(product.price) || 0;
  const discountPercent = Number(product.discount_percent) || 0;
  const hasDiscount = discountPercent > 0;

  const discountedPrice = hasDiscount
    ? Math.round(price - (price * discountPercent) / 100)
    : price;

  return (
    <>
      <div onClick={handleNavigate} className={styles.item}>
        <div className={styles.inner}>
          <div className={styles.imgWrapper}>
            <img
              className={styles.img}
              src={product.image_url}
              fetchPriority="high"
              alt="Фото товара"
              width={300}
              height={300}
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
              <h3 className={styles.price}>{formatPrice(discountedPrice)} ₽</h3>
            </div>

            <h4 className={styles.name}>{product.name}</h4>
            <h4 className={`${styles.article} ${styles.subtitle}`}>
              арт: <span>{product.article}</span>
            </h4>
          </div>

          {isAdmin ? (
            <div className={styles.actions}>
              <Button
                aria-label="Изменить товар"
                onClick={handleEdit}
                className={styles.btnEdit}
              >
                <Pencil size={18} />
              </Button>

              <Button
                aria-label="Удалить товар"
                disabled={isDeleting}
                loading={isDeleting}
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmOpen(true);
                }}
                className={styles.btnDelete}
              >
                <Trash size={18} />
              </Button>
            </div>
          ) : (
            <>
              {!isInCart ? (
                <>
                  {!product.existence ? (
                    <div
                      className={`${styles.enabled} ${
                        product.existence ? styles.inStock : styles.outOfStock
                      }`}
                    >
                      <span>
                        {product.existence ? "В наличии" : "Нет в наличии"}
                      </span>
                    </div>
                  ) : (
                    <Button
                      onClick={handleAddToCart}
                      size={buttonSize}
                      className={styles.btn}
                      variant="outline"
                    >
                      <PlusIcon className={styles.plus} />В корзину
                    </Button>
                  )}
                </>
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
                    disabled={cartQty >= 99}
                  >
                    <Plus className={styles.cartIcon} size={24} />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmOpen}
        message={`Вы точно хотите удалить товар "${product.name}"?`}
        onConfirm={handleDeleteProductConfirmed}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
};
