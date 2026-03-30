import { axiosInstance } from "@shared/api/instance/instance";
import { useMutation } from "@tanstack/react-query";

export type ChangePasswordData = {
  old_password: string;
  new_password: string;
  confirm_password: string;
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (changePasswordData: ChangePasswordData) => {
      const res = await axiosInstance.post(
        "/users/change-password",
        changePasswordData,
      );
      return res.data;
    },
  });
};
