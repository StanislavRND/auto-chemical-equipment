/* eslint-disable react-refresh/only-export-components */
import { useHomeActions } from "@pages/Home/model/useHomeActions";
import { createContext, useContext } from "react";

const ProductModalContext = createContext<ReturnType<
  typeof useHomeActions
> | null>(null);

export const ProductModalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const actions = useHomeActions();
  return (
    <ProductModalContext.Provider value={actions}>
      {children}
    </ProductModalContext.Provider>
  );
};

export const useProductModal = () => {
  const context = useContext(ProductModalContext);
  if (!context)
    throw new Error("useProductModal must be used inside ProductModalProvider");
  return context;
};
