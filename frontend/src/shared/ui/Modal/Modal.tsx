import { useEffect, type ReactNode } from "react";
import styles from "./Modal.module.scss";

interface ModalProps {
  isOpen: boolean;
  onSubmit?: () => void;
  onClose: () => void;
  loading?: boolean;
  children: ReactNode;
  title?: string;
  closeOnOverlayClick?: boolean;
  isEdit?: boolean;
  className?: string;
  classNameOverlay?: string;
  buttonText?: string;
}

export const Modal = ({
  isOpen,
  onSubmit,
  onClose,
  children,
  loading,
  title,
  isEdit,
  className,
  classNameOverlay,
  buttonText = "Создать",
}: ModalProps) => {
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleSubmitClick = () => {
    if (onSubmit) {
      onSubmit();
    }
  };

  useEffect(() => {
    document.body.classList.toggle("modal-open", isOpen);

    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={` ${classNameOverlay} ${styles.overlay} `}>
      <div
        onClick={handleContentClick}
        className={` ${className} ${styles.modal} `}
      >
        <div className={styles.header}>
          <h2 className={styles.title}>
            {isEdit ? `Редактирование ${title}` : `Добавление ${title}`}
          </h2>

          <button className={styles.closeButton} onClick={onClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-x-icon lucide-x"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
        <div className={styles.content}>{children}</div>
        <div className={styles.footer}>
          <button
            className={styles.confirmButton}
            onClick={handleSubmitClick}
            type="button"
            disabled={loading}
          >
            {!loading ? (
              isEdit ? (
                "Изменить"
              ) : (
                buttonText
              )
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className={styles.spinner}
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
