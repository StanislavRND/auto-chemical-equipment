import type { Category } from "@shared/api/catalog/catalog";
import { useCallback, useEffect, useState } from "react";
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
  mode: "create" | "edit";
  categories?: Category[];
  initialValues?: Partial<ProductFormValues> | null;
};

export const useProductFormState = ({
  mode,
  categories,
  initialValues,
}: Args) => {
  const [formData, setFormData] = useState<ProductFormValues>(
    createEmptyProductForm,
  );
  const [touched, setTouched] = useState<TouchedFields>(emptyTouched);

  useEffect(() => {
    if (!categories?.length) return;
    const handleChandeFormData = () => {
      setFormData((prev) => ensureDefaultsFromCatalog(prev, categories));
    };
    handleChandeFormData();
  }, [categories]);

  useEffect(() => {
    if (mode !== "edit") return;
    if (!categories?.length) return;
    if (!initialValues) return;

    const handleChangeFormData = () => {
      setFormData((prev) =>
        mergeInitialValues(prev, initialValues, categories),
      );
      setTouched(emptyTouched);
    };
    handleChangeFormData()
  }, [mode, initialValues, categories]);

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
      category_id: true,
      subcategory_id: true,
    });
  }, []);

  return {
    formData,
    setFormData,
    touched,
    setTouched,
    handleBlur,
    handleChange,
    touchAll,
  };
};
