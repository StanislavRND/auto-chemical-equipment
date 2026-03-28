import { useProductModal } from "@app/providers/ProductModalContext";
import { useUploadProductImage } from "@features/ProductForm/api/useImageUpload";
import { ProductForm } from "@features/ProductForm/ui/ProductForm";
import { ProductListSearch } from "@features/SearchProducts/ui/ProductListSearch";
import { Modal } from "@shared/ui/Modal/Modal";
import { useSearchParams } from "react-router-dom";

const SearchPage = () => {
  const { mode, openEdit, isOpen, productForm, handleCloseModal } =
    useProductModal();
  const { mutateAsync: uploadImage, isPending: isUploading } =
    useUploadProductImage();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";

  return (
    <>
      <ProductListSearch onEdit={openEdit} query={query} />{" "}
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
      ;
    </>
  );
};

export default SearchPage;
