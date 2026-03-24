import {
  selectCartPriceData,
  selectCartTotalCount,
} from "@entities/Cart/model/store/cartSelectors";
import { formatPrice } from "@shared/lib/formatting/formatPrice";
import { useBreakpoint } from "@shared/lib/hooks/useBreakpoint";
import {
  Breadcrumbs,
  type BreadcrumbItem,
} from "@shared/ui/BreadCrumb/BreadCrumb";
import { Button } from "@shared/ui/Button/Button";
import { Input } from "@shared/ui/FormComponents/Input/Input";
import { Textarea } from "@shared/ui/FormComponents/Textarea/Textarea";
import { CartList } from "@widgets/Cart/ui/CartList/CartList";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useRegistrationOrders } from "../model/useRegistrationOrders";
import styles from "./RegistrationOrders.module.scss";

export const RegistrationOrders = () => {
  const totalCount = useSelector(selectCartTotalCount);
  const { totalPrice, discountedPrice, discountPercent } =
    useSelector(selectCartPriceData);

  const { isMobile, isTablet } = useBreakpoint();
  const { form, errors, isPending, onChangeField, onSubmit } =
    useRegistrationOrders();

  const breadcrumbs = useMemo<BreadcrumbItem[]>(() => {
    return [{ label: "Главная", to: "/home" }, { label: "Оформление заказа" }];
  }, []);

  const buttonSize = isTablet || isMobile ? "sm" : "md";
  const hasDiscount = discountPercent > 0;

  return (
    <section className={styles.registrationOrders}>
      <div className={styles.container}>
        <div className={styles.breadcrumbs}>
          <Breadcrumbs items={breadcrumbs} />
        </div>

        <div className={styles.grid}>
          <div className={`${styles.data} ${styles.block}`}>
            <div className={styles.title}>Данные</div>
            <div className={styles.inputWrapper}>
              <div className={styles.field}>
                <Input
                  placeholder="Фамилия"
                  value={form.lastName}
                  onChange={onChangeField("lastName")}
                />
                {errors.lastName && (
                  <span className={styles.error}>{errors.lastName}</span>
                )}
              </div>

              <div className={styles.field}>
                <Input
                  placeholder="Имя"
                  value={form.firstName}
                  onChange={onChangeField("firstName")}
                />
                {errors.firstName && (
                  <span className={styles.error}>{errors.firstName}</span>
                )}
              </div>

              <div className={styles.field}>
                <Input
                  placeholder="Отчество"
                  value={form.middleName}
                  onChange={onChangeField("middleName")}
                />
              </div>

              <div className={styles.field}>
                <Input
                  placeholder="E-mail"
                  value={form.email}
                  onChange={onChangeField("email")}
                />
                {errors.email && (
                  <span className={styles.error}>{errors.email}</span>
                )}
              </div>

              <div className={styles.field}>
                <Input
                  placeholder="Номер телефона"
                  value={form.phone}
                  onChange={onChangeField("phone")}
                />
                {errors.phone && (
                  <span className={styles.error}>{errors.phone}</span>
                )}
              </div>
            </div>
          </div>

          <div className={`${styles.comment} ${styles.block}`}>
            <div className={styles.title}>Комментарий</div>
            <Textarea
              classNameContainer={styles.textareaContainer}
              className={styles.textarea}
              placeholder="Ваш комментарий"
              value={form.comment}
              onChange={onChangeField("comment")}
            />
          </div>

          <div className={`${styles.cart} ${styles.block}`}>
            <div className={styles.title}>В корзине</div>

            <div className={styles.cartInfo}>
              <div className={styles.cartCount}>
                <span>Товаров:</span>
                <span>{totalCount} шт</span>
              </div>

              <div className={styles.cartTotal}>
                <span>Итого:</span>

                <div className={styles.cartPrices}>
                  {hasDiscount && (
                    <span className={styles.oldPrice}>
                      {formatPrice(totalPrice)} ₽
                    </span>
                  )}

                  <span className={styles.currentPrice}>
                    {formatPrice(discountedPrice)} ₽
                  </span>
                </div>
              </div>
            </div>

            <Button
              size={buttonSize}
              className={styles.cartButton}
              onClick={onSubmit}
              loading={isPending}
              disabled={isPending}
            >
              Оформить заказ
            </Button>
          </div>
          <div className={styles.products}>
            <CartList title="Заказ" />
          </div>
        </div>
      </div>
    </section>
  );
};
