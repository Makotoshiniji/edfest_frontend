import axios from "axios";

const axiosInstance = axios.create({
  // ⚠️ แก้ตรงนี้: เปลี่ยนจาก IP เป็นโดเมนของคุณ
  // อย่าลืมเติม /api ต่อท้ายเหมือนเดิม
  baseURL: "https://www.edfest-kku.com/api",

  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

// ... ส่วน Interceptor ด้านล่างเหมือนเดิมครับ ...
// Request Interceptor
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token && token !== "undefined" && token !== "null") {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Session expired, redirecting to login...");
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
