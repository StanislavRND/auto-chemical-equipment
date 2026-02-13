import { MainLayout } from "@app/layouts/BaseLayout/BaseLayout";
import { AboutPage } from "@pages/About/ui/About";
import { AuthPage } from "@pages/Auth/ui/AuthPage";
import { HomePage } from "@pages/Home/HomePage";
import { RegisterPage } from "@pages/Register/ui/RegisterPage";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { PATHS } from "./paths";

const router = createBrowserRouter([
  {
    path: PATHS.ROOT,
    element: <Navigate to={PATHS.LOGIN} replace />,
  },

  {
    path: PATHS.LOGIN,
    element: <AuthPage />,
  },
  {
    path: PATHS.REGISTER,
    element: <RegisterPage />,
  },
  {
    element: <MainLayout />,
    children: [
      {
        path: PATHS.HOME,
        element: <HomePage />,
      },
      {
        path: PATHS.ABOUT,
        element: <AboutPage />,
      },
    ],
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
