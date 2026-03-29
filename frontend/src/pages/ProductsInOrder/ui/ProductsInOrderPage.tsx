import {
  useGetProductInOrder,
  type ProductInOrder,
} from "@entities/Order/api/order";
import {
  Breadcrumbs,
  type BreadcrumbItem,
} from "@shared/ui/BreadCrumb/BreadCrumb";
import { UserActions } from "@shared/ui/UserActions/UserActions";
import { Loader } from "@shared/ui/Loader/Loader";
import { ErrorMessage } from "@shared/ui/ErrorMessage/ErrorMessage";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import styles from "./ProductsInOrderPage.module.scss";

const ProductsInOrderPage = () => {
  const params = useParams();
  const orderId = Number(params.orderId);

  const { data, isLoading, isError } = useGetProductInOrder(orderId);

  const breadcrumbs = useMemo<BreadcrumbItem[]>(
    () => [
      { label: "Главная", to: "/home" },
      { label: "Мои заказы", to: "/profile/orders" },
      { label: `Товары из заказа` },
    ],
    []
  );

  return (
    <section className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.breadcrumbs}>
          <Breadcrumbs items={breadcrumbs} />
        </div>
        <UserActions />

        <div className={styles.productsList}>
          <div className={styles.title}>Информация о товарах</div>

          {isLoading ? (
            <div className={styles.loader}>
              <Loader size={32} text="Загрузка товаров..." />
            </div>
          ) : isError ? (
            <div className={styles.error}>
              <ErrorMessage message="Ошибка загрузки товаров" />
            </div>
          ) : (
            data?.products.map((item: ProductInOrder) => (
              <div className={styles.item} key={item.product_id}>
                <div className={styles.product}>
                  <img loading="lazy" src={item.image_url} alt={item.name} />
                  <div className={styles.productInfo}>
                    <h4 className={styles.productName}>{item.name}</h4>
                    <h5 className={styles.productActicle}>
                      Артикул: <span>{item.article}</span>
                    </h5>
                    <div className={styles.productPriceBlock}>
                      <div className={styles.productPrice}>{item.price} ₽</div>
                    </div>
                  </div>
                </div>

                <div className={styles.actions}>
                  <div className={styles.actionsCount}>{item.quantity} шт.</div>
                </div>

                <div className={styles.price}>
                  <div className={styles.priceText}>{item.total_price} ₽</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductsInOrderPage;