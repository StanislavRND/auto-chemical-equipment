import { Input } from "@shared/ui/FormComponents/Input/Input";
import { forwardRef } from "react";
import { useChangePasswordForm } from "../model/useChangePasswordForm";
import styles from "./ChangePasswordForm.module.scss";

export const ChangePasswordForm = forwardRef<HTMLFormElement>((_, ref) => {
  const {
    formData,
    touched,
    newPasswordError,
    confirmPasswordError,
    apiErrorMessage,
    handleBlur,
    handleChange,
    handleSubmit,
  } = useChangePasswordForm();

  return (
    <form ref={ref} className={styles.form} onSubmit={handleSubmit}>
      <Input
        placeholder="Старый пароль"
        type="password"
        value={formData.old_password}
        onChange={(value) => handleChange("old_password", value)}
        onBlur={() => handleBlur("old_password")}
        aria-label="Старый пароль"
      />

      <Input
        type="password"
        placeholder="Новый пароль"
        value={formData.new_password}
        onChange={(value) => handleChange("new_password", value)}
        onBlur={() => handleBlur("new_password")}
        aria-label="Новый пароль"
      />
      {touched.new_password && newPasswordError && (
        <div className={styles.error}>{newPasswordError}</div>
      )}

      <Input
        type="password"
        placeholder="Подтверждение пароля"
        value={formData.confirm_password}
        onChange={(value) => handleChange("confirm_password", value)}
        onBlur={() => handleBlur("confirm_password")}
        aria-label="Подтверждение пароля"
      />
      {touched.confirm_password && confirmPasswordError && (
        <div className={styles.error}>{confirmPasswordError}</div>
      )}

      {apiErrorMessage && !newPasswordError && !confirmPasswordError && (
        <div className={styles.errorGn}>{apiErrorMessage}</div>
      )}
    </form>
  );
});

ChangePasswordForm.displayName = "ChangePasswordForm";
