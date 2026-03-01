
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { menuItems, type MenuItem } from "../lib/data";
import { useAuth } from "@entities/User/model/useAuth";

export const useActiveMenu = (items: MenuItem[]) => {
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const activePath = useMemo(() => {
    const currentPath = location.pathname;

    const activeItem = items.find(
      (item) => item.id !== "catalog" && currentPath.includes(item.path),
    );

    if (activeItem) {
      return activeItem.path;
    } else {
      const homeItem = items.find((item) => item.id === "home");
      return homeItem?.path || "";
    }
  }, [location.pathname, items]);

  const filteredMenuItems = menuItems.filter((item) => {
    if (item.path === "/profile" && !isAuthenticated) {
      return false;
    }
    return true;
  });

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
