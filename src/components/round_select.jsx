import React, { useState, useEffect } from "react";
import {
  Clock,
  MapPin,
  Users,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  AlertCircle,
  Trash2,
  ArrowRight,
  BookOpen,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "../lib/axios";

const ActivitySelection = () => {
  const navigate = useNavigate();

  // State
  const [rounds, setRounds] = useState([]);
  const [stations, setStations] = useState([]);
  const [seatsData, setSeatsData] = useState({});
  const [selectedMap, setSelectedMap] = useState({});
  const [expandedSession, setExpandedSession] = useState(null); // อยากให้เปิดรอบแรกเลยไหม? ถ้าอยาก ใส่ 1 แทน null
  const [toastMessage, setToastMessage] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initial Setup & Polling
  useEffect(() => {
    setIsLoaded(true);

    const fetchData = async () => {
      try {
        // 1. ดึง Master Data
        const response = await axios.get("/initial-data");
        const data = response.data;

        setRounds(data.rounds);
        setStations(data.stations);

        // 2. คำนวณที่นั่งว่าง
        const initialSeats = {};

        // ตั้งค่า Capacity เริ่มต้น
        data.rounds.forEach((round) => {
          data.stations.forEach((station) => {
            initialSeats[`${round.id}-${station.id}`] =
              station.capacity_limit || 40;
          });
        });

        // หักลบยอดจอง (จาก Backend)
        if (data.reserved_seats) {
          data.reserved_seats.forEach((item) => {
            const key = `${item.round_id}-${item.station_id}`;
            if (initialSeats[key] !== undefined) {
              initialSeats[key] = initialSeats[key] - item.count;
            }
          });
        }
        setSeatsData(initialSeats);

        // 3. ดึงข้อมูลการจองของ User (เฉพาะครั้งแรกหรือเมื่อจำเป็น)
        // หมายเหตุ: ถ้าจะให้ Polling ทำงานเร็วขึ้น อาจจะแยกส่วนนี้ออกจาก loop interval ก็ได้
        const token = localStorage.getItem("auth_token");
        if (token) {
          // ... (Logic เดิมของคุณถูกต้องแล้ว)
          try {
            const regResponse = await axios.get("/my-registrations");
            const regData = regResponse.data;
            const initialMap = {};
            regData.forEach((reg) => {
              initialMap[reg.round_id] = reg.station_id;
            });
            // ใช้ Functional Update เพื่อป้องกันการเขียนทับ State ที่ User กำลังเลือกอยู่
            setSelectedMap((prev) =>
              Object.keys(prev).length === 0 ? initialMap : prev,
            );
          } catch (err) {
            if (err.response && err.response.status === 401) {
              localStorage.removeItem("auth_token");
              localStorage.removeItem("user");
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // เรียกครั้งแรกทันที
    fetchData();

    // ตั้งเวลาดึงข้อมูลใหม่ทุก 10 วินาที
    const intervalId = setInterval(fetchData, 10000);

    // Cleanup function
    return () => clearInterval(intervalId);

    // ❌ ลบบรรทัด fetchData() ที่อยู่ตรงนี้ออก (Unreachable code)
  }, []);

  // ... (ส่วน Logic Helpers และ Render อื่นๆ ถูกต้องแล้วครับ) ...

  const getSelectedCount = () => Object.keys(selectedMap).length;

  const handleSelect = (roundId, stationId) => {
    const currentSelection = selectedMap[roundId];
    if (currentSelection === stationId) {
      const newMap = { ...selectedMap };
      delete newMap[roundId];
      setSelectedMap(newMap);
      return;
    }
    if (!currentSelection && getSelectedCount() >= 4) {
      showToast(
        "น้องเลือกครบ 4 รอบแล้วครับ หากต้องการเปลี่ยน กรุณายกเลิกรายการเดิมก่อน",
      );
      return;
    }
    setSelectedMap((prev) => ({ ...prev, [roundId]: stationId }));
  };

  const handleClearAll = () => {
    if (window.confirm("ยืนยันการล้างข้อมูลการเลือกทั้งหมด?")) {
      setSelectedMap({});
      showToast("ล้างข้อมูลเรียบร้อย");
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleExpand = (id) => {
    setExpandedSession(expandedSession === id ? null : id);
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    const token = localStorage.getItem("auth_token");

    if (!token) {
      showToast("กรุณาเข้าสู่ระบบก่อนทำรายการ");
      setTimeout(() => navigate("/login"), 1000);
      return;
    }

    const payload = Object.entries(selectedMap).map(([rId, sId]) => ({
      round_id: parseInt(rId),
      station_id: sId,
    }));

    try {
      const response = await axios.post("/registrations/sync", {
        registrations: payload,
      });

      if (response.status === 200 || response.status === 201) {
        showToast("บันทึกข้อมูลสำเร็จ!");
        setTimeout(() => navigate("/user_dashboard"), 1500);
      }
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "เกิดข้อผิดพลาดในการบันทึก";
      showToast(msg);

      if (error.response?.status === 401) {
        localStorage.removeItem("auth_token");
        setTimeout(() => navigate("/login"), 1500);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (rounds.length === 0 || stations.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-orange-600 w-10 h-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-32">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&family=Sarabun:wght@300;400;500;600&display=swap');
          body { font-family: 'Sarabun', sans-serif; }
          h1, h2, h3, h4, h5, h6, .font-prompt { font-family: 'Prompt', sans-serif; }
          .animate-enter { animation: fadeSlideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; transform: translateY(20px); }
          @keyframes fadeSlideUp { to { opacity: 1; transform: translateY(0); } }
        `}
      </style>

      {/* --- Header --- */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md shadow-sm border-b border-orange-100">
        <div className="container mx-auto px-4 py-4 max-w-5xl">
          <button
            onClick={() => navigate("/user_dashboard")}
            className="flex items-center text-gray-400 hover:text-orange-600 transition-colors mb-2 group font-prompt"
          >
            <ChevronLeft
              size={20}
              className="mr-1 group-hover:-translate-x-1 transition-transform"
            />
            <span className="text-sm font-medium">กลับหน้าหลัก</span>
          </button>
          <div className="flex flex-col md:flex-row justify-between items-center mb-3">
            <div>
              <h1 className="text-2xl font-prompt font-bold text-gray-800">
                เลือกรอบกิจกรรม{" "}
                <span className="text-orange-600">และสาขาวิชา</span>
              </h1>
              <p className="text-sm text-gray-500 font-light hidden sm:block">
                เลือกกิจกรรมที่สนใจได้สูงสุด 4 รอบ (จากทั้งหมด 8 รอบ)
              </p>
            </div>

            <div className="mt-3 md:mt-0 flex items-center bg-orange-50 px-4 py-2 rounded-xl border border-orange-100">
              <div className="mr-3 text-right">
                <span className="block text-xs text-gray-500 font-prompt">
                  เลือกแล้ว
                </span>
                <span
                  className={`font-bold font-prompt text-lg ${getSelectedCount() === 4 ? "text-green-600" : "text-orange-600"}`}
                >
                  {getSelectedCount()}{" "}
                  <span className="text-gray-400 text-sm">/ 4</span>
                </span>
              </div>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ease-out rounded-full ${getSelectedCount() === 4 ? "bg-green-500" : "bg-orange-500"}`}
              style={{ width: `${(getSelectedCount() / 4) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* --- Timeline Content --- */}
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="relative">
          <div className="absolute left-4 sm:left-8 top-4 bottom-4 w-0.5 bg-gray-200 z-0"></div>

          {/* Loop Rounds (Rounds) */}
          {rounds.map((round, index) => {
            const isSelected = !!selectedMap[round.id];
            const selectedStationId = selectedMap[round.id];
            const selectedStation = stations.find(
              (s) => s.id === selectedStationId,
            );
            const isExpanded = expandedSession === round.id;

            return (
              <div
                key={round.id}
                className={`relative mb-6 pl-12 sm:pl-20 transition-all duration-500 ${isLoaded ? "animate-enter" : ""}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Number Dot */}
                <div
                  className={`absolute left-0 sm:left-4 top-6 w-8 h-8 rounded-full border-4 z-10 flex items-center justify-center transition-colors duration-300 ${isSelected ? "bg-orange-600 border-orange-100 shadow-lg" : "bg-white border-gray-300"}`}
                >
                  {isSelected ? (
                    <CheckCircle size={14} className="text-white" />
                  ) : (
                    <span className="text-xs font-bold text-gray-400">
                      {index + 1}
                    </span>
                  )}
                </div>

                {/* Card */}
                <div
                  className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${isExpanded ? "shadow-xl border-orange-200 ring-1 ring-orange-100" : "shadow-sm border-gray-100 hover:border-orange-200"}`}
                >
                  {/* Card Header */}
                  <div
                    onClick={() => toggleExpand(round.id)}
                    className="p-5 flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer select-none group"
                  >
                    <div className="flex items-start sm:items-center space-x-4">
                      <div className="bg-orange-50 text-orange-700 px-3 py-1.5 rounded-lg font-prompt font-semibold text-sm whitespace-nowrap">
                        รอบที่ {index + 1}
                      </div>
                      <div>
                        <div className="flex items-center text-gray-800 font-bold font-prompt text-lg">
                          <Clock size={18} className="mr-2 text-gray-400" />
                          {round.start_time &&
                            round.start_time.substring(0, 5)}{" "}
                          - {round.end_time && round.end_time.substring(0, 5)}
                        </div>
                        {selectedStation ? (
                          <div className="text-orange-600 text-sm font-medium mt-1 flex items-center animate-enter">
                            <CheckCircle size={14} className="mr-1.5" />
                            เลือก: {selectedStation.name}
                          </div>
                        ) : (
                          <div className="text-gray-400 text-sm font-light mt-1 group-hover:text-orange-400 transition-colors">
                            ยังไม่ได้เลือกกิจกรรม
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0 flex items-center justify-end">
                      <ChevronDown
                        size={20}
                        className={`text-gray-400 transition-transform duration-300 ${isExpanded ? "rotate-180 text-orange-600" : ""}`}
                      />
                    </div>
                  </div>

                  {/* Expandable Content (Stations Grid) */}
                  <div
                    className={`transition-[max-height] duration-500 ease-in-out overflow-hidden bg-gray-50/50 border-t border-gray-100 ${isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"}`}
                  >
                    <div className="p-5">
                      <p className="text-sm text-gray-500 mb-4 font-light flex items-center">
                        <BookOpen size={16} className="mr-2" /> เลือก 1
                        สาขาวิชาสำหรับรอบนี้
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Loop Stations (Majors) */}
                        {stations.map((station) => {
                          const seatsKey = `${round.id}-${station.id}`;
                          const remaining = seatsData[seatsKey] || 0;
                          const isFull = remaining <= 0;
                          const isActive = selectedMap[round.id] === station.id;

                          return (
                            <button
                              key={station.id}
                              onClick={() => handleSelect(round.id, station.id)}
                              disabled={isFull && !isActive}
                              className={`relative p-4 rounded-xl border-2 text-left transition-all duration-300 flex flex-col justify-between h-full group
                                ${
                                  isActive
                                    ? "bg-orange-600 border-orange-600 text-white shadow-lg scale-[1.02]"
                                    : isFull
                                      ? "bg-gray-100 border-gray-100 opacity-60 cursor-not-allowed grayscale"
                                      : "bg-white border-white hover:border-orange-200 hover:shadow-md"
                                }`}
                            >
                              <div className="mb-3">
                                <h4
                                  className={`font-prompt font-semibold text-base mb-1 line-clamp-2 ${isActive ? "text-white" : "text-gray-800"}`}
                                >
                                  {station.name}
                                </h4>
                                <div
                                  className={`flex items-center text-xs ${isActive ? "text-orange-100" : "text-gray-500"}`}
                                >
                                  <MapPin size={12} className="mr-1" /> ห้อง{" "}
                                  {station.room}
                                </div>
                              </div>
                              <div className="flex items-center justify-between mt-auto pt-3 border-t border-dashed border-opacity-20 border-gray-400">
                                <div
                                  className={`flex items-center text-sm font-medium ${isActive ? "text-white" : isFull ? "text-red-500" : "text-green-600"}`}
                                >
                                  <Users size={14} className="mr-1.5" />
                                  {isFull ? "เต็มแล้ว" : `ว่าง ${remaining}`}
                                </div>
                                {isActive && (
                                  <CheckCircle
                                    size={18}
                                    className="text-white animate-bounce-short"
                                  />
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- Footer Actions --- */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-40">
        <div className="container mx-auto max-w-5xl flex items-center justify-between">
          <button
            onClick={handleClearAll}
            disabled={getSelectedCount() === 0}
            className="flex items-center px-4 py-3 rounded-xl text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-30"
          >
            <Trash2 size={20} className="mr-2" />{" "}
            <span className="hidden sm:inline">ล้างการเลือก</span>
          </button>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:block text-right mr-2">
              <p className="text-xs text-gray-400">เลือกอย่างน้อย 1 รอบ</p>
              <p className="text-sm font-bold text-gray-800">
                เพื่อดำเนินการต่อ
              </p>
            </div>
            <button
              onClick={handleConfirm}
              disabled={getSelectedCount() === 0 || isSubmitting}
              className="flex items-center px-8 py-3.5 bg-orange-600 text-white rounded-xl font-prompt font-bold shadow-lg shadow-orange-200 hover:bg-orange-700 hover:-translate-y-1 transition-all duration-300 disabled:bg-gray-300 disabled:shadow-none disabled:translate-y-0 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />{" "}
                  กำลังบันทึก...
                </>
              ) : (
                <>
                  ยืนยันการเลือก <ArrowRight size={20} className="ml-2" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-full shadow-2xl flex items-center z-50 animate-enter">
          <AlertCircle size={20} className="text-orange-400 mr-3" />
          <span className="font-prompt text-sm">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default ActivitySelection;
