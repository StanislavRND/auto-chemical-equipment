import {
  useDeleteCatalog,
  useDeleteSubCatalog,
} from "@features/CatalogForm/api/useCatalog";
import { useUploadCatalogImage } from "@features/CatalogForm/api/useImageCatalogUpload";
import { CatalogForm } from "@features/CatalogForm/ui/CatalogForm";
import { useGetCatalog } from "@shared/api/catalog/catalog";
import { useBreakpoint } from "@shared/lib/hooks/useBreakpoint";
import { Button } from "@shared/ui/Button/Button";
import { ConfirmModal } from "@shared/ui/ConfirmModal/ConfirmModal";
import { ErrorMessage } from "@shared/ui/ErrorMessage/ErrorMessage";
import { Loader } from "@shared/ui/Loader/Loader";
import { Modal } from "@shared/ui/Modal/Modal";
import { ChevronDown, Pencil, PlusIcon, Trash } from "lucide-react";
import { useState } from "react";
import { useAdminCatalogActions } from "../model/useAdminCatalogACtions";
import styles from "./AdminCatalogPage.module.scss";

const AdminCatalogPage = () => {
  const { isLaptop, isMobile, isTablet } = useBreakpoint();
  const { data: categories, isLoading, isError } = useGetCatalog();
  const { mutate: deleteSubCatalog } = useDeleteSubCatalog();
  const {
    mutate: deleteCatalog,
    isError: isErrorDeleteCatalog,
    error,
  } = useDeleteCatalog();
  const {
    isOpen,
    openIds,
    mode,
    toggle,
    handleCloseModal,
    openCreate,
    openEdit,
    catalogForm,
  } = useAdminCatalogActions();
  const { mutateAsync: uploadImage, isPending: isUploading } =
    useUploadCatalogImage();

  const [confirmData, setConfirmData] = useState<{
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, message: "", onConfirm: () => {} });

  const handleDeleteCatalog = (id: number) => {
    setConfirmData({
      isOpen: true,
      message:
        "Вы действительно хотите удалить этот каталог? Все товары, которые есть в этом каталоге удалятся без возможности восстановления!",
      onConfirm: () => {
        deleteCatalog(id);
        setConfirmData((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleDeleteSubCatalog = (id: number) => {
    setConfirmData({
      isOpen: true,
      message:
        "Вы действительно хотите удалить этот каталог? Все товары, которые есть в этом подкаталоге удалятся без возможности восстановления!",
      onConfirm: () => {
        deleteSubCatalog(id);
        setConfirmData((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const buttonSize = isMobile ? "sm" : isTablet || isLaptop ? "md" : "lg";

  if (isLoading)
    return (
      <section className={styles.catalog}>
        <div className={styles.container}>
          <Loader size={32} text="Загрузка категорий..." />
        </div>
      </section>
    );
  if (isError)
    return (
      <section className={styles.catalog}>
        <div className={styles.container}>
          <ErrorMessage message="Ошибка загрузки категорий" />
        </div>
      </section>
    );

  return (
    <>
      <section className={styles.catalog}>
        <div className={styles.container}>
          <div className={styles.btnWrapper}>
            <Button
              onClick={openCreate}
              size={buttonSize}
              className={styles.btn}
              variant="outline"
            >
              <PlusIcon className={styles.plus} />
              Добавить категорию
            </Button>
          </div>
          {isErrorDeleteCatalog && (
            <div className={styles.error}>
              <ErrorMessage message={error.message} />
            </div>
          )}
          <div className={styles.list}>
            {categories?.map((cat) => {
              const subcategories = cat.subcategories || [];
              const isOpen = !!openIds[cat.id];
              const hasChildren = subcategories.length > 0;

              return (
                <div key={cat.id} className={styles.card}>
                  <div
                    className={styles.cardHeader}
                    onClick={() => toggle(cat.id, hasChildren)}
                  >
                    <div className={styles.left}>
                      {hasChildren && (
                        <ChevronDown
                          className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ""}`}
                        />
                      )}
                      <span className={styles.catName}>{cat.name}</span>
                    </div>
                    <div className={styles.actions}>
                      <Button
                        size="sm"
                        className={`${styles.actionBtn} ${styles.editDelete}`}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEdit(cat);
                        }}
                      >
                        <Pencil className={styles.edit} size={15} />
                      </Button>
                      <Button
                        size="sm"
                        className={`${styles.actionBtn} ${styles.btnDelete}`}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCatalog(cat.id);
                        }}
                      >
                        <Trash className={styles.trash} size={16} />
                      </Button>
                    </div>
                  </div>

                  {isOpen && (
                    <div className={styles.subList}>
                      {subcategories.map((sub) => (
                        <div key={sub.id} className={styles.subItem}>
                          <span>{sub.name}</span>
                          <Button
                            size="sm"
                            className={`${styles.deleteBtn} ${styles.btnSub}`}
                            type="button"
                            onClick={() => handleDeleteSubCatalog(sub.id)}
                          >
                            <Trash className={styles.trashSub} size={16} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <ConfirmModal
        isOpen={confirmData.isOpen}
        message={confirmData.message}
        onConfirm={confirmData.onConfirm}
        onCancel={() => setConfirmData((prev) => ({ ...prev, isOpen: false }))}
      />

      <Modal
        title="каталога"
        isEdit={mode === "edit"}
        buttonText={mode === "edit" ? "Изменить" : "Создать"}
        onClose={handleCloseModal}
        isOpen={isOpen}
        onSubmit={catalogForm.handleSubmit}
        loading={catalogForm.isPending || isUploading}
      >
        <CatalogForm
          formData={catalogForm.formData}
          touched={catalogForm.touched}
          formError={catalogForm.formError}
          handleBlur={catalogForm.handleBlur}
          handleChange={catalogForm.handleChange}
          handleSubcategoryChange={catalogForm.handleSubcategoryChange}
          addSubcategory={catalogForm.addSubcategory}
          confirmOpen={catalogForm.confirmOpen}
          handleRemoveClick={catalogForm.handleRemoveClick}
          handleConfirmDelete={catalogForm.handleConfirmDelete}
          handleCancelDelete={catalogForm.handleCancelDelete}
          uploadImage={uploadImage}
          isUploading={isUploading}
          apiErrorMessage={catalogForm.apiErrorMessage}
        />
      </Modal>
    </>
  );
};

export default AdminCatalogPage;
