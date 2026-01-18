import React, { useState, useEffect } from "react";
import {
  User,
  School,
  Phone,
  Mail,
  GraduationCap,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  ChevronDown,
  Lock,
  ShieldAlert,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const EditProfile = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // State สำหรับข้อมูลจริง
  const [formData, setFormData] = useState({
    firstname: "", // เปลี่ยน fullname เป็น first_name + last_name
    lastname: "",
    school: "",
    grade: "",
    phone: "",
    email: "", // Read-only
  });

  const [errors, setErrors] = useState({});

  // 1. โหลดข้อมูล User มาแสดงตอนเปิดหน้าเว็บ
  useEffect(() => {
    setIsLoaded(true);
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!token || !storedUser) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(storedUser);
    setFormData({
      firstname: user.first_name || "",
      lastname: user.last_name || "",
      school: user.school || "",
      grade: user.grade_level || "", // เช็คชื่อ field ใน DB ให้ตรง (grade_level หรือ grade)
      phone: user.phone || "",
      email: user.email || "",
    });
  }, [navigate]);

  // Validation Logic
  const validate = () => {
    const newErrors = {};
    if (!formData.firstname.trim()) newErrors.firstname = "กรุณากรอกชื่อจริง";
    if (!formData.lastname.trim()) newErrors.lastname = "กรุณากรอกนามสกุล";
    if (!formData.school.trim()) newErrors.school = "กรุณากรอกชื่อโรงเรียน";
    if (!formData.grade) newErrors.grade = "กรุณาเลือกระดับชั้น";

    // Simple Thai Phone Validation
    const phoneRegex = /^0[0-9]{9}$/;
    if (!formData.phone) {
      newErrors.phone = "กรุณากรอกเบอร์โทรศัพท์";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง (10 หลัก)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // 2. ฟังก์ชันบันทึกข้อมูล
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSaving(true);
      const token = localStorage.getItem("token");

      try {
        // ยิง API อัปเดตข้อมูล (สมมติว่าใช้ Route นี้)
        // **ต้องเช็ค Backend ว่าใช้ Route อะไร เช่น /api/user หรือ /api/update-profile**
        const response = await fetch(
          "http://127.0.0.1:8000/api/update-profile",
          {
            method: "POST", // หรือ PUT ตามที่ Backend กำหนด
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              first_name: formData.firstname,
              last_name: formData.lastname,
              phone: formData.phone,
              school: formData.school,
              grade_level: formData.grade,
            }),
          },
        );

        const data = await response.json();

        if (response.ok) {
          // อัปเดตข้อมูลใน LocalStorage ด้วย (สำคัญมาก เพื่อให้หน้าอื่นเห็นข้อมูลใหม่ทันที)
          const oldUser = JSON.parse(localStorage.getItem("user"));
          const newUser = { ...oldUser, ...data.user }; // data.user คือข้อมูลใหม่ที่ Backend ส่งกลับมา
          localStorage.setItem("user", JSON.stringify(newUser));

          setShowToast(true);
          setTimeout(() => {
            setShowToast(false);
            navigate("/user_dashboard"); // บันทึกเสร็จกลับหน้าหลัก
          }, 1500);
        } else {
          alert(data.message || "เกิดข้อผิดพลาดในการบันทึก");
        }
      } catch (error) {
        console.error("Update Error:", error);
        alert("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleCancel = () => {
    if (
      window.confirm(
        "คุณต้องการยกเลิกการแก้ไขใช่หรือไม่? ข้อมูลที่เปลี่ยนแปลงจะไม่ถูกบันทึก",
      )
    ) {
      navigate("/user_dashboard"); // กลับหน้าหลัก
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans text-gray-800">
      {/* Styles */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&family=Sarabun:wght@300;400;500;600&display=swap');
          body { font-family: 'Sarabun', sans-serif; }
          h1, h2, h3, h4, h5, h6, .font-prompt { font-family: 'Prompt', sans-serif; }
          
          .card-enter {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
          }
          .card-enter.active {
            opacity: 1;
            transform: translateY(0);
          }
          
          .input-group:focus-within svg { color: #ea580c; }
          
          /* Toast Animation */
          @keyframes slideUpFade {
            from { transform: translate(-50%, 100%); opacity: 0; }
            to { transform: translate(-50%, 0); opacity: 1; }
          }
          .toast-enter { animation: slideUpFade 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        `}
      </style>

      {/* Main Card */}
      <div
        className={`w-full max-w-2xl bg-white rounded-3xl shadow-xl shadow-orange-100/50 border border-white overflow-hidden card-enter ${isLoaded ? "active" : ""}`}
      >
        {/* Header */}
        <div className="bg-orange-50/50 p-8 border-b border-orange-100 flex items-center gap-6">
          <div className="w-20 h-20 bg-white rounded-full p-1 shadow-md border border-orange-100 relative group cursor-pointer">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.firstname}`}
              alt="Avatar"
              className="w-full h-full rounded-full bg-gray-50"
            />
            {/* ซ่อนปุ่มเปลี่ยนรูปไว้ก่อน เพราะยังไม่ได้ทำระบบ Upload */}
            {/* <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-white text-xs font-prompt">เปลี่ยนรูป</span>
            </div> */}
          </div>
          <div>
            <h2 className="font-prompt text-2xl font-bold text-gray-800">
              แก้ไขข้อมูลส่วนตัว
            </h2>
            <p className="text-gray-500 text-sm">
              อัปเดตข้อมูลของคุณให้เป็นปัจจุบัน
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Row 1: Firstname & Lastname */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 font-prompt ml-1">
                  ชื่อจริง <span className="text-red-500">*</span>
                </label>
                <div className="input-group relative transition-all duration-300">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 transition-colors duration-300">
                    <User size={20} />
                  </div>
                  <input
                    type="text"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-100 focus:bg-white transition-all duration-300 font-sarabun
                        ${errors.firstname ? "border-red-300" : "border-gray-200 focus:border-orange-500"}`}
                    placeholder="ชื่อจริง"
                  />
                </div>
                {errors.firstname && (
                  <p className="text-red-500 text-xs flex items-center mt-1 ml-1">
                    <AlertCircle size={12} className="mr-1" />{" "}
                    {errors.firstname}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 font-prompt ml-1">
                  นามสกุล <span className="text-red-500">*</span>
                </label>
                <div className="input-group relative transition-all duration-300">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 transition-colors duration-300">
                    <User size={20} />
                  </div>
                  <input
                    type="text"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-100 focus:bg-white transition-all duration-300 font-sarabun
                        ${errors.lastname ? "border-red-300" : "border-gray-200 focus:border-orange-500"}`}
                    placeholder="นามสกุล"
                  />
                </div>
                {errors.lastname && (
                  <p className="text-red-500 text-xs flex items-center mt-1 ml-1">
                    <AlertCircle size={12} className="mr-1" /> {errors.lastname}
                  </p>
                )}
              </div>
            </div>

            {/* Row 2: School & Grade */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* School */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 font-prompt ml-1">
                  โรงเรียน <span className="text-red-500">*</span>
                </label>
                <div className="input-group relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 transition-colors duration-300">
                    <School size={20} />
                  </div>
                  <input
                    type="text"
                    name="school"
                    value={formData.school}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-100 focus:bg-white transition-all duration-300 font-sarabun
                      ${errors.school ? "border-red-300" : "border-gray-200 focus:border-orange-500"}`}
                    placeholder="ชื่อโรงเรียน"
                  />
                </div>
                {errors.school && (
                  <p className="text-red-500 text-xs flex items-center mt-1 ml-1">
                    <AlertCircle size={12} className="mr-1" /> {errors.school}
                  </p>
                )}
              </div>

              {/* Grade */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 font-prompt ml-1">
                  ระดับชั้น <span className="text-red-500">*</span>
                </label>
                <div className="input-group relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 transition-colors duration-300">
                    <GraduationCap size={20} />
                  </div>
                  <select
                    name="grade"
                    value={formData.grade}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-10 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-100 focus:bg-white transition-all duration-300 font-sarabun appearance-none cursor-pointer
                      ${errors.grade ? "border-red-300" : "border-gray-200 focus:border-orange-500"}`}
                  >
                    <option value="">เลือกระดับชั้น</option>
                    <option value="m4">มัธยมศึกษาปีที่ 4</option>
                    <option value="m5">มัธยมศึกษาปีที่ 5</option>
                    <option value="m6">มัธยมศึกษาปีที่ 6</option>
                    <option value="vc">ปวช. / ปวส.</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                    <ChevronDown size={18} />
                  </div>
                </div>
                {errors.grade && (
                  <p className="text-red-500 text-xs flex items-center mt-1 ml-1">
                    <AlertCircle size={12} className="mr-1" /> {errors.grade}
                  </p>
                )}
              </div>
            </div>

            {/* Row 3: Phone & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Phone */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 font-prompt ml-1">
                  เบอร์โทรศัพท์ <span className="text-red-500">*</span>
                </label>
                <div className="input-group relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 transition-colors duration-300">
                    <Phone size={20} />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    maxLength={10}
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-100 focus:bg-white transition-all duration-300 font-sarabun
                      ${errors.phone ? "border-red-300" : "border-gray-200 focus:border-orange-500"}`}
                    placeholder="08xxxxxxxx"
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-xs flex items-center mt-1 ml-1">
                    <AlertCircle size={12} className="mr-1" /> {errors.phone}
                  </p>
                )}
              </div>

              {/* Email (Readonly) */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500 font-prompt ml-1 flex items-center">
                  อีเมล (บัญชีผู้ใช้){" "}
                  <Lock size={12} className="ml-2 opacity-50" />
                </label>
                <div className="relative group cursor-not-allowed">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Mail size={20} />
                  </div>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full pl-12 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 font-sarabun cursor-not-allowed select-none"
                  />
                  <div
                    className="absolute inset-0 bg-transparent"
                    title="ไม่สามารถแก้ไขอีเมลได้"
                  />
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-orange-50/50 rounded-xl p-4 flex items-start gap-3 border border-orange-100">
              <ShieldAlert
                size={20}
                className="text-orange-500 flex-shrink-0 mt-0.5"
              />
              <div className="text-sm text-gray-600 font-light">
                <span className="font-semibold text-orange-700 font-prompt block mb-1">
                  ความปลอดภัย
                </span>
                กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนบันทึก โดยเฉพาะชื่อ-นามสกุล
                และเบอร์โทรศัพท์ เพื่อสิทธิประโยชน์ในการเข้าร่วมกิจกรรม
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row gap-4 border-t border-gray-100">
              <button
                type="button"
                onClick={handleCancel}
                className="order-2 sm:order-1 flex-1 py-3.5 border-2 border-orange-100 text-orange-600 font-bold rounded-xl hover:bg-orange-50 hover:border-orange-200 transition-all duration-300 flex items-center justify-center font-prompt group"
              >
                <X
                  size={20}
                  className="mr-2 group-hover:rotate-90 transition-transform duration-300"
                />
                ยกเลิก
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className={`order-1 sm:order-2 flex-1 py-3.5 bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-200 hover:bg-orange-700 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center font-prompt
                  ${isSaving ? "opacity-80 cursor-wait" : ""}`}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    กำลังบันทึก...
                  </>
                ) : (
                  <>
                    <Save size={20} className="mr-2" />
                    บันทึกการแก้ไข
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 toast-enter">
          <div className="bg-gray-800 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 pr-8">
            <CheckCircle size={20} className="text-green-400" />
            <div>
              <p className="font-prompt font-bold text-sm">
                บันทึกข้อมูลเรียบร้อยแล้ว
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
