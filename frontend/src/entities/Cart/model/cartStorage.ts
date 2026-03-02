import type { CartState } from "./types";

const CART_LS_KEY = "cart_v1";

export function loadCartFromLS(): CartState | null {
  try {
    const raw = localStorage.getItem(CART_LS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CartState;

    if (!parsed || typeof parsed !== "object" || !parsed.itemsById) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveCartToLS(state: CartState) {
  localStorage.setItem(CART_LS_KEY, JSON.stringify(state));
}

export function clearCartLS() {
  localStorage.removeItem(CART_LS_KEY);
}
