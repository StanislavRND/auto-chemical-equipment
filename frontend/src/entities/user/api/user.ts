import { axiosInstance } from "@shared/api/instance/instance";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export interface User {
  id: number;
  email: string;
  role: string;
  hashed_password: string;
  inn: string;
  kpp: string;
  legal_address: string;
  legal_name: string;
}

export const useGetCurrentUser = () => {
  return useQuery<User>({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await axiosInstance.get("/users/me");
      return res.data;
    },
    staleTime: 1 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const logout = async () => {
    setIsLoading(true);

    try {
      await axiosInstance.post("/auth/logout");
      queryClient.removeQueries({ queryKey: ["user"] });
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { logout, isLoading };
};
