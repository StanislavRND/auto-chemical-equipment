import { useBreakpoint } from "@shared/lib/hooks/useBreakpoint";
import { Button } from "@shared/ui/Button/Button";
import { useConfirmCodeForm } from "../model/ConfirmCodeFormActions";
import styles from "./ConfirmCodeForm.module.scss";

export const ConfirmCodeForm = () => {
  const { isLaptop, isMobile, isTablet } = useBreakpoint();
  const { code, inputsRef, handleChange, handleKeyDown } = useConfirmCodeForm();

  const buttonSize = isLaptop || isTablet || isMobile ? "md" : "lg";
  return (
    <form className={styles.form}>
      <h1 className={styles.title}>Код из E-mail</h1>
      <h3 className={styles.subtitle}>Отправили на почту test@gmail.com</h3>
      <div className={styles.wrapperInput}>
        {code.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputsRef.current[index] = el;
            }}
            type="text"
            className={styles.input}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            maxLength={1}
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="off"
            autoFocus={index === 0}
            aria-label={`Цифра ${index + 1} кода подтверждения`}
          />
        ))}
      </div>

      <div className={styles.wrapperBtn}>
        {" "}
        <Button className={styles.btn} size={buttonSize}>
          Отправить
        </Button>
      </div>
    </form>
  );
};
