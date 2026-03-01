import { useAppDispatch, useAppSelector } from "@app/store/hooks";
import { updateField } from "@features/ConfirmCodeForm/model/registrationSlice";
import { isValidEmail } from "@shared/lib/validation/email";
import { AxiosError } from "axios";
import { useCallback, useState } from "react";
import { useGetCompanyByInn } from "../api/useCompanyRequest";
import { useRegisterRequest } from "../api/useRegisterRequest";

export const useRegisterForm = () => {
  const {
    mutate: registerRequest,
    isPending,
    isError,
    isSuccess,
    error,
  } = useRegisterRequest();
  const dispatch = useAppDispatch();
  const formData = useAppSelector((state) => state.registration);
  const {
    refetch: fetchCompanyData,
    isFetching: isCompanyLoading,
    error: errorCompany,
    isError: isErrorCompany,
  } = useGetCompanyByInn(formData.inn);
  const [checked, setChecked] = useState(false);

  const [touched, setTouched] = useState({
    inn: false,
    kpp: false,
    legal_name: false,
    legal_address: false,
    email: false,
    password: false,
    password_confirm: false,
  });

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

  const isFormValid =
    !innError &&
    !kppError &&
    !legalAddressError &&
    !emailError &&
    !passwordError &&
    !legalNameError &&
    !confirmPasswordError;

  const handleCheck = () => {
    setChecked(!checked);
  };

  const handleInnBlur = useCallback(async () => {
    setTouched((prev) => ({ ...prev, inn: true }));

    const isValidInn =
      formData.inn &&
      (formData.inn.length === 10 || formData.inn.length === 12) &&
      /^\d+$/.test(formData.inn);

    if (isValidInn) {
      try {
        const result = await fetchCompanyData();
        const companyData = result.data;

        if (companyData) {
          dispatch(updateField({ field: "kpp", value: companyData.kpp || "" }));
          dispatch(
            updateField({ field: "legal_name", value: companyData.name || "" }),
          );
          dispatch(
            updateField({
              field: "legal_address",
              value: companyData.address || "",
            }),
          );

          setTouched((prev) => ({
            ...prev,
            kpp: true,
            legal_address: true,
            legal_name: true,
          }));
        }
      } catch (error) {
        console.error("Ошибка при загрузке данных компании:", error);
      }
    }
  }, [formData.inn, fetchCompanyData, dispatch]);

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

      setTouched({
        inn: true,
        kpp: true,
        legal_address: true,
        legal_name: true,
        email: true,
        password: true,
        password_confirm: true,
      });

      const trimmedData = {
        inn: formData.inn.trim(),
        kpp: formData.kpp.trim(),
        legal_name: formData.legal_name.trim(),
        legal_address: formData.legal_address.trim(),
        email: formData.email.trim(),
        password: formData.password.trim(),
        password_confirm: formData.password_confirm.trim(),
      };

      if (isFormValid) {
        registerRequest(trimmedData);
      }
    },
    [isFormValid, formData, registerRequest],
  );

  const getApiErrorMessage = (): string | null => {
    if (!isError) return null;
    if (error instanceof AxiosError && error.response?.data?.detail) {
      return error.response.data.detail;
    }
    return "Ошибка при регистрации. Попробуйте позже.";
  };

  const getApiCompanyErrorMessage = (): string | null => {
    if (!isErrorCompany) return null;
    if (
      errorCompany instanceof AxiosError &&
      errorCompany.response?.data?.detail
    ) {
      return errorCompany.response.data.detail;
    }
    return "Ошибка при получение компании. Попробуйте позже.";
  };

  return {
    formData,
    touched,
    innError,
    kppError,
    legalAddressError,
    emailError,
    legalNameError,
    passwordError,
    confirmPasswordError,
    isCompanyLoading,
    checked,

    isSuccess,
    isPending,
    apiErrorMessage: getApiErrorMessage(),
    apiCompanyErrorMessage: getApiCompanyErrorMessage(),
    handleBlur,
    handleChange,
    handleSubmit,
    handleInnBlur,
    handleCheck,
  };
};
