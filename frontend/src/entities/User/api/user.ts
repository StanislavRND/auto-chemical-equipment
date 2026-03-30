import { axiosInstance } from "@shared/api/instance/instance";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export interface User {
  id: number;
  email: string;
  role: string;
  inn: string |null;
  kpp: string |null;
  legal_address: string |null;
  legal_name: string |null;
  full_name: string |null;
  phone: string |null;
  user_type: "legal" | "person";
}


export const useGetCurrentUser = () => {
  return useQuery<User>({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await axiosInstance.get("/users/me");
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
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
      await axiosInstance.post("/logout");
      queryClient.removeQueries({ queryKey: ["user"] });
      window.location.href = "/home";
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { logout, isLoading };
};
