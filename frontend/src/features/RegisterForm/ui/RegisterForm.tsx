import { useBreakpoint } from "@shared/lib/hooks/useBreakpoint";
import { Button } from "@shared/ui/Button/Button";
import { Input } from "@shared/ui/Input/Input";
import { useEffect } from "react";
import { useRegisterForm } from "../model/useRegisterForm";
import styles from "./RegisterForm.module.scss";

interface RegisterFormProps {
  onSuccess?: () => void;
}

export const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const { isLaptop, isMobile, isTablet } = useBreakpoint();
  const buttonSize = isLaptop || isTablet || isMobile ? "md" : "lg";

  const {
    formData,
    touched,
    innError,
    kppError,
    legalAddressError,
    emailError,
    passwordError,
    confirmPasswordError,
    isPending,
    isSuccess,
    apiErrorMessage,
    handleBlur,
    handleChange,
    handleSubmit,
  } = useRegisterForm();

  useEffect(() => {
    if (isSuccess && onSuccess) {
      onSuccess();
    }
  }, [isSuccess, onSuccess]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(e);
  };
  return (
    <form onSubmit={handleFormSubmit} className={styles.form}>
      <Input
        placeholder="ИНН"
        id="register-inn"
        aria-label="ИНН"
        type="text"
        value={formData.inn}
        onChange={(value) => handleChange("inn", value)}
        onBlur={() => handleBlur("inn")}
      />
      {touched.inn && innError && (
        <div className={styles.error}>{innError}</div>
      )}

      <Input
        placeholder="КПП"
        id="register-kpp"
        aria-label="КПП"
        type="text"
        value={formData.kpp}
        onChange={(value) => handleChange("kpp", value)}
        onBlur={() => handleBlur("kpp")}
      />
      {touched.kpp && kppError && (
        <div className={styles.error}>{kppError}</div>
      )}

      <Input
        placeholder="Юридическое наименование"
        id="register-address"
        aria-label="Юридическое наименование"
        type="text"
        value={formData.legal_address}
        onChange={(value) => handleChange("legal_address", value)}
        onBlur={() => handleBlur("legal_address")}
      />
      {touched.legal_address && legalAddressError && (
        <div className={styles.error}>{legalAddressError}</div>
      )}

      <Input
        placeholder="E-mail"
        id="register-email"
        aria-label="E-mail"
        type="text"
        value={formData.email}
        onChange={(value) => handleChange("email", value)}
        onBlur={() => handleBlur("email")}
      />

      {touched.email && emailError && (
        <div className={styles.error}>{emailError}</div>
      )}

      <Input
        type="password"
        placeholder="Пароль"
        id="register-password"
        aria-label="Пароль"
        value={formData.password}
        onChange={(value) => handleChange("password", value)}
        onBlur={() => handleBlur("password")}
      />

      {touched.password && passwordError && (
        <div className={styles.error}>{passwordError}</div>
      )}

      <Input
        type="password"
        placeholder="Подтвердить пароль"
        id="register-confirm-password"
        aria-label="Подтвердить пароль"
        value={formData.password_confirm}
        onChange={(value) => handleChange("password_confirm", value)}
        onBlur={() => handleBlur("password_confirm")}
      />

      {touched.password_confirm && confirmPasswordError && (
        <div className={styles.error}>{confirmPasswordError}</div>
      )}

      {apiErrorMessage &&
        !emailError &&
        !passwordError &&
        !innError &&
        !kppError &&
        !legalAddressError &&
        !confirmPasswordError && (
          <div className={styles.errorGn}>{apiErrorMessage}</div>
        )}

      <Button
        disabled={isPending}
        loading={isPending}
        type="submit"
        size={buttonSize}
      >
        Зарегистрироваться
      </Button>
    </form>
  );
};
