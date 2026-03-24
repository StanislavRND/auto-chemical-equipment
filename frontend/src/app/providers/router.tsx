import { MainLayout } from "@app/layouts/BaseLayout/BaseLayout";
import { useSyncCart } from "@entities/Cart/model/useSyncCart";
import { AboutPage } from "@pages/About/ui/About";
import { AdminCatalogPage } from "@pages/AdminCatalog/ui/AdminCatalogPage";
import { AuthPage } from "@pages/Auth/ui/AuthPage";
import { CartPage } from "@pages/Cart/ui/CartPage";
import { CatalogProductPage } from "@pages/CatalogProduct/ui/CatalogProductPage";
import { CurrentProductPage } from "@pages/CurrentProduct/ui/CurrentProductPage";
import { AccessDeniedPage } from "@pages/Fallback/AccessDeniedPage/AccessDeniedPage";
import { NotFoundPage } from "@pages/Fallback/NotFoundPage/NotFoundPage";
import { HomePage } from "@pages/Home/ui/HomePage";
import { PrivacyPolicyPage } from "@pages/Policy/PrivacyPolicy/PrivacyPolicyPage";
import { UserAgreementPage } from "@pages/Policy/UserAgreement/UserAgreementPage";
import { ProductsInOrderPage } from "@pages/ProductsInOrder/ui/ProductsInOrderPage";
import { ProfileMePage } from "@pages/ProfileMe/ui/ProfileMePage";
import { ProfileOrdersPage } from "@pages/ProfileOrders/ui/ProfileOrdersPage";
import { RegisterPage } from "@pages/Register/ui/RegisterPage";
import { RegistrationOrdersPage } from "@pages/RegistrationOrders/ui/RegistrationOrdersPage";
import { SearchPage } from "@pages/Search/ui/SearchPage";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { AdminRoute } from "./AdminRoute";
import { PATHS } from "./paths";
import { ProductModalProvider } from "./ProductModalContext";
import { ProtectedRoute } from "./ProtectedRoute";

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
        path: PATHS.CATALOG_SUBCATEGORY,
        element: <CatalogProductPage />,
      },
      {
        path: PATHS.CATALOG_CATEGORY,
        element: <CatalogProductPage />,
      },
      {
        path: PATHS.SEARCH,
        element: <SearchPage />,
      },

      {
        element: <ProtectedRoute />,
        children: [
          {
            path: PATHS.PROFILE_ME,
            element: <ProfileMePage />,
          },
          {
            path: PATHS.PROFILE_ORDERS,
            element: <ProfileOrdersPage />,
          },
          {
            path: PATHS.REGISTRATION_ORDERS,
            element: <RegistrationOrdersPage />,
          },
          {
            path: PATHS.PROFILE_PRODUCTS_IN_ORDER,
            element: <ProductsInOrderPage />,
          },
        ],
      },
      {
        element: <AdminRoute />,
        children: [
          {
            path: PATHS.ADMIN_CATALOG,
            element: <AdminCatalogPage />,
          },
        ],
      },
    ],
  },
]);

export const AppRouter = () => {
  useSyncCart();
  return (
    <ProductModalProvider>
      <RouterProvider router={router} />
    </ProductModalProvider>
  );
};
