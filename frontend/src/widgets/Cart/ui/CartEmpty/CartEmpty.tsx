import cartImg from "@shared/assets/images/empty-cart.png";
import { useBreakpoint } from "@shared/lib/hooks/useBreakpoint";
import { Button } from "@shared/ui/Button/Button";
import { useNavigate } from "react-router-dom";
import styles from "./CartEmpty.module.scss";

export const CartEmpty = () => {
  const { isLaptop, isMobile, isTablet } = useBreakpoint();
  const navigate = useNavigate();

  const buttonSize = isLaptop || isMobile || isTablet ? "md" : "lg";

  return (
    <section className={styles.cartEmpty}>
      <div className={styles.container}>
        <div className={styles.imageWrapper}>
          <img
            className={styles.cartImg}
            src={cartImg}
            alt="Фото пустой корзины"
          />
        </div>
        <div className={styles.empty}>
          <h3 className={styles.title}>В корзине пока нет товаров</h3>
          <p className={styles.text}>
            <span>Перейдите в каталог</span>, воспользуйтесь поиском, чтобы
            найти нужный товар
          </p>
          <Button
            onClick={() => navigate("/home")}
            className={styles.btn}
            size={buttonSize}
          >
            Начать покупки
          </Button>
        </div>
      </div>
    </section>
  );
};
