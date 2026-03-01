import { Check } from "lucide-react";
import { type ReactNode } from "react";
import styles from "./Checkbox.module.scss";

interface CheckboxProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  children?: ReactNode;
}

export const Checkbox = ({
  checked,
  onChange,
  disabled = false,
  children,
}: CheckboxProps) => {
  return (
    <label
      className={`${styles.checkboxContainer} ${
        disabled ? styles.disabled : ""
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className={styles.hiddenInput}
      />

      <span
        className={`${styles.customCheckbox} ${checked ? styles.checked : ""}`}
      >
        {checked && <Check size={16} />}
      </span>

      {children && <span className={styles.label}>{children}</span>}
    </label>
  );
};
