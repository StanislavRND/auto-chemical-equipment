import { useAppSelector } from "@app/store/hooks";
import { selectCartTotalCount } from "@entities/Cart/model/store/cartSelectors";
import { useAuth } from "@entities/User/model/useAuth";
import type { Category } from "@shared/api/catalog/catalog";
import { useBreakpoint } from "@shared/lib/hooks/useBreakpoint";
import { Button } from "@shared/ui/Button/Button";
import { Catalog } from "@shared/ui/Catalog/Catalog";
import { Input } from "@shared/ui/FormComponents/Input/Input";
import { Menu, Search, ShoppingCart, UserRound } from "lucide-react";
import { useToolbar } from "../model/useToolbar";
import styles from "./Toolbar.module.scss";

interface ToolbarProps {
  categories: Category[];
  loading: boolean;
  error: Error | null;
}

export const Toolbar = (props: ToolbarProps) => {
  const { isLaptop, isMobile, isTablet } = useBreakpoint();

  const {
    isCatalogOpen,
    sentinelRef,
    isScrolled,
    setIsCatalogOpen,
    toggleCatalog,
    handleToLogin,
    handleToCart,
    handleToProfile,
  } = useToolbar();

  const { isAuthenticated, role } = useAuth();
  const cartCount = useAppSelector(selectCartTotalCount);

  const buttonSize = isLaptop || isMobile || isTablet ? "md" : "lg";

  return (
    <>
      <div ref={sentinelRef} style={{ height: 1 }} />

      <section
        className={`${styles.toolbar} ${isScrolled ? styles.scrolled : ""}`}
      >
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
            {role !== "admin" && isAuthenticated && (
              <button
                onClick={handleToCart}
                type="button"
                aria-label="Корзина"
                className={styles.cartBtn}
              >
                <ShoppingCart className={styles.actionsIcon} />
                <span className={styles.cartBadge}>
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              </button>
            )}

            {isAuthenticated ? (
              <button
                onClick={handleToProfile}
                type="button"
                aria-label="Профиль"
                className={styles.profileBtn}
              >
                <UserRound className={styles.actionsIcon} />
              </button>
            ) : (
              <Button
                size={buttonSize}
                className={styles.btnLogin}
                variant="outline"
                onClick={handleToLogin}
              >
                Войти
              </Button>
            )}
          </div>

          <Catalog
            categories={props.categories || []}
            loading={props.loading}
            error={props.error}
            className={styles.toolbarCatalog}
            isOpen={isCatalogOpen}
            onClose={() => setIsCatalogOpen(false)}
          />
        </div>
      </section>
    </>
  );
};
