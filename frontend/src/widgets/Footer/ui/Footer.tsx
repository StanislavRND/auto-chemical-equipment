import imgLogo from "@shared/assets/images/logo-text.png";
import { Link } from "react-router-dom";
import styles from "./Footer.module.scss";

const INFO_ITEMS = [
  { name: "Главная", path: "/home" },
  { name: "О компании", path: "/about" },
];

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.img}>
          <Link to={"/home"}>
            <img src={imgLogo} alt="Логотип компании" />
          </Link>
        </div>
        <nav className={styles.nav}>
          <div className={styles.info}>
            <div className={styles.title}>Информация</div>
            {INFO_ITEMS.map((item, index) => (
              <div key={index} className={styles.subtitle}>
                <Link to={item.path}>{item.name}</Link>
              </div>
            ))}
          </div>
        </nav>
        <div className={styles.dop}>
          <div className={styles.dopTitle}>Время работы</div>
          <div className={styles.dopSubtile}>ПН-ПТ с 8:30 до 22:00 (МСК)</div>
          <div className={styles.dopTitle}>Общие вопросы</div>
          <div className={styles.dopSubtile}>8 800 535-77-77</div>
        </div>
      </div>
      <div className={styles.police}>
        2026 © ОптовикАвтоХим
        <span>|</span>
        <Link to={"/privacy-policy"}> Политика конфиденциальности </Link>
      </div>
    </footer>
  );
};
