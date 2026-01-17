import React, { useState, useEffect } from "react";
import {
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  KeyRound,
  AlertCircle,
  Loader2,
  Check,
} from "lucide-react";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [strength, setStrength] = useState(0);
  const [isMatch, setIsMatch] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Trigger Entrance Animation
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Calculate Password Strength
  useEffect(() => {
    let score = 0;
    if (password.length >= 8) score += 1; // Length check
    if (password.length >= 12) score += 1; // Extra length
    if (/[A-Z]/.test(password)) score += 1; // Uppercase
    if (/[0-9]/.test(password)) score += 1; // Number
    if (/[^A-Za-z0-9]/.test(password)) score += 1; // Special char

    // Cap score at 4 for bar calculation
    setStrength(Math.min(score, 4));

    // Check match real-time
    if (confirmPassword) {
      setIsMatch(password === confirmPassword);
    }
  }, [password, confirmPassword]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password.length < 8) return;
    if (password !== confirmPassword) {
      setIsMatch(false);
      return;
    }

    setIsLoading(true);

    // Simulate API Call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1500);
  };

  const getStrengthColor = () => {
    if (strength <= 1) return "bg-red-400";
    if (strength === 2) return "bg-orange-400";
    if (strength === 3) return "bg-yellow-400";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (password.length === 0) return "";
    if (strength <= 1) return "อ่อน";
    if (strength === 2) return "ปานกลาง";
    if (strength === 3) return "ดี";
    return "ดีมาก";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden font-sans text-gray-800">
      {/* --- Styles --- */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&family=Sarabun:wght@300;400;500;600&display=swap');
          body { font-family: 'Sarabun', sans-serif; }
          h1, h2, h3, h4, h5, h6, .font-prompt { font-family: 'Prompt', sans-serif; }

          /* Entrance Animation */
          .card-enter {
            opacity: 0;
            transform: translateY(30px) scale(0.98);
            transition: opacity 0.7s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
          }
          .card-enter.active {
            opacity: 1;
            transform: translateY(0) scale(1);
          }

          /* Smooth Width Transition for Strength Bar */
          .transition-width { transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.5s ease; }
          
          /* Success Scale Animation */
          @keyframes scaleCheck {
            0% { transform: scale(0); opacity: 0; }
            60% { transform: scale(1.2); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }
          .animate-scale-check { animation: scaleCheck 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        `}
      </style>

      {/* --- Background --- */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white via-orange-50 to-white"></div>
        {/* Decorative Shapes */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-orange-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div
          className="absolute bottom-10 right-10 w-40 h-40 bg-yellow-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* --- Main Card --- */}
      <div
        className={`relative z-10 w-full max-w-md px-4 card-enter ${
          isLoaded ? "active" : ""
        }`}
      >
        <div className="bg-white rounded-[2rem] shadow-2xl shadow-orange-100/50 border border-white p-8 md:p-10 relative overflow-hidden">
          {/* Header Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-orange-500"></div>

          {!isSuccess ? (
            /* --- Reset Form State --- */
            <>
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 shadow-sm border border-orange-100">
                  <div className="relative">
                    <Lock size={32} />
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 border border-orange-100">
                      <KeyRound size={14} className="text-orange-400" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center mb-8">
                <h1 className="font-prompt text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  ตั้งรหัสผ่านใหม่
                </h1>
                <p className="text-gray-500 font-light text-sm">
                  กรุณากำหนดรหัสผ่านใหม่สำหรับบัญชีของคุณ <br />
                  เพื่อความปลอดภัยในการใช้งาน
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* New Password */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 font-prompt ml-1">
                    รหัสผ่านใหม่
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-orange-500 transition-colors">
                      <Lock size={18} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all font-sarabun"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer focus:outline-none"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700 font-prompt ml-1">
                    ยืนยันรหัสผ่านใหม่
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-orange-500 transition-colors">
                      <ShieldCheck size={18} />
                    </div>
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full pl-10 pr-10 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:bg-white focus:ring-2 transition-all font-sarabun
                        ${
                          !isMatch && confirmPassword
                            ? "border-red-300 focus:ring-red-200 focus:border-red-500"
                            : "border-gray-200 focus:ring-orange-200 focus:border-orange-500"
                        }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer focus:outline-none"
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {/* Mismatch Error */}
                  {!isMatch && confirmPassword && (
                    <div className="flex items-center text-red-500 text-xs mt-1 animate-pulse ml-1">
                      <AlertCircle size={12} className="mr-1" />
                      รหัสผ่านไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง
                    </div>
                  )}
                </div>

                {/* Password Strength Meter */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mt-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-500 font-medium">
                      ความปลอดภัยของรหัสผ่าน
                    </span>
                    <span
                      className={`text-xs font-bold transition-colors duration-300 
                        ${
                          strength <= 1
                            ? "text-red-500"
                            : strength === 2
                            ? "text-orange-500"
                            : strength === 3
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                    >
                      {getStrengthText()}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden flex">
                    <div
                      className={`h-full ${getStrengthColor()} transition-width`}
                      style={{ width: `${(strength / 4) * 100}%` }}
                    ></div>
                  </div>
                  <ul className="mt-3 space-y-1">
                    <li
                      className={`text-xs flex items-center ${
                        password.length >= 8
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}
                    >
                      <div
                        className={`w-3 h-3 rounded-full flex items-center justify-center mr-2 border ${
                          password.length >= 8
                            ? "bg-green-100 border-green-200"
                            : "border-gray-300"
                        }`}
                      >
                        {password.length >= 8 && <Check size={8} />}
                      </div>
                      ความยาวอย่างน้อย 8 ตัวอักษร
                    </li>
                  </ul>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={
                    isLoading ||
                    password.length < 8 ||
                    !isMatch ||
                    !confirmPassword
                  }
                  className={`w-full py-3.5 rounded-xl font-prompt font-bold text-lg shadow-lg flex items-center justify-center transition-all duration-300 mt-4
                    ${
                      isLoading ||
                      password.length < 8 ||
                      !isMatch ||
                      !confirmPassword
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                        : "bg-orange-600 text-white hover:bg-orange-700 hover:shadow-orange-200 hover:-translate-y-1 active:scale-95"
                    }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={24} className="animate-spin mr-2" />
                      กำลังบันทึก...
                    </>
                  ) : (
                    <span>ยืนยันการเปลี่ยนรหัสผ่าน</span>
                  )}
                </button>
              </form>
            </>
          ) : (
            /* --- Success State --- */
            <div className="text-center py-8">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-check">
                <CheckCircle2 size={48} className="text-green-600" />
              </div>

              <h2 className="font-prompt text-2xl font-bold text-gray-900 mb-3 animate-fade-in-up">
                ตั้งรหัสผ่านสำเร็จ!
              </h2>
              <p className="text-gray-500 font-light mb-8 animate-fade-in-up delay-100">
                คุณสามารถใช้รหัสผ่านใหม่
                <br />
                ในการเข้าสู่ระบบได้ทันที
              </p>

              <button className="w-full py-3.5 bg-orange-600 text-white rounded-xl font-prompt font-bold shadow-lg shadow-orange-200 hover:bg-orange-700 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center group animate-fade-in-up delay-200">
                กลับไปหน้าเข้าสู่ระบบ
                <ArrowRight
                  size={20}
                  className="ml-2 group-hover:translate-x-1 transition-transform"
                />
              </button>

              <p className="mt-8 text-xs text-gray-400 bg-gray-50 py-2 rounded-lg inline-block px-4">
                <ShieldCheck size={12} className="inline mr-1 -mt-0.5" />
                กรุณาเก็บรักษารหัสผ่านไว้เป็นความลับ
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
