import { axiosInstance } from "@shared/api/instance/instance";
import { useQuery } from "@tanstack/react-query";

export type CompanyInfo = {
  inn: string;
  kpp: string;
  name: string;
  address: string;
};

export const useGetCompanyByInn = (inn: string) => {
  return useQuery<CompanyInfo>({
    queryKey: ["company", inn],
    queryFn: async () => {
      const res = await axiosInstance.get(`/company/${inn}`);
      return res.data;
    },
    enabled: false,
    retry: 0,
  });
};
