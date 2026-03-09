import styles from "./CartSale.module.scss";

export const CartSale = () => {
  return (
    <section className={styles.sale}>
      <div className={styles.discounts}>
        <div className={styles.discountTitle}> Cкидки</div>
        <ul className={styles.discountList}>
          <li>от 20 000 ₽ — 3%</li>
          <li>от 50 000 ₽ — 5%</li>
          <li>от 100 000 ₽ — 10%</li>
        </ul>
      </div>
    </section>
  );
};
