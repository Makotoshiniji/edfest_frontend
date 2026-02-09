import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://76.13.179.18/api", // ตรวจสอบว่า Port ตรงกับ Laravel ของคุณ

  // 👇 บรรทัดนี้สำคัญที่สุด ถ้าไม่มีบรรทัดนี้ จะแก้ 419 ไม่หาย
  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

export default axiosInstance;
