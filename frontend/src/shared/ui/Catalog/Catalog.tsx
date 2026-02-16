import type { Category } from "@shared/api/catalog/catalog";
import { useCatalog } from "@shared/lib/hooks/useCatalog";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import { Loader } from "../Loader/Loader";
import styles from "./Catalog.module.scss";

interface CatalogProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  categories: Category[];
  loading: boolean;
  error: Error | null;
}

export const Catalog = ({
  isOpen,
  onClose,
  className,
  categories,
  loading,
  error,
}: CatalogProps) => {
  const {
    catalogRef,
    activeSubCatalog,
    activeCategory,
    hasSubcategories,
    categoriesWithSubcats,
    handleItemClick,
  } = useCatalog({
    isOpen,
    onClose,
    categories,
  });

  if (!isOpen) return null;

  if (loading)
    return (
      <section className={`${styles.catalog} ${className}`} ref={catalogRef}>
        <Loader size={32} text="Загрузка каталога..." />
      </section>
    );

  if (error)
    return (
      <section className={`${styles.catalog} ${className}`} ref={catalogRef}>
        <ErrorMessage message="Ошибка получения каталога" />
      </section>
    );

  return (
    <section className={`${styles.catalog} ${className}`} ref={catalogRef}>
      <div
        className={styles.overlay}
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      />

      <div className={styles.general}>
        <div className={styles.title}>Каталог</div>
        {categoriesWithSubcats.map((category) => (
          <div
            key={category.id}
            className={`${styles.subtitle} ${activeSubCatalog === category.name ? styles.active : ""}`}
            onClick={() =>
              handleItemClick(category.name, category.hasSubcats, category.id)
            }
          >
            <span>{category.name}</span>
            {activeSubCatalog === category.name && category.hasSubcats && (
              <ChevronRight size={16} />
            )}
          </div>
        ))}
      </div>

      {activeCategory && hasSubcategories && activeCategory.subcategories && (
        <div className={styles.dop}>
          <div className={styles.title}>{activeCategory.name}</div>
          {activeCategory.subcategories.map((subcategory) => (
            <div
              key={subcategory.id}
              className={styles.subtitle}
              onClick={onClose}
            >
              <Link to={`/catalog/${activeCategory.id}/${subcategory.id}`}>
                {subcategory.name}
              </Link>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
