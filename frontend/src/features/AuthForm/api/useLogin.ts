import { axiosInstance } from "@shared/api/instance/instance";
import { useMutation } from "@tanstack/react-query";

export type LoginData = {
  email: string;
  password: string;
};

export const useLogin = () => {
  return useMutation({
    mutationFn: async (userData: LoginData) => {
      const res = await axiosInstance.post("/login", userData);
      return res.data;
    },
  });
};
