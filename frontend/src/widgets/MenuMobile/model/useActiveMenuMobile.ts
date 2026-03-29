import { useAuth } from "@entities/User/model/useAuth";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { menuItems, type MenuItem } from "../lib/data";

export const useActiveMenu = (items: MenuItem[]) => {
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { isAuthenticated, role } = useAuth();
  const isAdmin = role === "admin";

  const activePath = useMemo(() => {
    const currentPath = location.pathname;

    const activeItem = items.find(
      (item) => item.id !== "catalog" && currentPath.includes(item.path),
    );

    if (activeItem) return activeItem.path;

    const homeItem = items.find((item) => item.id === "home");
    return homeItem?.path || "";
  }, [location.pathname, items]);

  const filteredMenuItems = useMemo(() => {
    return menuItems.filter((item) => {
      if (item.path === "/profile/me" && !isAuthenticated) return false;

      if (item.id === "cart" && isAdmin) return false;

      if (item.id === "about" && isAdmin) return false;

      if (item.id === "catalogAdmin" && !isAdmin) return false;
      if (item.id === "ordersAdmin" && !isAdmin) return false;

      return true;
    });
  }, [isAuthenticated, isAdmin]);

  const handleNavigate = (path: string, itemId: string) => {
    if (itemId === "catalog") {
      setIsCatalogOpen((prev) => !prev);
      return;
    }
    navigate(path);
  };

  return {
    activePath,
    isCatalogOpen,
    setIsCatalogOpen,
    filteredMenuItems,
    handleNavigate,
  };
};
