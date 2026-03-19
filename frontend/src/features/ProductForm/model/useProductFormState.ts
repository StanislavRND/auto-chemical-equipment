import type { Category } from "@shared/api/catalog/catalog";
import { useCallback, useState } from "react";
import {
  createEmptyProductForm,
  ensureDefaultsFromCatalog,
  getFirstSubcategoryIdByCategory,
  mergeInitialValues,
} from "../lib/init";
import {
  emptyTouched,
  type ProductFormValues,
  type TouchedFields,
} from "../types";

type Args = {
  categories?: Category[];
};

export const useProductFormState = ({ categories }: Args) => {
  const [formData, setFormData] = useState<ProductFormValues>(() =>
    categories?.length
      ? ensureDefaultsFromCatalog(createEmptyProductForm(), categories)
      : createEmptyProductForm(),
  );

  const [touched, setTouched] = useState<TouchedFields>(emptyTouched);

  const resetCreateForm = useCallback(() => {
    setFormData(
      categories?.length
        ? ensureDefaultsFromCatalog(createEmptyProductForm(), categories)
        : createEmptyProductForm(),
    );
    setTouched(emptyTouched);
  }, [categories]);

  const resetEditForm = useCallback(
    (initialValues?: Partial<ProductFormValues> | null) => {
      if (!categories?.length || !initialValues) return;

      setFormData((prev) =>
        mergeInitialValues(prev, initialValues, categories),
      );
      setTouched(emptyTouched);
    },
    [categories],
  );

  const handleBlur = useCallback((field: keyof ProductFormValues) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const handleChange = useCallback(
    <K extends keyof ProductFormValues>(
      field: K,
      value: ProductFormValues[K],
    ) => {
      setFormData((prev) => {
        if (field === "category_id") {
          const catId = value as number;
          const firstSubId = getFirstSubcategoryIdByCategory(categories, catId);

          return {
            ...prev,
            category_id: catId,
            subcategory_id: firstSubId,
          };
        }

        return { ...prev, [field]: value };
      });
    },
    [categories],
  );

  const touchAll = useCallback(() => {
    setTouched({
      name: true,
      description: true,
      compound: true,
      method_of_application: true,
      image_url: true,
      price: true,
      discount_percent: true,
      category_id: true,
      subcategory_id: true,
    });
  }, []);

  return {
    formData,
    touched,
    handleBlur,
    handleChange,
    touchAll,
    resetCreateForm,
    resetEditForm,
  };
};
