import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const useActiveHeader = () => {
  const location = useLocation();
  const [activePath, setActivePath] = useState<string>("");

  useEffect(() => {
    const currentPath = location.pathname;

    const timeoutId = setTimeout(() => {
      if (currentPath.includes("/home")) {
        setActivePath("/home");
      } else if (currentPath.includes("/about")) {
        setActivePath("/about");
      } else {
        setActivePath("");
      }
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [location]);

  return { activePath };
};
