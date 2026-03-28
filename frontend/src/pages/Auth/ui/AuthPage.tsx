import { LayoutAuthRegister } from "@shared/ui/LayoutAuthRegister/LayoutAuthRegister";

const AuthPage = () => {
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
export default AuthPage;
