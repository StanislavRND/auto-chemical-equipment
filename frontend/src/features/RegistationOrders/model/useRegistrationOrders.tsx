import { parsePrice } from "@entities/Cart/lib/formating";
import { getDiscountPercent } from "@entities/Cart/lib/saleData";
import { selectCartItemsArray } from "@entities/Cart/model/store/cartSelectors";
import { useUpdateCatalogRatingBatch } from "@shared/api/catalog/catalog";
import { isValidEmail } from "@shared/lib/validation/email";
import { useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const cartItems = useSelector(selectCartItemsArray);
  const { mutate: createOrder, isPending: isCreateOrderPending } =
    useCreateOrder();
  const { increaseRating, isPending: isRatingPending } =
    useUpdateCatalogRatingBatch();
  const isPending = isCreateOrderPending || isRatingPending;

  const onChangeField = useCallback(
    (field: keyof FormState) => (value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: "" }));
    },
    [],
  );

  const products = useMemo(() => {
    const productsDiscountedPrice = cartItems.reduce((sum, item) => {
      const price = parsePrice(item.price);
      const itemDiscount = Number(item.discount_percent) || 0;
      return sum + price * (1 - itemDiscount / 100) * item.qty;
    }, 0);

    const cartDiscountPercent = getDiscountPercent(productsDiscountedPrice);

    return cartItems.map((item) => {
      const price = parsePrice(item.price);
      const itemDiscount = Number(item.discount_percent) || 0;
      const priceWithItemDiscount = price * (1 - itemDiscount / 100);
      const finalPrice = Math.round(
        priceWithItemDiscount * (1 - cartDiscountPercent / 100),
      );

      return {
        product_id: item.productId,
        name: item.name,
        article: item.article,
        category_id: item.categoryId,
        image_url: item.image_url,
        quantity: item.qty,
        price: String(finalPrice),
        total_price: finalPrice * item.qty,
      };
    });
  }, [cartItems]);

  const validate = useCallback(() => {
    const newErrors: FormErrors = {};
    if (!form.lastName.trim()) newErrors.lastName = "Обязательное поле";
    if (!form.firstName.trim()) newErrors.firstName = "Обязательное поле";
    if (!form.email.trim()) newErrors.email = "Обязательное поле";
    else if (!isValidEmail(form.email.trim()))
      newErrors.email = "Некорректный email";
    if (!form.phone.trim()) newErrors.phone = "Обязательное поле";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && products.length > 0;
  }, [form, products]);

  const onSubmit = useCallback(() => {
    if (!validate()) return;

    createOrder(
      {
        first_name: form.firstName.trim(),
        last_name: form.lastName.trim(),
        middle_name: form.middleName.trim() || null,
        comment: form.comment.trim() || null,
        products,
      },
      {
        onSuccess: async () => {
          try {
            await increaseRating(cartItems);
          } finally {
            navigate("/profile/orders");
          }
        },
      },
    );
  }, [
    createOrder,
    form,
    products,
    validate,
    cartItems,
    increaseRating,
    navigate,
  ]);

  return { form, errors, isPending, onChangeField, onSubmit };
};
