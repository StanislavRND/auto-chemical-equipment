export const toNumberOrUndefined = (value?: string) => {
  if (!value) return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
};
