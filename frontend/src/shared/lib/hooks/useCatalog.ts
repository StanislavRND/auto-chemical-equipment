import { useEffect, useRef, useState } from "react";

interface CatalogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const useCatalog = ({ isOpen, onClose }: CatalogProps) => {
  const [activeSubCatalog, setActiveSubCatalog] = useState<string | null>(null);
  const catalogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClose = () => {
      if (!isOpen) {
        setActiveSubCatalog(null);
      }
    };
    handleClose();
  }, [isOpen]);

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

  const handleSubCatalogClick = (itemName: string) => {
    if (itemName === "Автохимия") {
      setActiveSubCatalog(
        activeSubCatalog === "Автохимия" ? null : "Автохимия",
      );
    }
  };

  const handleItemClick = (itemName: string) => {
    if (itemName === "Автохимия") {
      handleSubCatalogClick(itemName);
    } else {
      onClose();
    }
  };

  return { catalogRef, activeSubCatalog, handleItemClick };
};
