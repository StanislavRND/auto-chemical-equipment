import { ChevronUp } from "lucide-react";
import { useState } from "react";
import styles from "./SortTabs.module.scss";

export type SortValue = "name" | "price_desc" | "price_asc";

interface SortTabsProps {
  value: SortValue;
  onChange: (value: SortValue) => void;
  className?: string;
}

const options: { label: string; value: SortValue }[] = [
  { label: "по наименованию", value: "name" },
  { label: "сначала дорогие", value: "price_desc" },
  { label: "сначала дешевые", value: "price_asc" },
];

export const SortTabs = ({ value, onChange, className }: SortTabsProps) => {
  const [open, setOpen] = useState(false);

  const currentLabel = options.find((o) => o.value === value)?.label;

  return (
    <div className={`${styles.wrapper} ${className ?? ""}`}>
      <div className={styles.tabs}>
        {options.map((option) => (
          <div
            key={option.value}
            className={`${styles.item} ${
              value === option.value ? styles.active : ""
            }`}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </div>
        ))}
      </div>

      <div className={styles.select}>
        <div
          className={`${styles.selectHeader} ${open ? styles.open : ""}`}
          onClick={() => setOpen((prev) => !prev)}
        >
          <span>{currentLabel}</span>
          <ChevronUp className={styles.icon} size={18} />
        </div>

        {open && (
          <div className={styles.dropdown}>
            {options.map((option) => (
              <div
                key={option.value}
                className={styles.dropdownItem}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
