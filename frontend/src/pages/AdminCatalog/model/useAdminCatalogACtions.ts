import { useCatalogForm } from "@features/CatalogForm/model/useCatalogForm";
import type { Category } from "@shared/api/catalog/catalog";
import { useState } from "react";

export const useAdminCatalogActions = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingCatalog, setEditingCatalog] = useState<Category | null>(null);

  const [openIds, setOpenIds] = useState<{ [key: number]: boolean }>({});

  const toggle = (id: number, hasChildren: boolean) => {
    if (!hasChildren) return;
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleSubmitSuccess = () => {
    handleCloseModal();
    setEditingCatalog(null);
    setMode("create");
  };

  const openCreate = () => {
    setMode("create");
    setEditingCatalog(null);
    catalogForm.resetCreateForm();
    handleOpenModal();
  };

  const openEdit = (catalog: Category) => {
    setMode("edit");
    setEditingCatalog(catalog);

    catalogForm.resetEditForm({
      name: catalog.name,
      image_url: catalog.image_url,
      subcategories: catalog.subcategories || [],
    });

    handleOpenModal();
  };

  const catalogForm = useCatalogForm({
    mode,
    categoryId: editingCatalog ? String(editingCatalog.id) : undefined,
    onSuccess: handleSubmitSuccess,
  });

  return {
    isOpen,
    openIds,
    mode,
    toggle,
    handleCloseModal,
    openCreate,
    openEdit,
    catalogForm,
  };
};
