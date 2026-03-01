import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import styles from "./BreadCrumb.module.scss";

export type BreadcrumbItem = {
  label: string;
  to?: string;
  disabled?: boolean;
};

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs = ({ items, className }: BreadcrumbsProps) => {
  return (
    <nav className={`${styles.nav} ${className ?? ""}`} aria-label="breadcrumb">
      <ul className={styles.list}>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          const isFirst = idx === 0; //

          return (
            <li key={`${item.label}-${idx}`} className={styles.item}>
              {item.to && !isLast && !item.disabled ? (
                <Link
                  className={`${styles.link} ${isFirst ? styles.homeLink : ""}`}
                  to={item.to}
                >
                  {item.label}
                </Link>
              ) : (
                <span className={` ${isLast ? styles.current : ""}`}>
                  {item.label}
                </span>
              )}

              {!isLast && <ChevronRight size={16} className={styles.icon} />}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
