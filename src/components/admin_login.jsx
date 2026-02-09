import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
// 1. เพิ่ม Import
import { useNavigate, Link } from "react-router-dom";

const AdminLogin = () => {
  const navigate = useNavigate(); // ประกาศ navigate
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    // เช็คว่าถ้ามี Token อยู่แล้ว ให้เด้งไป Dashboard เลยไหม? (Optional)
    const token = localStorage.getItem("admin_token");
    if (token) {
      // navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    setIsLoading(true);

    try {
      // 2. ยิง API Login ของ Admin
      const response = await fetch("http://76.13.179.18/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Login สำเร็จ
        setIsSuccess(true);

        // เก็บ Token แยกสำหรับ Admin (สำคัญ! อย่าใช้ชื่อ 'token' ซ้ำกับ User)
        localStorage.setItem("admin_token", data.token);
        localStorage.setItem("admin_user", JSON.stringify(data.admin));

        // Redirect ไป Admin Dashboard
        setTimeout(() => {
          navigate("/admin_dashboard");
        }, 1000);
      } else {
        // Login ไม่ผ่าน
        setError(data.message || "อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        setIsLoading(false); // หยุดโหลดเพื่อให้กรอกใหม่ได้
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden font-sans text-gray-800">
      {/* --- Styles --- */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&family=Sarabun:wght@300;400;500;600&display=swap');
          body { font-family: 'Sarabun', sans-serif; }
          h1, h2, h3, h4, h5, h6, .font-prompt { font-family: 'Prompt', sans-serif; }

          .card-enter {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
            transition: opacity 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
          }
          .card-enter.active {
            opacity: 1;
            transform: scale(1) translateY(0);
          }

          .input-group:focus-within {
            border-color: #ea580c;
            box-shadow: 0 0 0 4px rgba(234, 88, 12, 0.1);
          }

          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
            20%, 40%, 60%, 80% { transform: translateX(4px); }
          }
          .animate-shake { animation: shake 0.4s ease-in-out; }
        `}
      </style>

      {/* --- Background --- */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/80 via-white to-gray-50"></div>
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(#ea580c 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        ></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gray-200 rounded-full blur-3xl opacity-40"></div>
      </div>

      {/* --- Main Card --- */}
      <div
        className={`relative z-10 w-full max-w-md px-4 card-enter ${isLoaded ? "active" : ""}`}
      >
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 to-orange-600"></div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-50 rounded-2xl text-orange-600 mb-4 shadow-sm border border-orange-100">
              <ShieldCheck size={32} strokeWidth={2} />
            </div>
            <h1 className="font-prompt text-2xl font-bold text-gray-900 tracking-tight">
              Admin Portal
            </h1>
            <p className="text-gray-500 text-sm mt-1 font-light">
              ระบบผู้ดูแลกิจกรรมเปิดบ้านคณะศึกษาศาสตร์
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-lg flex items-center text-red-600 text-sm animate-shake">
              <AlertCircle size={18} className="mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Message */}
          {isSuccess && (
            <div className="mb-6 p-3 bg-green-50 border border-green-100 rounded-lg flex items-center text-green-700 text-sm">
              <CheckCircle2 size={18} className="mr-2 flex-shrink-0" />
              <span>เข้าสู่ระบบสำเร็จ กำลังพาคุณไปยัง Dashboard...</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 font-prompt ml-1">
                Email
              </label>
              <div className="input-group relative flex items-center bg-gray-50 border border-gray-200 rounded-xl transition-all duration-200">
                <div className="pl-4 text-gray-400">
                  <Mail size={20} />
                </div>
                <input
                  type="email" // เปลี่ยน type เป็น email
                  disabled={isLoading || isSuccess}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-transparent border-none focus:ring-0 text-gray-800 placeholder-gray-400 font-sarabun"
                  placeholder="admin@edfest.com"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 font-prompt ml-1">
                Password
              </label>
              <div className="input-group relative flex items-center bg-gray-50 border border-gray-200 rounded-xl transition-all duration-200">
                <div className="pl-4 text-gray-400">
                  <Lock size={20} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  disabled={isLoading || isSuccess}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-transparent border-none focus:ring-0 text-gray-800 placeholder-gray-400 font-sarabun"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="pr-4 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || isSuccess}
              className={`w-full py-3.5 rounded-xl font-prompt font-bold text-base shadow-lg flex items-center justify-center transition-all duration-300 mt-2
                ${
                  isLoading || isSuccess
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                    : "bg-orange-600 text-white hover:bg-orange-700 hover:shadow-orange-200 hover:-translate-y-0.5 active:scale-95"
                }`}
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin mr-2" />
                  กำลังตรวจสอบ...
                </>
              ) : isSuccess ? (
                <>
                  <Loader2 size={20} className="animate-spin mr-2" />
                  Redirecting...
                </>
              ) : (
                <span>เข้าสู่ระบบ</span>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-8 text-center border-t border-gray-100 pt-6">
            <Link
              to="/" // เปลี่ยน Link กลับหน้าแรก
              className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium text-sm transition-colors group"
            >
              <ArrowLeft
                size={16}
                className="mr-2 group-hover:-translate-x-1 transition-transform duration-300"
              />
              กลับสู่หน้าเว็บไซต์หลัก
            </Link>
          </div>
        </div>

        <p className="text-center text-gray-400 text-xs mt-6 font-light">
          &copy; 2026 Faculty of Education, Khon Kaen University. <br />
          Restricted Access Area.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
