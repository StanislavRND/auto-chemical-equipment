import { ProductListSearch } from "@features/SearchProducts/ui/ProductListSearch";
import { useSearchParams } from "react-router-dom";

export const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";

  return <ProductListSearch query={query} />;
};
