import type { CatalogFormValues } from "../types";

export type CatalogFormErrors = {
  nameError: string;
  imgError: string;
  subcategoriesErrors?: string[];
};

const REQUIRED = "Обязательное поле";

export const validateCatalogForm = (
  formData: CatalogFormValues,
): CatalogFormErrors => {
  const nameError = !formData.name.trim() ? REQUIRED : "";
  const imgError = !formData.image_url.trim() ? REQUIRED : "";

  const subcategoriesErrors = formData.subcategories.map((sub) =>
    !sub.name.trim() ? REQUIRED : "",
  );

  return {
    nameError,
    imgError,
    subcategoriesErrors,
  };
};

export const isCatalogFormValid = (
  errors: CatalogFormErrors,
  formData: CatalogFormValues,
) => {
  const hasFieldErrors = Object.values(errors).some((val) =>
    Array.isArray(val) ? val.some(Boolean) : Boolean(val),
  );

  return !hasFieldErrors && formData.image_url.trim().length > 0;
};
