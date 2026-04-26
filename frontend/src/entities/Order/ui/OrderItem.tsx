import { useAuth } from "@entities/User/model/useAuth";
import { Button } from "@shared/ui/Button/Button";
import { ConfirmModal } from "@shared/ui/ConfirmModal/ConfirmModal";
import { Select } from "@shared/ui/FormComponents/Select/Select";
import { EyeIcon, Trash } from "lucide-react";
import type { Order, Status } from "../api/order";

import { useOrder } from "../model/useOrder";
import styles from "./OrderItem.module.scss";

interface OrderItemProps {
  order: Order;
}

export const OrderItem = ({ order }: OrderItemProps) => {
  const { role } = useAuth();
  const {
    status,
    isModalOpen,
    setIsModalOpen,
    statusTextMap,
    statusOptions,
    handleOpenProducts,
    handleDelete,
    handleStatusChange,
  } = useOrder(order);

  const {
    numberOrder,
    firstName,
    lastName,
    middleName,
    createdAt,
    totalPrice,
    totalProductsCount,
    comment,
  } = order;

  return (
    <>
      <ConfirmModal
        isOpen={isModalOpen}
        message="Вы действительно хотите удалить заказ?"
        onCancel={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
      />

      <div className={styles.item}>
        <div className={styles.desktop}>
          <span className={styles.number}>#{numberOrder}</span>
          <span className={styles.name}>
            {lastName} {firstName} {middleName}
          </span>
          <span className={styles.date}>
            {new Date(createdAt).toLocaleDateString()}
          </span>
          <span className={styles.price}>{totalPrice} ₽</span>
          <span className={styles.count}>{totalProductsCount} шт.</span>

          <div className={styles.successWrapper}>
            {role === "admin" ? (
              <Select
                className={styles.select}
                placeholder="Статус"
                options={statusOptions}
                value={status}
                onChange={(v) => handleStatusChange(v as Status)}
                drop="up"
              />
            ) : (
              <span className={`${styles.status} ${styles[status]}`}>
                {statusTextMap[status as Status]}
              </span>
            )}
          </div>

          <span className={styles.date}>{comment ?? "—"}</span>

          <div className={styles.btnWrapper}>
            <Button
              onClick={() => handleOpenProducts(order.id)}
              className={styles.btn}
              size="sm"
              aria-label="Просмотр заказа"
            >
              <EyeIcon size={20} />
            </Button>

            {role === "admin" && (
              <Button
                onClick={() => setIsModalOpen(true)}
                className={styles.btnDelete}
                size="sm"
                aria-label="Удаление заказа"
              >
                <Trash size={20} />
              </Button>
            )}
          </div>
        </div>

        <div className={styles.mobile}>
          <div className={styles.row}>
            <span className={styles.label}>Номер</span>
            <span className={styles.divider}></span>
            <span className={`${styles.value} ${styles.numberValue}`}>
              #{numberOrder}
            </span>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>ФИО</span>
            <span className={styles.divider}></span>
            <span className={styles.value}>
              {lastName} {firstName} {middleName}
            </span>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>Дата</span>
            <span className={styles.divider}></span>
            <span className={`${styles.value} ${styles.dateValue}`}>
              {new Date(createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>Сумма</span>
            <span className={styles.divider}></span>
            <span className={`${styles.value} ${styles.priceValue}`}>
              {totalPrice} ₽
            </span>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>Кол-во товаров</span>
            <span className={styles.divider}></span>
            <span className={styles.value}>{totalProductsCount} шт.</span>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>Статус</span>
            <span className={styles.divider}></span>
            <div className={styles.value}>
              {role === "admin" ? (
                <Select
                  className={styles.select}
                  placeholder="Статус"
                  options={statusOptions}
                  value={status}
                  onChange={(v) => handleStatusChange(v as Status)}
                  drop="up"
                />
              ) : (
                <span className={`${styles.status} ${styles[status]}`}>
                  {statusTextMap[status as Status]}
                </span>
              )}
            </div>
          </div>

          <div className={styles.row}>
            <span className={styles.label}>Комментарий</span>
            <span className={styles.divider}></span>
            <span className={`${styles.value} ${styles.dateValue}`}>
              {comment ?? "—"}
            </span>
          </div>

          <div className={styles.btnWrapper}>
            <Button
              onClick={() => handleOpenProducts(order.id)}
              className={styles.btn}
              size="sm"
              aria-label="Просмотр заказа"
            >
              Детали
            </Button>

            {role === "admin" && (
              <Button
                onClick={() => setIsModalOpen(true)}
                className={styles.btnDelete}
                size="sm"
                aria-label="Удаление заказа"
              >
                <Trash size={20} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
