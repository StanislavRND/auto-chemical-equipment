import { LayoutAuthRegister } from "@shared/ui/LayoutAuthRegister/LayoutAuthRegister";
import { useRegisterActions } from "../model/RegisterActions";

export const RegisterPage = () => {
  const { mode, handleSuccess, handleBackToRegister } = useRegisterActions();
  return (
    <>
      <LayoutAuthRegister
        title="Регистрация"
        text="Уже есть аккаунт?"
        subTitle="Войдите"
        type="register"
        mode={mode}
        onSuccess={handleSuccess}
        onBackToRegister={handleBackToRegister}
      />
    </>
  );
};
