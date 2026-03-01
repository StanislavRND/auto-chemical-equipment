import { ErrorMessage } from "@shared/ui/ErrorMessage/ErrorMessage";
import { Loader } from "@shared/ui/Loader/Loader";
import { useGetPopularityCategory } from "../api/popularityCategory";
import styles from "./PopularityCategory.module.scss";

export const PopularityCategory = () => {
  const {
    data: popularityCategory,
    isLoading,
    error,
  } = useGetPopularityCategory();

  if (isLoading)
    return (
      <section className={styles.loading}>
        <Loader size={64} text="Загрузка популярных категорий..." />
      </section>
    );

  if (error)
    return (
      <section className={styles.error}>
        <div className={styles.container}>
          {" "}
          <ErrorMessage message="Ошибка загрузки популярных категорий" />
        </div>
      </section>
    );

  return (
    <section className={styles.popularity}>
      <div className={styles.container}>
        <h3 className={styles.title}>Популярные категории</h3>
        <div className={styles.items}>
          {popularityCategory?.map((el) => (
            <div key={el.name} className={styles.item}>
              <div className={styles.inner}>
                {" "}
                <div className={styles.name}>{el.name}</div>
                <div className={styles.imgWrapper}>
                  <img src={el.image_url} alt="Фото категории" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
