import { useAppSelector } from "@app/store/hooks";
import { selectCartItemsArray } from "@entities/Cart/model/cartSelectors";
import { Breadcrumbs } from "@shared/ui/BreadCrumb/BreadCrumb";
import { CartEmpty } from "@widgets/Cart/ui/CartEmpty/CartEmpty";
import { CartList } from "@widgets/Cart/ui/CartList/CartList";
import { CartOrder } from "@widgets/Cart/ui/CartOrder/CartOrder";
import { breadcrumbsItems } from "../lib/breadcrums";
import styles from "./CartPage.module.scss";

export const CartPage = () => {
  const cartItems = useAppSelector(selectCartItemsArray);
  const isCartEmpty = !cartItems || cartItems.length === 0;

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {!isCartEmpty && (
          <div className={styles.breadcrumbs}>
            <Breadcrumbs items={breadcrumbsItems} />
          </div>
        )}

        {isCartEmpty ? (
          <CartEmpty />
        ) : (
          <>
            <CartList />
            <div className={styles.wrapperOrder}>
              <CartOrder />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
