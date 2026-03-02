import { MainLayout } from "@app/layouts/BaseLayout/BaseLayout";
import { AboutPage } from "@pages/About/ui/About";
import { AuthPage } from "@pages/Auth/ui/AuthPage";
import { CartPage } from "@pages/Cart/ui/CartPage";
import { CurrentProductPage } from "@pages/CurrentProduct/ui/CurrentProductPage";
import { AccessDeniedPage } from "@pages/Fallback/AccessDeniedPage/AccessDeniedPage";
import { NotFoundPage } from "@pages/Fallback/NotFoundPage/NotFoundPage";
import { HomePage } from "@pages/Home/ui/HomePage";
import { PrivacyPolicyPage } from "@pages/Policy/PrivacyPolicy/PrivacyPolicyPage";
import { ProfileMePage } from "@pages/ProfileMe/ui/ProfileMePage";
import { ProfileOrdersPage } from "@pages/ProfileOrders/ui/ProfileOrdersPage";
import { RegisterPage } from "@pages/Register/ui/RegisterPage";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { PATHS } from "./paths";
import { ProtectedRoute } from "./ProtectedRoute";
import { UserAgreementPage } from "@pages/Policy/UserAgreement/UserAgreementPage";

const router = createBrowserRouter([
  {
    path: PATHS.ROOT,
    element: <Navigate to={PATHS.HOME} replace />,
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
    path: PATHS.ACCESS_DENIED,
    element: <AccessDeniedPage />,
  },
  {
    path: PATHS.NOT_FOUND,
    element: <NotFoundPage />,
  },
  {
    path: PATHS.PRIVACY_POLICY,
    element: <PrivacyPolicyPage />,
  },
  {
    path: PATHS.USER_AGREEMENT,
    element: <UserAgreementPage />,
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
      {
        path: PATHS.CART,
        element: <CartPage />,
      },
      {
        path: PATHS.PRODUCT_WITH_SUB,
        element: <CurrentProductPage />,
      },
      {
        path: PATHS.PRODUCT_NO_SUB,
        element: <CurrentProductPage />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: PATHS.PROFILEME,
            element: <ProfileMePage />,
          },
          {
            path: PATHS.PROFILEORDERS,
            element: <ProfileOrdersPage />,
          },
        ],
      },
    ],
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
