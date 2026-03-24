import { AxiosError } from "axios";
import { useCallback, useMemo } from "react";
import { useCreateCatalog, useUpdateCatalog } from "../api/useCatalog";
import { isCatalogFormValid, validateCatalogForm } from "../lib/validation";
import type { UseCatalogFormArgs } from "../types";
import { useCatalogFormState } from "./useCatalogFormState";

export const useCatalogForm = ({
  mode,
  categoryId,
  onSuccess,
}: UseCatalogFormArgs) => {
  const {
    mutate: createCatalog,
    isPending: isCreatePending,
    isError: isCreateError,
    error: createError,
  } = useCreateCatalog();

  const {
    mutate: updateCatalog,
    isPending: isUpdatePending,
    isError: isUpdateError,
    error: updateError,
  } = useUpdateCatalog();

  const isPending = isCreatePending || isUpdatePending;
  const isError = isCreateError || isUpdateError;
  const error = (createError ?? updateError) as unknown;

  const {
    formData,
    touched,
    confirmOpen,
    handleBlur,
    handleChange,
    handleSubcategoryChange,
    addSubcategory,
    handleRemoveClick,
    handleConfirmDelete,
    handleCancelDelete,
    touchAll,
    resetCreateForm,
    resetEditForm,
  } = useCatalogFormState();

  const formError = useMemo(() => validateCatalogForm(formData), [formData]);

  const isFormValid = useMemo(
    () => isCatalogFormValid(formError, formData),
    [formError, formData],
  );

  const payload = useMemo(
    () => ({
      name: formData.name.trim(),
      image_url: formData.image_url.trim(),
      subcategories: formData.subcategories,
    }),
    [formData],
  );

  const handleSubmit = useCallback(() => {
    touchAll();
    if (!isFormValid) return;

    if (mode === "edit") {
      if (!categoryId) return;
      updateCatalog(
        { data: payload, categoryId },
        { onSuccess: () => onSuccess?.() },
      );
      return;
    }

    createCatalog(payload, { onSuccess: () => onSuccess?.() });
  }, [
    touchAll,
    isFormValid,
    mode,
    categoryId,
    payload,
    createCatalog,
    updateCatalog,
    onSuccess,
  ]);

  const apiErrorMessage = useMemo((): string | null => {
    if (!isError) return null;
    if (error instanceof AxiosError && error.response?.data?.detail) {
      return error.response.data.detail;
    }
    return mode === "edit"
      ? "Ошибка при изменении каталога."
      : "Ошибка при создании каталога.";
  }, [isError, error, mode]);

  return {
    mode,
    formData,
    touched,
    confirmOpen,
    formError,
    isFormValid,
    isPending,
    isError,
    apiErrorMessage,
    handleBlur,
    handleChange,
    handleSubcategoryChange,
    addSubcategory,
    handleRemoveClick,
    handleConfirmDelete,
    handleCancelDelete,
    handleSubmit,
    resetCreateForm,
    resetEditForm,
  };
};
