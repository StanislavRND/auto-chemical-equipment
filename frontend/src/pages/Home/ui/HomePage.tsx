import { useAuth } from "@entities/User/model/useAuth";
import { useUploadProductImage } from "@features/ProductForm/api/useImageUpload";
import { ProductForm } from "@features/ProductForm/ui/ProductForm";
import { useBreakpoint } from "@shared/lib/hooks/useBreakpoint";
import { Button } from "@shared/ui/Button/Button";
import { Modal } from "@shared/ui/Modal/Modal";
import { PopularityCategory } from "@widgets/PopularityCategory/ui/PopularityCategory";
import { ProductItems } from "@widgets/ProductItems/ui/ProductItems";
import { PlusIcon } from "lucide-react";
import { useHomeActions } from "../model/useHomeActions";
import styles from "./HomePage.module.scss";

export const HomePage = () => {
  const { role } = useAuth();
  const { isLaptop, isMobile, isTablet } = useBreakpoint();
  const { isOpen, mode, handleCloseModal, openCreate, openEdit, productForm } =
    useHomeActions();

  const { mutateAsync: uploadImage, isPending: isUploading } =
    useUploadProductImage();

  const buttonSize = isMobile ? "sm" : isTablet || isLaptop ? "md" : "lg";
  return (
    <>
      {role !== "admin" && <PopularityCategory />}
      {role === "admin" && (
        <div className={styles.wrapperBtn}>
          <Button
            onClick={openCreate}
            size={buttonSize}
            className={styles.btn}
            variant="outline"
          >
            <PlusIcon className={styles.plus} />
            Добавить товар
          </Button>
        </div>
      )}

      <ProductItems onEdit={openEdit} />

      <Modal
        title="товара"
        isEdit={mode === "edit"}
        buttonText={mode === "edit" ? "Изменить" : "Создать"}
        onClose={handleCloseModal}
        isOpen={isOpen}
        onSubmit={productForm.handleSubmit}
        loading={productForm.isPending || isUploading}
      >
        <ProductForm
          formData={productForm.formData}
          touched={productForm.touched}
          formError={productForm.formError}
          categoryOptions={productForm.categoryOptions}
          subcategoryOptions={productForm.subcategoryOptions}
          handleBlur={productForm.handleBlur}
          handleChange={productForm.handleChange}
          uploadImage={uploadImage}
          isUploading={isUploading}
          apiErrorMessage={productForm.apiErrorMessage}
        />
      </Modal>
    </>
  );
};
