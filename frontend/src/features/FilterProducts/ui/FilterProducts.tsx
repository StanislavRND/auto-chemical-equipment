import { useBreakpoint } from "@shared/lib/hooks/useBreakpoint";
import { Button } from "@shared/ui/Button/Button";
import {
  useFilterProducts,
  type CatalogFilters,
} from "../model/useFilterProducts";
import styles from "./FilterProducts.module.scss";

type Props = {
  initialFilters: CatalogFilters;
  onApply: (filters: CatalogFilters) => void;
  onReset: () => void;
  handleCloseFilter: () => void;
};

export const FilterProducts = ({
  initialFilters,
  onApply,
  onReset,
  handleCloseFilter,
}: Props) => {
  const { isLaptop, isMobile, isTablet } = useBreakpoint();

  const {
    priceFrom,
    priceTo,
    inStock,
    withDiscount,
    setInStock,
    setPriceFrom,
    setPriceTo,
    setWithDiscount,
    handleApply,
    handleReset,
  } = useFilterProducts({
    initialFilters,
    onApply,
    onReset,
    handleCloseFilter,
  });

  const buttonSize = isMobile ? "sm" : isTablet || isLaptop ? "md" : "lg";

  return (
    <section className={styles.filter}>
      <div className={styles.group}>
        <p className={styles.label}>Цена</p>

        <div className={styles.price}>
          <input
            type="number"
            placeholder="от"
            value={priceFrom}
            onChange={(e) => setPriceFrom(e.target.value)}
          />

          <input
            type="number"
            placeholder="до"
            value={priceTo}
            onChange={(e) => setPriceTo(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.group}>
        <p className={styles.label}>В наличии</p>

        <div className={styles.optionFlex}>
          <label className={styles.option}>
            <input
              type="radio"
              name="stock"
              checked={inStock === true}
              onChange={() => setInStock(true)}
            />
            Да
          </label>

          <label className={styles.option}>
            <input
              type="radio"
              name="stock"
              checked={inStock === false}
              onChange={() => setInStock(false)}
            />
            Нет
          </label>
        </div>
      </div>

      <div className={styles.group}>
        <p className={styles.label}>Со скидкой</p>

        <div className={styles.optionFlex}>
          <label className={styles.option}>
            <input
              type="radio"
              name="sale"
              checked={withDiscount === true}
              onChange={() => setWithDiscount(true)}
            />
            Да
          </label>

          <label className={styles.option}>
            <input
              type="radio"
              name="sale"
              checked={withDiscount === false}
              onChange={() => setWithDiscount(false)}
            />
            Нет
          </label>
        </div>
      </div>

      <div className={styles.actions}>
        <Button size={buttonSize} onClick={handleApply}>
          Применить
        </Button>

        <Button variant="outline" size={buttonSize} onClick={handleReset}>
          Сбросить
        </Button>
      </div>
    </section>
  );
};
