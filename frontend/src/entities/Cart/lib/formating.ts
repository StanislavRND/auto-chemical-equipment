export const formatRub = (value: number) => {
  return new Intl.NumberFormat("ru-RU").format(value) + " ₽";
};

export const parsePrice = (price: string) => {
  const n = Number(String(price).replace(",", "."));
  return Number.isFinite(n) ? n : 0;
};
