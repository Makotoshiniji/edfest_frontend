import React, { useState, useEffect } from "react";
import {
  Mail,
  KeyRound,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../lib/axios";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Cooldown Timer Logic
  useEffect(() => {
    let interval = null;
    if (cooldown > 0) {
      interval = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cooldown]);

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSuccess(false);

    // Client-side Validation
    if (!email) {
      setError("กรุณากรอกอีเมลของคุณ");
      return;
    }
    if (!validateEmail(email)) {
      setError("รูปแบบอีเมลไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง");
      return;
    }

    setIsLoading(true);

    try {
      // 1. 👇 ขอ CSRF Cookie ก่อน (แก้ Error 419)
      await axios.get("/sanctum/csrf-cookie");

      // 2. 👇 ใช้ axios แทน fetch (และไม่ต้องใส่ http://localhost... เพราะตั้งใน axios.js แล้ว)
      await axios.post("/api/forgot-password", { email });

      // 3. ถ้าสำเร็จ (Axios จะไม่ Error) ทำงานต่อได้เลย
      setIsSuccess(true);
      setCooldown(60);

      setTimeout(() => {
        navigate("/verify_opt_resetpassword", { state: { email } });
      }, 1500);
    } catch (err) {
      // 4. จัดการ Error แบบ Axios
      console.error("Error:", err);

      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.email?.[0] ||
        "เกิดข้อผิดพลาดในการส่งรหัส OTP";

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden font-sans text-gray-800">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&family=Sarabun:wght@300;400;500;600&display=swap');
          body { font-family: 'Sarabun', sans-serif; }
          h1, h2, h3, h4, h5, h6, .font-prompt { font-family: 'Prompt', sans-serif; }

          @keyframes float {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-20px) scale(1.05); }
          }
          .bg-blob { animation: float 10s ease-in-out infinite; }
          
          .card-enter {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
            transition: opacity 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
          }
          .card-enter.active {
            opacity: 1;
            transform: scale(1) translateY(0);
          }

          .input-focus:focus-within {
            box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.1);
            border-color: #f97316;
          }
        `}
      </style>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-50 via-white to-gray-50"></div>
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-60 bg-blob"></div>
        <div
          className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-yellow-100 rounded-full blur-3xl opacity-60 bg-blob"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div
        className={`relative z-10 w-full max-w-md px-4 card-enter ${
          isLoaded ? "active" : ""
        }`}
      >
        <div className="bg-white rounded-[2rem] shadow-2xl shadow-orange-100/50 border border-white p-8 md:p-10 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 shadow-inner mb-2 transform transition-transform hover:scale-105 hover:rotate-3 duration-500">
              <div className="relative">
                <Mail
                  size={32}
                  className="absolute -top-2 -left-2 opacity-20"
                />
                <KeyRound size={40} />
              </div>
            </div>
          </div>

          <h1 className="font-prompt text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            ลืมรหัสผ่าน?
          </h1>
          <p className="text-gray-500 font-light text-sm md:text-base mb-8 leading-relaxed">
            ไม่ต้องกังวล! กรุณากรอกอีเมลที่ใช้สมัคร{" "}
            <br className="hidden md:block" />
            ระบบจะส่งรหัส OTP เพื่อตั้งรหัสผ่านใหม่ไปให้คุณ
          </p>

          {isSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-xl flex items-start text-left animate-pulse">
              <CheckCircle
                size={20}
                className="text-green-600 mt-0.5 mr-3 flex-shrink-0"
              />
              <div>
                <h4 className="font-prompt font-bold text-green-700 text-sm">
                  ส่งรหัส OTP เรียบร้อยแล้ว
                </h4>
                <p className="text-green-600 text-xs mt-1">
                  กำลังนำคุณไปยังหน้ากรอกรหัส OTP...
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center text-red-600 text-sm text-left animate-bounce-short">
              <AlertCircle size={18} className="mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-left">
              <label className="text-sm font-medium text-gray-700 font-prompt ml-1 mb-1 block">
                อีเมลของคุณ
              </label>
              <div className="relative transition-all duration-300 input-focus rounded-xl">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading || (isSuccess && cooldown > 0)}
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:outline-none transition-all duration-300 placeholder-gray-400 font-sarabun disabled:bg-gray-100 disabled:text-gray-400"
                  placeholder="example@email.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || (isSuccess && cooldown > 0)}
              className={`w-full py-3.5 rounded-xl font-prompt font-bold text-lg shadow-lg flex items-center justify-center transition-all duration-300
                ${
                  isLoading || (isSuccess && cooldown > 0)
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                    : "bg-orange-600 text-white hover:bg-orange-700 hover:shadow-orange-200 hover:-translate-y-1 active:scale-95"
                }`}
            >
              {isLoading ? (
                <>
                  <Loader2 size={24} className="animate-spin mr-2" />
                  กำลังดำเนินการ...
                </>
              ) : isSuccess && cooldown > 0 ? (
                <span>ส่งใหม่ได้ใน {cooldown} วินาที</span>
              ) : (
                <span>ส่งรหัส OTP</span>
              )}
            </button>
          </form>

          {/* Footer Actions */}
          <div className="mt-8 pt-6 border-t border-dashed border-gray-200">
            <Link
              to="/login"
              className="inline-flex items-center text-gray-500 hover:text-orange-600 transition-colors font-medium font-prompt group text-sm"
            >
              <ArrowLeft
                size={16}
                className="mr-2 group-hover:-translate-x-1 transition-transform"
              />
              กลับไปหน้าเข้าสู่ระบบ
            </Link>
          </div>

          <div className="mt-6 flex items-center justify-center text-xs text-gray-400 bg-gray-50 py-2 px-4 rounded-full inline-block mx-auto">
            <ShieldCheck size={14} className="inline mr-1.5 mb-0.5" />
            เพื่อความปลอดภัย รหัส OTP จะหมดอายุภายใน 5 นาที
          </div>
        </div>

        <p className="text-center text-gray-400 text-xs mt-6 font-light">
          &copy; 2026 Faculty of Education, Khon Kaen University
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
