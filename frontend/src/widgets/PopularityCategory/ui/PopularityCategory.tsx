import { ErrorMessage } from "@shared/ui/ErrorMessage/ErrorMessage";
import { Loader } from "@shared/ui/Loader/Loader";
import { useNavigate } from "react-router-dom";
import { useGetPopularityCategory } from "../api/popularityCategory";
import styles from "./PopularityCategory.module.scss";

const DEFAULT_CATALOG_SEARCH = new URLSearchParams({
  sort: "name",
  inStock: "true",
  withDiscount: "false",
}).toString();

export const PopularityCategory = () => {
  const navigate = useNavigate();

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
            <div
              key={el.name}
              className={styles.item}
              onClick={() =>
                navigate({
                  pathname: `/catalog/${el.id}`,
                  search: `?${DEFAULT_CATALOG_SEARCH}`,
                })
              }
              role="button"
              tabIndex={0}
            >
              <div className={styles.inner}>
                <div className={styles.name}>{el.name}</div>

                <div className={styles.imgWrapper}>
                  <img src={el.image_url} alt={el.name} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
