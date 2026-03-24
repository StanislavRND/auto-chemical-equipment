export interface SubcategoriesForm {
  id?: number;
  name: string;
}

export interface CatalogFormValues {
  name: string;
  image_url: string;
  subcategories: SubcategoriesForm[];
}

export type TouchedFields = { [K in keyof CatalogFormValues]: boolean };

export type Mode = "create" | "edit";

export type UseCatalogFormArgs = {
  mode: Mode;
  categoryId?: string;
  onSuccess?: () => void;
};

export const emptyTouched: TouchedFields = {
  name: false,
  image_url: false,
  subcategories: false,
};
