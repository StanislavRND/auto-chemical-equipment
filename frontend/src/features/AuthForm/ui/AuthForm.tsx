import { useBreakpoint } from "@shared/lib/hooks/useBreakpoint";
import { Button } from "@shared/ui/Button/Button";
import { Input } from "@shared/ui/Input/Input";
import styles from "./AuthForm.module.scss";

export const AuthForm = () => {
  const { isLaptop, isMobile, isTablet } = useBreakpoint();

  const buttonSize = isLaptop || isTablet || isMobile ? "md" : "lg";
  return (
    <form className={styles.form}>
      <Input placeholder="E-mail" />
      <Input type="password" placeholder="Пароль" />
      <Button size={buttonSize}>Войти</Button>
    </form>
  );
};
