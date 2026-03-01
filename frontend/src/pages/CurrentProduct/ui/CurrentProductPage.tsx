import { formatPrice } from "@shared/lib/formatting/formatPrice";
import { useBreakpoint } from "@shared/lib/hooks/useBreakpoint";
import { Breadcrumbs } from "@shared/ui/BreadCrumb/BreadCrumb";
import { Button } from "@shared/ui/Button/Button";
import { ErrorMessage } from "@shared/ui/ErrorMessage/ErrorMessage";
import { Loader } from "@shared/ui/Loader/Loader";
import { PlusIcon } from "lucide-react";
import { useCurrentProduct } from "../model/useCurrentProduct";
import styles from "./CurrentProductPage.module.scss";

export const CurrentProductPage = () => {
  const { isMobile } = useBreakpoint();
  const { breadcrumbs, productInfo, isLoading, error } = useCurrentProduct();

  const buttonSize = isMobile ? "sm" : "md";

  if (isLoading)
    return (
      <section className={styles.loading}>
        <Loader size={64} text="Загрузка информации о товаре..." />
      </section>
    );

  if (error)
    return (
      <section className={styles.error}>
        <div className={styles.container}>
          {" "}
          <ErrorMessage message="Ошибка загрузки товара" />
        </div>
      </section>
    );

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <Breadcrumbs items={breadcrumbs} />
        <section className={styles.product}>
          <div className={styles.imgWrapper}>
            <img src={productInfo?.image_url} alt="Фото товара" />
          </div>
          <div className={styles.info}>
            <h3 className={styles.infoTitle}>{productInfo?.name}</h3>
            <div className={styles.infoBlock}>
              <h4 className={styles.infoBlockTitle}>О товаре</h4>
              <div className={styles.infoBlockSubtitle}>
                Артикуль: <span>{productInfo?.article}</span>
              </div>
            </div>
            <div className={styles.infoBlock}>
              <h4 className={styles.infoBlockTitle}>Описание</h4>
              <div className={styles.infoBlockSubtitle}>
                {productInfo?.description}
              </div>
            </div>
            <div className={styles.infoBlock}>
              <h4 className={styles.infoBlockTitle}>Состав</h4>
              <div className={styles.infoBlockSubtitle}>
                {productInfo?.compound}
              </div>
            </div>
            <div className={styles.infoBlock}>
              <h4 className={styles.infoBlockTitle}>Способ применения</h4>
              <div className={styles.infoBlockSubtitle}>
                {productInfo?.method_of_application}
              </div>
            </div>
          </div>
          <div className={styles.actions}>
            <h3 className={styles.price}>
              {formatPrice(productInfo?.price || 0)} ₽
            </h3>
            <div
              className={`${styles.enabled} ${
                productInfo?.existence ? styles.inStock : styles.outOfStock
              }`}
            >
              <span>
                {productInfo?.existence ? "В наличии" : "Нет в наличии"}
              </span>
            </div>
            <Button
              onClick={() => alert("Добавлено")}
              size={buttonSize}
              className={styles.btn}
              variant="outline"
            >
              <PlusIcon className={styles.plus} />В корзину
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};
