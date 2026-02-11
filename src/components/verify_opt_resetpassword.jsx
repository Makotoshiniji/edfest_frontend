// import React, { useState, useEffect, useRef } from "react";
// import {
//   ShieldCheck,
//   Timer,
//   ArrowLeft,
//   AlertCircle,
//   CheckCircle2,
//   RotateCcw,
//   Loader2,
// } from "lucide-react";
// import { useLocation, useNavigate, Link } from "react-router-dom";
// // ✅ 1. นำเข้า axios ที่เราตั้งค่า HTTPS ไว้แล้ว
// import axios from "../lib/axios";

// const OtpVerification = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const email = location.state?.email || "";

//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [isShake, setIsShake] = useState(false);
//   const [isSuccess, setIsSuccess] = useState(false);
//   const [countdown, setCountdown] = useState(60);
//   const [isLoaded, setIsLoaded] = useState(false);

//   const inputRefs = useRef([]);

//   useEffect(() => {
//     if (!email) {
//       navigate("/forgot-password");
//     }
//     setIsLoaded(true);
//   }, [email, navigate]);

//   useEffect(() => {
//     let timer;
//     if (countdown > 0) {
//       timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
//     }
//     return () => clearInterval(timer);
//   }, [countdown]);

//   const handleChange = (index, value) => {
//     if (isNaN(value)) return;

//     const newOtp = [...otp];
//     newOtp[index] = value.substring(value.length - 1);
//     setOtp(newOtp);
//     setError("");

//     if (value && index < 5 && inputRefs.current[index + 1]) {
//       inputRefs.current[index + 1].focus();
//     }
//   };

//   const handleKeyDown = (index, e) => {
//     if (
//       e.key === "Backspace" &&
//       !otp[index] &&
//       index > 0 &&
//       inputRefs.current[index - 1]
//     ) {
//       inputRefs.current[index - 1].focus();
//     }
//   };

//   const handlePaste = (e) => {
//     e.preventDefault();
//     const data = e.clipboardData.getData("text").trim();
//     if (!/^\d+$/.test(data)) return;

//     const newOtp = [...otp];
//     const pasteData = data.slice(0, 6).split("");

//     pasteData.forEach((char, index) => {
//       newOtp[index] = char;
//     });

//     setOtp(newOtp);
//     setError("");

//     const nextIndex = Math.min(pasteData.length, 5);
//     inputRefs.current[nextIndex].focus();
//   };

//   // ✅ 2. แก้ไขฟังก์ชัน handleResend ให้ใช้ axios
//   const handleResend = async () => {
//     if (countdown > 0) return;

//     try {
//       // ไม่ต้องใส่ domain เต็ม ใส่แค่ path พอ (axios จะไปต่อกับ baseURL เอง)
//       const response = await axios.post("/forgot-password", { email });

//       if (response.status === 200) {
//         setCountdown(60);
//         setOtp(["", "", "", "", "", ""]);
//         setError("");
//         inputRefs.current[0].focus();
//         alert("ส่งรหัส OTP ใหม่เรียบร้อยแล้ว");
//       }
//     } catch (error) {
//       console.error(error);
//       const msg =
//         error.response?.data?.message ||
//         "ไม่สามารถส่งรหัส OTP ได้ กรุณาลองใหม่";
//       alert(msg);
//     }
//   };

//   // ✅ 3. แก้ไขฟังก์ชัน handleSubmit ให้ใช้ axios
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const otpValue = otp.join("");

//     if (otpValue.length !== 6) return;

//     setIsLoading(true);
//     setError("");

//     try {
//       // ใช้ axios ยิงไปที่ /verify-otp
//       const response = await axios.post("/verify-otp", {
//         email,
//         otp: otpValue,
//       });

//       if (response.status === 200) {
//         setIsSuccess(true);
//         // ส่งต่อไปหน้า Reset Password
//         setTimeout(() => {
//           navigate("/reset_password", { state: { email, otp: otpValue } });
//         }, 1000);
//       }
//     } catch (err) {
//       console.error(err);
//       // ดึง Error Message จาก Backend มาแสดง
//       const msg = err.response?.data?.message || "รหัส OTP ไม่ถูกต้อง";

//       setError(msg);
//       setIsShake(true);
//       setTimeout(() => setIsShake(false), 500);
//       setOtp(["", "", "", "", "", ""]);
//       inputRefs.current[0].focus();
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden font-sans text-gray-800">
//       <style>
//         {`
//           @import url('https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&family=Sarabun:wght@300;400;500;600&display=swap');
//           body { font-family: 'Sarabun', sans-serif; }
//           h1, h2, h3, h4, h5, h6, .font-prompt { font-family: 'Prompt', sans-serif; }

//           .card-enter {
//             opacity: 0;
//             transform: translateY(30px);
//             transition: opacity 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
//           }
//           .card-enter.active {
//             opacity: 1;
//             transform: translateY(0);
//           }

//           @keyframes shake {
//             0%, 100% { transform: translateX(0); }
//             10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
//             20%, 40%, 60%, 80% { transform: translateX(4px); }
//           }
//           .animate-shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }

//           @keyframes pulse-orange {
//             0% { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.4); }
//             70% { box-shadow: 0 0 0 10px rgba(249, 115, 22, 0); }
//             100% { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0); }
//           }
//           .success-pulse { animation: pulse-orange 1.5s infinite; }
//         `}
//       </style>

//       {/* --- Background Decorations --- */}
//       <div className="absolute inset-0 pointer-events-none">
//         <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-50 via-white to-orange-50/50"></div>
//         <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-orange-200 rounded-full blur-[80px] opacity-40 animate-pulse"></div>
//         <div className="absolute bottom-[-50px] left-[-50px] w-64 h-64 bg-yellow-200 rounded-full blur-[80px] opacity-40 animate-pulse"></div>
//       </div>

//       <div
//         className={`relative z-10 w-full max-w-md px-4 card-enter ${
//           isLoaded ? "active" : ""
//         }`}
//       >
//         <div className="bg-white rounded-[2rem] shadow-2xl shadow-orange-100/50 border border-white p-8 md:p-10 text-center relative overflow-hidden">
//           <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-300 to-orange-500"></div>

//           <div className="flex justify-center mb-6">
//             <div
//               className={`w-20 h-20 rounded-full flex items-center justify-center mb-2 transition-all duration-500
//               ${
//                 isSuccess
//                   ? "bg-green-100 text-green-600 success-pulse"
//                   : "bg-orange-50 text-orange-500"
//               }`}
//             >
//               {isSuccess ? (
//                 <CheckCircle2 size={40} />
//               ) : (
//                 <ShieldCheck size={40} />
//               )}
//             </div>
//           </div>

//           <h1 className="font-prompt text-2xl md:text-3xl font-bold text-gray-900 mb-2">
//             ยืนยันรหัส OTP
//           </h1>
//           <p className="text-gray-500 font-light text-sm md:text-base mb-8">
//             กรุณากรอกรหัส OTP 6 หลัก <br />
//             ที่ส่งไปยัง: <b>{email}</b>
//           </p>

//           {error && (
//             <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center justify-center text-red-600 text-sm animate-shake">
//               <AlertCircle size={18} className="mr-2" />
//               <span>{error}</span>
//             </div>
//           )}

//           <form onSubmit={handleSubmit}>
//             <div
//               className={`flex justify-center gap-2 sm:gap-3 mb-8 ${
//                 isShake ? "animate-shake" : ""
//               }`}
//             >
//               {otp.map((digit, index) => (
//                 <input
//                   key={index}
//                   ref={(el) => (inputRefs.current[index] = el)}
//                   type="text"
//                   maxLength={1}
//                   value={digit}
//                   onChange={(e) => handleChange(index, e.target.value)}
//                   onKeyDown={(e) => handleKeyDown(index, e)}
//                   onPaste={handlePaste}
//                   disabled={isLoading || isSuccess}
//                   className={`w-10 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold rounded-xl border-2 transition-all duration-200 outline-none caret-orange-500 font-prompt
//                     ${
//                       isSuccess
//                         ? "border-green-400 bg-green-50 text-green-700"
//                         : error
//                           ? "border-red-300 bg-red-50 text-red-600 focus:border-red-500"
//                           : "border-gray-200 bg-gray-50 text-gray-800 focus:border-orange-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(249,115,22,0.15)]"
//                     }`}
//                 />
//               ))}
//             </div>

//             <button
//               type="submit"
//               disabled={isLoading || otp.join("").length !== 6 || isSuccess}
//               className={`w-full py-3.5 rounded-xl font-prompt font-bold text-lg shadow-lg flex items-center justify-center transition-all duration-300
//                 ${
//                   isLoading || otp.join("").length !== 6 || isSuccess
//                     ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
//                     : "bg-orange-600 text-white hover:bg-orange-700 hover:shadow-orange-200 hover:-translate-y-1 active:scale-95"
//                 }`}
//             >
//               {isLoading ? (
//                 <>
//                   <Loader2 size={24} className="animate-spin mr-2" />
//                   กำลังตรวจสอบ...
//                 </>
//               ) : isSuccess ? (
//                 <span>ยืนยันสำเร็จ</span>
//               ) : (
//                 <span>ยืนยันรหัส OTP</span>
//               )}
//             </button>
//           </form>

//           <div className="mt-8 text-center">
//             <p className="text-gray-500 text-sm mb-2">ยังไม่ได้รับรหัส?</p>
//             {countdown > 0 ? (
//               <div className="flex items-center justify-center text-gray-400 text-sm bg-gray-100 rounded-full py-1.5 px-4 inline-block">
//                 <Timer size={14} className="mr-1.5 inline" />
//                 ส่งรหัสใหม่ได้ใน{" "}
//                 <span className="font-bold w-6 inline-block text-center">
//                   {countdown}
//                 </span>{" "}
//                 วินาที
//               </div>
//             ) : (
//               <button
//                 onClick={handleResend}
//                 className="inline-flex items-center text-orange-600 hover:text-orange-700 font-semibold text-sm transition-colors group"
//               >
//                 <RotateCcw
//                   size={16}
//                   className="mr-1.5 group-hover:rotate-180 transition-transform duration-500"
//                 />
//                 ส่งรหัส OTP ใหม่
//               </button>
//             )}
//           </div>

//           <div className="mt-8 pt-6 border-t border-gray-100">
//             <div className="flex flex-col items-center space-y-4">
//               <p className="text-xs text-gray-400 bg-orange-50/50 px-3 py-1 rounded-full border border-orange-100">
//                 <ShieldCheck size={12} className="inline mr-1 -mt-0.5" />
//                 รหัส OTP จะหมดอายุภายใน 5 นาที
//               </p>

//               <Link
//                 to="/login"
//                 className="flex items-center text-gray-400 hover:text-orange-600 transition-colors text-sm font-medium"
//               >
//                 <ArrowLeft size={16} className="mr-1" />
//                 กลับไปหน้าเข้าสู่ระบบ
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OtpVerification;
import React, { useState, useEffect, useRef } from "react";
import {
  ShieldCheck,
  Timer,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  RotateCcw,
  Loader2,
} from "lucide-react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "../lib/axios";

const OtpVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isShake, setIsShake] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [isLoaded, setIsLoaded] = useState(false);

  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }
    setIsLoaded(true);
  }, [email, navigate]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

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

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // --- ฟังก์ชันส่ง OTP ใหม่ พร้อมดัก Error ---
  const handleResend = async () => {
    if (countdown > 0) return;
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post("/forgot-password", { email });
      if (response.status === 200) {
        setCountdown(60);
        setOtp(["", "", "", "", "", ""]);
        alert("ส่งรหัส OTP ใหม่เรียบร้อยแล้ว");
      }
    } catch (err) {
      // ดัก Error จากการส่งใหม่
      const errorMsg =
        err.response?.data?.message ||
        "ไม่สามารถส่ง OTP ได้ กรุณาลองใหม่อีกครั้ง";
      setError(`Resend Error: ${errorMsg}`);
      console.error("Resend OTP Failed:", err.response || err);
    } finally {
      setIsLoading(false);
    }
  };

  // --- ฟังก์ชันยืนยัน OTP พร้อมดัก Error แบบละเอียด ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      setError("กรุณากรอกรหัส OTP ให้ครบ 6 หลัก");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      console.log("--- DEBUG: RUNNING NEW CODE ---");
      const response = await axios.post("/verify-otp", {
        email,
        otp: otpValue,
      });

      if (response.status === 200) {
        setIsSuccess(true);
        setTimeout(() => {
          navigate("/reset_password", { state: { email, otp: otpValue } });
        }, 1000);
      }
    } catch (err) {
      console.error("Verify OTP Error Details:", err);

      // ดัก Error ตามสถานะของ HTTP Response
      if (!err.response) {
        // กรณีปัญหา Network หรือ Server ล่ม (ยิงไปไม่ถึง)
        setError(
          "ไม่สามารถเชื่อมต่อ Server ได้ (Network Error) กรุณาเช็คอินเทอร์เน็ต",
        );
      } else if (err.response.status === 400) {
        setError("ข้อมูลไม่ถูกต้อง หรือรหัส OTP หมดอายุ");
      } else if (err.response.status === 422) {
        setError("ข้อมูลที่ส่งไปไม่ถูกต้อง (Validation Error)");
      } else if (err.response.status === 500) {
        setError("เกิดข้อผิดพลาดที่ระบบ Server (Internal Server Error)");
      } else {
        // Error อื่นๆ ที่ Backend ส่งมา
        setError(err.response.data?.message || "รหัส OTP ไม่ถูกต้อง");
      }

      setIsShake(true);
      setTimeout(() => setIsShake(false), 500);
      setOtp(["", "", "", "", "", ""]);
      if (inputRefs.current[0]) inputRefs.current[0].focus();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      {/* ส่วนแสดง UI เหมือนเดิม */}
      <div
        className={`w-full max-w-md bg-white rounded-3xl shadow-xl p-8 transition-all ${isLoaded ? "opacity-100" : "opacity-0"}`}
      >
        <h1 className="text-2xl font-bold text-center mb-2">ยืนยันรหัส OTP</h1>
        <p className="text-center text-gray-500 mb-6">ส่งไปยัง: {email}</p>

        {/* แสดง Error Message ที่ดักไว้ */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center gap-2 animate-shake">
            <AlertCircle size={18} />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div
            className={`flex justify-center gap-2 mb-6 ${isShake ? "animate-shake" : ""}`}
          >
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                disabled={isLoading || isSuccess}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl focus:border-orange-500 outline-none"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading || isSuccess}
            className="w-full py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 disabled:bg-gray-300 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "ยืนยันรหัส OTP"
            )}
          </button>
        </form>

        {/* ส่วนปุ่ม Resend และ Link กลับหน้า Login */}
        <div className="mt-6 text-center">
          {countdown > 0 ? (
            <p className="text-sm text-gray-400">
              ส่งรหัสใหม่ได้ใน {countdown} วินาที
            </p>
          ) : (
            <button
              onClick={handleResend}
              className="text-orange-600 font-bold text-sm"
            >
              ส่งรหัสใหม่
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
