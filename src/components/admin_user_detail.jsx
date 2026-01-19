import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  User,
  School,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Clock,
  AlertCircle,
  FileText,
  Printer,
  MoreVertical,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

// --- Sub-Components ---
// (UserInfoCard, ActivityTable, SkeletonLoading เหมือนเดิม ไม่ต้องแก้)
const UserInfoCard = ({ user }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-6 animate-fade-in-up">
    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
      <div className="flex-shrink-0">
        <div className="w-24 h-24 rounded-full bg-orange-50 border-4 border-white shadow-md flex items-center justify-center overflow-hidden">
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.first_name}`}
            alt="User Avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="flex-1 w-full">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="font-prompt text-2xl font-bold text-gray-800">
              {user.first_name} {user.last_name}
            </h2>
            <div className="flex items-center text-gray-500 text-sm mt-1 mb-4">
              <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-xs font-bold mr-2">
                ID: {user.id}
              </span>
              <span>
                สมัครเมื่อ:{" "}
                {new Date(user.created_at).toLocaleDateString("th-TH")}
              </span>
            </div>
          </div>
          <button className="text-gray-400 hover:text-orange-600 transition-colors p-2">
            <MoreVertical size={20} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 pt-4 border-t border-gray-100">
          <div className="flex items-start gap-3">
            <School className="text-orange-500 mt-0.5" size={18} />
            <div>
              <p className="text-xs text-gray-400 uppercase font-semibold">
                โรงเรียน
              </p>
              <p className="text-gray-800 font-medium">{user.school || "-"}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <User className="text-orange-500 mt-0.5" size={18} />
            <div>
              <p className="text-xs text-gray-400 uppercase font-semibold">
                ระดับชั้น
              </p>
              <p className="text-gray-800 font-medium">
                {user.grade_level || "-"}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="text-orange-500 mt-0.5" size={18} />
            <div>
              <p className="text-xs text-gray-400 uppercase font-semibold">
                เบอร์โทรศัพท์
              </p>
              <p className="text-gray-800 font-medium">{user.phone || "-"}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="text-orange-500 mt-0.5" size={18} />
            <div>
              <p className="text-xs text-gray-400 uppercase font-semibold">
                อีเมล
              </p>
              <p className="text-gray-800 font-medium">{user.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ActivityTable = ({ activities }) => (
  <div
    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up"
    style={{ animationDelay: "0.1s" }}
  >
    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
      <h3 className="font-prompt text-lg font-bold text-gray-800 flex items-center gap-2">
        <Calendar className="text-orange-600" size={20} />
        ข้อมูลการเลือกกิจกรรม
      </h3>
      <div className="text-sm text-gray-500">
        เลือกแล้ว{" "}
        <span className="text-orange-600 font-bold">
          {activities.filter((a) => a.major).length}
        </span>{" "}
        / 4 รอบ
      </div>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
            <th className="px-6 py-4 font-medium w-24">รอบที่</th>
            <th className="px-6 py-4 font-medium w-40">เวลา</th>
            <th className="px-6 py-4 font-medium">ฐาน / สาขาวิชา</th>
            <th className="px-6 py-4 font-medium w-32">ห้อง</th>
            <th className="px-6 py-4 font-medium w-32 text-center">สถานะ</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {activities.map((item, index) => (
            <tr
              key={index}
              className={`transition-colors duration-200 hover:bg-orange-50/30 group
                ${!item.major ? "bg-gray-50/30" : ""}`}
            >
              <td className="px-6 py-4">
                <span className="font-bold text-gray-700 bg-white border border-gray-200 w-8 h-8 flex items-center justify-center rounded-lg shadow-sm group-hover:border-orange-200 group-hover:text-orange-600 transition-colors">
                  {item.round}
                </span>
              </td>
              <td className="px-6 py-4 text-gray-600 flex items-center gap-2 h-full">
                <Clock size={16} className="text-gray-400" />
                {item.time}
              </td>
              <td className="px-6 py-4">
                {item.major ? (
                  <span className="font-prompt font-semibold text-gray-800 text-base">
                    {item.major}
                  </span>
                ) : (
                  <span className="text-gray-400 italic font-light flex items-center gap-1">
                    <AlertCircle size={14} /> ยังไม่ได้เลือกกิจกรรม
                  </span>
                )}
              </td>
              <td className="px-6 py-4 text-gray-600">
                {item.room ? (
                  <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-xs font-medium w-fit">
                    <MapPin size={12} /> {item.room}
                  </span>
                ) : (
                  <span className="text-gray-300">-</span>
                )}
              </td>
              <td className="px-6 py-4 text-center">
                {item.major ? (
                  <span className="inline-flex items-center justify-center w-8 h-8 text-green-500 bg-green-50 rounded-full">
                    <CheckCircle size={18} />
                  </span>
                ) : (
                  <span className="inline-flex items-center justify-center w-8 h-8 text-gray-300 bg-gray-100 rounded-full">
                    <XCircle size={18} />
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const SkeletonLoading = () => (
  <div className="animate-pulse space-y-6">
    <div className="bg-white h-64 rounded-2xl p-8 border border-gray-100">
      <div className="flex gap-6">
        <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
        <div className="flex-1 space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
    <div className="bg-white h-96 rounded-2xl border border-gray-100"></div>
  </div>
);

// --- Main Page Component ---

const AdminUserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      navigate("/admin_login");
      return;
    }

    const fetchData = async () => {
      try {
        // 🔥 ใช้ Promise.all ดึงข้อมูล User และ Rounds พร้อมกัน
        const [userRes, roundsRes] = await Promise.all([
          fetch(`http://127.0.0.1:8000/api/admin/users/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }),
          fetch(`http://127.0.0.1:8000/api/rounds`, {
            headers: {
              Accept: "application/json",
              // ถ้า API rounds ต้องการ token ให้ใส่เพิ่มตรงนี้
            },
          }),
        ]);

        if (!userRes.ok) throw new Error("ไม่พบข้อมูลผู้ใช้งาน");
        if (!roundsRes.ok) throw new Error("ไม่สามารถดึงข้อมูลรอบกิจกรรมได้");

        const userData = await userRes.json();
        const roundsData = await roundsRes.json(); // ข้อมูลรอบจริงจาก DB

        setUser(userData);

        // 🔥 Map ข้อมูลรอบจริงเข้ากับการลงทะเบียนของ User
        const mappedActivities = roundsData.map((roundRef) => {
          // format เวลาให้สวยงาม (ตัด :00 วินาทีออก ถ้ามี)
          const timeString = `${roundRef.start_time.slice(0, 5)} - ${roundRef.end_time.slice(0, 5)}`;

          // หาว่ารอบนี้ user ลงทะเบียนอะไรไว้ไหม
          const reg = userData.registrations.find(
            (r) => r.round_id === roundRef.id,
          );

          if (reg) {
            return {
              round: roundRef.id, // หรือ roundRef.round_number ถ้ามี
              time: timeString,
              major: reg.station.name,
              room: reg.station.room,
            };
          } else {
            return {
              round: roundRef.id,
              time: timeString,
              major: null,
              room: null,
            };
          }
        });

        setActivities(mappedActivities);
      } catch (err) {
        console.error(err);
        setError("ไม่พบข้อมูล หรือเกิดข้อผิดพลาดในการเชื่อมต่อ");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">{error}</h3>
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            กลับหน้ารายชื่อ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&family=Sarabun:wght@300;400;500;600&display=swap');
        body { font-family: 'Sarabun', sans-serif; }
        .font-prompt { font-family: 'Prompt', sans-serif; }
        .animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; opacity: 0; transform: translateY(20px); }
        @keyframes fadeInUp { to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div className="max-w-5xl mx-auto px-4 py-8 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-all duration-300 shadow-sm"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="font-prompt text-2xl font-bold text-gray-800">
                รายละเอียดผู้สมัคร
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Admin Panel / User Management / Detail
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors shadow-sm text-sm font-medium">
              <Printer size={16} />
              พิมพ์ข้อมูล
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 shadow-orange-200 shadow-md transition-colors text-sm font-bold">
              <FileText size={16} />
              Export PDF
            </button>
          </div>
        </div>

        {isLoading ? (
          <SkeletonLoading />
        ) : (
          <>
            <UserInfoCard user={user} />
            <ActivityTable activities={activities} />
          </>
        )}
      </div>
    </div>
  );
};

export default AdminUserDetail;
