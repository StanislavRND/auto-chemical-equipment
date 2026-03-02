import type { Product } from "@entities/Product/api/product";

export interface CartItem {
  productId: Product["id"];
  name: string;
  article: string;
  image_url: string;
  price: string;
  qty: number;
}

export interface CartState {
  itemsById: Record<number, CartItem>;
}

export interface CartProduct {
  id: number;
  name: string;
  price: string;
  image_url: string;
  article: string;
}
