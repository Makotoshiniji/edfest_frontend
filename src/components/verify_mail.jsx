import React, { useState, useEffect, useRef } from "react";
import {
  MailCheck, // เปลี่ยนไอคอนให้สื่อความหมาย
  Timer,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  RotateCcw,
  Loader2,
  Mail,
} from "lucide-react";
import { useLocation, useNavigate, Link } from "react-router-dom";

const VerifyMail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || ""; // รับ email ที่ส่งมาจากหน้า Register

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isShake, setIsShake] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [isLoaded, setIsLoaded] = useState(false);

  const inputRefs = useRef([]);

  // ถ้าไม่มี email ให้ดีดกลับไปหน้า Register หรือ Login
  useEffect(() => {
    if (!email) {
      navigate("/register");
    }
    setIsLoaded(true);
  }, [email, navigate]);

  // Countdown Timer
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  // Handle Input Change
  const handleChange = (index, value) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    setError("");

    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle Backspace
  const handleKeyDown = (index, e) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0 &&
      inputRefs.current[index - 1]
    ) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle Paste
  const handlePaste = (e) => {
    e.preventDefault();
    const data = e.clipboardData.getData("text").trim();
    if (!/^\d+$/.test(data)) return;

    const newOtp = [...otp];
    const pasteData = data.slice(0, 6).split("");

    pasteData.forEach((char, index) => {
      newOtp[index] = char;
    });

    setOtp(newOtp);
    setError("");

    const nextIndex = Math.min(pasteData.length, 5);
    inputRefs.current[nextIndex].focus();
  };

  // Handle Resend OTP
  const handleResend = async () => {
    if (countdown > 0) return;

    try {
      // ยิง API ขอ OTP ใหม่สำหรับการยืนยันอีเมล
      const response = await fetch(
        "http://76.13.179.18/api/resend-verification-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );

      if (response.ok) {
        setCountdown(60);
        setOtp(["", "", "", "", "", ""]);
        setError("");
        inputRefs.current[0].focus();
        alert("ส่งรหัสยืนยันใหม่เรียบร้อยแล้ว");
      } else {
        alert("ไม่สามารถส่งรหัสได้ในขณะนี้");
      }
    } catch (error) {
      alert("เชื่อมต่อ Server ไม่ได้");
    }
  };

  // Submit Logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");

    if (otpValue.length !== 6) return;

    setIsLoading(true);
    setError("");

    try {
      // ยิง API ยืนยันอีเมล
      const response = await fetch("http://76.13.179.18/api/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, otp: otpValue }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        // เก็บ Token และข้อมูล User ลง LocalStorage (เหมือนตอน Login สำเร็จ)
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // พาไปหน้า Dashboard
        setTimeout(() => {
          navigate("/user_dashboard");
        }, 1500);
      } else {
        setError(data.message || "รหัส OTP ไม่ถูกต้อง");
        setIsShake(true);
        setTimeout(() => setIsShake(false), 500);
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0].focus();
      }
    } catch (err) {
      setError("เชื่อมต่อ Server ไม่ได้");
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

          .card-enter {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
          }
          .card-enter.active {
            opacity: 1;
            transform: translateY(0);
          }

          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
            20%, 40%, 60%, 80% { transform: translateX(4px); }
          }
          .animate-shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }

          @keyframes pulse-orange {
            0% { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(249, 115, 22, 0); }
            100% { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0); }
          }
          .success-pulse { animation: pulse-orange 1.5s infinite; }
        `}
      </style>

      {/* --- Background --- */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-50 via-white to-orange-50/50"></div>
        <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-orange-200 rounded-full blur-[80px] opacity-40 animate-pulse"></div>
        <div className="absolute bottom-[-50px] left-[-50px] w-64 h-64 bg-yellow-200 rounded-full blur-[80px] opacity-40 animate-pulse"></div>
      </div>

      <div
        className={`relative z-10 w-full max-w-md px-4 card-enter ${
          isLoaded ? "active" : ""
        }`}
      >
        <div className="bg-white rounded-[2rem] shadow-2xl shadow-orange-100/50 border border-white p-8 md:p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-300 to-orange-500"></div>

          <div className="flex justify-center mb-6">
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center mb-2 transition-all duration-500 
              ${
                isSuccess
                  ? "bg-green-100 text-green-600 success-pulse"
                  : "bg-orange-50 text-orange-500"
              }`}
            >
              {isSuccess ? <CheckCircle2 size={40} /> : <MailCheck size={40} />}
            </div>
          </div>

          <h1 className="font-prompt text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            ยืนยันอีเมล
          </h1>
          <p className="text-gray-500 font-light text-sm md:text-base mb-8">
            รหัสยืนยันถูกส่งไปยัง <br />
            <b className="text-orange-600">{email}</b>
          </p>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center justify-center text-red-600 text-sm animate-shake">
              <AlertCircle size={18} className="mr-2" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div
              className={`flex justify-center gap-2 sm:gap-3 mb-8 ${
                isShake ? "animate-shake" : ""
              }`}
            >
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  disabled={isLoading || isSuccess}
                  className={`w-10 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold rounded-xl border-2 transition-all duration-200 outline-none caret-orange-500 font-prompt
                    ${
                      isSuccess
                        ? "border-green-400 bg-green-50 text-green-700"
                        : error
                          ? "border-red-300 bg-red-50 text-red-600 focus:border-red-500"
                          : "border-gray-200 bg-gray-50 text-gray-800 focus:border-orange-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(249,115,22,0.15)]"
                    }`}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading || otp.join("").length !== 6 || isSuccess}
              className={`w-full py-3.5 rounded-xl font-prompt font-bold text-lg shadow-lg flex items-center justify-center transition-all duration-300
                ${
                  isLoading || otp.join("").length !== 6 || isSuccess
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                    : "bg-orange-600 text-white hover:bg-orange-700 hover:shadow-orange-200 hover:-translate-y-1 active:scale-95"
                }`}
            >
              {isLoading ? (
                <>
                  <Loader2 size={24} className="animate-spin mr-2" />
                  กำลังตรวจสอบ...
                </>
              ) : isSuccess ? (
                <span>ยืนยันเรียบร้อย</span>
              ) : (
                <span>ยืนยันอีเมล</span>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm mb-2">ไม่ได้รับรหัส?</p>
            {countdown > 0 ? (
              <div className="flex items-center justify-center text-gray-400 text-sm bg-gray-100 rounded-full py-1.5 px-4 inline-block">
                <Timer size={14} className="mr-1.5 inline" />
                ขอรหัสใหม่ได้ใน{" "}
                <span className="font-bold w-6 inline-block text-center">
                  {countdown}
                </span>{" "}
                วินาที
              </div>
            ) : (
              <button
                onClick={handleResend}
                className="inline-flex items-center text-orange-600 hover:text-orange-700 font-semibold text-sm transition-colors group"
              >
                <RotateCcw
                  size={16}
                  className="mr-1.5 group-hover:rotate-180 transition-transform duration-500"
                />
                ส่งรหัส OTP ใหม่
              </button>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <Link
              to="/register"
              className="flex items-center justify-center text-gray-400 hover:text-orange-600 transition-colors text-sm font-medium"
            >
              <ArrowLeft size={16} className="mr-1" />
              กลับไปหน้าสมัครสมาชิก
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyMail;
