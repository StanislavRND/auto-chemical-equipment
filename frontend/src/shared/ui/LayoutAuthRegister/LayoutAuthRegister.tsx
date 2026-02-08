import { AuthForm } from "@features/AuthForm/ui/AuthForm";
import { ConfirmCodeForm } from "@features/ConfirmCodeForm/ui/ConfirmCodeForm";
import { RegisterForm } from "@features/RegisterForm/ui/RegisterForm";
import authRegister from "@shared/assets/images/auth-register.webp";
import { CircleArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from "./LayoutAuthRegister.module.scss";

interface LayoutAuthRegister {
  type: string;
  title: string;
  text: string;
  subTitle: string;
  mode?: "register" | "confirm";
  onSuccess?: () => void;
  onBackToRegister?: () => void;
}

export const LayoutAuthRegister = (props: LayoutAuthRegister) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (props.mode === "confirm" && props.onBackToRegister) {
      props.onBackToRegister();
    } else {
      navigate("/");
    }
  };

  const renderForm = () => {
    if (props.type === "auth") {
      return <AuthForm />;
    }

    if (props.mode === "confirm") {
      return <ConfirmCodeForm />;
    }

    return <RegisterForm onSuccess={props.onSuccess} />;
  };

  return (
    <main className={styles.wrapper}>
      <div className={styles.bar}>
        <button
          onClick={handleBackClick}
          className={styles.backButton}
          aria-label="Вернуться назад"
        >
          <div className={styles.back}>
            <CircleArrowLeft
              strokeWidth={1}
              className={styles.icon}
              style={{ color: "var(--text-secondary)" }}
              aria-hidden="true"
            />
            <span className={styles.text}>Назад</span>
          </div>
        </button>
      </div>
      <div className={styles.content}>
        <div className={styles.contentLeft}>
          {props.mode !== "confirm" && (
            <h1 className={styles.contentTitle}>{props.title}</h1>
          )}

          {renderForm()}

          {props.mode !== "confirm" && (
            <>
              <div
                className={styles.contentLine}
                role="separator"
                aria-orientation="horizontal"
              ></div>

              <p className={styles.contentText}>
                {props.text}{" "}
                <a
                  href={props.type === "auth" ? "/register" : "/login"}
                  className={styles.contentLink}
                >
                  {props.subTitle}
                </a>
              </p>
            </>
          )}
        </div>
        <img
          className={styles.contentRight}
          src={authRegister}
          alt="Декоративное изображение для страницы авторизации"
        />
      </div>
    </main>
  );
};
