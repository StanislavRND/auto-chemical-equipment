import { useAppSelector } from "@app/store/hooks";
import { AxiosError } from "axios";
import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterVerify } from "../api/useRegisterVerify";

export const useConfirmCodeForm = () => {
  const { mutate: verify, isError, error, isPending } = useRegisterVerify();
  const registrationData = useAppSelector((state) => state.registration);

  const [code, setCode] = useState<string[]>(["", "", "", ""]);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  const handleChange = (index: number, value: string) => {
    const numericValue = value.replace(/\D/g, "");

    if (!numericValue && value !== "") {
      return;
    }

    const newValue = numericValue.charAt(0);

    const newCode = [...code];
    newCode[index] = newValue;
    setCode(newCode);

    if (newValue && index < code.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    if (!newValue && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        if (!code[index] && index > 0) {
          e.preventDefault();
          const newCode = [...code];
          newCode[index - 1] = "";
          setCode(newCode);

          setTimeout(() => {
            inputsRef.current[index - 1]?.focus();
            inputsRef.current[index - 1]?.select();
          }, 0);
        } else if (code[index]) {
          e.preventDefault();
          const newCode = [...code];
          newCode[index] = "";
          setCode(newCode);
        }
      }
    },
    [code],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const verificationCode = code.join("");

    if (verificationCode.length === 4) {
      const verifyData = {
        ...registrationData,
        code: verificationCode,
      };
      verify(verifyData, {
        onSuccess: () => {
          navigate("/home");
        },
      });
    }
  };

  const getApiErrorMessage = (): string | null => {
    if (!isError) return null;
    if (error instanceof AxiosError && error.response?.data?.detail) {
      return error.response.data.detail;
    }
    return "Ошибка при проверки кода. Попробуйте ещё раз.";
  };

  return {
    code,
    inputsRef,
    isPending,
    handleChange,
    handleSubmit,
    handleKeyDown,
    apiErrorMessage: getApiErrorMessage(),
  };
};
