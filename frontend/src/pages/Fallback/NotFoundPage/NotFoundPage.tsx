import { Button } from "@shared/ui/Button/Button";
import { FileQuestion } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from "./NotFoundPage.module.scss";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <section className={styles.wrapper}>
      <div className={styles.container}>
        <FileQuestion className={styles.icon} size={64} />

        <h1 className={styles.title}>Страница не найдена</h1>

        <div className={styles.message}>
          <p>Запрашиваемая страница не существует или была перемещена</p>
        </div>

        <div className={styles.buttons}>
          <Button
            onClick={() => navigate("/")}
            variant="primary"
            className={styles.btn}
          >
            На главную
          </Button>

          <Button
            className={styles.btn}
            onClick={() => navigate(-1)}
            variant="outline"
          >
            Назад
          </Button>
        </div>
      </div>
    </section>
  );
};

export default NotFoundPage;
