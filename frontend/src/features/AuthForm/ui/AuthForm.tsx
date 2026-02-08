import { useBreakpoint } from "@shared/lib/hooks/useBreakpoint";
import { Button } from "@shared/ui/Button/Button";
import { Input } from "@shared/ui/Input/Input";
import styles from "./AuthForm.module.scss";

export const AuthForm = () => {
  const { isLaptop, isMobile, isTablet } = useBreakpoint();

  const buttonSize = isLaptop || isTablet || isMobile ? "md" : "lg";
  return (
    <form className={styles.form} aria-label="Форма авторизации">
      <Input
        placeholder="E-mail"
        type="email" 
        id="email-input"
        aria-label="Email адрес"
      />
      <Input
        type="password"
        placeholder="Пароль"
        id="password-input"
        aria-label="Пароль"
      />
      <Button size={buttonSize} type="submit">
        Войти
      </Button>
    </form>
  );
};
