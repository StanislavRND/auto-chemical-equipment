import {
  Home,
  Info,
  Menu,
  ShoppingCart,
  UserRound,
  type LucideIcon,
} from "lucide-react";

export interface MenuItem {
  id: string;
  icon: LucideIcon;
  label: string;
  path: string;
}

export const menuItems: MenuItem[] = [
  { id: "home", icon: Home, label: "Главная", path: "/home" },
  { id: "about", icon: Info, label: "О нас", path: "/about" },
  { id: "catalog", icon: Menu, label: "Каталог", path: "/catalog" },
  { id: "cart", icon: ShoppingCart, label: "Корзина", path: "/cart" },
  { id: "profile", icon: UserRound, label: "Профиль", path: "/profile" },
];
