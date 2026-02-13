import { CATALOG_ITEMS, SUBCATALOG_ITEMS } from "@shared/lib/data/catalog";
import { useCatalog } from "@shared/lib/hooks/useCatalog";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import styles from "./Catalog.module.scss";

interface CatalogProps {
  isOpen: boolean;
  onClose: () => void;
  className: string;
}

export const Catalog = ({ isOpen, onClose, className }: CatalogProps) => {
  const { catalogRef, activeSubCatalog, handleItemClick } = useCatalog({
    isOpen,
    onClose,
  });
  if (!isOpen) return null;

  return (
    <section className={`${styles.catalog} ${className}`} ref={catalogRef}>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.general}>
        <div className={styles.title}>Каталог</div>
        {CATALOG_ITEMS.map((item, index) => (
          <div
            key={index}
            className={`${styles.subtitle} ${activeSubCatalog === item.name ? styles.active : ""}`}
            onClick={() => handleItemClick(item.name)}
          >
            <span>{item.name}</span>
            {activeSubCatalog === "Автохимия" && item.name === "Автохимия" && (
              <ChevronRight size={16} />
            )}
          </div>
        ))}
      </div>

      {activeSubCatalog === "Автохимия" && (
        <div className={styles.dop}>
          <div className={styles.title}>Автохимия</div>
          {SUBCATALOG_ITEMS.map((item, index) => (
            <div key={index} className={styles.subtitle} onClick={onClose}>
              <Link to={item.path}>{item.name}</Link>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
