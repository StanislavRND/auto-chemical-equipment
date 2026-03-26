import { Navigate, Outlet } from "react-router-dom";
import { PATHS } from "./paths";
import { useAuth } from "@entities/User/model/useAuth";

export const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div style={{ display: "none" }}>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to={PATHS.ACCESS_DENIED} replace />;
  }

  return <Outlet />;
};
