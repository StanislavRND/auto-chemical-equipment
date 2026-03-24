import { useGetOrders } from "@entities/Order/api/order";
import { OrderItem } from "@entities/Order/ui/OrderItem";
import {
  Breadcrumbs,
  type BreadcrumbItem,
} from "@shared/ui/BreadCrumb/BreadCrumb";
import { ErrorMessage } from "@shared/ui/ErrorMessage/ErrorMessage";
import { Loader } from "@shared/ui/Loader/Loader";
import { UserActions } from "@shared/ui/UserActions/UserActions";
import { useMemo } from "react";
import styles from "./UserOrders.module.scss";

export const UserOrders = () => {
  const { data: orders = [], isLoading, isError } = useGetOrders();
  const breadcrumbs = useMemo<BreadcrumbItem[]>(
    () => [{ label: "Главная", to: "/home" }, { label: "Мои заказы" }],
    [],
  );

  return (
    <section className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.breadcrumbs}>
          <Breadcrumbs items={breadcrumbs} />
        </div>
        <UserActions />
        <div className={styles.orders}>
          {orders.length != 0 && (
            <h3 className={styles.title}>История заказов</h3>
          )}

          {orders.length != 0 && (
            <div className={styles.header}>
              <span>Номер</span>
              <span>ФИО</span>
              <span>Дата</span>
              <span>Сумма</span>
              <span>Кол-во товаров</span>
              <span>Статус</span>
              <span>Товары</span>
            </div>
          )}

          <div className={styles.list}>
            {isLoading ? (
              <div className={styles.loader}>
                <Loader size={32} text="Загрузка заказов..." />
              </div>
            ) : isError ? (
              <div className={styles.error}>
                <ErrorMessage message="Ошибка загрузки заказов" />
              </div>
            ) : orders.length === 0 ? (
              <div className={styles.empty}>У вас пока нет заказов</div>
            ) : (
              orders.map((order) => <OrderItem key={order.id} order={order} />)
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
