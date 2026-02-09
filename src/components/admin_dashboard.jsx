import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  CalendarClock,
  MapPin,
  Settings,
  LogOut,
  Search,
  Download,
  ChevronRight,
  Menu,
  Bell,
  TrendingUp,
  Filter,
  MoreVertical,
  CheckCircle,
  XCircle,
} from "lucide-react";
// 1. เพิ่ม Import useNavigate
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate(); // ประกาศใช้งาน navigate
  const [activeView, setActiveView] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // State เก็บข้อมูลสถิติ
  const [stats, setStats] = useState({
    users: 0,
    selections: 0,
    fullSessions: 0,
  });

  // 2. เพิ่ม State เก็บข้อมูลจริง
  const [users, setUsers] = useState([]); // เก็บรายชื่อผู้สมัคร
  const [adminUser, setAdminUser] = useState(null); // เก็บข้อมูล Admin

  // 3. แก้ไข useEffect เพื่อดึงข้อมูลจริง
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    const storedAdmin = localStorage.getItem("admin_user");

    // ตรวจสอบ Token ถ้าไม่มีให้เด้งไปหน้า Login
    if (!token) {
      navigate("/admin_login");
      return;
    }

    if (storedAdmin) {
      setAdminUser(JSON.parse(storedAdmin));
    }

    const fetchData = async () => {
      try {
        // ยิง API 1: ดึงสถิติ Dashboard
        const statsResponse = await fetch(
          "http://76.13.179.18/api/admin/dashboard-stats",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          },
        );

        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        }

        // ยิง API 2: ดึงรายชื่อผู้สมัคร (Recent Users)
        const usersResponse = await fetch(
          "http://76.13.179.18/api/admin/users?limit=5", // ดึงมา 5 คนล่าสุด
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          },
        );

        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          // Laravel Paginate จะส่งข้อมูลมาใน property .data
          setUsers(usersData.data || []);
        }
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // 4. แก้ไขฟังก์ชัน Logout
  const handleLogout = async () => {
    if (window.confirm("ต้องการออกจากระบบผู้ดูแลใช่หรือไม่?")) {
      const token = localStorage.getItem("admin_token");
      try {
        await fetch("http://76.13.179.18/api/admin/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
      } catch (e) {
        console.error("Logout error", e);
      }

      // ลบข้อมูลใน LocalStorage และเปลี่ยนหน้า
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
      navigate("/admin_login");
    }
  };

  const menuItems = [
    { id: "overview", label: "ภาพรวมระบบ", icon: LayoutDashboard },
    { id: "users", label: "จัดการผู้สมัคร", icon: Users },
    { id: "sessions", label: "จัดการรอบกิจกรรม", icon: CalendarClock },
    { id: "majors", label: "จัดการฐาน/สาขา", icon: MapPin },
    { id: "settings", label: "ตั้งค่าระบบ", icon: Settings },
  ];

  // --- Components ---

  const StatCard = ({ title, value, subtext, icon: Icon, trend }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-800 font-prompt group-hover:text-orange-600 transition-colors">
            {value.toLocaleString()}
          </h3>
        </div>
        <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors duration-300">
          <Icon size={24} />
        </div>
      </div>
      <div className="flex items-center text-xs">
        {trend && (
          <span className="text-green-500 flex items-center font-medium bg-green-50 px-2 py-0.5 rounded-full mr-2">
            <TrendingUp size={12} className="mr-1" /> {trend}
          </span>
        )}
        <span className="text-gray-400">{subtext}</span>
      </div>
    </div>
  );

  // 5. แก้ไข UsersTable ให้แสดงข้อมูลจริง
  const UsersTable = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up">
      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <h3 className="font-prompt font-bold text-lg text-gray-800">
          รายชื่อผู้สมัครล่าสุด
        </h3>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="ค้นหาชื่อ, โรงเรียน..."
              className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 w-full md:w-64"
            />
          </div>
          <button className="flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50">
            <Filter size={18} className="mr-2" /> กรอง
          </button>
          <button className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg text-sm hover:bg-orange-700 shadow-sm">
            <Download size={18} className="mr-2" /> Export
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 font-medium">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">ชื่อ-นามสกุล</th>
              <th className="px-6 py-4">โรงเรียน</th>
              <th className="px-6 py-4">ระดับชั้น</th>
              <th className="px-6 py-4">วันที่สมัคร</th>
              <th className="px-6 py-4 text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {/* วนลูปข้อมูลจริงจาก users state */}
            {users.length > 0 ? (
              users.map((user) => (
                <tr
                  key={user.id}
                  // 🔥 เพิ่มคำสั่งนี้: เมื่อกดแล้วให้ไปหน้า /admin/users/{id}
                  onClick={() => navigate(`/admin/users/${user.id}`)}
                  // 🔥 เพิ่ม cursor-pointer: ให้เมาส์เป็นรูปมือตอนชี้
                  className="hover:bg-orange-50/30 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 font-mono text-gray-400">
                    #{user.id}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-800">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold mr-3">
                        {user.first_name ? user.first_name.charAt(0) : "U"}
                      </div>
                      {user.first_name} {user.last_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {user.school || "-"}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {user.grade_level || "-"}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {/* แสดงวันที่แบบย่อ */}
                    {new Date(user.created_at).toLocaleDateString("th-TH")}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-orange-600 transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-400">
                  ไม่พบข้อมูลผู้สมัคร
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="p-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
        <span>แสดง 5 รายการล่าสุด</span>
        <div className="flex gap-2">
          <button className="px-3 py-1 border rounded hover:bg-gray-50 opacity-50 cursor-not-allowed">
            ก่อนหน้า
          </button>
          <button className="px-3 py-1 border rounded hover:bg-gray-50">
            ถัดไป
          </button>
        </div>
      </div>
    </div>
  );

  const ActivityProgress = ({ name, current, max, room }) => {
    const percent = (current / max) * 100;
    const isFull = current >= max;

    return (
      <div className="mb-6 group cursor-pointer">
        <div className="flex justify-between items-end mb-2">
          <div>
            <h4 className="font-medium text-gray-800 group-hover:text-orange-600 transition-colors">
              {name}
            </h4>
            <span className="text-xs text-gray-400 flex items-center mt-0.5">
              <MapPin size={10} className="mr-1" /> ห้อง {room}
            </span>
          </div>
          <div className="text-right">
            <span
              className={`text-sm font-bold ${isFull ? "text-red-500" : "text-gray-800"}`}
            >
              {current}
            </span>
            <span className="text-xs text-gray-400"> / {max}</span>
          </div>
        </div>
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${isFull ? "bg-red-500" : "bg-orange-500"}`}
            style={{ width: `${percent}%` }}
          ></div>
        </div>
      </div>
    );
  };

  // --- Main Render ---

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 flex overflow-hidden">
      {/* Styles */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&family=Sarabun:wght@300;400;500;600&display=swap');
          body { font-family: 'Sarabun', sans-serif; }
          h1, h2, h3, h4, h5, h6, .font-prompt { font-family: 'Prompt', sans-serif; }
          
          .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; opacity: 0; transform: translateY(20px); }
          .delay-100 { animation-delay: 0.1s; }
          .delay-200 { animation-delay: 0.2s; }
          
          @keyframes fadeInUp { to { opacity: 1; transform: translateY(0); } }
        `}
      </style>

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative z-30 w-64 h-full bg-white border-r border-gray-100 transform transition-transform duration-300 ease-in-out flex flex-col
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-20"}`}
      >
        {/* Logo Area */}
        <div className="h-20 flex items-center justify-center border-b border-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-orange-200">
              ED
            </div>
            {isSidebarOpen && (
              <div className="lg:block animate-fade-in-up">
                <h1 className="font-prompt font-bold text-gray-800 leading-none">
                  Admin
                </h1>
                <span className="text-xs text-orange-500 font-medium">
                  Dashboard
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 py-6 px-3 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 group relative
                ${
                  activeView === item.id
                    ? "bg-orange-50 text-orange-600 font-semibold"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
            >
              <item.icon
                size={22}
                className={`flex-shrink-0 ${activeView === item.id ? "text-orange-600" : "text-gray-400 group-hover:text-gray-600"}`}
              />

              <span
                className={`ml-4 whitespace-nowrap transition-opacity duration-200 ${!isSidebarOpen && "hidden lg:hidden"}`}
              >
                {item.label}
              </span>

              {/* Tooltip for collapsed sidebar */}
              {!isSidebarOpen && (
                <div className="hidden lg:group-hover:block absolute left-full ml-2 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}

              {activeView === item.id && (
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-orange-600 rounded-l-full"></div>
              )}
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut size={22} />
            <span
              className={`ml-4 font-medium ${!isSidebarOpen && "hidden lg:hidden"}`}
            >
              ออกจากระบบ
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-gray-50">
        {/* Top Navbar */}
        <header className="h-20 bg-white border-b border-gray-100 px-8 flex justify-between items-center sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg lg:hidden"
            >
              <Menu size={24} />
            </button>
            <h2 className="font-prompt text-xl font-bold text-gray-800 hidden sm:block">
              {menuItems.find((i) => i.id === activeView)?.label}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative">
              <Bell
                size={20}
                className="text-gray-400 hover:text-orange-600 cursor-pointer transition-colors"
              />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </div>
            <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-gray-800">
                  {adminUser ? adminUser.name : "Admin"}
                </p>
                <p className="text-xs text-gray-500">
                  {adminUser ? adminUser.email : "Super Administrator"}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
                  alt="Admin"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-6 lg:p-8 overflow-y-auto custom-scrollbar">
          {activeView === "overview" && (
            <div className="space-y-8 animate-fade-in-up">
              {/* Stat Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="ผู้สมัครทั้งหมด"
                  value={stats.users}
                  subtext="นักเรียนที่ลงทะเบียน"
                  icon={Users}
                  trend="+12%"
                />
                <StatCard
                  title="เลือกกิจกรรมแล้ว"
                  value={stats.selections}
                  subtext="ที่นั่งถูกจอง"
                  icon={CheckCircle}
                  trend="+8%"
                />
                <StatCard
                  title="รอบที่เต็มแล้ว"
                  value={stats.fullSessions}
                  subtext="จากทั้งหมด 104 รอบ"
                  icon={XCircle}
                />
                <StatCard
                  title="สาขายอดนิยม"
                  value={"Eng"}
                  subtext="การสอนภาษาอังกฤษ"
                  icon={TrendingUp}
                />
              </div>

              {/* Main Charts Area */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart Mockup (Static for now) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-prompt font-bold text-gray-800">
                      จำนวนผู้สมัครรายวัน
                    </h3>
                    <select className="text-sm border-gray-200 rounded-lg text-gray-500 focus:ring-orange-200">
                      <option>7 วันล่าสุด</option>
                      <option>เดือนนี้</option>
                    </select>
                  </div>
                  <div className="h-64 flex items-end justify-between space-x-2 px-2">
                    {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                      <div
                        key={i}
                        className="w-full flex flex-col justify-end group"
                      >
                        <div
                          className="bg-orange-100 group-hover:bg-orange-500 rounded-t-lg transition-all duration-300 relative"
                          style={{ height: `${h}%` }}
                        >
                          <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded transition-opacity">
                            {h * 15} คน
                          </div>
                        </div>
                        <p className="text-center text-xs text-gray-400 mt-2">
                          D-{i + 1}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Major Progress (Mockup for now) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="font-prompt font-bold text-gray-800 mb-6">
                    สถานะที่นั่งรายสาขา
                  </h3>
                  <div className="overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                    <ActivityProgress
                      name="การสอนภาษาอังกฤษ"
                      current={320}
                      max={320}
                      room="AV-1"
                    />
                    <ActivityProgress
                      name="คอมพิวเตอร์ศึกษา"
                      current={280}
                      max={320}
                      room="Lab-1"
                    />
                    <ActivityProgress
                      name="การสอนภาษาไทย"
                      current={150}
                      max={320}
                      room="101"
                    />
                    <ActivityProgress
                      name="คณิตศาสตรศึกษา"
                      current={210}
                      max={320}
                      room="305"
                    />
                    <ActivityProgress
                      name="สังคมศึกษา"
                      current={90}
                      max={320}
                      room="202"
                    />
                  </div>
                </div>
              </div>

              {/* Recent Users Table */}
              <UsersTable />
            </div>
          )}

          {activeView === "users" && (
            <div className="space-y-6 animate-fade-in-up">
              <UsersTable />
            </div>
          )}

          {/* Placeholder for other views */}
          {(activeView === "sessions" ||
            activeView === "majors" ||
            activeView === "settings") && (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-fade-in-up">
              <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-6">
                <Settings
                  size={40}
                  className="text-orange-400 animate-spin-slow"
                />
              </div>
              <h3 className="text-2xl font-prompt font-bold text-gray-800 mb-2">
                ส่วนนี้อยู่ระหว่างการพัฒนา
              </h3>
              <p className="text-gray-500">
                คุณสามารถจัดการข้อมูลในส่วนนี้ได้ในเวอร์ชันถัดไป
              </p>
            </div>
          )}
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #ddd; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #bbb; }
        .animate-spin-slow { animation: spin 8s linear infinite; }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
