import { ADVANTAGES } from "@shared/lib/data/advantages";
import styles from "./Advantages.module.scss";

export const Advantages = () => {
  return (
    <section className={styles.advantages}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {ADVANTAGES.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`${styles.card} ${styles[item.color]}`}
              >
                <Icon size={32} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
