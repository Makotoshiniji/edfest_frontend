// src/lib/axios.js (สร้างไฟล์ใหม่)
import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://127.0.0.1:8000", // URL Backend
  withCredentials: true, // ✅ สำคัญมาก! เพื่อให้ส่ง Cookie
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default axiosClient;
