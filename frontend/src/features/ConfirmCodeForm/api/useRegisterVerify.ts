import type { RegisterRequestData } from "@features/RegisterForm/api/useRegisterRequest";
import { axiosInstance } from "@shared/api/instance/instance";
import { useMutation } from "@tanstack/react-query";

export type RegisterVerifyData = RegisterRequestData & { code: string };

export const useRegisterVerify = () => {
  return useMutation({
    mutationFn: async (verifyData: RegisterVerifyData) => {
      const res = await axiosInstance.post("/register/verify", verifyData);
      return res.data;
    },
  });
};
