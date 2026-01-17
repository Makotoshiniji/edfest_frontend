import React, { useState, useEffect } from "react";
import {
  User,
  School,
  Phone,
  Mail,
  Lock,
  Check,
  ChevronDown,
  AlertCircle,
  ArrowRight,
  GraduationCap,
  Loader2,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate(); // 1. แก้ไข: เพิ่มบรรทัดนี้
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    school: "",
    grade: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  // Error State
  const [errors, setErrors] = useState({});

  // Trigger Entry Animation
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Validation Logic
  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "password":
        if (value.length < 8)
          error = "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร";
        break;
      case "confirmPassword":
        if (value !== formData.password) error = "รหัสผ่านไม่ตรงกัน";
        break;
      case "phone":
        if (value && !/^\d{10}$/.test(value))
          error = "กรุณากรอกเบอร์โทรศัพท์ 10 หลัก";
        break;
      case "email":
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          error = "รูปแบบอีเมลไม่ถูกต้อง";
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;

    setFormData((prev) => ({ ...prev, [name]: val }));

    // Real-time validation for specific fields
    if (
      name === "password" ||
      name === "confirmPassword" ||
      name === "email" ||
      name === "phone"
    ) {
      const errorMsg = validateField(name, val);
      setErrors((prev) => ({ ...prev, [name]: errorMsg }));

      // Re-validate confirm password if password changes
      if (name === "password" && formData.confirmPassword) {
        const matchError =
          val !== formData.confirmPassword ? "รหัสผ่านไม่ตรงกัน" : "";
        setErrors((prev) => ({ ...prev, confirmPassword: matchError }));
      }
    } else {
      // Clear error for other fields when typing
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all required fields
    const newErrors = {};

    // 2. แก้ไข: เปลี่ยนการเช็ค fullname เป็น firstname และ lastname
    if (!formData.firstname) newErrors.firstname = "กรุณากรอกชื่อจริง";
    if (!formData.lastname) newErrors.lastname = "กรุณากรอกนามสกุล";

    if (!formData.school) newErrors.school = "กรุณากรอกชื่อโรงเรียน";
    if (!formData.grade) newErrors.grade = "กรุณาระเลือกระดับชั้น";
    if (!formData.phone) newErrors.phone = "กรุณากรอกเบอร์โทรศัพท์";
    if (!formData.email) newErrors.email = "กรุณากรอกอีเมล";
    if (!formData.password) newErrors.password = "กรุณากำหนดรหัสผ่าน";
    if (formData.password.length < 8)
      newErrors.password = "รหัสผ่านต้องอย่างน้อย 8 ตัวอักษร";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "รหัสผ่านไม่ตรงกัน";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. ยิง API ไปที่ Laravel
      const response = await fetch("http://127.0.0.1:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        // 2. Mapping ตัวแปรให้ตรงกับ Database (Snake Case)
        body: JSON.stringify({
          first_name: formData.firstname,
          last_name: formData.lastname,
          email: formData.email,
          phone: formData.phone,
          school: formData.school,
          grade_level: formData.grade, // ใน DB ชื่อ grade_level
          password: formData.password,
          password_confirmation: formData.confirmPassword,
          is_term_accepted: formData.terms,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // 3. สมัครสำเร็จ -> เก็บ Token -> ไปหน้า Dashboard
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        alert("สมัครสมาชิกสำเร็จ!");
        navigate("/userdashboard");
      } else {
        // 4. ถ้า Error (เช่น อีเมลซ้ำ)
        if (data.errors) {
          const apiErrors = {};
          if (data.errors.email) apiErrors.email = data.errors.email[0];
          if (data.errors.phone) apiErrors.phone = data.errors.phone[0];
          // เพิ่ม error field อื่นๆ ถ้ามี
          setErrors(apiErrors);
        } else {
          alert(data.message || "เกิดข้อผิดพลาด");
        }
      }
    } catch (error) {
      console.error("Register Error:", error);
      alert("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 bg-gray-50 font-sans text-gray-800 overflow-hidden">
      {/* --- Styles --- */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&family=Sarabun:wght@300;400;500;600&display=swap');
          
          body { font-family: 'Sarabun', sans-serif; }
          h1, h2, h3, h4, h5, h6, .font-prompt { font-family: 'Prompt', sans-serif; }

          /* Background Animation */
          @keyframes float-blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -30px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          .animate-blob { animation: float-blob 15s infinite ease-in-out; }
          .delay-2000 { animation-delay: 2s; }
          
          /* Card Entrance */
          .card-enter {
            opacity: 0;
            transform: translateY(40px) scale(0.98);
            transition: opacity 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
          }
          .card-enter.active {
            opacity: 1;
            transform: translateY(0) scale(1);
          }

          /* Input Animations */
          .input-wrapper:focus-within .input-icon { color: #ea580c; }
          .input-wrapper:focus-within { transform: translateY(-1px); }
          
          /* Error Slide */
          @keyframes slideDownFade {
            from { opacity: 0; transform: translateY(-5px); max-height: 0; }
            to { opacity: 1; transform: translateY(0); max-height: 20px; }
          }
          .error-msg { animation: slideDownFade 0.3s ease-out forwards; }
        `}
      </style>

      {/* --- Animated Background --- */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-200/40 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-yellow-200/40 rounded-full blur-3xl animate-blob delay-2000"></div>
        <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px]"></div>
      </div>

      {/* --- Main Card --- */}
      <div
        className={`relative z-10 w-full max-w-2xl bg-white rounded-3xl shadow-2xl shadow-orange-100 border border-white p-8 md:p-12 card-enter ${
          isLoaded ? "active" : ""
        }`}
      >
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl text-white shadow-lg mb-4 transform hover:rotate-12 transition-transform duration-500">
            <GraduationCap size={32} />
          </div>
          <h2 className="font-prompt text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            สมัครเข้าร่วมกิจกรรม
          </h2>
          <p className="font-sarabun text-gray-500">
            Education Open House KKU 2026
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: First Name & Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 font-prompt ml-1">
                ชื่อจริง <span className="text-red-500">*</span>
              </label>
              <div className="input-wrapper relative transition-all duration-300">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 input-icon transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border ${
                    errors.firstname
                      ? "border-red-300 focus:ring-red-200"
                      : "border-gray-200 focus:ring-orange-200 focus:border-orange-500"
                  } rounded-xl focus:outline-none focus:ring-4 transition-all duration-300 font-sarabun`}
                  placeholder="กรอกชื่อจริง"
                />
              </div>
              {errors.firstname && (
                <p className="text-xs text-red-500 flex items-center mt-1 error-msg">
                  <AlertCircle size={12} className="mr-1" />
                  {errors.firstname}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 font-prompt ml-1">
                นามสกุล <span className="text-red-500">*</span>
              </label>
              <div className="input-wrapper relative transition-all duration-300">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 input-icon transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border ${
                    errors.lastname
                      ? "border-red-300 focus:ring-red-200"
                      : "border-gray-200 focus:ring-orange-200 focus:border-orange-500"
                  } rounded-xl focus:outline-none focus:ring-4 transition-all duration-300 font-sarabun`}
                  placeholder="กรอกนามสกุล"
                />
              </div>
              {errors.lastname && (
                <p className="text-xs text-red-500 flex items-center mt-1 error-msg">
                  <AlertCircle size={12} className="mr-1" />
                  {errors.lastname}
                </p>
              )}
            </div>
          </div>

          {/* Row 2: School & Grade */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* School */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 font-prompt ml-1">
                โรงเรียน <span className="text-red-500">*</span>
              </label>
              <div className="input-wrapper relative transition-all duration-300">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 input-icon transition-colors">
                  <School size={18} />
                </div>
                <input
                  type="text"
                  name="school"
                  value={formData.school}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border ${
                    errors.school
                      ? "border-red-300 focus:ring-red-200"
                      : "border-gray-200 focus:ring-orange-200 focus:border-orange-500"
                  } rounded-xl focus:outline-none focus:ring-4 transition-all duration-300 font-sarabun`}
                  placeholder="ชื่อโรงเรียนของน้อง"
                />
              </div>
              {errors.school && (
                <p className="text-xs text-red-500 flex items-center mt-1 error-msg">
                  <AlertCircle size={12} className="mr-1" />
                  {errors.school}
                </p>
              )}
            </div>

            {/* Grade Dropdown */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 font-prompt ml-1">
                ระดับชั้น <span className="text-red-500">*</span>
              </label>
              <div className="input-wrapper relative transition-all duration-300">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 input-icon transition-colors">
                  <GraduationCap size={18} />
                </div>
                <select
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-10 py-2.5 bg-gray-50 border ${
                    errors.grade
                      ? "border-red-300 focus:ring-red-200"
                      : "border-gray-200 focus:ring-orange-200 focus:border-orange-500"
                  } rounded-xl focus:outline-none focus:ring-4 transition-all duration-300 font-sarabun appearance-none cursor-pointer`}
                >
                  <option value="">เลือกระดับชั้น</option>
                  <option value="m4">มัธยมศึกษาปีที่ 4</option>
                  <option value="m5">มัธยมศึกษาปีที่ 5</option>
                  <option value="m6">มัธยมศึกษาปีที่ 6</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                  <ChevronDown size={18} />
                </div>
              </div>
              {errors.grade && (
                <p className="text-xs text-red-500 flex items-center mt-1 error-msg">
                  <AlertCircle size={12} className="mr-1" />
                  {errors.grade}
                </p>
              )}
            </div>
          </div>

          {/* Row 3: Phone & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Phone */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 font-prompt ml-1">
                เบอร์โทรศัพท์ <span className="text-red-500">*</span>
              </label>
              <div className="input-wrapper relative transition-all duration-300">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 input-icon transition-colors">
                  <Phone size={18} />
                </div>
                <input
                  type="tel"
                  name="phone"
                  maxLength={10}
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border ${
                    errors.phone
                      ? "border-red-300 focus:ring-red-200"
                      : "border-gray-200 focus:ring-orange-200 focus:border-orange-500"
                  } rounded-xl focus:outline-none focus:ring-4 transition-all duration-300 font-sarabun`}
                  placeholder="08X-XXX-XXXX"
                />
              </div>
              {errors.phone && (
                <p className="text-xs text-red-500 flex items-center mt-1 error-msg">
                  <AlertCircle size={12} className="mr-1" />
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 font-prompt ml-1">
                อีเมล (Username) <span className="text-red-500">*</span>
              </label>
              <div className="input-wrapper relative transition-all duration-300">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 input-icon transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border ${
                    errors.email
                      ? "border-red-300 focus:ring-red-200"
                      : "border-gray-200 focus:ring-orange-200 focus:border-orange-500"
                  } rounded-xl focus:outline-none focus:ring-4 transition-all duration-300 font-sarabun`}
                  placeholder="example@email.com"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 flex items-center mt-1 error-msg">
                  <AlertCircle size={12} className="mr-1" />
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          {/* Row 4: Passwords */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Password */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 font-prompt ml-1">
                รหัสผ่าน <span className="text-red-500">*</span>
              </label>
              <div className="input-wrapper relative transition-all duration-300">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 input-icon transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border ${
                    errors.password
                      ? "border-red-300 focus:ring-red-200"
                      : "border-gray-200 focus:ring-orange-200 focus:border-orange-500"
                  } rounded-xl focus:outline-none focus:ring-4 transition-all duration-300 font-sarabun`}
                  placeholder="อย่างน้อย 8 ตัวอักษร"
                />
              </div>
              {errors.password ? (
                <p className="text-xs text-red-500 flex items-center mt-1 error-msg">
                  <AlertCircle size={12} className="mr-1" />
                  {errors.password}
                </p>
              ) : (
                <p className="text-xs text-gray-400 mt-1 pl-1">
                  ต้องมีความยาวอย่างน้อย 8 ตัวอักษร
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 font-prompt ml-1">
                ยืนยันรหัสผ่าน <span className="text-red-500">*</span>
              </label>
              <div className="input-wrapper relative transition-all duration-300">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 input-icon transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border ${
                    errors.confirmPassword
                      ? "border-red-300 focus:ring-red-200"
                      : "border-gray-200 focus:ring-orange-200 focus:border-orange-500"
                  } rounded-xl focus:outline-none focus:ring-4 transition-all duration-300 font-sarabun`}
                  placeholder="กรอกรหัสผ่านอีกครั้ง"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 flex items-center mt-1 error-msg">
                  <AlertCircle size={12} className="mr-1" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="pt-2">
            <label className="flex items-start space-x-3 cursor-pointer group">
              <div className="relative flex items-center mt-0.5">
                <input
                  type="checkbox"
                  name="terms"
                  checked={formData.terms}
                  onChange={handleChange}
                  className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-md checked:bg-orange-600 checked:border-orange-600 focus:ring-2 focus:ring-orange-200 transition-all duration-200 cursor-pointer"
                />
                <Check
                  size={14}
                  className="absolute text-white left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 transition-opacity duration-200 pointer-events-none"
                />
              </div>
              <span className="text-sm text-gray-600 font-sarabun select-none group-hover:text-gray-800 transition-colors">
                ข้าพเจ้ายอมรับ{" "}
                <Link
                  to="#"
                  className="text-orange-600 underline decoration-orange-300 hover:decoration-orange-600"
                >
                  เงื่อนไขและข้อตกลงการใช้งาน
                </Link>{" "}
                รวมถึงนโยบายความเป็นส่วนตัว
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={!formData.terms || isSubmitting}
              className={`w-full py-3.5 rounded-xl font-bold font-prompt text-lg shadow-lg flex items-center justify-center transition-all duration-300
              ${
                !formData.terms || isSubmitting
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                  : "bg-orange-600 text-white hover:bg-orange-700 hover:shadow-orange-200 hover:-translate-y-1 hover:shadow-xl active:scale-95"
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={24} className="animate-spin mr-2" />
                  กำลังสมัครสมาชิก...
                </>
              ) : (
                <>
                  สมัครสมาชิก
                  <ArrowRight
                    size={20}
                    className={`ml-2 transition-transform duration-300 ${
                      formData.terms ? "group-hover:translate-x-1" : ""
                    }`}
                  />
                </>
              )}
            </button>
          </div>

          {/* Login Link */}
          <div className="text-center pt-2">
            <p className="text-gray-500 text-sm font-sarabun">
              มีบัญชีผู้ใช้แล้ว?{" "}
              <Link
                to="/login"
                className="font-bold text-orange-600 hover:text-orange-700 transition-colors font-prompt"
              >
                เข้าสู่ระบบ
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
