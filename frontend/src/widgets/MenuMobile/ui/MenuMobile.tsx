import { menuItems } from "../lib/data";
import { useActiveMenu } from "../model/useActiveMenuMobile";
import styles from "./MenuMobile.module.scss";

interface MenuMobileProps {
  url?: string;
}

export const MenuMobile = ({ url = "/home" }: MenuMobileProps) => {
  const { activePath } = useActiveMenu(menuItems, url);
  return (
    <menu className={styles.menu}>
      <div className={styles.items}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePath === item.path;

          return (
            <button
              key={item.id}
              className={`${styles.item} ${isActive ? styles.active : ""}`}
            >
              <Icon className={styles.icon} />
              <div className={styles.title}>{item.label}</div>
            </button>
          );
        })}
      </div>
    </menu>
  );
};
