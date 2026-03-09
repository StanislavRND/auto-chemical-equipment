import type { Product } from "@entities/Product/api/product";
import { useProductForm } from "@features/ProductForm/model/useProductForm";
import { useState } from "react";

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
    productForm.resetCreateForm();
    handleOpenModal();
  };

  const openEdit = (product: Product) => {
    setMode("edit");
    setEditingProduct(product);

    productForm.resetEditForm({
      name: product.name,
      description: product.description,
      compound: product.compound,
      method_of_application: product.method_of_application,
      image_url: product.image_url,
      price: String(product.price),
      category_id: product.category_id,
      subcategory_id: product.subcategory_id,
    });

    handleOpenModal();
  };

  const productForm = useProductForm({
    mode,
    productId: editingProduct ? String(editingProduct.id) : undefined,
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
