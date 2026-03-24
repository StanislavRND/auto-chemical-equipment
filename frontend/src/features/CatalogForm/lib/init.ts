import type { CatalogFormValues } from "../types";

export const createEmptyCatalogForm = (): CatalogFormValues => ({
  name: "",
  image_url: "",
  subcategories: [], 
});

export const mergeInitialValues = (
  prev: CatalogFormValues,
  initialValues?: Partial<CatalogFormValues> | null,
): CatalogFormValues => {
  return {
    ...prev,
    name: initialValues?.name ?? prev.name ?? "",
    image_url: initialValues?.image_url ?? prev.image_url ?? "",
    subcategories: initialValues?.subcategories ?? prev.subcategories ?? [],
  };
};