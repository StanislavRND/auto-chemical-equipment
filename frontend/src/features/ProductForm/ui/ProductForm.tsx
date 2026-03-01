import { FilepInput } from "@shared/ui/FormComponents/FileInput/FileInput";
import { Input } from "@shared/ui/FormComponents/Input/Input";
import { Select } from "@shared/ui/FormComponents/Select/Select";
import { Textarea } from "@shared/ui/FormComponents/Textarea/Textarea";
import type { ProductFormValues } from "../types";
import styles from "./ProductForm.module.scss";

type ProductFormProps = {
  formData: ProductFormValues;
  touched: Record<string, boolean>;
  formError: Record<string, string>;
  apiErrorMessage: string | null;
  categoryOptions: { value: number; label: string }[];
  subcategoryOptions: { value: number; label: string }[];
  handleBlur: (field: keyof ProductFormValues) => void;
  handleChange: <K extends keyof ProductFormValues>(
    field: K,
    value: ProductFormValues[K],
  ) => void;
  uploadImage: (file: File) => Promise<string>;
  isUploading: boolean;
};

export const ProductForm = ({
  formData,
  touched,
  formError,
  categoryOptions,
  subcategoryOptions,
  handleBlur,
  handleChange,
  uploadImage,
  isUploading,
  apiErrorMessage,
}: ProductFormProps) => {
  return (
    <form className={styles.form}>
      <Input
        placeholder="Название товара"
        type="text"
        value={formData.name}
        onChange={(value) => handleChange("name", value)}
        onBlur={() => handleBlur("name")}
        aria-label="Email адрес"
      />

      {touched.name && formError.nameError && (
        <div className={styles.error}>{formError.nameError}</div>
      )}

      <FilepInput
        placeholder="Фото товара (.webp)"
        value={formData.image_url}
        uploadFile={uploadImage}
        disabled={isUploading}
        isUploading={isUploading}
        onChange={(url) => handleChange("image_url", url ?? "")}
      />

      {touched.image_url && formError.imgError && (
        <div className={styles.error}>{formError.imgError}</div>
      )}

      <Textarea
        placeholder="Описание товара"
        value={formData.description}
        onChange={(value) => handleChange("description", value)}
        onBlur={() => handleBlur("description")}
      />

      {touched.description && formError.descError && (
        <div className={styles.error}>{formError.descError}</div>
      )}

      <Textarea
        placeholder="Состав товара"
        value={formData.compound}
        onChange={(value) => handleChange("compound", value)}
        onBlur={() => handleBlur("compound")}
      />
      {touched.compound && formError.compoundError && (
        <div className={styles.error}>{formError.compoundError}</div>
      )}

      <Textarea
        placeholder="Способ применение товара "
        value={formData.method_of_application}
        onChange={(value) => handleChange("method_of_application", value)}
        onBlur={() => handleBlur("method_of_application")}
      />

      {touched.method_of_application && formError.methodError && (
        <div className={styles.error}>{formError.methodError}</div>
      )}

      <Input
        placeholder="Цена товара"
        type="text"
        value={formData.price}
        onChange={(value) => handleChange("price", value)}
        onBlur={() => handleBlur("price")}
        aria-label="Цена товара"
      />

      {touched.price && formError.priceError && (
        <div className={styles.error}>{formError.priceError}</div>
      )}

      <Select
        placeholder="Категория"
        options={categoryOptions}
        value={formData.category_id}
        onChange={(v) => handleChange("category_id", v)}
        drop="up"
      />

      {touched.category_id && formError.categoryError && (
        <div className={styles.error}>{formError.categoryError}</div>
      )}

      {subcategoryOptions.length > 0 && (
        <Select
          placeholder="Подкатегория"
          options={subcategoryOptions}
          value={formData.subcategory_id ?? 0}
          onChange={(v) => handleChange("subcategory_id", v)}
          drop="up"
        />
      )}

      {subcategoryOptions.length > 0 &&
        touched.subcategory_id &&
        formError.subcategoryError && (
          <div className={styles.error}>{formError.subcategoryError}</div>
        )}

      {apiErrorMessage && (
        <div className={styles.errorGn}>{apiErrorMessage}</div>
      )}
    </form>
  );
};
