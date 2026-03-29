import React, { Suspense, lazy } from "react";
import { MainLayout } from "@app/layouts/BaseLayout/BaseLayout";
import { useSyncCart } from "@entities/Cart/model/useSyncCart";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { AdminRoute } from "./AdminRoute";
import { PATHS } from "./paths";
import { ProductModalProvider } from "./ProductModalContext";
import { ProtectedRoute } from "./ProtectedRoute";

const HomePage = lazy(() => import("@pages/Home/ui/HomePage"));
const AboutPage = lazy(() => import("@pages/About/ui/About"));
const CartPage = lazy(() => import("@pages/Cart/ui/CartPage"));
const CurrentProductPage = lazy(() => import("@pages/CurrentProduct/ui/CurrentProductPage"));
const CatalogProductPage = lazy(() => import("@pages/CatalogProduct/ui/CatalogProductPage"));
const SearchPage = lazy(() => import("@pages/Search/ui/SearchPage"));
const ProfileMePage = lazy(() => import("@pages/ProfileMe/ui/ProfileMePage"));
const ProfileOrdersPage = lazy(() => import("@pages/ProfileOrders/ui/ProfileOrdersPage"));
const RegistrationOrdersPage = lazy(() => import("@pages/RegistrationOrders/ui/RegistrationOrdersPage"));
const ProductsInOrderPage = lazy(() => import("@pages/ProductsInOrder/ui/ProductsInOrderPage"));
const AdminCatalogPage = lazy(() => import("@pages/AdminCatalog/ui/AdminCatalogPage"));
const AuthPage = lazy(() => import("@pages/Auth/ui/AuthPage"));
const RegisterPage = lazy(() => import("@pages/Register/ui/RegisterPage"));
const PrivacyPolicyPage = lazy(() => import("@pages/Policy/PrivacyPolicy/PrivacyPolicyPage"));
const UserAgreementPage = lazy(() => import("@pages/Policy/UserAgreement/UserAgreementPage"));
const AccessDeniedPage = lazy(() => import("@pages/Fallback/AccessDeniedPage/AccessDeniedPage"));
const NotFoundPage = lazy(() => import("@pages/Fallback/NotFoundPage/NotFoundPage"));

const SuspenseWrapper = (Component: React.LazyExoticComponent<React.ComponentType>) => (
  <Suspense>
    <Component />
  </Suspense>
);

const router = createBrowserRouter([
  { path: PATHS.ROOT, element: <Navigate to={PATHS.HOME} replace /> },
  { path: PATHS.LOGIN, element: SuspenseWrapper(AuthPage) },
  { path: PATHS.REGISTER, element: SuspenseWrapper(RegisterPage) },
  { path: PATHS.ACCESS_DENIED, element: SuspenseWrapper(AccessDeniedPage) },
  { path: PATHS.NOT_FOUND, element: SuspenseWrapper(NotFoundPage) },
  { path: PATHS.PRIVACY_POLICY, element: SuspenseWrapper(PrivacyPolicyPage) },
  { path: PATHS.USER_AGREEMENT, element: SuspenseWrapper(UserAgreementPage) },
  {
    element: <MainLayout />,
    children: [
      { path: PATHS.HOME, element: SuspenseWrapper(HomePage) },
      { path: PATHS.ABOUT, element: SuspenseWrapper(AboutPage) },
      { path: PATHS.CART, element: SuspenseWrapper(CartPage) },
      { path: PATHS.PRODUCT_WITH_SUB, element: SuspenseWrapper(CurrentProductPage) },
      { path: PATHS.PRODUCT_NO_SUB, element: SuspenseWrapper(CurrentProductPage) },
      { path: PATHS.CATALOG_SUBCATEGORY, element: SuspenseWrapper(CatalogProductPage) },
      { path: PATHS.CATALOG_CATEGORY, element: SuspenseWrapper(CatalogProductPage) },
      { path: PATHS.SEARCH, element: SuspenseWrapper(SearchPage) },

      {
        element: <ProtectedRoute />,
        children: [
          { path: PATHS.PROFILE_ME, element: SuspenseWrapper(ProfileMePage) },
          { path: PATHS.PROFILE_ORDERS, element: SuspenseWrapper(ProfileOrdersPage) },
          { path: PATHS.REGISTRATION_ORDERS, element: SuspenseWrapper(RegistrationOrdersPage) },
          { path: PATHS.PROFILE_PRODUCTS_IN_ORDER, element: SuspenseWrapper(ProductsInOrderPage) },
        ],
      },
      {
        element: <AdminRoute />,
        children: [{ path: PATHS.ADMIN_CATALOG, element: SuspenseWrapper(AdminCatalogPage) }],
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