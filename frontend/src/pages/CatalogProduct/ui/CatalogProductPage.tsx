import { useProductModal } from "@app/providers/ProductModalContext";
import { useUploadProductImage } from "@features/ProductForm/api/useImageUpload";
import { ProductForm } from "@features/ProductForm/ui/ProductForm";
import { Modal } from "@shared/ui/Modal/Modal";
import { ProductItems } from "@widgets/ProductItems/ui/ProductItems";

const CatalogProductPage = () => {
  const { mode, openEdit, isOpen, productForm, handleCloseModal } =
    useProductModal();
  const { mutateAsync: uploadImage, isPending: isUploading } =
    useUploadProductImage();

  return (
    <div>
      <ProductItems onEdit={openEdit} isCatalog={true} />

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
          {...productForm}
          uploadImage={uploadImage}
          isUploading={isUploading}
        />
      </Modal>
    </div>
  );
};

export default CatalogProductPage;
