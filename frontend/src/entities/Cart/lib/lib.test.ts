import { describe, expect, it } from "vitest";
import { formatRub, parsePrice } from "./formating";

describe("formating", () => {
  describe("formatRub", () => {
    it("форматирует целое число", () => {
      expect(formatRub(100)).toBe("100 ₽");
    });

    it("форматирует ноль", () => {
      expect(formatRub(0)).toBe("0 ₽");
    });
  });

  describe("parsePrice", () => {
    it("парсит целое число", () => {
      expect(parsePrice("100")).toBe(100);
    });

    it("парсит число с запятой", () => {
      expect(parsePrice("1500,5")).toBe(1500.5);
    });

    it("парсит число с точкой", () => {
      expect(parsePrice("1500.5")).toBe(1500.5);
    });

    it("возвращает 0 для невалидного значения", () => {
      expect(parsePrice("не число")).toBe(0);
    });

    it("возвращает 0 для пустой строки", () => {
      expect(parsePrice("")).toBe(0);
    });
  });
});
