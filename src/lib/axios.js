// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: "http://76.13.179.18/api", // ตรวจสอบว่า Port ตรงกับ Laravel ของคุณ

//   // 👇 บรรทัดนี้สำคัญที่สุด ถ้าไม่มีบรรทัดนี้ จะแก้ 419 ไม่หาย
//   withCredentials: true,

//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//     "X-Requested-With": "XMLHttpRequest",
//   },
// });

// export default axiosInstance;

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://76.13.179.18/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

// 🔥 เพิ่ม Interceptor: ด่านตรวจก่อนส่งข้อมูล
axiosInstance.interceptors.request.use((config) => {
  // 1. ล้วงกระเป๋าหา Token
  const token = localStorage.getItem("auth_token");

  // 2. ถ้ามี Token ให้แนบไปกับบัตรผ่าน (Header)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosInstance;
