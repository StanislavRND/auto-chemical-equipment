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
      <Input placeholder="ИНН" />
      <Input placeholder="КПП" />
      <Input placeholder="Юридический наименование" />
      <Input placeholder="E-mail" />
      <Input type="password" placeholder="Пароль" />
      <Input type="password" placeholder="Подтвердить пароль" />
      <Button type="submit" size={buttonSize}>
        Зарегистрироваться
      </Button>
    </form>
  );
};
