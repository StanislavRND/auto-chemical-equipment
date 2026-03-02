import { useBreakpoint } from "@shared/lib/hooks/useBreakpoint";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export const useToolbar = () => {
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [internalScrolled, setInternalScrolled] = useState(false);

  const { isTablet } = useBreakpoint();
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isTablet) return;

    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInternalScrolled(!entry.isIntersecting);
      },
      { threshold: 1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isTablet]);

  const isScrolled = !isTablet && internalScrolled;

  const toggleCatalog = () => setIsCatalogOpen((v) => !v);

  return {
    sentinelRef,
    isCatalogOpen,
    isScrolled,
    setIsCatalogOpen,
    toggleCatalog,
    handleToLogin: () => navigate("/login"),
    handleToCart: () => navigate("/cart"),
    handleToProfile: () => navigate("/profile/me"),
  };
};
