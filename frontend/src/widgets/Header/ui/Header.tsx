import imgLogo from "@shared/assets/images/logo-text.png";
import { Link } from "react-router-dom";
import { useActiveHeader } from "../model/useActiveHeader";
import styles from "./Header.module.scss";

export const Header = () => {
  const { activePath } = useActiveHeader();
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.img}>
          <Link to={"/home"}>
            <img src={imgLogo} alt="Логотип компании" />
          </Link>
        </div>

        <nav className={styles.nav}>
          <ul className={styles.items}>
            <li
              className={`${styles.item} ${activePath === "/home" ? styles.active : ""}`}
            >
              <Link to="/home">Главная</Link>
            </li>
            <li
              className={`${styles.item} ${activePath === "/about" ? styles.active : ""}`}
            >
              <Link to="/about">О компании</Link>
            </li>
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
