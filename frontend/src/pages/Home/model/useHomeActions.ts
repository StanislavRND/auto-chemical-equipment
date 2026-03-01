import type { Product } from "@entities/Product/api/product";
import { useProductForm } from "@features/ProductForm/model/useProductForm";
import { useMemo, useState } from "react";

export const useHomeActions = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleSubmitSuccess = () => {
    handleCloseModal();
    setEditingProduct(null);
    setMode("create");
  };

  const openCreate = () => {
    setMode("create");
    setEditingProduct(null);
    handleOpenModal();
  };

  const openEdit = (product: Product) => {
    setMode("edit");
    setEditingProduct(product);
    handleOpenModal();
  };

  const initialValues = useMemo(() => {
    if (!editingProduct) return undefined;
    return {
      name: editingProduct.name,
      description: editingProduct.description,
      compound: editingProduct.compound,
      method_of_application: editingProduct.method_of_application,
      image_url: editingProduct.image_url,
      price: String(editingProduct.price),
      category_id: editingProduct.category_id,
      subcategory_id: editingProduct.subcategory_id,
    };
  }, [editingProduct]);

  const productForm = useProductForm({
    mode,
    productId: editingProduct ? String(editingProduct.id) : undefined,
    initialValues,
    onSuccess: handleSubmitSuccess,
  });

  return {
    isOpen,
    mode,
    handleCloseModal,
    openCreate,
    openEdit,
    productForm,
  };
};
