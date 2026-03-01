import { LoaderCircle } from "lucide-react";
import styles from "./Loader.module.scss";

interface LoaderProps {
  text?: string;
  size?: number;
  color?: string;
  textHidden?: boolean;
}

export const Loader = ({
  text = "Загрузка...",
  size = 24,
  color = "var(--blue-500)",
  textHidden = false,
}: LoaderProps) => {
  return (
    <div className={styles.loaderContainer}>
      <LoaderCircle size={size} color={color} className={styles.loaderIcon} />
      {!textHidden && text && <span className={styles.loaderText}>{text}</span>}
    </div>
  );
};
