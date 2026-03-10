import { Button } from "@shared/ui/Button/Button";
import styles from "./FilterProducts.module.scss";

export const FilterProducts = () => {
  return (
    <section className={styles.filter}>
      <div className={styles.group}>
        <p className={styles.label}>Цена</p>
        <div className={styles.price}>
          <input type="number" placeholder="от" />
          <input type="number" placeholder="до" />
        </div>
      </div>

      <div className={styles.group}>
        <p className={styles.label}>В наличии</p>
        <div className={styles.optionFlex}>
          <label className={styles.option}>
            <input type="radio" name="stock" />
            Да
          </label>

          <label className={styles.option}>
            <input type="radio" name="stock" defaultChecked />
            Нет
          </label>
        </div>
      </div>

      <div className={styles.group}>
        <p className={styles.label}>Со скидкой</p>
        <div className={styles.optionFlex}>
          <label className={styles.option}>
            <input type="radio" name="sale" />
            Да
          </label>

          <label className={styles.option}>
            <input type="radio" name="sale" defaultChecked />
            Нет
          </label>
        </div>
      </div>

      <div className={styles.actions}>
        <Button size="md">Применить</Button>
        <Button variant="outline" size="md">
          Сбросить
        </Button>
      </div>
    </section>
  );
};
