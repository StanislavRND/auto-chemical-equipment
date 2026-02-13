import { Toolbar } from "@/widgets/Toolbar/ui/Toolbar";
import { useBreakpoint } from "@shared/lib/hooks/useBreakpoint";
import { Footer } from "@widgets/Footer/ui/Footer";
import { Header } from "@widgets/Header/ui/Header";
import { MenuMobile } from "@widgets/MenuMobile/ui/MenuMobile";
import { Outlet } from "react-router-dom";

export const MainLayout = () => {
  const { isMobile, isTablet } = useBreakpoint();

  const shouldRenderMenuMobile = isMobile || isTablet;
  return (
    <>
      <Header />
      {shouldRenderMenuMobile && <MenuMobile />}
      <Toolbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};
