import { Loader2 } from "lucide-react";
import styles from "./Button.module.scss";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  type?: "button" | "submit" | "reset";
  loading?: boolean;
  loaderColor?: string;
  disabled?: boolean;
}

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  className = "",
  loading = false,
  loaderColor,
  disabled = false,
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
      disabled={disabled}
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
