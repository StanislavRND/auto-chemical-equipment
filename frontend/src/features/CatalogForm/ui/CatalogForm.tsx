import { Button } from "@shared/ui/Button/Button";
import { FilepInput } from "@shared/ui/FormComponents/FileInput/FileInput";
import { Input } from "@shared/ui/FormComponents/Input/Input";
import { PlusIcon, Trash } from "lucide-react";
import { ConfirmModal } from "@shared/ui/ConfirmModal/ConfirmModal";
import type { CatalogFormValues } from "../types";
import styles from "./CatalogForm.module.scss";

type CatalogFormProps = {
  formData: CatalogFormValues;
  touched: Record<string, boolean>;
  formError: Record<string, string | string[]>;
  apiErrorMessage: string | null;
  handleBlur: (field: keyof CatalogFormValues) => void;
  handleChange: (field: "name" | "image_url", value: string) => void;
  handleSubcategoryChange: (index: number, value: string) => void;
  addSubcategory: () => void;
  confirmOpen: boolean;
  handleRemoveClick: (index: number) => void;
  handleConfirmDelete: () => void;
  handleCancelDelete: () => void;
  uploadImage: (file: File) => Promise<string>;
  isUploading: boolean;
};

export const CatalogForm = ({
  formData,
  touched,
  formError,
  handleBlur,
  handleChange,
  handleSubcategoryChange,
  addSubcategory,

  confirmOpen,
  handleRemoveClick,
  handleConfirmDelete,
  handleCancelDelete,
  uploadImage,
  isUploading,
  apiErrorMessage,
}: CatalogFormProps) => {
  return (
    <>
      <form className={styles.form}>
        <Input
          placeholder="Название категории"
          type="text"
          value={formData.name}
          onChange={(value) => handleChange("name", value)}
          onBlur={() => handleBlur("name")}
          aria-label="name"
        />
        {touched.name && formError.nameError && (
          <div className={styles.error}>{formError.nameError}</div>
        )}

        <FilepInput
          placeholder="Фото категории (.webp)"
          value={formData.image_url}
          uploadFile={uploadImage}
          disabled={isUploading}
          isUploading={isUploading}
          onChange={(url) => handleChange("image_url", url ?? "")}
        />
        {touched.image_url && formError.imgError && (
          <div className={styles.error}>{formError.imgError}</div>
        )}

        <div className={styles.btnWrapper}>
          <Button
            className={styles.addSub}
            type="button"
            size="sm"
            onClick={addSubcategory}
          >
            <PlusIcon size={18} />
            Добавить подкатегорию
          </Button>
        </div>

        {formData.subcategories.map((sub, index) => (
          <div key={index} className={styles.subcategoryRow}>
            <div className={styles.inputRow}>
              <Input
                placeholder={`Подкатегория #${index + 1}`}
                type="text"
                value={sub.name}
                onChange={(value) => handleSubcategoryChange(index, value)}
              />
              <Button
                size="sm"
                className={styles.deleteBtn}
                type="button"
                onClick={() => handleRemoveClick(index)}
              >
                <Trash size={18} />
              </Button>
            </div>
            {formError.subcategoriesErrors?.[index] && (
              <div className={styles.error}>
                {formError.subcategoriesErrors[index]}
              </div>
            )}
          </div>
        ))}

        {apiErrorMessage && (
          <div className={styles.errorGn}>{apiErrorMessage}</div>
        )}
      </form>

      <ConfirmModal
        isOpen={confirmOpen}
        message="Вы удаляете эту подкатегорию. Все товары в ней будут удалены при сохранении. Продолжить?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
};