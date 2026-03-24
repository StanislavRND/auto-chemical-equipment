import { useCallback, useState } from "react";
import { createEmptyCatalogForm, mergeInitialValues } from "../lib/init";
import {
  emptyTouched,
  type CatalogFormValues,
  type TouchedFields,
} from "../types";


export const useCatalogFormState = () => {
  const [formData, setFormData] = useState<CatalogFormValues>(() =>
    createEmptyCatalogForm(),
  );
  const [touched, setTouched] = useState<TouchedFields>(emptyTouched);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [subToDelete, setSubToDelete] = useState<number | null>(null);

  const handleBlur = useCallback((field: keyof CatalogFormValues) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const handleChange = useCallback(
    (field: "name" | "image_url", value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const handleSubcategoryChange = useCallback(
    (index: number, value: string) => {
      setFormData((prev) => {
        const newSubs = [...prev.subcategories];
        newSubs[index] = { ...newSubs[index], name: value };
        return { ...prev, subcategories: newSubs };
      });
    },
    [],
  );

 const addSubcategory = useCallback(() => {
  setFormData((prev) => ({
    ...prev,
    subcategories: [...prev.subcategories, { name: "",}],
  }));
}, []);

  const handleRemoveClick = (index: number) => {
    setSubToDelete(index);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (subToDelete !== null) {
      setFormData((prev) => ({
        ...prev,
        subcategories: prev.subcategories.filter((_, i) => i !== subToDelete),
      }));
    }
    setConfirmOpen(false);
    setSubToDelete(null);
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setSubToDelete(null);
  };

  const resetCreateForm = useCallback(() => {
    setFormData(createEmptyCatalogForm());
    setTouched(emptyTouched);
  }, []);

  const resetEditForm = useCallback(
    (initialValues?: Partial<CatalogFormValues> | null) => {
      if (!initialValues) return;
      setFormData((prev) => mergeInitialValues(prev, initialValues));
      setTouched(emptyTouched);
    },
    [],
  );

  const touchAll = useCallback(() => {
    setTouched({
      name: true,
      image_url: true,
      subcategories: true,
    });
  }, []);

  return {
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
  };
};
