import type { Category } from "@shared/api/catalog/catalog";
import type { ProductFormValues } from "../types";

export const getDefaultCategoryId = (categories?: Category[]) =>
  categories?.[0]?.id ?? 0;

export const getDefaultSubcategoryId = (categories?: Category[]) =>
  categories?.[0]?.subcategories?.[0]?.id ?? 0;

export const createEmptyProductForm = (): ProductFormValues => ({
  name: "",
  description: "",
  compound: "",
  method_of_application: "",
  image_url: "",
  price: "",
  discount_percent: "",
  category_id: 0,
  subcategory_id: 0,
});

export const mergeInitialValues = (
  prev: ProductFormValues,
  initialValues?: Partial<ProductFormValues> | null,
  categories?: Category[],
): ProductFormValues => {
  const fallbackCategoryId = getDefaultCategoryId(categories);
  const fallbackSubId = getDefaultSubcategoryId(categories);

  return {
    ...prev,
    name: initialValues?.name ?? prev.name ?? "",
    description: initialValues?.description ?? prev.description ?? "",
    compound: initialValues?.compound ?? prev.compound ?? "",
    method_of_application:
      initialValues?.method_of_application ?? prev.method_of_application ?? "",
    image_url: initialValues?.image_url ?? prev.image_url ?? "",
    price: initialValues?.price ?? prev.price ?? "",
    category_id:
      initialValues?.category_id ?? prev.category_id ?? fallbackCategoryId,
    subcategory_id:
      initialValues?.subcategory_id ?? prev.subcategory_id ?? fallbackSubId,
  };
};

export const ensureDefaultsFromCatalog = (
  prev: ProductFormValues,
  categories?: Category[],
): ProductFormValues => {
  if (!categories?.length) return prev;

  const firstCat = categories[0];
  const firstSub = firstCat.subcategories?.[0];

  return {
    ...prev,
    category_id: prev.category_id || firstCat.id,
    subcategory_id: prev.subcategory_id || (firstSub?.id ?? 0),
  };
};

export const getFirstSubcategoryIdByCategory = (
  categories: Category[] | undefined,
  categoryId: number,
) => categories?.find((c) => c.id === categoryId)?.subcategories?.[0]?.id ?? 0;
