import { useAuth } from "@entities/User/model/useAuth";
import { useUploadProductImage } from "@features/ProductForm/api/useImageUpload";
import { useBreakpoint } from "@shared/lib/hooks/useBreakpoint";
import { Button } from "@shared/ui/Button/Button";
import { ProductForm } from "@features/ProductForm/ui/ProductForm";
import { Modal } from "@shared/ui/Modal/Modal";
import { PopularityCategory } from "@widgets/PopularityCategory/ui/PopularityCategory";
import { PlusIcon } from "lucide-react";
import { lazy, Suspense, useMemo } from "react";
import { useHomeActions } from "../model/useHomeActions";
import styles from "./HomePage.module.scss";

const ProductItems = lazy(
  () => import("@widgets/ProductItems/ui/ProductItems"),
);

const HomePage = () => {
  const { role } = useAuth();
  const { isLaptop, isMobile, isTablet } = useBreakpoint();

  const { isOpen, mode, handleCloseModal, openCreate, openEdit, productForm } =
    useHomeActions();

  const { mutateAsync: uploadImage, isPending: isUploading } =
    useUploadProductImage();

  const buttonSize = useMemo(() => {
    if (isMobile) return "sm";
    if (isTablet || isLaptop) return "md";
    return "lg";
  }, [isMobile, isTablet, isLaptop]);

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


      <Suspense fallback={<div>Загрузка товаров...</div>}>
        <ProductItems onEdit={openEdit} />
      </Suspense>


      {isOpen && (
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
      )}
    </>
  );
};

export default HomePage;
