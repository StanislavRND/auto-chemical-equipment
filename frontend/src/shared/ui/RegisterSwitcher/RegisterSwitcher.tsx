import styles from "./RegisterSwitcher.module.scss";

interface EntitySwitcherProps {
  mode: "person" | "legal";
  onChange: (mode: "person" | "legal") => void;
}

export const RegisterSwitcher = ({ mode, onChange }: EntitySwitcherProps) => {
  return (
    <div className={styles.switcher}>
      <button
        type="button"
        className={`${styles.option} ${mode === "person" ? styles.active : ""}`}
        onClick={() => onChange("person")}
      >
        Физ. лицо
      </button>
      <button
        type="button"
        className={`${styles.option} ${mode === "legal" ? styles.active : ""}`}
        onClick={() => onChange("legal")}
      >
        Юр. лицо
      </button>
    </div>
  );
};
