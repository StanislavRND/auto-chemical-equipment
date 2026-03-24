import { Button } from "@shared/ui/Button/Button";
import { EyeIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Order } from "../api/order";
import styles from "./OrderItem.module.scss";

interface OrderItemProps {
  order: Order;
}

export const OrderItem = ({ order }: OrderItemProps) => {
  const navigate = useNavigate();
  const {
    numberOrder,
    firstName,
    lastName,
    middleName,
    createdAt,
    totalPrice,
    totalProductsCount,
    status,
  } = order;

  const statusText = status === "success" ? "Завершен" : status;

  const handleOpenProducts = (id: number) => {
    navigate(`/profile/orders/${id}`);
  };

  return (
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
          <span
            className={`${styles.status} ${
              status === "success" ? styles.success : ""
            }`}
          >
            {statusText}
          </span>
        </div>

        <div className={styles.btnWrapper}>
          <Button
            onClick={() => handleOpenProducts(order.id)}
            className={styles.btn}
            size="sm"
          >
            <EyeIcon />
          </Button>
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
          <span
            className={`${styles.status} ${
              status === "success" ? styles.success : ""
            }`}
          >
            {statusText}
          </span>
        </div>

        <Button
          onClick={() => handleOpenProducts(order.id)}
          className={styles.btn}
          size="sm"
        >
          Детали
        </Button>
      </div>
    </div>
  );
};
