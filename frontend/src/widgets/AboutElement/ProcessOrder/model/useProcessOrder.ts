import { useState } from "react";

export const useProcessOrder = () => {
  const [activeId, setActiveId] = useState<number | null>(null);

  const toggleItem = (id: number) => {
    setActiveId(activeId === id ? null : id);
  };
  return {
    activeId,
    toggleItem,
  };
};
