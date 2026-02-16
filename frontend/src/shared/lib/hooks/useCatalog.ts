import type { Category } from "@shared/api/catalog/catalog";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

interface CatalogProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
}

export const useCatalog = ({ isOpen, onClose, categories }: CatalogProps) => {
  const [activeSubCatalog, setActiveSubCatalog] = useState<string | null>(null);
  const catalogRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const catalogButton = document.querySelector(
        '[data-catalog-button="true"]',
      );

      if (
        catalogRef.current &&
        !catalogRef.current.contains(event.target as Node) &&
        !catalogButton?.contains(event.target as Node) &&
        isOpen
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleItemClick = (
    itemName: string,
    hasSubcategories: boolean,
    categoryId?: number,
  ) => {
    if (hasSubcategories) {
      setActiveSubCatalog(activeSubCatalog === itemName ? null : itemName);
    } else {
      onClose();
      if (categoryId) {
        navigate(`/catalog/${categoryId}`);
      }
    }
  };

  const activeCategory = categories.find(
    (cat) => cat.name === activeSubCatalog,
  );
  const hasSubcategories = (activeCategory?.subcategories?.length ?? 0) > 0;

  const categoriesWithSubcats = categories.map((category) => ({
    ...category,
    hasSubcats: Boolean(category.subcategories?.length),
  }));

  return {
    catalogRef,
    activeSubCatalog,
    activeCategory,
    handleItemClick,
    categoriesWithSubcats,
    hasSubcategories,
  };
};
