import { AuthPage } from "@pages/auth/ui/AuthPage";
import { RegisterPage } from "@pages/register/ui/RegisterPage";
import { Navigate, Route, Routes } from "react-router-dom";

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
};
