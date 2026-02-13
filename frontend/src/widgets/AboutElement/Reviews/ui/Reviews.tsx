import { REVIEWS } from "@shared/lib/data/reviews";
import { useBreakpoint } from "@shared/lib/hooks/useBreakpoint";
import { useReviews } from "../model/useReviews";
import styles from "./Reviews.module.scss";
import { ReviewsDesktop } from "./ReviewsDesktop";
import { ReviewsMobile } from "./ReviewsMobile";

export const Reviews = () => {
  const { currentIndex, review, handleNext, handlePrev } = useReviews();
  const { isTablet } = useBreakpoint();

  return (
    <section className={styles.reviews}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Отзывы наших клиентов</h2>
        </div>

        {isTablet ? (
          <ReviewsMobile reviews={REVIEWS} />
        ) : (
          <ReviewsDesktop
            review={review}
            currentIndex={currentIndex}
            onNext={handleNext}
            onPrev={handlePrev}
            totalReviews={REVIEWS.length}
          />
        )}
      </div>
    </section>
  );
};
