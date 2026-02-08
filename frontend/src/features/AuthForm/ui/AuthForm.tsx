import { useBreakpoint } from "@shared/lib/hooks/useBreakpoint";
import { Button } from "@shared/ui/Button/Button";
import { Input } from "@shared/ui/Input/Input";
import { useAuthForm } from "../model/useAuthForm";
import styles from "./AuthForm.module.scss";

export const AuthForm = () => {
  const { isLaptop, isMobile, isTablet } = useBreakpoint();
  const {
    formData,
    touched,
    emailError,
    passwordError,
    isPending,
    apiErrorMessage,
    handleBlur,
    handleChange,
    handleSubmit,
  } = useAuthForm();

  const buttonSize = isLaptop || isMobile || isTablet ? "md" : "lg";

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Input
        placeholder="E-mail"
        type="email"
        value={formData.email}
        onChange={(value) => handleChange("email", value)}
        onBlur={() => handleBlur("email")}
        aria-label="Email адрес"
      />
      {touched.email && emailError && (
        <div className={styles.error}>{emailError}</div>
      )}

      <Input
        type="password"
        placeholder="Пароль"
        value={formData.password}
        onChange={(value) => handleChange("password", value)}
        onBlur={() => handleBlur("password")}
        aria-label="Пароль"
      />
      {touched.password && passwordError && (
        <div className={styles.error}>{passwordError}</div>
      )}

      {apiErrorMessage && !emailError && !passwordError && (
        <div className={styles.errorGn}>{apiErrorMessage}</div>
      )}

      <Button
        disabled={isPending}
        loading={isPending}
        size={buttonSize}
        type="submit"
      >
        Войти
      </Button>
    </form>
  );
};
