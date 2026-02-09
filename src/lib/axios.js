import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://76.13.179.18/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  // เช็คว่ามี token และไม่ใช่ค่า null/undefined
  if (token && token !== "undefined" && token !== "null") {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
เ;
