import { Loader } from "@shared/ui/Loader/Loader";
import { X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import styles from "./FileInput.module.scss";

type FileInputProps = {
  placeholder: string;
  value?: string | null;
  onChange?: (url: string | null) => void;
  disabled?: boolean;
  floatingColor?: string;
  clearError?: () => void;
  uploadFile: (file: File) => Promise<string>;
  isUploading?: boolean;
};

export const FilepInput = ({
  placeholder,
  value = null,
  onChange,
  disabled,
  floatingColor,
  clearError,
  uploadFile,
  isUploading,
}: FileInputProps) => {
  const [focused, setFocused] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  const loading = uploading || !!isUploading;

  const id = useId();
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value) setFileName("Файл загружен");
    else setFileName("");
  }, [value]);

  const shouldFloat = focused || !!value || !!fileName;

  const pick = () => {
    if (disabled || loading) return;
    ref.current?.click();
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;

    if (
      f &&
      f.type !== "image/webp" &&
      !f.name.toLowerCase().endsWith(".webp")
    ) {
      e.target.value = "";
      setFileName("");
      onChange?.(null);
      clearError?.();
      return;
    }

    if (!f) {
      onChange?.(null);
      clearError?.();
      return;
    }

    try {
      setUploading(true);
      setFileName(f.name);

      const url = await uploadFile(f);
      onChange?.(url);
      clearError?.();
    } finally {
      setUploading(false);
      if (ref.current) ref.current.value = "";
    }
  };

  const clear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (ref.current) ref.current.value = "";
    setFileName("");
    onChange?.(null);
    clearError?.();
  };

  return (
    <div className={styles.container} onClick={pick}>
      <input
        ref={ref}
        id={`file-${id}`}
        type="file"
        accept="image/webp,.webp"
        className={styles.hidden}
        disabled={disabled || loading}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={handleChange}
      />

      <div className={styles.fake}>
        <span className={styles.name}>
          {loading ? (
            <Loader textHidden={true} size={16} text="Загрузка..." />
          ) : (
            fileName || "Выберите .webp"
          )}
        </span>

        {(value || fileName) &&
          !loading && ( // ✅
            <button type="button" className={styles.clear} onClick={clear}>
              <X size={20} color="var(--text-secondary)" />
            </button>
          )}
      </div>

      <label
        htmlFor={`file-${id}`}
        className={`${styles.label} ${shouldFloat ? styles.floating : ""}`}
        style={
          shouldFloat && floatingColor ? { color: floatingColor } : undefined
        }
      >
        {placeholder}
      </label>
    </div>
  );
};
