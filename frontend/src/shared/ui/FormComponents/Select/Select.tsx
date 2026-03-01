import { useEffect, useId, useRef, useState } from "react";
import styles from "./Select.module.scss";

export interface SelectOption<T = string | number | boolean | undefined> {
  value: T;
  label: string;
}

interface SelectProps<T = string | number | boolean | undefined> {
  options: SelectOption<T>[];
  value?: T;
  onChange: (value: T) => void;
  placeholder: string;
  disabled?: boolean;
  error?: boolean;
  className?: string;
  drop?: "down" | "up";
  floatingColor?: string;
  clearError?: () => void;
}

export const Select = <T extends string | number | boolean | undefined>({
  options,
  value,
  onChange,
  placeholder,
  disabled = false,
  error = false,
  className = "",
  drop = "down",
  floatingColor,
  clearError,
}: SelectProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  const selected = options.find((o) => o.value === value);
  const shouldFloat = isFocused || value !== undefined;

  const toggle = () => {
    if (disabled) return;
    setIsOpen((p) => !p);
    setIsFocused(true);
  };

  const pick = (v: T) => {
    onChange(v);
    clearError?.();
    setIsOpen(false);
    setIsFocused(false);
  };

  useEffect(() => {
    const onDocDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", onDocDown);
    return () => document.removeEventListener("mousedown", onDocDown);
  }, []);

  return (
    <div ref={ref} className={`${styles.container} ${className}`}>
      <div
        id={`select-${id}`}
        className={`${styles.select} ${isOpen ? styles.open : ""} ${
          error ? styles.error : ""
        } ${disabled ? styles.disabled : ""}`}
        onClick={toggle}
        role="button"
        tabIndex={0}
      >
        <span className={styles.value}>{selected ? selected.label : ""}</span>

        <svg
          className={`${styles.arrow} ${isOpen ? styles.rotated : ""}`}
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>

        <label
          htmlFor={`select-${id}`}
          className={`${styles.label} ${shouldFloat ? styles.floating : ""}`}
          style={
            shouldFloat && floatingColor ? { color: floatingColor } : undefined
          }
        >
          {placeholder}
        </label>
      </div>

      {isOpen && (
        <div
          className={`${styles.options} ${
            drop === "up" ? styles.up : styles.down
          }`}
        >
          {options.map((o) => (
            <div
              key={o.label}
              className={styles.option}
              onClick={() => pick(o.value)}
            >
              {o.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
