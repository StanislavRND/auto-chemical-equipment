import { useCallback, useRef, useState } from "react";

export const useConfirmCodeForm = () => {
  const [code, setCode] = useState<string[]>(["", "", "", ""]);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    const numericValue = value.replace(/\D/g, "");

    if (!numericValue && value !== "") {
      return;
    }

    const newValue = numericValue.charAt(0);

    const newCode = [...code];
    newCode[index] = newValue;
    setCode(newCode);

    if (newValue && index < code.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    if (!newValue && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        if (!code[index] && index > 0) {
          e.preventDefault();
          const newCode = [...code];
          newCode[index - 1] = "";
          setCode(newCode);

          setTimeout(() => {
            inputsRef.current[index - 1]?.focus();
            inputsRef.current[index - 1]?.select();
          }, 0);
        } else if (code[index]) {
          e.preventDefault();
          const newCode = [...code];
          newCode[index] = "";
          setCode(newCode);
        }
      }
    },
    [code]
  );

  return { code, inputsRef, handleChange, handleKeyDown };
};
