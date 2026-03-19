import { selectCartItemsArray } from "@entities/Cart/model/store/cartSelectors";
import { isValidEmail } from "@shared/lib/validation/email";
import { useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useCreateOrder } from "../api/createOrder";

type FormState = {
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  phone: string;
  comment: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const initialState: FormState = {
  firstName: "",
  lastName: "",
  middleName: "",
  email: "",
  phone: "",
  comment: "",
};

export const useRegistrationOrders = () => {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});

  const cartItems = useSelector(selectCartItemsArray);
  const { mutate: createOrder, isPending } = useCreateOrder();

  const onChangeField = useCallback(
    (field: keyof FormState) => (value: string) => {
      setForm((prev) => ({
        ...prev,
        [field]: value,
      }));

      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    },
    [],
  );

  const products = useMemo(() => {
    return cartItems.map((item) => ({
      product_id: item.productId,
      name: item.name,
      article: item.article,
      image_url: item.image_url,
      quantity: item.qty,
      price: item.price,
      total_price: Number(item.price) * item.qty,
    }));
  }, [cartItems]);

  const validate = useCallback(() => {
    const newErrors: FormErrors = {};

    if (!form.lastName.trim()) {
      newErrors.lastName = "Обязательное поле";
    }

    if (!form.firstName.trim()) {
      newErrors.firstName = "Обязательное поле";
    }

    if (!form.email.trim()) {
      newErrors.email = "Обязательное поле";
    } else if (!isValidEmail(form.email.trim())) {
      newErrors.email = "Некорректный email";
    }

    if (!form.phone.trim()) {
      newErrors.phone = "Обязательное поле";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0 && products.length > 0;
  }, [form, products]);

  const onSubmit = useCallback(() => {
    const isFormValid = validate();

    if (!isFormValid) {
      return;
    }

    createOrder({
      first_name: form.firstName.trim(),
      last_name: form.lastName.trim(),
      middle_name: form.middleName.trim() || null,
      comment: form.comment.trim() || null,
      products,
    });
  }, [createOrder, form, products, validate]);

  return {
    form,
    errors,
    isPending,
    onChangeField,
    onSubmit,
  };
};
