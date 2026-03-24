import { axiosInstance } from "@shared/api/instance/instance";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export type PresignResponse = {
  upload_url: string;
  image_url: string;
};

export const useUploadCatalogImage = () => {
  return useMutation<string, Error, File>({
    mutationKey: ["catalog-image-upload"],
    mutationFn: async (file: File) => {
      const presign = await axiosInstance.post<PresignResponse>(
        "/categories/upload",
        { filename: file.name },
      );

      const { upload_url, image_url } = presign.data;

      await axios.put(upload_url, file, {
        withCredentials: false,
        headers: {
          "Content-Type": file.type || "image/webp",
        },
      });

      return image_url;
    },
  });
};
