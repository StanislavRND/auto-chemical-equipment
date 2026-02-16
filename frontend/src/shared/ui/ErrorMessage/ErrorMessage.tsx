import { AlertCircle } from "lucide-react";
import styles from "./ErrorMessage.module.scss";

interface ErrorMessageProps {
  message?: string;
}

export const ErrorMessage = ({ message = "Ошибка. Попробуйте ещё раз." }: ErrorMessageProps) => {
  return (
    <div className={styles.error}>
      <AlertCircle size={20} />
      <span>{message}</span>
    </div>
  );
};
