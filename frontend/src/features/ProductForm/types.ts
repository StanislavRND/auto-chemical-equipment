export interface ProductFormValues {
  name: string;
  description: string;
  compound: string;
  method_of_application: string;
  image_url: string;
  price: string;
  category_id: number;
  subcategory_id: number | null;
}

export type TouchedFields = { [K in keyof ProductFormValues]: boolean };

export type Mode = "create" | "edit";

export type UseProductFormArgs = {
  mode: Mode;
  productId?: string;
  initialValues?: Partial<ProductFormValues>;
  onSuccess?: () => void;
};

export const emptyTouched: TouchedFields = {
  name: false,
  description: false,
  compound: false,
  method_of_application: false,
  image_url: false,
  price: false,
  category_id: false,
  subcategory_id: false,
};
