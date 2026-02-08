import { isValidEmail } from "@shared/lib/validation/email";
import { AxiosError } from "axios";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../api/useLogin";

export const useAuthForm = () => {
  const { mutate: login, isPending, isError, error } = useLogin();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const emailError = !formData.email
    ? "Обязательное поле"
    : !isValidEmail(formData.email)
      ? "Некорректный email"
      : "";

  const passwordError = !formData.password
    ? "Обязательное поле"
    : formData.password.length < 8
      ? "Минимум 8 символов"
      : "";

  const isFormValid = !emailError && !passwordError;

  const handleBlur = useCallback((field: keyof typeof formData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const handleChange = useCallback(
    (field: keyof typeof formData, value: string) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    [],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    const trimmedData = {
      email: formData.email.trim(),
      password: formData.password.trim(),
    };
    if (isFormValid) {
      login(trimmedData, {
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
    return "Ошибка при входе. Попробуйте позже.";
  };

  return {
    formData,
    touched,
    emailError,
    passwordError,
    isFormValid,
    isPending,
    isError,
    apiErrorMessage: getApiErrorMessage(),
    handleBlur,
    handleChange,
    handleSubmit,
  };
};
