import { useBreakpoint } from "@shared/lib/hooks/useBreakpoint";
import { Button } from "@shared/ui/Button/Button";
import { Catalog } from "@shared/ui/Catalog/Catalog";
import { Input } from "@shared/ui/Input/Input";
import { Menu, Search, ShoppingCart, UserRound } from "lucide-react";
import { useToolbar } from "../model/useToolbar";
import styles from "./Toolbar.module.scss";

export const Toolbar = () => {
  const { isLaptop, isMobile, isTablet } = useBreakpoint();
  const { isCatalogOpen, setIsCatalogOpen, toggleCatalog } = useToolbar();

  const buttonSize = isLaptop || isMobile || isTablet ? "md" : "lg";

  return (
    <section className={styles.toolbar}>
      <div className={styles.container}>
        <Button
          data-catalog-button="true"
          size={buttonSize}
          className={styles.btn}
          onClick={toggleCatalog}
        >
          <Menu className={styles.menuIcon} />
          Каталог
        </Button>
        <div className={styles.inputWrapper}>
          <Input placeholder="Поиск" className={styles.input} />
          <Search className={styles.searchIcon} />
        </div>
        <div className={styles.actions}>
          <button type="button" aria-label="Корзина">
            <ShoppingCart className={styles.actionsIcon} />
          </button>
          <button type="button" aria-label="Профиль">
            <UserRound className={styles.actionsIcon} />
          </button>
        </div>
        <Catalog
          className={styles.toolbarCatalog}
          isOpen={isCatalogOpen}
          onClose={() => setIsCatalogOpen(false)}
        />
      </div>
    </section>
  );
};
