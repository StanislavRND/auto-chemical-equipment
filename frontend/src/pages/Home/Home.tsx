import { useBreakpoint } from "@shared/lib/hooks/useBreakpoint";
import { Catalog } from "@shared/ui/Catalog/Catalog";

export const Home = () => {
  const { isMobile, isTablet } = useBreakpoint();

  const shouldRenderMenuMobile = isMobile || isTablet;
  return (
    <main style={{width: '100vw'}}>
      {/* <Header />
      {shouldRenderMenuMobile && <MenuMobile />} */}
      {/* <Footer /> */}
      <Catalog />
    </main>
  );
};
