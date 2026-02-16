import { useGetCatalog } from "@shared/api/catalog/catalog";
import { Catalog } from "@shared/ui/Catalog/Catalog";
import { menuItems } from "../lib/data";
import { useActiveMenu } from "../model/useActiveMenuMobile";
import styles from "./MenuMobile.module.scss";

export const MenuMobile = () => {
  const {
    activePath,
    filteredMenuItems,
    handleNavigate,
    setIsCatalogOpen,
    isCatalogOpen,
  } = useActiveMenu(menuItems);
  const { data: categories, isLoading, error } = useGetCatalog();

  return (
    <>
      {" "}
      <menu className={styles.menu}>
        <div className={styles.items}>
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePath === item.path;

            return (
              <button
                key={item.id}
                className={`${styles.item} ${isActive ? styles.active : ""}`}
                onClick={() => handleNavigate(item.path, item.id)}
                {...(item.id === "catalog"
                  ? { "data-catalog-button": "true" }
                  : {})}
              >
                <Icon className={styles.icon} />
                <div className={styles.title}>{item.label}</div>
              </button>
            );
          })}
        </div>
      </menu>
      <Catalog
        categories={categories || []}
        loading={isLoading}
        error={error}
        className={styles.menuCatalog}
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
      />
    </>
  );
};
