import { useBreakpoint } from "@shared/lib/hooks/useBreakpoint";
import { Eye, EyeOff } from "lucide-react";
import { useId, useState } from "react";
import styles from "./Input.module.scss";

interface InputProps {
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  type?: string;
  id?: string;
  "aria-label"?: string;
}

export const Input = ({
  placeholder,
  value = "",
  onChange,
  onBlur,
  type = "text",
  id,
  "aria-label": ariaLabel,
}: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [showPasswordToggle, setShowPasswordToggle] = useState(false);
  const { isLaptop } = useBreakpoint();

  const generatedId = useId();
  const inputId = id || `input-${generatedId}`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange?.(newValue);
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const togglePasswordVisibility = () => {
    setShowPasswordToggle(!showPasswordToggle);
  };

  const inputType = showPasswordToggle ? "text" : type;
  const shouldFloat = isFocused || inputValue.length > 0;

  const getHeightInputContainerClass = () => {
    if (isLaptop) return styles.heightInputContainerLaptop;
    return "";
  };
  const getHeightLabelClass = () => {
    if (isLaptop) return styles.heightLabelLaptop;
    return "";
  };

  return (
    <div
      className={`${styles.inputContainer} ${getHeightInputContainerClass()}`}
    >
      <input
        id={inputId}
        type={inputType}
        className={styles.input}
        value={inputValue}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        aria-label={ariaLabel || placeholder}
      />

      {type === "password" &&
        (showPasswordToggle ? (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className={styles.eyeButton}
            aria-label="Скрыть пароль"
            aria-controls={inputId}
          >
            <Eye className={styles.eyeIcon} />
          </button>
        ) : (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className={styles.eyeButton}
            aria-label="Показать пароль"
            aria-controls={inputId}
          >
            <EyeOff className={styles.eyeIcon} />
          </button>
        ))}

      <label
        htmlFor={inputId}
        className={`${styles.label} ${getHeightLabelClass()} ${
          shouldFloat ? styles.floating : ""
        }`}
      >
        {placeholder}
      </label>
    </div>
  );
};
