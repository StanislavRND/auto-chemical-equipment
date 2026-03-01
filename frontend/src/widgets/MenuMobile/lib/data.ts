import {
  Home,
  Info,
  Menu,
  ShoppingCart,
  UserRound,
  type LucideIcon,
  Settings, // или любой подходящий icon
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

  {
    id: "catalogAdmin",
    icon: Settings,
    label: "Редактор каталога",
    path: "/catalog/admin", 
  },

  { id: "catalog", icon: Menu, label: "Каталог", path: "" },
  { id: "cart", icon: ShoppingCart, label: "Корзина", path: "/cart" },
  { id: "profile", icon: UserRound, label: "Профиль", path: "/profile/me" },
];