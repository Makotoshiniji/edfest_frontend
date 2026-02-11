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
  Menu,
  Bell,
  TrendingUp,
  Filter,
  MoreVertical,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // State
  const [stats, setStats] = useState({
    users: 0,
    selections: 0,
    fullSessions: 0,
    stations: [], // ✅ เพิ่ม stations array
    dailyStats: [], // ✅ เพิ่ม dailyStats array
  });
  const [users, setUsers] = useState([]);
  const [adminUser, setAdminUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    const storedAdmin = localStorage.getItem("admin_user");

    if (!token) {
      navigate("/admin_login");
      return;
    }

    if (storedAdmin) {
      setAdminUser(JSON.parse(storedAdmin));
    }

    const fetchData = async () => {
      try {
        // 1. ดึงสถิติ Dashboard
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
          // แปลง dailyStats ให้มีครบ 7 วัน (เผื่อวันที่ไม่มีคนสมัคร) หรือใช้ตามจริง
          setStats(statsData);
        }

        // 2. ดึงรายชื่อผู้สมัคร 5 คนล่าสุด
        const usersResponse = await fetch(
          "http://76.13.179.18/api/admin/users?limit=5",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          },
        );

        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
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
        console.error(e);
      }
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

  const ActivityProgress = ({ name, current, max, room }) => {
    const percent = max > 0 ? (current / max) * 100 : 0; // ป้องกันหารด้วยศูนย์
    const isFull = current >= max && max > 0;

    return (
      <div className="mb-6 group cursor-pointer">
        <div className="flex justify-between items-end mb-2">
          <div>
            <h4 className="font-medium text-gray-800 group-hover:text-orange-600 transition-colors">
              {name}
            </h4>
            <span className="text-xs text-gray-400 flex items-center mt-0.5">
              <MapPin size={10} className="mr-1" /> ห้อง {room || "-"}
            </span>
          </div>
          <div className="text-right">
            <span
              className={`text-sm font-bold ${isFull ? "text-red-500" : "text-gray-800"}`}
            >
              {current}
            </span>
            {/* แสดง Mockup Max ไว้ก่อน ถ้าฐานข้อมูลยังไม่มี field รับจำนวนจำกัดรวม */}
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

  const UsersTable = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up">
      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <h3 className="font-prompt font-bold text-lg text-gray-800">
          รายชื่อผู้สมัครล่าสุด
        </h3>
        {/* ... Search bar codes ... */}
        <div className="flex gap-3 w-full md:w-auto">
          {/* ใส่ Search bar เดิมตรงนี้ */}
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
            {users.length > 0 ? (
              users.map((user) => (
                <tr
                  key={user.id}
                  onClick={() => navigate(`/admin/users/${user.id}`)}
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
                  <td className="px-6 py-4 text-gray-600">{user.school}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {user.grade_level}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(user.created_at).toLocaleDateString("th-TH")}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-orange-600">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-400">
                  ไม่พบข้อมูล
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  // --- Main Render ---
  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-600 rounded-full animate-spin border-t-transparent"></div>
      </div>
    );

  // คำนวณความสูงกราฟจาก dailyStats
  const maxDaily = stats.dailyStats
    ? Math.max(...stats.dailyStats.map((d) => d.count), 10)
    : 10;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 flex overflow-hidden">
      {/* Sidebar & Header code (เหมือนเดิม) */}
      <aside
        className={`fixed lg:relative z-30 w-64 h-full bg-white border-r border-gray-100 transform transition-transform duration-300 ease-in-out flex flex-col ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-20"}`}
      >
        {/* ... Sidebar Content ... */}
        <div className="h-20 flex items-center justify-center border-b border-gray-50">
          <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center text-white font-bold">
            ED
          </div>
        </div>
        <nav className="flex-1 py-6 px-3 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center px-4 py-3 rounded-xl ${activeView === item.id ? "bg-orange-50 text-orange-600" : "text-gray-500 hover:bg-gray-50"}`}
            >
              <item.icon size={22} />
              <span className={`ml-4 ${!isSidebarOpen && "hidden lg:hidden"}`}>
                {item.label}
              </span>
            </button>
          ))}
        </nav>
        <div className="p-4">
          <button onClick={handleLogout} className="text-red-500 flex gap-2">
            <LogOut /> <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-gray-50">
        <header className="h-20 bg-white border-b px-8 flex justify-between items-center sticky top-0 z-20">
          <div className="font-bold text-xl">Admin Dashboard</div>
          <div className="flex gap-4 items-center">
            <span>{adminUser?.name}</span>
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          </div>
        </header>

        <div className="flex-1 p-6 lg:p-8 overflow-y-auto custom-scrollbar">
          {activeView === "overview" && (
            <div className="space-y-8 animate-fade-in-up">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="ผู้สมัครทั้งหมด"
                  value={stats.users}
                  subtext="คน"
                  icon={Users}
                  trend="Update"
                />
                <StatCard
                  title="การจองทั้งหมด"
                  value={stats.selections}
                  subtext="ที่นั่ง"
                  icon={CheckCircle}
                />
                <StatCard
                  title="รอบที่เต็ม"
                  value={stats.fullSessions}
                  subtext="รอบ"
                  icon={XCircle}
                />
                {/* ดึงชื่อสาขาที่ฮิตที่สุดมาแสดง */}
                <StatCard
                  title="สาขายอดนิยม"
                  value={
                    stats.stations?.[0]
                      ? stats.stations[0].name.substring(0, 10) + "..."
                      : "-"
                  }
                  subtext={
                    stats.stations?.[0]
                      ? `${stats.stations[0].registrations_count} คน`
                      : ""
                  }
                  icon={TrendingUp}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* ✅ 1. กราฟจำนวนผู้สมัคร (Dynamic) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-prompt font-bold text-gray-800">
                      จำนวนผู้สมัคร 7 วันล่าสุด
                    </h3>
                  </div>
                  <div className="h-64 flex items-end justify-between space-x-2 px-2">
                    {stats.dailyStats && stats.dailyStats.length > 0 ? (
                      stats.dailyStats.map((d, i) => {
                        const h = (d.count / maxDaily) * 100; // คำนวณความสูง %
                        return (
                          <div
                            key={i}
                            className="w-full flex flex-col justify-end group"
                          >
                            <div
                              className="bg-orange-100 group-hover:bg-orange-500 rounded-t-lg transition-all duration-300 relative"
                              style={{ height: `${h}%`, minHeight: "10%" }}
                            >
                              <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded">
                                {d.count} คน
                              </div>
                            </div>
                            <p className="text-center text-xs text-gray-400 mt-2 truncate">
                              {new Date(d.date).getDate()}/
                              {new Date(d.date).getMonth() + 1}
                            </p>
                          </div>
                        );
                      })
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        ไม่มีข้อมูลช่วงนี้
                      </div>
                    )}
                  </div>
                </div>

                {/* ✅ 2. สถานะที่นั่งรายสาขา (Dynamic) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="font-prompt font-bold text-gray-800 mb-6">
                    ยอดจองรายสาขา
                  </h3>
                  <div className="overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                    {stats.stations && stats.stations.length > 0 ? (
                      stats.stations.map((st) => (
                        <ActivityProgress
                          key={st.id}
                          name={st.name}
                          current={st.registrations_count}
                          max={320} // สมมติค่า Max ไว้ก่อน (8 รอบ * 40 คน)
                          room={st.room}
                        />
                      ))
                    ) : (
                      <p className="text-center text-gray-400">
                        ยังไม่มีข้อมูลการจอง
                      </p>
                    )}
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
