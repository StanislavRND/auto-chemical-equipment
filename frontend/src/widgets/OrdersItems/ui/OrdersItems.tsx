import { OrderItem } from "@entities/Order/ui/OrderItem";
import { Breadcrumbs } from "@shared/ui/BreadCrumb/BreadCrumb";
import { ErrorMessage } from "@shared/ui/ErrorMessage/ErrorMessage";
import { Loader } from "@shared/ui/Loader/Loader";

import { OrdersFilters } from "@features/OrdersFilters/ui/OrdersFilters";
import { useOrdersItems } from "../model/useOrdersItems";
import styles from "./OrdersItems.module.scss";

const OrdersItems = () => {
  const {
    breadcrumbs,
    numberOrder,
    fullName,
    setFullName,
    status,
    setNumberOrder,
    setStatus,
    orders,
    isLoading,
    isError,
    loadMoreRef,
    isFetchingNextPage,
  } = useOrdersItems();
  return (
    <section className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.breadcrumbs}>
          <Breadcrumbs items={breadcrumbs} />
        </div>
        <OrdersFilters
          numberOrder={numberOrder}
          fullName={fullName}
          status={status}
          setNumberOrder={setNumberOrder}
          setFullName={setFullName}
          setStatus={setStatus}
        />
        <div className={styles.orders}>
          {orders.length !== 0 && (
            <h3 className={styles.title}>История заказов</h3>
          )}

          {orders.length !== 0 && (
            <div className={styles.header}>
              <span>Номер</span>
              <span>ФИО</span>
              <span>Дата</span>
              <span>Сумма</span>
              <span>Кол-во товаров</span>
              <span>Статус</span>
              <span>Комментарий</span>
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
              <>
                {orders.map((order) => (
                  <OrderItem key={order.id} order={order} />
                ))}
                <div ref={loadMoreRef} />
                {isFetchingNextPage && (
                  <div className={styles.loader}>
                    <Loader size={24} text="Загрузка еще заказов..." />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrdersItems;
