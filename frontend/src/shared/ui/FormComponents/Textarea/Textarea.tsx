import { forwardRef, useEffect, useId, useState } from "react";
import styles from "./Textarea.module.scss";

interface TextareaProps extends Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "onChange"
> {
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  floatingColor?: string;
  clearError?: () => void;
  classNameContainer?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      placeholder,
      value = "",
      onChange,
      onBlur,
      id,
      className = "",
      classNameContainer = "",
      disabled,
      floatingColor,
      clearError,
      ...rest
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [textareaValue, setTextareaValue] = useState(value);

    const generatedId = useId();
    const textareaId = id || `textarea-${generatedId}`;

    useEffect(() => {
      setTextareaValue(value);
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      setTextareaValue(newValue);
      onChange?.(newValue);
      clearError?.();
    };

    const handleBlur = () => {
      setIsFocused(false);
      onBlur?.();
    };

    const shouldFloat = isFocused || textareaValue.length > 0;

    return (
      <div className={`${styles.textareaContainer} ${classNameContainer}`}>
        <textarea
          id={textareaId}
          ref={ref}
          className={`${styles.textarea} ${className}`}
          value={textareaValue}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          aria-label={placeholder}
          disabled={disabled}
          placeholder=""
          {...rest}
        />

        <label
          htmlFor={textareaId}
          className={`${styles.label} ${shouldFloat ? styles.floating : ""}`}
          style={
            shouldFloat && floatingColor ? { color: floatingColor } : undefined
          }
        >
          {placeholder}
        </label>
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
