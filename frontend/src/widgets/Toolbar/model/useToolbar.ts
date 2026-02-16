import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useToolbar = () => {
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const navigate = useNavigate();

  const toggleCatalog = () => {
    setIsCatalogOpen(!isCatalogOpen);
  };

  const handleToLogin = () => {
    navigate("/login");
  };

  const handleToCart = () => {
    navigate("/cart");
  };

  const handleToProfile = () => {
    navigate("/profile/me");
  };

  return {
    isCatalogOpen,
    setIsCatalogOpen,
    toggleCatalog,
    handleToLogin,
    handleToCart,
    handleToProfile,
  };
};
