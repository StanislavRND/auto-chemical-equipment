import { AuthPage } from "@pages/Auth/ui/AuthPage";
import { Home } from "@pages/Home/Home";
import { RegisterPage } from "@pages/Register/ui/RegisterPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navigate, Route, Routes } from "react-router-dom";

export const App = () => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </QueryClientProvider>
  );
};
