import { useAppDispatch, useAppSelector } from "@app/store/hooks";
import { updateField } from "@features/ConfirmCodeForm/model/registrationSlice";
import { isValidEmail } from "@shared/lib/validation/email";
import { AxiosError } from "axios";
import { useCallback, useState } from "react";
import { useRegisterRequest, type RegisterRequestData } from "../api/useRegisterRequest";

export const useRegisterForm = (typeRegister: "person" | "legal") => {
  const {
    mutate: registerRequest,
    isPending,
    isError,
    isSuccess,
    error,
  } = useRegisterRequest();

  const dispatch = useAppDispatch();
  const formData = useAppSelector((state) => state.registration);
  const [checked, setChecked] = useState(false);

  const [touched, setTouched] = useState({
    inn: false,
    kpp: false,
    legal_name: false,
    legal_address: false,
    email: false,
    password: false,
    password_confirm: false,
    full_name: false,
    phone: false,
  });

  const isLegal = typeRegister === "legal";

  const innError = !formData.inn
    ? "Обязательное поле"
    : !/^\d+$/.test(formData.inn)
      ? "Только цифры"
      : formData.inn.length !== 10 && formData.inn.length !== 12
        ? "Должен содержать 10 или 12 цифр"
        : "";

  const kppError = !formData.kpp
    ? "Обязательное поле"
    : !/^[\dA-Za-z]{9}$/.test(formData.kpp)
      ? "Должен содержать 9 символов"
      : "";

  const legalAddressError = !formData.legal_address ? "Обязательное поле" : "";
  const legalNameError = !formData.legal_name ? "Обязательное поле" : "";

  const fullNameError = !formData.full_name ? "Обязательное поле" : "";

  const phoneError = !formData.phone
    ? "Обязательное поле"
    : !/^\+?\d{10,15}$/.test(formData.phone)
      ? "Некорректный телефон"
      : "";

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

  const confirmPasswordError = !formData.password_confirm
    ? "Обязательное поле"
    : formData.password !== formData.password_confirm
      ? "Пароли не совпадают"
      : "";

  const isFormValid = isLegal
    ? !innError && !kppError && !legalAddressError && !legalNameError
    : !fullNameError && !phoneError;

  const finalValid =
    isFormValid && !emailError && !passwordError && !confirmPasswordError;

  const handleCheck = () => {
    setChecked(!checked);
  };

  const handleBlur = useCallback((field: keyof typeof formData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const handleChange = useCallback(
    (field: keyof typeof formData, value: string) => {
      dispatch(updateField({ field, value }));
    },
    [dispatch],
  );


  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      setTouched((prev) => ({
        ...prev,
        inn: true,
        kpp: true,
        legal_address: true,
        legal_name: true,
        full_name: true,
        phone: true,
        email: true,
        password: true,
        password_confirm: true,
      }));

      const base = {
        email: formData.email.trim(),
        password: formData.password.trim(),
        password_confirm: formData.password_confirm.trim(),
      };

      let requestData: RegisterRequestData;

      if (isLegal) {
        requestData = {
          ...base,
          user_type: "legal",
          inn: formData.inn.trim(),
          kpp: formData.kpp.trim(),
          legal_name: formData.legal_name.trim(),
          legal_address: formData.legal_address.trim(),
        };
      } else {
        requestData = {
          ...base,
          user_type: "person",
          full_name: formData.full_name.trim(),
          phone: formData.phone.trim(),
        };
      }

      if (finalValid) {
        registerRequest(requestData);
      }
    },
    [formData, finalValid, registerRequest, isLegal],
  );

  const getApiErrorMessage = (): string | null => {
    if (!isError) return null;
    if (error instanceof AxiosError && error.response?.data?.detail) {
      return error.response.data.detail;
    }
    return "Ошибка при регистрации. Попробуйте позже.";
  };

  return {
    formData,
    touched,

    innError,
    kppError,
    legalAddressError,
    legalNameError,
    fullNameError,
    phoneError,
    emailError,
    passwordError,
    confirmPasswordError,

    checked,
    isSuccess,
    isPending,
    apiErrorMessage: getApiErrorMessage(),

    handleBlur,
    handleChange,
    handleSubmit,
    handleCheck,
  };
};
