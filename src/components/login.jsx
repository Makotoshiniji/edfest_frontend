import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  Home,
  ChevronLeft,
} from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  // Trigger animation on mount
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate API Call
    setTimeout(() => {
      setIsLoading(false);
      if (email === "" || password === "") {
        setError("กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน");
      } else {
        // Mock Success (In real app, redirect here)
        alert("เข้าสู่ระบบสำเร็จ (Demo)");
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-gray-50 font-sans text-gray-800">
      {/* --- Styles & Fonts --- */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&family=Sarabun:wght@300;400;500;600&display=swap');
          
          body { font-family: 'Sarabun', sans-serif; }
          h1, h2, h3, h4, h5, h6, .font-prompt { font-family: 'Prompt', sans-serif; }

          /* Background Animation */
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          .animate-blob {
            animation: blob 10s infinite;
          }
          .animation-delay-2000 { animation-delay: 2s; }
          .animation-delay-4000 { animation-delay: 4s; }

          /* Card Entry Animation */
          .card-enter {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
            transition: opacity 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
          }
          .card-enter.active {
            opacity: 1;
            transform: scale(1) translateY(0);
          }

          /* Input Focus Transition */
          .input-group { transition: all 0.3s ease; }
          .input-group:focus-within { transform: translateY(-2px); }
          
          /* Error Slide In */
          @keyframes slideDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-slide-down { animation: slideDown 0.4s ease-out forwards; }
        `}
      </style>

      {/* --- Animated Background --- */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-orange-50 via-white to-gray-50 z-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-4000"></div>

        {/* Subtle Grid Pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(#f97316 0.5px, transparent 0.5px)",
            backgroundSize: "24px 24px",
            opacity: 0.05,
          }}
        ></div>
      </div>

      {/* --- Main Card --- */}
      <div
        className={`relative z-10 w-full max-w-md p-6 sm:p-8 card-enter ${
          isLoaded ? "active" : ""
        }`}
      >
        {/* Back Button (Optional UX improvement) */}
        <a
          href="#"
          className="inline-flex items-center text-gray-400 hover:text-orange-600 mb-6 transition-colors text-sm font-prompt group"
        >
          <ChevronLeft
            size={16}
            className="mr-1 group-hover:-translate-x-1 transition-transform"
          />
          กลับหน้าหลัก
        </a>

        <div className="bg-white rounded-[2rem] shadow-2xl shadow-orange-100/50 border border-white p-8 sm:p-10 relative overflow-hidden">
          {/* Top Decor Line */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 to-orange-600"></div>

          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-50 rounded-2xl text-orange-600 mb-4 shadow-sm transform hover:rotate-6 transition-transform duration-500 cursor-default">
              <GraduationCap size={32} />
            </div>
            <h2 className="font-prompt text-2xl font-bold text-gray-800 mb-2">
              เข้าสู่ระบบ
            </h2>
            <p className="font-sarabun text-gray-500 text-sm">
              เข้าสู่ระบบเพื่อสมัครกิจกรรม Open House KKU
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm animate-slide-down">
              <AlertCircle size={18} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 font-prompt ml-1">
                อีเมล / เบอร์โทรศัพท์
              </label>
              <div className="input-group relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Mail size={20} />
                </div>
                <input
                  type="text"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all duration-300 placeholder-gray-400 font-sarabun"
                  placeholder="example@kku.ac.th"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700 font-prompt ml-1">
                  รหัสผ่าน
                </label>
              </div>
              <div className="input-group relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Lock size={20} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-11 pr-11 py-3 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all duration-300 placeholder-gray-400 font-sarabun"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-orange-600 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div className="flex justify-end pt-1">
                <a
                  href="#"
                  className="text-sm text-orange-500 font-medium hover:text-orange-600 relative group font-prompt"
                >
                  ลืมรหัสผ่าน?
                  <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-orange-600 transition-all duration-300 group-hover:w-full"></span>
                </a>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 px-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-lg shadow-orange-200 transform transition-all duration-300 flex items-center justify-center space-x-2 font-prompt text-lg group ${
                isLoading
                  ? "opacity-80 cursor-not-allowed"
                  : "hover:-translate-y-1 hover:shadow-orange-300"
              }`}
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <>
                  <span>เข้าสู่ระบบ</span>
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </button>
          </form>

          {/* Footer / Register Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm font-sarabun">
              ยังไม่มีบัญชีผู้ใช้?{" "}
              <a
                href="#"
                className="font-bold text-orange-600 hover:text-orange-700 transition-colors font-prompt"
              >
                สมัครสมาชิกใหม่
              </a>
            </p>
          </div>
        </div>

        {/* Footer Copyright */}
        <p className="text-center text-gray-400 text-xs mt-6 font-sarabun">
          © 2024 Faculty of Education, KKU.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
