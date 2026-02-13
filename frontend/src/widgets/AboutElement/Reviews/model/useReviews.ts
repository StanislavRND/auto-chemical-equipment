import { REVIEWS } from "@shared/lib/data/reviews";
import { useState } from "react";

export const useReviews = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? REVIEWS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === REVIEWS.length - 1 ? 0 : prev + 1));
  };

  const review = REVIEWS[currentIndex];

  return {
    currentIndex,
    review,
    handlePrev,
    handleNext,
  };
};
