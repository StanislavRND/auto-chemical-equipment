import { useAuth } from "@shared/lib/hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";
import { PATHS } from "./paths";

export const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={PATHS.ACCESS_DENIED} />;
  }

  return <Outlet />;
};
