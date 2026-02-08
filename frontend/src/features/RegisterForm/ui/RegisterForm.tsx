import { useBreakpoint } from "@shared/lib/hooks/useBreakpoint";
import { Button } from "@shared/ui/Button/Button";
import { Input } from "@shared/ui/Input/Input";
import styles from "./RegisterForm.module.scss";

interface RegisterFormProps {
  onSuccess?: () => void;
}

export const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const { isLaptop, isMobile, isTablet } = useBreakpoint();

  const buttonSize = isLaptop || isTablet || isMobile ? "md" : "lg";

  const handleSubmit = async () => {
    if (onSuccess) {
      onSuccess();
    }

    console.log("Успешно");
  };
  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <Input placeholder="ИНН" id="register-inn" aria-label="ИНН" type="text" />
      <Input placeholder="КПП" id="register-kpp" aria-label="КПП" type="text" />
      <Input
        placeholder="Юридическое наименование"
        id="register-address"
        aria-label="Юридическое наименование"
        type="text"
      />
      <Input
        placeholder="E-mail"
        id="register-email"
        aria-label="E-mail"
        type="text"
      />
      <Input
        type="password"
        placeholder="Пароль"
        id="register-password"
        aria-label="Пароль"
      />
      <Input
        type="password"
        placeholder="Подтвердить пароль"
        id="register-confirm-password"
        aria-label="Подтвердить пароль"
      />
      <Button type="submit" size={buttonSize}>
        Зарегистрироваться
      </Button>
    </form>
  );
};
