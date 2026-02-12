import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import type { MenuItem } from "../lib/data";

export const useActiveMenu = (
  items: MenuItem[],
  defaultPath: string = "/home",
) => {
  const location = useLocation();
  const [activePath, setActivePath] = useState<string>(defaultPath);

  useEffect(() => {
    const currentPath = location.pathname;

    const timeoutId = setTimeout(() => {
      for (const item of items) {
        if (
          currentPath.includes(item.path) ||
          (item.path === "/home" && (currentPath === "/" || currentPath === ""))
        ) {
          setActivePath(item.path);
          return;
        }
      }
      setActivePath(defaultPath);
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [location, items, defaultPath]);

  return { activePath };
};
