import { useGetCurrentUser } from "../api/user";

export function useAuth() {
  const { data, isLoading, isError } = useGetCurrentUser();

  return {
    loading: isLoading,
    isAuthenticated: !!data && !isError,
    user: data ?? null,
    role: data?.role ?? null,
  };
}
