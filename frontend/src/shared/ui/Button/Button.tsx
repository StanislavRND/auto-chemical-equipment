import { Loader2 } from "lucide-react";
import { type ButtonHTMLAttributes } from "react";
import styles from "./Button.module.scss";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  loaderColor?: string;
}

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  className = "",
  loading = false,
  loaderColor,
  disabled,
  ...props 
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={`
        ${styles.button}
        ${styles[variant]}
        ${styles[size]}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className={styles.loaderContainer}>
          <Loader2
            className={styles.loader}
            style={loaderColor ? { color: loaderColor } : undefined}
          />
        </div>
      ) : (
        children
      )}
    </button>
  );
};
