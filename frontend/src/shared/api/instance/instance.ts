import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

const baseURL = import.meta.env.VITE_API_URL;

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

export type { AxiosError };

export const refreshToken = async () => {
  try {
    const token = Cookies.get("access_token");
    if (!token) return false;

    await axios.post("/api/refresh", {}, { withCredentials: true });
    return true;
  } catch {
    return false;
  }
};

if (typeof window !== "undefined") {
  let lastRefresh = 0;
  const REFRESH_INTERVAL = 7 * 60 * 1000;
  const MAX_INACTIVITY = 10 * 60 * 1000;

  setInterval(async () => {
    const now = Date.now();
    const token = Cookies.get("access_token");

    if (token && now - lastRefresh > MAX_INACTIVITY) {
      lastRefresh = now;
      await refreshToken();
    }
  }, REFRESH_INTERVAL);

  window.addEventListener("focus", () => {
    const now = Date.now();
    const token = Cookies.get("access_token");

    if (token && now - lastRefresh > MAX_INACTIVITY) {
      lastRefresh = now;
      refreshToken();
    }
  });
}
