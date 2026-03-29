import { Input } from "@shared/ui/FormComponents/Input/Input";
import { Select } from "@shared/ui/FormComponents/Select/Select";
import { type FC } from "react";
import styles from "./OrdersFilters.module.scss";

type OrdersFiltersProps = {
  numberOrder?: string;
  fullName?: string;
  status?: string;
  setNumberOrder: (v: string | undefined) => void;
  setFullName: (v: string | undefined) => void;
  setStatus: (v: string | undefined) => void;
};

const statusOptions = [
  { label: "Все статусы", value: "" },
  { label: "В ожидании", value: "pending" },
  { label: "В сборке", value: "ready" },
  { label: "Завершен", value: "success" },
];

export const OrdersFilters: FC<OrdersFiltersProps> = ({
  numberOrder,
  fullName,
  status,
  setNumberOrder,
  setFullName,
  setStatus,
}) => {
  return (
    <div className={styles.filters}>
      <Input
        placeholder="Номер заказа"
        type="text"
        value={numberOrder ?? ""}
        onChange={(value) => setNumberOrder(value)}
      />
      <Input
        placeholder="ФИО"
        type="text"
        value={fullName ?? ""}
        onChange={(value) => setFullName(value)}
      />
      <Select
        placeholder="Статус"
        options={statusOptions}
        value={status ?? ""}
        onChange={(v) => setStatus(v)}
      />
    </div>
  );
};
