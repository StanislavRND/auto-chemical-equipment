import { axiosInstance } from "@shared/api/instance/instance";
import { useMutation } from "@tanstack/react-query";

export type RegisterRequestData = {
  inn: string;
  kpp: string;
  legal_address: string;
  email: string;
  password: string;
  password_confirm: string;
};

export const useRegisterRequest = () => {
  return useMutation({
    mutationFn: async (requestData: RegisterRequestData) => {
      const res = await axiosInstance.post("/register/request", requestData);
      return res.data;
    },
  });
};
