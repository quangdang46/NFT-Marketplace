import axios from "axios";
import Cookies from "js-cookie";
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  // withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);



axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/refresh"
    ) {
      originalRequest._retry = true;
      const refreshToken = Cookies.get("refresh_token");

      if (refreshToken) {
        try {
          const { data } = await axiosInstance.post("/auth/refresh", {
            refreshToken,
          });
          Cookies.set("auth_token", data.accessToken, {
            expires: 1 / 24,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
          });
          originalRequest.headers[
            "Authorization"
          ] = `Bearer ${data.accessToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError: any) {
          console.error(
            "Refresh token failed:",
            refreshError.response?.data || refreshError.message
          );
          // Chỉ xóa cookie nếu lỗi là 401 (Unauthorized), không xóa nếu 400
          if (refreshError.response?.status === 401) {
            Cookies.remove("auth_token", { secure: true, sameSite: "strict" });
            Cookies.remove("refresh_token", {
              secure: true,
              sameSite: "strict",
            });
            if (typeof window !== "undefined") {
              window.location.href = "/";
            }
          }
          return Promise.reject(refreshError);
        }
      } else {
        if (typeof window !== "undefined") {
          window.location.href = "/";
        }
        return Promise.reject(new Error("No refresh token available"));
      }
    }
    return Promise.reject(error);
  }
);


// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       console.log("Error 401:", error);
//     }
//     console.log("Error from client:", error);
//     Cookies.remove("auth_token");
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
