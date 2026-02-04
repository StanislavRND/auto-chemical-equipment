import { useState } from "react";

export const useRegisterActions = () => {
  const [mode, setMode] = useState<"register" | "confirm">("register");

  const handleSuccess = () => {
    setMode("confirm");
  };

  const handleBackToRegister = () => {
    setMode("register");
  };

  return {
    mode,
    handleSuccess,
    handleBackToRegister,
  };
};
