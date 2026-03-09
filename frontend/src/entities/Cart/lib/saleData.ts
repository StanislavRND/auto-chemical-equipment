export const SALE_DISCOUNTS = [
  { from: 100000, percent: 10 },
  { from: 50000, percent: 5 },
  { from: 20000, percent: 3 },
];

export const getDiscountPercent = (totalPrice: number): number => {
  const discount = SALE_DISCOUNTS.find((sale) => totalPrice >= sale.from);
  return discount?.percent ?? 0;
};
