import styles from "./LoaderSkeleton.module.scss";

interface LoaderSkeletonProps {
  height?: number | string;
  width?: number | string;
  count?: number;
  className?: string;
}

export const LoaderSkeleton = ({
  height = 200,
  width = "100%",
  count = 1,
  className = "",
}: LoaderSkeletonProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`${styles.skeleton} ${className}`}
          style={{ height, width }}
        />
      ))}
    </>
  );
};