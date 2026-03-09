import { useUpdateProduct } from "@entities/Product/api/product";
import { useGetCatalog } from "@shared/api/catalog/catalog";
import { AxiosError } from "axios";
import { useCallback, useMemo } from "react";
import { useCreateProduct } from "../api/useProduct";
import { isProductFormValid, validateProductForm } from "../lib/validation";
import type { UseProductFormArgs } from "../types";
import { useProductFormState } from "./useProductFormState";

export const useProductForm = ({
  mode,
  productId,
  onSuccess,
}: UseProductFormArgs) => {
  const { data: categories } = useGetCatalog();

  const {
    mutate: createProduct,
    isPending: isCreatePending,
    isError: isCreateError,
    error: createError,
  } = useCreateProduct();

  const {
    mutate: updateProduct,
    isPending: isUpdatePending,
    isError: isUpdateError,
    error: updateError,
  } = useUpdateProduct();

  const isPending = isCreatePending || isUpdatePending;
  const isError = isCreateError || isUpdateError;
  const error = (createError ?? updateError) as unknown;

  const {
    formData,
    touched,
    handleBlur,
    handleChange,
    touchAll,
    resetCreateForm,
    resetEditForm,
  } = useProductFormState({
    categories,
  });

  const categoryOptions = useMemo(
    () =>
      categories?.map((category) => ({
        value: category.id,
        label: category.name,
      })) ?? [],
    [categories],
  );

  const subcategoryOptions = useMemo(() => {
    const cat = categories?.find((c) => c.id === formData.category_id);
    return (
      cat?.subcategories?.map((s) => ({
        value: s.id,
        label: s.name,
      })) ?? []
    );
  }, [categories, formData.category_id]);

  const hasSubcategories = subcategoryOptions.length > 0;

  const formError = useMemo(
    () => validateProductForm(formData, hasSubcategories),
    [formData, hasSubcategories],
  );

  const isFormValid = useMemo(
    () => isProductFormValid(formError, formData, hasSubcategories),
    [formError, formData, hasSubcategories],
  );

  const payload = useMemo(
    () => ({
      name: formData.name.trim(),
      description: formData.description.trim(),
      compound: formData.compound.trim(),
      method_of_application: formData.method_of_application.trim(),
      price: formData.price.trim(),
      image_url: formData.image_url.trim(),
      category_id: formData.category_id,
      subcategory_id: hasSubcategories ? formData.subcategory_id : null,
    }),
    [formData, hasSubcategories],
  );

  const handleSubmit = useCallback(() => {
    touchAll();
    if (!isFormValid) return;

    if (mode === "edit") {
      if (!productId) return;
      updateProduct(
        { data: payload, productId },
        { onSuccess: () => onSuccess?.() },
      );
      return;
    }

    createProduct(payload, { onSuccess: () => onSuccess?.() });
  }, [
    touchAll,
    isFormValid,
    mode,
    productId,
    payload,
    createProduct,
    updateProduct,
    onSuccess,
  ]);

  const apiErrorMessage = useMemo((): string | null => {
    if (!isError) return null;
    if (error instanceof AxiosError && error.response?.data?.detail) {
      return error.response.data.detail;
    }
    return mode === "edit"
      ? "Ошибка при изменении товара."
      : "Ошибка при создании товара.";
  }, [isError, error, mode]);

  return {
    mode,
    formData,
    touched,
    categoryOptions,
    subcategoryOptions,
    formError,
    isFormValid,
    isPending,
    isError,
    apiErrorMessage,
    handleBlur,
    handleChange,
    handleSubmit,
    resetCreateForm,
    resetEditForm,
  };
};
