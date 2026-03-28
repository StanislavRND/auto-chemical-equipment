import { useAppSelector } from "@app/store/hooks";
import { selectCartItemsArray } from "@entities/Cart/model/store/cartSelectors";
import { Breadcrumbs } from "@shared/ui/BreadCrumb/BreadCrumb";
import { CartEmpty } from "@widgets/Cart/ui/CartEmpty/CartEmpty";
import { CartList } from "@widgets/Cart/ui/CartList/CartList";
import { CartOrder } from "@widgets/Cart/ui/CartOrder/CartOrder";
import { CartSale } from "@widgets/Cart/ui/CartSale/CartSale";
import { breadcrumbsItems } from "../lib/breadcrums";
import styles from "./CartPage.module.scss";

const CartPage = () => {
  const cartItems = useAppSelector(selectCartItemsArray);
  const isCartEmpty = !cartItems || cartItems.length === 0;

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.breadcrumbs}>
          <Breadcrumbs items={breadcrumbsItems} />
        </div>

        {isCartEmpty ? (
          <CartEmpty />
        ) : (
          <>
            <CartList />
            <div className={styles.wrapperBottomBlocks}>
              <CartSale />
              <CartOrder />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;
