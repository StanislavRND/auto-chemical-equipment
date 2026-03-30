import type { RootState } from "@app/store/store";
import type { CartItem, CartState } from "../types";
import {
  selectCartItemsArray,
  selectCartPriceData,
  selectCartTotalCount,
} from "./cartSelectors";

const createCartItem = (overrides?: Partial<CartItem>): CartItem => ({
  productId: 1,
  article: "A1",
  categoryId: 10,
  name: "Товар",
  image_url: "",
  price: "100",
  discount_percent: "0",
  qty: 1,
  ...overrides,
});

const createCartState = (items: CartItem[] = []): CartState => ({
  itemsById: items.reduce(
    (acc, item) => {
      acc[item.productId] = item;
      return acc;
    },
    {} as Record<number, CartItem>,
  ),
});

const createRootState = (cartItems: CartItem[] = []): RootState =>
  ({
    cart: createCartState(cartItems),
  }) as RootState;

describe("Cart selectors", () => {
  it("selectCartItemsArray возвращает массив товаров", () => {
    const state = createRootState([
      createCartItem({ name: "Товар 1", productId: 1 }),
      createCartItem({ name: "Товар 2", productId: 2 }),
    ]);

    const items = selectCartItemsArray(state);
    expect(items.length).toBe(2);
    expect(items[0].name).toBe("Товар 1");
    expect(items[1].name).toBe("Товар 2");
  });

  it("selectCartTotalCount считает общее количество", () => {
    const state = createRootState([
      createCartItem({ productId: 1, qty: 2 }),
      createCartItem({ productId: 2, qty: 1 }),
    ]);

    const total = selectCartTotalCount(state);
    expect(total).toBe(3);
  });

  it("selectCartPriceData считает цены и скидки", () => {
    const state = createRootState([
      createCartItem({
        productId: 1,
        price: "100",
        discount_percent: "10",
        qty: 2,
      }),
      createCartItem({
        productId: 2,
        price: "200",
        discount_percent: "0",
        qty: 1,
      }),
    ]);

    const data = selectCartPriceData(state);

    expect(data.totalPrice).toBe(400);
    expect(data.productsDiscountedPrice).toBeLessThan(data.totalPrice);
    expect(data.discountedPrice).toBeLessThanOrEqual(
      data.productsDiscountedPrice,
    );
    expect(data.discountPercent).toBeGreaterThan(0);
    expect(data.cartDiscountPercent).toBeGreaterThanOrEqual(0);
  });
});
