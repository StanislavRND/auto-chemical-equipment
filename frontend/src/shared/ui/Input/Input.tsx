import { useBreakpoint } from "@shared/lib/hooks/useBreakpoint";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import styles from "./Input.module.scss";

interface InputProps {
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
  type?: string;
}

export const Input = ({
  placeholder,
  value = "",
  onChange,
  type = "text",
}: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [showPasswordToggle, setShowPasswordToggle] = useState(false);
  const {  isLaptop } = useBreakpoint();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange?.(newValue);
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
        type={inputType}
        className={styles.input}
        value={inputValue}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {type === "password" &&
        (showPasswordToggle ? (
          <Eye onClick={togglePasswordVisibility} className={styles.eyeIcon} />
        ) : (
          <EyeOff
            onClick={togglePasswordVisibility}
            className={styles.eyeIcon}
          />
        ))}
      <label
        className={`${styles.label} ${getHeightLabelClass()} ${
          shouldFloat ? styles.floating : ""
        }`}
      >
        {placeholder}
      </label>
    </div>
  );
};
