import { ChevronLeft, ChevronRight, MapPin, Star } from "lucide-react";
import styles from "./Reviews.module.scss";

interface ReviewsDesktopProps {
  review: (typeof import("@shared/lib/data/reviews").REVIEWS)[0];
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
  totalReviews: number;
}

export const ReviewsDesktop = ({
  review,
  currentIndex,
  onNext,
  onPrev,
  totalReviews,
}: ReviewsDesktopProps) => {
  return (
    <>
      <div className={styles.contentWrapper}>
        <button
          aria-label="button nav prev"
          className={`${styles.navButton} ${styles.navPrev}`}
          onClick={onPrev}
        >
          <ChevronLeft size={24} />
        </button>

        <div className={styles.reviewCard}>
          <div className={styles.company}>
            <h3>{review.company}</h3>
            <span>
              <MapPin size={16} />
              {review.city}
            </span>
          </div>
          <div className={styles.rating}>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={20}
                fill={i < review.rating ? "var(--orange-500)" : "none"}
                color={
                  i < review.rating ? "var(--orange-500)" : "var(--orange-200)"
                }
              />
            ))}
          </div>
          <p className={styles.text}>{review.text}</p>
        </div>

        <button
          aria-label="button nav next"
          className={`${styles.navButton} ${styles.navNext}`}
          onClick={onNext}
        >
          <ChevronRight size={22} />
        </button>
      </div>

      <div className={styles.progress}>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{
              width: `${((currentIndex + 1) / totalReviews) * 100}%`,
            }}
          />
        </div>
      </div>
    </>
  );
};
