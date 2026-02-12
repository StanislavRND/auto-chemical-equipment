import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Catalog.module.scss";

export const Catalog = () => {
  const [isOpen, setIsOpen] = useState(false);

  const CATALOG_ITEMS = [
    { name: "Автохимия" },
    { name: "Масло и тех.жидкости" },
    { name: "Антифризы" },
    { name: "Стеклоочистители" },
    { name: "Аксессуары" },
    { name: "Инструменты" },
    { name: "Диски и шины" },
    { name: "Запчасти" },
    { name: "Аккумуляторные батареи" },
    { name: "Оборудование" },
  ];

  const SUBCATALOG_ITEMS = [
    { name: "Очистители", path: "/catalog/avtohimiya/ochistiteli" },
    {
      name: "Средства для мойки",
      path: "/catalog/avtohimiya/sredstva-dlya-moyki",
    },
    { name: "Шампуни", path: "/catalog/avtohimiya/shampuni" },
  ];

  const toggleCatalog = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.catalog}>
      <div className={styles.general}>
        <div className={styles.title}>Каталог</div>
        {CATALOG_ITEMS.map((item, index) => (
          <div
            key={index}
            className={`${styles.subtitle} ${isOpen && item.name === "Автохимия" ? styles.active : ""}`}
            onClick={item.name === "Автохимия" ? toggleCatalog : undefined}
          >
            <span>{item.name}</span>
            {isOpen && item.name === "Автохимия" && <ChevronRight size={16} />}
          </div>
        ))}
      </div>

      {isOpen && (
        <div className={styles.dop}>
          <div className={styles.title}>Автохимия</div>
          {SUBCATALOG_ITEMS.map((item, index) => (
            <div key={index} className={styles.subtitle}>
              <Link to={item.path}>{item.name}</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
