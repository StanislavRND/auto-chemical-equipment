import { Button } from "@shared/ui/Button/Button";
import { ShieldClose } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from "./AccessDeniedPage.module.scss";

 const AccessDeniedPage = () => {
  const navigate = useNavigate();

  return (
    <section className={styles.wrapper}>
      {" "}
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
            onClick={() => navigate("/home")}
            variant="outline"
          >
            На главную
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AccessDeniedPage
