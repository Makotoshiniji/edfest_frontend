import React, { useState, useEffect } from "react";
import {
  Home,
  User,
  Calendar,
  LogOut,
  Edit3,
  MapPin,
  Phone,
  Mail,
  School,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Menu,
  X,
  Clock,
  BookOpen,
  GraduationCap,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
// 1. Import axios ที่ตั้งค่าไว้
import axios from "../lib/axios";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  // State สำหรับข้อมูลจริง
  const [user, setUser] = useState(null);
  const [selectedActivities, setSelectedActivities] = useState([]);

  const totalRounds = 4;
  const currentSelection = selectedActivities.length;
  const isComplete = currentSelection >= totalRounds;

  useEffect(() => {
    // 2. โหลดข้อมูล User และ Registrations ผ่าน Axios
    const fetchData = async () => {
      try {
        // Parallel requests
        const [userRes, regRes] = await Promise.all([
          // ✅ แก้ไข: เอา /api ออก (เพราะใน axios.js มีให้แล้ว)
          axios.get("/user"),
          axios.get("/my-registrations"),
        ]);

        setUser(userRes.data);
        setSelectedActivities(regRes.data);

        // อัปเดต localStorage เผื่อไว้ใช้ที่อื่น (Optional)
        localStorage.setItem("user", JSON.stringify(userRes.data));
      } catch (error) {
        console.error("Auth Error:", error);
        if (error.response && error.response.status === 401) {
          // Session หมดอายุ หรือยังไม่ได้ Login
          localStorage.removeItem("user");
          navigate("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Helpers
  const handleLogout = async () => {
    if (window.confirm("คุณต้องการออกจากระบบใช่หรือไม่?")) {
      try {
        // ✅ แก้ไข: เอา /api ออก
        await axios.post("/logout");
      } catch (err) {
        console.error("Logout failed", err);
      } finally {
        // ลบข้อมูลฝั่ง Client และเด้งไปหน้า Login
        localStorage.removeItem("user");
        localStorage.removeItem("auth_token"); // ลบ Token ด้วยถ้ามี
        navigate("/login");
      }
    }
  };

  const handleEditProfile = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const SidebarItem = ({ id, icon: Icon, label, onClick }) => (
    <button
      onClick={() => {
        onClick(id);
        setIsSidebarOpen(false);
      }}
      className={`w-full flex items-center space-x-3 px-6 py-4 transition-all duration-300 relative group
        ${
          activeTab === id
            ? "text-orange-600 bg-orange-50 font-semibold border-r-4 border-orange-600"
            : "text-gray-500 hover:text-orange-500 hover:bg-gray-50 font-medium"
        }`}
    >
      <Icon
        size={20}
        className={`transition-transform duration-300 ${
          activeTab === id ? "scale-110" : "group-hover:scale-110"
        }`}
      />
      <span>{label}</span>
    </button>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400 font-prompt animate-pulse">
            กำลังโหลดข้อมูล...
          </p>
        </div>
      </div>
    );
  }

  // ฟังก์ชันสำหรับลบการจอง
  const handleRemove = async (roundId) => {
    if (!window.confirm("คุณต้องการยกเลิกการจองรอบนี้ใช่หรือไม่?")) return;

    try {
      // กรองเอาเฉพาะตัวที่ *ไม่ได้* ถูกลบ
      const updatedList = selectedActivities.filter(
        (activity) => activity.round_id !== roundId,
      );

      // แปลงข้อมูลเพื่อส่งกลับไป Sync ใหม่
      const payload = updatedList.map((item) => ({
        round_id: item.round_id,
        station_id: item.station_id,
      }));

      // ✅ แก้ไข: เอา /api ออก
      await axios.post("/registrations/sync", { registrations: payload });

      // ถ้าสำเร็จ (ไม่ Error)
      setSelectedActivities(updatedList);
      setShowToast(true);
    } catch (error) {
      console.error("Remove Error:", error);
      alert("ไม่สามารถเชื่อมต่อ Server ได้ หรือ Session หมดอายุ");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex">
      {/* --- Styles --- */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&family=Sarabun:wght@300;400;500;600&display=swap');
          body { font-family: 'Sarabun', sans-serif; }
          h1, h2, h3, h4, h5, h6, .font-prompt { font-family: 'Prompt', sans-serif; }
          
          .animate-fade-up { animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; transform: translateY(20px); }
          .delay-100 { animation-delay: 0.1s; }
          .delay-200 { animation-delay: 0.2s; }
          .delay-300 { animation-delay: 0.3s; }
          
          @keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }
          
          .card-hover:hover { transform: translateY(-4px); box-shadow: 0 10px 25px -5px rgba(249, 115, 22, 0.15); }
        `}
      </style>

      {/* --- Sidebar --- */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-gray-100 fixed h-full z-20 shadow-sm">
        <div className="p-8 flex items-center space-x-3">
          <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-orange-200">
            <GraduationCap size={24} />
          </div>
          <div>
            <h1 className="font-prompt font-bold text-xl text-gray-800">
              ED KKU
            </h1>
            <p className="text-xs text-gray-400">Open House 2024</p>
          </div>
        </div>

        <nav className="flex-1 mt-6">
          <SidebarItem
            id="overview"
            icon={Home}
            label="ภาพรวม"
            onClick={setActiveTab}
          />
          <SidebarItem
            id="profile"
            icon={User}
            label="ข้อมูลส่วนตัว"
            onClick={setActiveTab}
          />
          <SidebarItem
            id="activities"
            icon={Calendar}
            label="กิจกรรมที่เลือก"
            onClick={setActiveTab}
          />
        </nav>

        <div className="p-6">
          <button
            onClick={handleLogout}
            className="w-full py-3 px-4 border border-gray-200 text-gray-600 rounded-xl hover:border-orange-200 hover:text-orange-600 hover:bg-orange-50 transition-all duration-300 flex items-center justify-center space-x-2 font-medium"
          >
            <LogOut size={18} />
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </aside>

      {/* --- Mobile Header --- */}
      <div className="lg:hidden fixed top-0 w-full bg-white z-30 px-4 py-3 shadow-sm flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-orange-600 rounded-md flex items-center justify-center text-white">
            <GraduationCap size={18} />
          </div>
          <span className="font-prompt font-bold text-lg text-gray-800">
            ED KKU
          </span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="text-gray-600 hover:text-orange-600"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Drawer */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
          <div className="absolute right-0 top-0 h-full w-64 bg-white shadow-2xl p-6 flex flex-col animate-fade-in">
            <div className="flex justify-end mb-6">
              <button onClick={() => setIsSidebarOpen(false)}>
                <X size={24} className="text-gray-400" />
              </button>
            </div>
            <nav className="space-y-2">
              <SidebarItem
                id="overview"
                icon={Home}
                label="ภาพรวม"
                onClick={setActiveTab}
              />
              <SidebarItem
                id="profile"
                icon={User}
                label="ข้อมูลส่วนตัว"
                onClick={setActiveTab}
              />
              <SidebarItem
                id="activities"
                icon={Calendar}
                label="กิจกรรมที่เลือก"
                onClick={setActiveTab}
              />
            </nav>
            <div className="mt-auto">
              <button
                onClick={handleLogout}
                className="w-full py-2 border border-orange-200 text-orange-600 rounded-lg"
              >
                ออกจากระบบ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Main Content --- */}
      <main className="flex-1 lg:ml-72 p-4 lg:p-8 pt-20 lg:pt-8 min-h-screen">
        <div className="max-w-5xl mx-auto">
          {/* Welcome Header */}
          <header className="mb-8 animate-fade-up">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="font-prompt text-3xl font-bold text-gray-800 mb-2">
                  สวัสดี,{" "}
                  <span className="text-orange-600">
                    {user?.first_name} {user?.last_name}
                  </span>{" "}
                  👋
                </h2>
                <p className="text-gray-500 font-light">
                  ยินดีต้อนรับสู่ระบบจัดการกิจกรรม Open House
                </p>
              </div>
              <div className="mt-4 md:mt-0 hidden md:block">
                <span className="text-sm text-gray-400 bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm">
                  {new Date().toLocaleDateString("th-TH", {
                    dateStyle: "long",
                  })}
                </span>
              </div>
            </div>
          </header>

          {/* === OVERVIEW TAB === */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-up delay-100">
                {/* Profile Summary Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 card-hover transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                      <User size={24} />
                    </div>
                    <button
                      onClick={() => setActiveTab("profile")}
                      className="text-gray-400 hover:text-blue-600"
                    >
                      <Edit3 size={18} />
                    </button>
                    {/* <button
                      onClick={() => navigate("/edit_profile")}
                      className="text-gray-400 hover:text-blue-600"
                    >
                      <Edit3 size={18} />
                    </button> */}
                  </div>
                  <h3 className="text-gray-500 text-sm font-light mb-1">
                    ข้อมูลส่วนตัว
                  </h3>
                  <p className="font-prompt font-semibold text-gray-800 truncate">
                    {user?.school}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{user?.grade}</p>
                </div>

                {/* Selection Status Card */}
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-2xl shadow-lg shadow-orange-200 text-white card-hover transition-all duration-300 relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-white opacity-10 rounded-full"></div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white">
                      <CheckCircle size={24} />
                    </div>
                    {isComplete && (
                      <span className="bg-white/20 px-2 py-0.5 rounded text-xs">
                        ครบแล้ว
                      </span>
                    )}
                  </div>
                  <h3 className="text-orange-100 text-sm font-light mb-1">
                    สถานะการเลือกกิจกรรม
                  </h3>
                  <div className="flex items-baseline space-x-2">
                    <span className="font-prompt font-bold text-3xl">
                      {currentSelection}
                    </span>
                    <span className="text-orange-200 text-sm">
                      / {totalRounds} รอบ
                    </span>
                  </div>
                  <div className="w-full bg-black/10 h-1.5 rounded-full mt-4 overflow-hidden">
                    <div
                      className="h-full bg-white transition-all duration-1000"
                      style={{
                        width: `${(currentSelection / totalRounds) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Next Step / Action Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 card-hover transition-all duration-300 flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-4">
                      <Calendar size={24} />
                    </div>
                    <h3 className="font-prompt font-semibold text-gray-800">
                      จัดการกิจกรรม
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {currentSelection === 0
                        ? "คุณยังไม่ได้เลือกกิจกรรม"
                        : isComplete
                          ? "เลือกครบตามจำนวนแล้ว"
                          : "ยังสามารถเลือกเพิ่มได้อีก"}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/round_select")}
                    className="mt-4 w-full py-2 bg-gray-50 text-gray-600 hover:bg-orange-50 hover:text-orange-600 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                  >
                    {currentSelection === 0
                      ? "เริ่มเลือกกิจกรรม"
                      : "ดูรายละเอียด"}{" "}
                    <ChevronRight size={16} className="ml-1" />
                  </button>
                </div>
              </div>

              {/* Quick Summary Section */}
              <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100 animate-fade-up delay-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-prompt text-xl font-bold text-gray-800 flex items-center">
                    <BookOpen size={20} className="mr-2 text-orange-500" />{" "}
                    สรุปกิจกรรมที่เลือก
                  </h3>
                  <button
                    onClick={() => setActiveTab("activities")}
                    className="text-sm text-orange-600 hover:underline"
                  >
                    ดูทั้งหมด
                  </button>
                </div>

                {currentSelection > 0 ? (
                  <div className="space-y-3">
                    {selectedActivities.map((activity, index) => (
                      <div
                        key={activity.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-orange-200 transition-colors"
                      >
                        <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                          <div className="bg-white w-12 h-12 rounded-lg flex flex-col items-center justify-center text-xs font-bold text-gray-500 shadow-sm border border-gray-100">
                            <span>รอบ</span>
                            <span className="text-lg text-orange-600 leading-none">
                              {index + 1}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-prompt font-medium text-gray-800">
                              {activity.station?.name}
                            </h4>
                            <div className="flex items-center text-xs text-gray-500 mt-0.5">
                              <Clock size={12} className="mr-1" />{" "}
                              {activity.round?.start_time} -{" "}
                              {activity.round?.end_time}
                              <span className="mx-2">•</span>
                              <MapPin size={12} className="mr-1" /> ห้อง{" "}
                              {activity.station?.room}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                            ยืนยันแล้ว
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <AlertCircle
                      size={40}
                      className="mx-auto text-gray-300 mb-3"
                    />
                    <p className="text-gray-500 font-medium">
                      ยังไม่มีกิจกรรมที่เลือก
                    </p>
                    <p className="text-sm text-gray-400 mb-4">
                      กรุณาเลือกรอบกิจกรรมเพื่อเริ่มต้น
                    </p>
                    <button
                      onClick={() => navigate("/round_select")}
                      className="px-6 py-2 bg-orange-600 text-white rounded-lg shadow-md hover:bg-orange-700 transition-colors text-sm"
                    >
                      ไปยังหน้าเลือกกิจกรรม
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* === PROFILE TAB === */}
          {activeTab === "profile" && (
            <div className="animate-fade-up">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 max-w-3xl mx-auto relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-orange-400 to-orange-600"></div>
                <div className="relative flex flex-col items-center sm:items-start sm:flex-row sm:space-x-8">
                  <div className="mt-12 sm:mt-8 mb-4 sm:mb-0">
                    <div className="w-32 h-32 bg-white p-1 rounded-full shadow-lg">
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.first_name}`}
                        alt="Profile"
                        className="w-full h-full rounded-full bg-gray-100"
                      />
                    </div>
                  </div>
                  <div className="mt-0 sm:mt-14 text-center sm:text-left flex-1">
                    <h2 className="font-prompt text-2xl font-bold text-gray-800">
                      {user?.first_name} {user?.last_name}
                    </h2>
                    <p className="text-gray-500">นักเรียนผู้เข้าร่วมโครงการ</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                      <div className="space-y-1">
                        <label className="text-xs text-gray-400 uppercase tracking-wide">
                          โรงเรียน
                        </label>
                        <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg">
                          <School size={18} className="mr-3 text-orange-500" />
                          {user?.school}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-gray-400 uppercase tracking-wide">
                          ระดับชั้น
                        </label>
                        <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg">
                          <GraduationCap
                            size={18}
                            className="mr-3 text-orange-500"
                          />
                          {user?.grade_level}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-gray-400 uppercase tracking-wide">
                          เบอร์โทรศัพท์
                        </label>
                        <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg">
                          <Phone size={18} className="mr-3 text-orange-500" />
                          {user?.phone}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-gray-400 uppercase tracking-wide">
                          อีเมล
                        </label>
                        <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg">
                          <Mail size={18} className="mr-3 text-orange-500" />
                          {user?.email}
                        </div>
                      </div>
                    </div>
                    <div className="mt-8 flex justify-center sm:justify-start">
                      <button
                        onClick={() => navigate("/edit_profile")}
                        className="flex items-center px-6 py-2.5 bg-gray-800 text-white rounded-xl shadow-lg hover:bg-gray-900 transition-colors"
                      >
                        <Edit3 size={16} className="mr-2" /> แก้ไขข้อมูล
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* === ACTIVITIES TAB === */}
          {activeTab === "activities" && (
            <div className="animate-fade-up space-y-6">
              <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between">
                <div>
                  <h3 className="font-prompt text-xl font-bold text-gray-800 mb-1">
                    กิจกรรมที่เลือก
                  </h3>
                  <p className="text-gray-500 text-sm">
                    จัดการรอบเวลาและตรวจสอบสถานะการลงทะเบียน
                  </p>
                </div>
                <div className="mt-4 md:mt-0 flex items-center bg-orange-50 px-4 py-2 rounded-xl border border-orange-100">
                  <span className="text-gray-600 text-sm mr-2">สถานะ:</span>
                  <span
                    className={`font-bold ${isComplete ? "text-green-600" : "text-orange-600"}`}
                  >
                    เลือกแล้ว {currentSelection} / {totalRounds}
                  </span>
                </div>
              </div>

              {selectedActivities.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {selectedActivities.map((activity, index) => (
                    <div
                      key={activity.id}
                      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between hover:border-orange-300 transition-all duration-300 animate-fade-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-start space-x-5">
                        <div className="hidden md:flex flex-col items-center justify-center w-16 h-16 bg-orange-50 rounded-2xl text-orange-600 border border-orange-100">
                          <span className="text-xs font-medium text-gray-500">
                            รอบที่
                          </span>
                          <span className="text-2xl font-bold">
                            {index + 1}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="md:hidden bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded font-bold">
                              รอบที่ {index + 1}
                            </span>
                            <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded flex items-center">
                              <Clock size={10} className="mr-1" />{" "}
                              {activity.round?.start_time} -{" "}
                              {activity.round?.end_time}
                            </span>
                          </div>
                          <h4 className="font-prompt text-lg font-bold text-gray-800">
                            {activity.station?.name}
                          </h4>
                          <p className="text-gray-500 text-sm mt-1 flex items-center">
                            <MapPin size={14} className="mr-1 text-gray-400" />{" "}
                            อาคารคณะศึกษาศาสตร์ ห้อง {activity.station?.room}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 flex items-center justify-between md:justify-end md:space-x-4 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
                        <div className="flex items-center text-green-600 text-sm font-medium">
                          <CheckCircle size={16} className="mr-1.5" />{" "}
                          ลงทะเบียนสำเร็จ
                        </div>
                        <button
                          className="text-gray-400 hover:text-red-500 p-2 transition-colors"
                          title="ยกเลิกการเลือก"
                          onClick={() => handleRemove(activity.round_id)}
                        >
                          <X size={20} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {!isComplete && (
                    <button
                      onClick={() => navigate("/round_select")}
                      className="w-full py-4 border-2 border-dashed border-orange-200 rounded-2xl text-orange-500 font-medium hover:bg-orange-50 hover:border-orange-400 transition-all duration-300 flex items-center justify-center space-x-2"
                    >
                      <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                        +
                      </div>
                      <span>เลือกรอบกิจกรรมเพิ่มเติม</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                  <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Calendar size={32} className="text-orange-400" />
                  </div>
                  <h3 className="font-prompt text-xl font-bold text-gray-800 mb-2">
                    ยังไม่มีกิจกรรม
                  </h3>
                  <p className="text-gray-500 mb-8 max-w-md mx-auto">
                    คุณยังไม่ได้ทำการเลือกรอบกิจกรรม
                    กรุณาเลือกกิจกรรมที่คุณสนใจเพื่อเข้าร่วมงาน Open House
                  </p>
                  <button
                    onClick={() => navigate("/round_select")}
                    className="px-8 py-3 bg-orange-600 text-white rounded-xl font-bold shadow-lg shadow-orange-200 hover:bg-orange-700 hover:-translate-y-1 transition-all duration-300"
                  >
                    ไปหน้าเลือกกิจกรรม
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* --- Toast Notification --- */}
      {showToast && (
        <div className="fixed bottom-8 right-8 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-2xl flex items-center z-50 animate-fade-up">
          <CheckCircle size={20} className="text-green-400 mr-3" />
          <span className="font-prompt text-sm">
            ระบบจำลอง: แก้ไขข้อมูลเรียบร้อย
          </span>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
