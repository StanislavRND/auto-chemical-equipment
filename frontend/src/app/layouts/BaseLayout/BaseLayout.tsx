import { Toolbar } from "@/widgets/Toolbar/ui/Toolbar";
import { useGetCatalog } from "@shared/api/catalog/catalog";
import { useBreakpoint } from "@shared/lib/hooks/useBreakpoint";
import { Footer } from "@widgets/Footer/ui/Footer";
import { Header } from "@widgets/Header/ui/Header";
import { MenuMobile } from "@widgets/MenuMobile/ui/MenuMobile";
import { Outlet } from "react-router-dom";
import styles from "./BaseLayout.module.scss";

export const MainLayout = () => {
  const { isMobile, isTablet } = useBreakpoint();
  const { data: categories, isLoading, error } = useGetCatalog();

  const shouldRenderMenuMobile = isMobile || isTablet;

  return (
    <div className={styles.layout}>
      <Header />
      {shouldRenderMenuMobile && <MenuMobile />}
      <Toolbar
        categories={categories || []}
        loading={isLoading}
        error={error}
      />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
