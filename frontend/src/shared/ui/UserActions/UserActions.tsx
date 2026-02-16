import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../Button/Button";
import styles from "./UserActions.module.scss";

export const UserActions = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isMeActive = location.pathname.includes("/me");
  const isOrdersActive = location.pathname.includes("/orders");

  return (
    <div className={styles.actions}>
      <Button
        onClick={() => navigate("/profile/me")}
        className={`${styles.btn} ${isMeActive ? styles.active : ""}`}
        variant="outline"
      >
        Данные
      </Button>

      <Button
        onClick={() => navigate("/profile/orders")}
        className={`${styles.btn} ${isOrdersActive ? styles.active : ""}`}
        variant="outline"
      >
        Заказы
      </Button>
    </div>
  );
};
