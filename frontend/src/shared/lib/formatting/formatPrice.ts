export const formatPrice = (price: string | number): string => {
  const numericPrice =
    typeof price === "number" ? price : Number(price.replace(/\s/g, ""));

  if (isNaN(numericPrice)) return "0";

  return new Intl.NumberFormat("ru-RU").format(numericPrice);
};
