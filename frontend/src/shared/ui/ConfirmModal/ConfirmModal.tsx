import styles from "./ConfirmModal.module.scss";

interface ConfirmModalProps {
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isOpen: boolean;
}

export const ConfirmModal = ({
  title = "Подтверждение",
  message,
  onConfirm,
  onCancel,
  isOpen,
}: ConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3 className={styles.title}>{title}</h3> 
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          <button className={styles.cancel} onClick={onCancel}>
            Отмена
          </button>
          <button className={styles.confirm} onClick={onConfirm}>
            Подтвердить
          </button>
        </div>
      </div>
    </div>
  );
};
