import { axiosInstance } from "@shared/api/instance/instance";
import { useMutation } from "@tanstack/react-query";

export type RegisterRequestData =
  | {
      user_type: "legal";
      inn: string;
      kpp: string;
      legal_name: string;
      legal_address: string;
      email: string;
      password: string;
      password_confirm: string;
    }
  | {
      user_type: "person";
      full_name: string;
      phone: string;
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
