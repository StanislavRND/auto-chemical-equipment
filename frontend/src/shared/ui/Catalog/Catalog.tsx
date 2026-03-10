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

const DEFAULT_CATALOG_SEARCH = new URLSearchParams({
  sort: "name",
  inStock: "true",
  withDiscount: "false",
}).toString();

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

  if (loading) {
    return (
      <section className={`${styles.catalog} ${className}`} ref={catalogRef}>
        <Loader size={32} text="Загрузка каталога..." />
      </section>
    );
  }

  if (error) {
    return (
      <section className={`${styles.catalog} ${className}`} ref={catalogRef}>
        <ErrorMessage message="Ошибка получения каталога" />
      </section>
    );
  }

  return (
    <section className={`${styles.catalog} ${className}`} ref={catalogRef}>
      <div className={styles.overlay} onClick={onClose} />

      <div className={styles.general}>
        <div className={styles.title}>Каталог</div>

        {categoriesWithSubcats.map((category) => {
          const isActive = activeSubCatalog === category.name;

          if (!category.hasSubcats) {
            return (
              <Link
                key={category.id}
                to={{
                  pathname: `/catalog/${category.id}`,
                  search: `?${DEFAULT_CATALOG_SEARCH}`,
                }}
                className={`${styles.subtitle} ${isActive ? styles.active : ""}`}
                onClick={onClose}
              >
                <span>{category.name}</span>
              </Link>
            );
          }

          return (
            <div
              key={category.id}
              className={`${styles.subtitle} ${isActive ? styles.active : ""}`}
              onClick={() =>
                handleItemClick(category.name, category.hasSubcats, category.id)
              }
            >
              <span>{category.name}</span>
              {isActive && <ChevronRight size={16} />}
            </div>
          );
        })}
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
              <Link
                to={{
                  pathname: `/catalog/${activeCategory.id}/${subcategory.id}`,
                  search: `?${DEFAULT_CATALOG_SEARCH}`,
                }}
              >
                {subcategory.name}
              </Link>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
