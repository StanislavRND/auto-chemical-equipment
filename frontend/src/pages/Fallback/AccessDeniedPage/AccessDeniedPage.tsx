import { Button } from "@shared/ui/Button/Button";
import { ShieldClose } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from "./AccessDeniedPage.module.scss";

export const AccessDeniedPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <ShieldClose className={styles.icon} size={64} />

      <h1 className={styles.title}>Доступ запрещен</h1>

      <div className={styles.message}>
        <p>Для просмотра этой страницы необходимо авторизоваться</p>
      </div>

      <div className={styles.buttons}>
        <Button
          onClick={() => navigate("/login")}
          variant="primary"
          className={styles.btn}
        >
          Войти
        </Button>

        <Button
          className={styles.btn}
          onClick={() => navigate("/register")}
          variant="outline"
        >
          Зарегистрироваться
        </Button>
      </div>
    </div>
  );
};