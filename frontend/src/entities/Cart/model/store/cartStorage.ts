import type { CartState } from "../types";

const CART_LS_KEY = "cart_v1";

export function loadCartFromLS(): CartState | undefined {
  try {
    const raw = localStorage.getItem(CART_LS_KEY);
    if (!raw) return undefined;

    const parsed = JSON.parse(raw) as CartState;
    if (!parsed || typeof parsed !== "object" || !parsed.itemsById) {
      return undefined;
    }

    return parsed;
  } catch {
    return undefined;
  }
}

export function saveCartToLS(cart: CartState) {
  localStorage.setItem(CART_LS_KEY, JSON.stringify(cart));
}

export function clearCartLS() {
  localStorage.removeItem(CART_LS_KEY);
}
