import { useDeleteProduct, type Product } from "@entities/Product/api/product";
import { useAuth } from "@entities/User/model/useAuth";
import { useBreakpoint } from "@shared/lib/hooks/useBreakpoint";
import { Button } from "@shared/ui/Button/Button";
import { Pencil, PlusIcon, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from "./ProductItem.module.scss";
import { formatPrice } from "@shared/lib/formatting/formatPrice";

interface ProductItemProps {
  product: Product;
  onEdit?: (product: Product) => void;
}

export const ProductItem = ({ product, onEdit }: ProductItemProps) => {
  const { isLaptop, isMobile, isTablet } = useBreakpoint();
  const { role } = useAuth();
  const { mutate: deleteProduct, isPending } = useDeleteProduct();
  const navigate = useNavigate();

  const buttonSize = isMobile ? "sm" : isTablet || isLaptop ? "md" : "lg";

  const handleNavigate = () => {
    if (product.subcategory_id !== null) {
      navigate(
        `/products/${product.category_id}/${product.subcategory_id}/${product.id}`,
      );
    } else {
      navigate(`/products/${product.category_id}/${product.id}`);
    }
  };

  return (
    <div onClick={handleNavigate} className={styles.item}>
      <div className={styles.inner}>
        <div className={styles.imgWrapper}>
          <img
            className={styles.img}
            src={product.image_url}
            alt="Фото товара"
          />
        </div>
        <div className={styles.itemInfo}>
          <h3 className={styles.price}>{formatPrice(product.price)} ₽</h3>
          <h4 className={`${styles.name}`}>{product.name}</h4>
          <h4 className={`${styles.article} ${styles.subtitle}`}>
            арт: <span>{product.article}</span>
          </h4>
        </div>
        {role !== "admin" ? (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              alert("Добавлено");
            }}
            size={buttonSize}
            className={styles.btn}
            variant="outline"
          >
            <PlusIcon className={styles.plus} />В корзину
          </Button>
        ) : (
          <div className={styles.actions}>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                if (onEdit) onEdit(product);
              }}
              className={styles.btnEdit}
            >
              <Pencil size={18} />
            </Button>
            <Button
              disabled={isPending}
              loading={isPending}
              onClick={(e) => {
                e.stopPropagation();
                deleteProduct(product.id);
              }}
              className={styles.btnDelete}
            >
              <Trash size={18} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
