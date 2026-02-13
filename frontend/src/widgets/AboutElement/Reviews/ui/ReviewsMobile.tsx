import { MapPin, Star } from "lucide-react";
import styles from "./Reviews.module.scss";

interface ReviewsMobileProps {
  reviews: typeof import("@shared/lib/data/reviews").REVIEWS;
}

export const ReviewsMobile = ({ reviews }: ReviewsMobileProps) => {
  return (
    <>
      <div className={styles.reviewCard}>
        {reviews.map((item) => (
          <div key={item.id} className={styles.reviewSlide}>
            <div className={styles.company}>
              <h3>{item.company}</h3>
              <span>
                <MapPin size={16} />
                {item.city}
              </span>
            </div>
            <div className={styles.rating}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  fill={i < item.rating ? "var(--orange-500)" : "none"}
                  color={
                    i < item.rating
                      ? "var(--orange-500)"
                      : "var(--orange-200)"
                  }
                />
              ))}
            </div>
            <p className={styles.text}>{item.text}</p>
          </div>
        ))}
      </div>
      
      <div className={styles.progress}>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: '33.33%' }} />
        </div>
      </div>
    </>
  );
};