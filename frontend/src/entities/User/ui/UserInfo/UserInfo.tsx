import { useGetCurrentUser, useLogout } from "@entities/User/api/user";
import {
  LEGAL_FIELDS,
  PERSON_FIELDS,
  type UserField,
} from "@entities/User/lib/data";
import { useChangePasswordForm } from "@features/ChangePasswordForm/model/useChangePasswordForm";
import { ChangePasswordForm } from "@features/ChangePasswordForm/ui/ChangePasswordForm";
import {
  Breadcrumbs,
  type BreadcrumbItem,
} from "@shared/ui/BreadCrumb/BreadCrumb";
import { Button } from "@shared/ui/Button/Button";
import { ErrorMessage } from "@shared/ui/ErrorMessage/ErrorMessage";
import { Input } from "@shared/ui/FormComponents/Input/Input";
import { Loader } from "@shared/ui/Loader/Loader";
import { Modal } from "@shared/ui/Modal/Modal";
import { UserActions } from "@shared/ui/UserActions/UserActions";
import { BriefcaseBusiness } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import styles from "./UserInfo.module.scss";

export const UserInfo = () => {
  const { data: user, isLoading, error } = useGetCurrentUser();
  const { logout, isLoading: isLoadingLogout } = useLogout();
  const [isOpen, setIsOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const { isLoading: isPasswordChanging } = useChangePasswordForm();

  const handleFormSubmit = () => {
    formRef.current?.requestSubmit();
  };

  const breadcrumbs = useMemo<BreadcrumbItem[]>(() => {
    return [{ label: "Главная", to: "/home" }, { label: "Данные профиля" }];
  }, []);

  const fields = user?.user_type === "legal" ? LEGAL_FIELDS : PERSON_FIELDS;

  if (isLoading)
    return (
      <section className={styles.wrapper}>
        <div className={styles.container}>
          <Loader size={48} text="Загрузка данных..." />
        </div>
      </section>
    );
  if (error)
    return (
      <section className={styles.wrapper}>
        <div className={styles.container}>
          <ErrorMessage message="Ошибка загрузки данных о пользователе." />
        </div>
      </section>
    );

  if (!user) return;

  return (
    <>
      {" "}
      <section className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.breadcrumbs}>
            <Breadcrumbs items={breadcrumbs} />
          </div>

          {user.role !== "admin" && <UserActions />}

          <div className={styles.userInfo}>
            <div className={styles.leftBlock}>
              <div className={styles.avatar}>
                <BriefcaseBusiness
                  className={styles.icon}
                  color="var(--blue-500)"
                  size={92}
                />
              </div>
              <h3 className={styles.name}>
                {user.user_type === "legal"
                  ? user.legal_name || "Название не указано"
                  : user.full_name || "ФИО не указано"}
              </h3>
            </div>
            <div className={styles.rightBlock}>
              <div className={styles.inputs}>
                {fields.map(({ placeholder, key }: UserField) => (
                  <Input
                    key={key}
                    className={styles.input}
                    disabled={true}
                    placeholder={placeholder}
                    value={user[key as keyof typeof user]?.toString() || ""}
                    floatingColor="var(--text-secondary)"
                  />
                ))}
              </div>
              <div className={styles.btnWrapper}>
                <Button
                  onClick={handleOpenModal}
                  className={`${styles.btn} ${styles.btnPass}`}
                  variant="outline"
                >
                  Сменить пароль
                </Button>
                <Button
                  disabled={isLoadingLogout}
                  loading={isLoadingLogout}
                  onClick={logout}
                  className={styles.btn}
                >
                  Выйти
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {isOpen && (
        <Modal
          title="пароля"
          isEdit={true}
          buttonText={"Изменить"}
          onClose={handleCloseModal}
          isOpen={isOpen}
          onSubmit={handleFormSubmit}
          loading={isPasswordChanging}
        >
          <ChangePasswordForm ref={formRef} />
        </Modal>
      )}
    </>
  );
};
