import { useAuth } from "@entities/User/model/useAuth";
import imgLogo from "@shared/assets/images/logo-text.png";
import { Link } from "react-router-dom";
import { useActiveHeader } from "../model/useActiveHeader";
import styles from "./Header.module.scss";

export const Header = () => {
  const { activePath } = useActiveHeader();
  const { role } = useAuth();
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.img}>
          <Link to={"/home"}>
            <img
              width={160}
              height={160}
              src={imgLogo}
              alt="Логотип компании"
            />
          </Link>
        </div>

        <nav className={styles.nav}>
          <ul className={styles.items}>
            <li
              className={`${styles.item} ${activePath === "/home" ? styles.active : ""}`}
            >
              <Link to="/home">Главная</Link>
            </li>
            {role !== "admin" ? (
              <li
                className={`${styles.item} ${activePath === "/about" ? styles.active : ""}`}
              >
                <Link to="/about">О компании</Link>
              </li>
            ) : (
              <li
                className={`${styles.item} ${activePath === "/catalog/admin" ? styles.active : ""}`}
              >
                <Link to="/catalog/admin">Редактор каталога</Link>
              </li>
            )}
          </ul>
        </nav>
        <div className={styles.contacts}>
          <div className={styles.phone}>8 800 535-77-77</div>
          <div className={styles.email}>test@gmail.com</div>
        </div>
      </div>
    </header>
  );
};
