import type { ProductFormValues } from "../types";

export type ProductFormErrors = {
  nameError: string;
  descError: string;
  imgError: string;
  compoundError: string;
  methodError: string;
  priceError: string;
  categoryError: string;
  discountPercentError: string;
  subcategoryError: string;
};

const REQUIRED = "Обязательное поле";

const MIN_LEN = 30;
const MIN_LEN_MSG = `Минимум ${MIN_LEN} символов`;

export const validateProductForm = (
  formData: ProductFormValues,
  hasSubcategories: boolean,
): ProductFormErrors => {
  const nameError = !formData.name.trim() ? REQUIRED : "";
  const imgError = !formData.image_url.trim() ? REQUIRED : "";

  const descError = !formData.description.trim()
    ? REQUIRED
    : formData.description.trim().length < MIN_LEN
      ? MIN_LEN_MSG
      : "";

  const compoundError = !formData.compound.trim()
    ? REQUIRED
    : formData.compound.trim().length < MIN_LEN
      ? MIN_LEN_MSG
      : "";

  const methodError = !formData.method_of_application.trim()
    ? REQUIRED
    : formData.method_of_application.trim().length < MIN_LEN
      ? MIN_LEN_MSG
      : "";

  const rawPrice = formData.price.trim();
  const priceNumber = Number(rawPrice.replace(",", "."));

  const priceError = !rawPrice
    ? REQUIRED
    : Number.isNaN(priceNumber)
      ? "Введите число"
      : priceNumber <= 0
        ? "Только положительные числа"
        : "";
  const discountPercentError = !rawPrice
    ? REQUIRED
    : Number.isNaN(priceNumber)
      ? "Введите число"
      : priceNumber <= 0
        ? "Только положительные числа"
        : "";

  const categoryError = !formData.category_id ? REQUIRED : "";
  const subcategoryError =
    hasSubcategories && !formData.subcategory_id ? REQUIRED : "";

  return {
    nameError,
    descError,
    discountPercentError,
    imgError,
    compoundError,
    methodError,
    priceError,
    categoryError,
    subcategoryError,
  };
};

export const isProductFormValid = (
  errors: ProductFormErrors,
  formData: ProductFormValues,
  hasSubcategories: boolean,
) => {
  const hasErrors = Object.values(errors).some(Boolean);
  if (hasErrors) return false;

  if (!formData.image_url.trim()) return false;
  if (!formData.category_id) return false;
  if (hasSubcategories && !formData.subcategory_id) return false;

  return true;
};
