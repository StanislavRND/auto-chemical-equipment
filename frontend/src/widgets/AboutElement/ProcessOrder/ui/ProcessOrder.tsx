import { orderSteps } from "@shared/lib/data/processOrder";
import { Minus, Plus } from "lucide-react";
import { useProcessOrder } from "../model/useProcessOrder";
import styles from "./ProcessOrder.module.scss";

export const ProcessOrder = () => {
  const { activeId, toggleItem } = useProcessOrder();

  return (
    <section className={styles.processOrder}>
      <div className={styles.container}>
        <h3 className={styles.title}>Процесс оформления заказа</h3>
        <div className={styles.items}>
          {orderSteps.map((step) => (
            <div
              key={step.id}
              className={`${styles.item} ${activeId === step.id ? styles.active : ""}`}
              onClick={() => toggleItem(step.id)}
            >
              <div className={styles.itemHeader}>
                <div className={styles.itemTitle}>
                  <span>{step.number}</span>
                  {step.title}
                </div>
                <button
                  aria-label={activeId === step.id ? "close menu" : "open menu"}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleItem(step.id);
                  }}
                >
                  {activeId === step.id ? <Minus /> : <Plus />}
                </button>
              </div>
              <div className={styles.itemDescription}>
                <div>{step.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
