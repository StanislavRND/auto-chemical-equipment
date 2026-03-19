import type { Product } from "@entities/Product/api/product";
export interface CartItem {
  productId: Product["id"];
  category_id: Product["category_id"];
  name: string;
  article: string;
  image_url: string;
  price: string;
  discount_percent: string;
  qty: number;
}

export interface CartState {
  itemsById: Record<number, CartItem>;
}

export interface CartProduct {
  id: number;
  name: string;
  category_id: number;
  price: string;
  image_url: string;
  article: string;
  discount_percent: string;
}
