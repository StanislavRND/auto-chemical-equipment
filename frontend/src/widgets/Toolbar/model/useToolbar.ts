import { useState } from "react";

export const useToolbar = () => {
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  const toggleCatalog = () => {
    setIsCatalogOpen(!isCatalogOpen);
  };
  return { isCatalogOpen, setIsCatalogOpen, toggleCatalog };
};
