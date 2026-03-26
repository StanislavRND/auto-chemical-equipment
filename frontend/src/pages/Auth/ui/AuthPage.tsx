import { LayoutAuthRegister } from "@shared/ui/LayoutAuthRegister/LayoutAuthRegister";

export const AuthPage = () => {
  return (
    <>
      <LayoutAuthRegister
        title="Вход"
        text="Ещё нет аккаунта?"
        subTitle="Зарегистрируйтесь"
        type="auth"
      />
    </>
  );
};
