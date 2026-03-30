import { useLogoutChangePassword } from "@entities/User/api/user";
import { AxiosError } from "axios";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChangePassword } from "../api/changePassword";

export const useChangePasswordForm = () => {
  const {
    mutate: changePassword,
    isPending,
    isError,
    error,
  } = useChangePassword();
  const { logout: logoutChangePassword } = useLogoutChangePassword();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [touched, setTouched] = useState({
    old_password: false,
    new_password: false,
    confirm_password: false,
  });

  const newPasswordError = !formData.new_password
    ? "Обязательное поле"
    : formData.new_password.length < 8
      ? "Минимум 8 символов"
      : "";

  const confirmPasswordError = !formData.confirm_password
    ? "Обязательное поле"
    : formData.confirm_password.length < 8
      ? "Минимум 8 символов"
      : "";

  const isFormValid = !newPasswordError && !confirmPasswordError;

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
    setTouched({
      old_password: true,
      new_password: true,
      confirm_password: true,
    });

    const trimmedData = {
      old_password: formData.old_password.trim(),
      new_password: formData.new_password.trim(),
      confirm_password: formData.confirm_password.trim(),
    };

    if (isFormValid) {
      changePassword(trimmedData, {
        onSuccess: async () => {
          await logoutChangePassword(); 
          navigate("/login");
        },
      });
    }
  };

  const getApiErrorMessage = (): string | null => {
    if (!isError) return null;
    if (error instanceof AxiosError && error.response?.data?.detail) {
      return error.response.data.detail;
    }
    return "Ошибка при смене пароля. Попробуйте позже.";
  };

  return {
    formData,
    touched,
    newPasswordError,
    confirmPasswordError,
    isFormValid,
    isLoading: isPending,
    isError,
    apiErrorMessage: getApiErrorMessage(),
    handleBlur,
    handleChange,
    handleSubmit,
  };
};
