import styles from "./SortTabs.module.scss";

export type SortValue = "name" | "price-desc" | "price-asc";

interface SortTabsProps {
  value: SortValue;
  onChange: (value: SortValue) => void;
  className?: string;
}

export const SortTabs = ({ value, onChange, className }: SortTabsProps) => {
  return (
    <div className={`${styles.wrapper} ${className ?? ""}`}>
      <div
        className={`${styles.item} ${value === "name" ? styles.active : ""}`}
        onClick={() => onChange("name")}
      >
        по наименованию
      </div>

      <div
        className={`${styles.item} ${
          value === "price-desc" ? styles.active : ""
        }`}
        onClick={() => onChange("price-desc")}
      >
        cначала дорогие
      </div>

      <div
        className={`${styles.item} ${
          value === "price-asc" ? styles.active : ""
        }`}
        onClick={() => onChange("price-asc")}
      >
        cначала дешевые
      </div>
    </div>
  );
};
