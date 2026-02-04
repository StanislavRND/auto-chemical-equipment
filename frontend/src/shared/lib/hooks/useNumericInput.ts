import { useCallback, useState } from "react";

export const useNumericInput = (initialValue: string = "") => {
  const [value, setValue] = useState(initialValue);

  const handleChange = useCallback((inputValue: string) => {
    const numericValue = inputValue.replace(/\D/g, "");
    setValue(numericValue);
    return numericValue;
  }, []);

  const clear = useCallback(() => {
    setValue("");
  }, []);

  return {
    value,
    setValue,
    handleChange,
    clear,
  };
};
