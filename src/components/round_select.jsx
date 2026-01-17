import React, { useState, useEffect } from "react";
import {
  Clock,
  MapPin,
  Users,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Calendar,
  Trash2,
  ArrowRight,
  BookOpen,
} from "lucide-react";

const ActivitySelection = () => {
  // --- Data Configuration ---
  const timeSlots = [
    { id: 1, time: "09.30 – 10.00", label: "รอบที่ 1" },
    { id: 2, time: "10.10 – 10.40", label: "รอบที่ 2" },
    { id: 3, time: "10.50 – 11.20", label: "รอบที่ 3" },
    { id: 4, time: "11.30 – 12.00", label: "รอบที่ 4" },
    { id: 5, time: "13.00 – 13.30", label: "รอบที่ 5" },
    { id: 6, time: "13.40 – 14.10", label: "รอบที่ 6" },
    { id: 7, time: "14.20 – 14.50", label: "รอบที่ 7" },
    { id: 8, time: "15.00 – 15.30", label: "รอบที่ 8" },
  ];

  const majors = [
    { id: "m1", name: "การสอนภาษาไทย", room: "ED-101" },
    { id: "m2", name: "สังคมศึกษา", room: "ED-202" },
    { id: "m3", name: "คณิตศาสตรศึกษา", room: "ED-305" },
    { id: "m4", name: "คอมพิวเตอร์ศึกษา", room: "ED-Lab1" },
    { id: "m5", name: "การสอนภาษาญี่ปุ่น", room: "ED-401" },
    { id: "m6", name: "วิทยาศาสตร์ศึกษา", room: "Sc-Lab2" },
    { id: "m7", name: "ศิลปศึกษา", room: "Art-Studio" },
    { id: "m8", name: "พลศึกษา", room: "Gym-1" },
    { id: "m9", name: "การสอนภาษาจีน", room: "ED-402" },
    { id: "m10", name: "การสอนภาษาอังกฤษ (TESOL)", room: "ED-AV1" },
    { id: "m11", name: "เอกเดี่ยวการประถมศึกษา", room: "ED-Play" },
    { id: "m12", name: "เอกคู่การปฐมวัยและประถมศึกษา", room: "ED-Kids" },
    { id: "m13", name: "ดนตรีศึกษา", room: "Music-Hall" },
  ];

  // --- State ---
  const [selectedMap, setSelectedMap] = useState({}); // { sessionId: majorId }
  const [expandedSession, setExpandedSession] = useState(1);
  const [seatsData, setSeatsData] = useState({});
  const [toastMessage, setToastMessage] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // --- Initial Setup ---
  useEffect(() => {
    setIsLoaded(true);
    // Mock seat data (Random 0-40 seats)
    const initialSeats = {};
    timeSlots.forEach((slot) => {
      majors.forEach((major) => {
        // Randomly make some full (0 seats) for demo
        const randomSeats = Math.floor(Math.random() * 41);
        initialSeats[`${slot.id}-${major.id}`] =
          randomSeats < 3 ? 0 : randomSeats;
      });
    });
    setSeatsData(initialSeats);
  }, []);

  // --- Logic Helpers ---
  const getSelectedCount = () => Object.keys(selectedMap).length;

  const handleSelect = (sessionId, majorId) => {
    const currentSelection = selectedMap[sessionId];
    const seatsKey = `${sessionId}-${majorId}`;
    const availableSeats = seatsData[seatsKey];

    // Case 1: Deselecting the currently selected item
    if (currentSelection === majorId) {
      const newMap = { ...selectedMap };
      delete newMap[sessionId];
      setSelectedMap(newMap);
      return;
    }

    // Case 2: Selecting a new item
    // Check constraints
    if (availableSeats <= 0) return; // Prevent if full

    if (!currentSelection && getSelectedCount() >= 4) {
      showToast(
        "น้องเลือกครบ 4 รอบแล้วครับ หากต้องการเปลี่ยน กรุณายกเลิกรายการเดิมก่อน"
      );
      return;
    }

    // Update selection
    setSelectedMap((prev) => ({
      ...prev,
      [sessionId]: majorId,
    }));
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

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-32">
      {/* --- Styles --- */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&family=Sarabun:wght@300;400;500;600&display=swap');
          body { font-family: 'Sarabun', sans-serif; }
          h1, h2, h3, h4, h5, h6, .font-prompt { font-family: 'Prompt', sans-serif; }
          
          .custom-scrollbar::-webkit-scrollbar { width: 6px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #fdba74; border-radius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #f97316; }

          .animate-enter { animation: fadeSlideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; transform: translateY(20px); }
          @keyframes fadeSlideUp { to { opacity: 1; transform: translateY(0); } }
        `}
      </style>

      {/* --- Header & Progress Bar (Sticky) --- */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md shadow-sm border-b border-orange-100">
        <div className="container mx-auto px-4 py-4 max-w-5xl">
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

            {/* Progress Badge */}
            <div className="mt-3 md:mt-0 flex items-center bg-orange-50 px-4 py-2 rounded-xl border border-orange-100">
              <div className="mr-3 text-right">
                <span className="block text-xs text-gray-500 font-prompt">
                  เลือกแล้ว
                </span>
                <span
                  className={`font-bold font-prompt text-lg ${
                    getSelectedCount() === 4
                      ? "text-green-600"
                      : "text-orange-600"
                  }`}
                >
                  {getSelectedCount()}{" "}
                  <span className="text-gray-400 text-sm">/ 4</span>
                </span>
              </div>
              <div className="w-10 h-10 relative">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="20"
                    cy="20"
                    r="16"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    className="text-orange-200"
                  />
                  <circle
                    cx="20"
                    cy="20"
                    r="16"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                    className={`${
                      getSelectedCount() === 4
                        ? "text-green-500"
                        : "text-orange-500"
                    } transition-all duration-500`}
                    strokeDasharray={100}
                    strokeDashoffset={100 - (getSelectedCount() / 4) * 100}
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Progress Bar (Mobile Visual) */}
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ease-out rounded-full ${
                getSelectedCount() === 4 ? "bg-green-500" : "bg-orange-500"
              }`}
              style={{ width: `${(getSelectedCount() / 4) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* --- Main Content (Timeline) --- */}
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-4 sm:left-8 top-4 bottom-4 w-0.5 bg-gray-200 z-0"></div>

          {timeSlots.map((slot, index) => {
            const isSelected = !!selectedMap[slot.id];
            const selectedMajorId = selectedMap[slot.id];
            const selectedMajor = majors.find((m) => m.id === selectedMajorId);
            const isExpanded = expandedSession === slot.id;

            return (
              <div
                key={slot.id}
                className={`relative mb-6 pl-12 sm:pl-20 transition-all duration-500 ${
                  isLoaded ? "animate-enter" : ""
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Timeline Dot */}
                <div
                  className={`absolute left-0 sm:left-4 top-6 w-8 h-8 rounded-full border-4 z-10 flex items-center justify-center transition-colors duration-300
                    ${
                      isSelected
                        ? "bg-orange-600 border-orange-100 shadow-lg shadow-orange-200"
                        : "bg-white border-gray-300"
                    }`}
                >
                  {isSelected && (
                    <CheckCircle size={14} className="text-white" />
                  )}
                  {!isSelected && (
                    <span className="text-xs font-bold text-gray-400">
                      {index + 1}
                    </span>
                  )}
                </div>

                {/* Session Card */}
                <div
                  className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden
                  ${
                    isExpanded
                      ? "shadow-xl border-orange-200 ring-1 ring-orange-100"
                      : "shadow-sm border-gray-100 hover:border-orange-200 hover:shadow-md"
                  }`}
                >
                  {/* Card Header (Clickable) */}
                  <div
                    onClick={() => toggleExpand(slot.id)}
                    className="p-5 flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer select-none group"
                  >
                    <div className="flex items-start sm:items-center space-x-4">
                      <div className="bg-orange-50 text-orange-700 px-3 py-1.5 rounded-lg font-prompt font-semibold text-sm whitespace-nowrap">
                        {slot.label}
                      </div>
                      <div>
                        <div className="flex items-center text-gray-800 font-bold font-prompt text-lg">
                          <Clock size={18} className="mr-2 text-gray-400" />
                          {slot.time}
                        </div>
                        {selectedMajor ? (
                          <div className="text-orange-600 text-sm font-medium mt-1 flex items-center animate-enter">
                            <CheckCircle size={14} className="mr-1.5" />
                            เลือก: {selectedMajor.name}
                          </div>
                        ) : (
                          <div className="text-gray-400 text-sm font-light mt-1 group-hover:text-orange-400 transition-colors">
                            ยังไม่ได้เลือกกิจกรรม
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 sm:mt-0 flex items-center justify-end">
                      <div
                        className={`w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 transition-transform duration-300 ${
                          isExpanded
                            ? "rotate-180 bg-orange-100 text-orange-600"
                            : "group-hover:bg-gray-100"
                        }`}
                      >
                        <ChevronDown size={20} />
                      </div>
                    </div>
                  </div>

                  {/* Expandable Content (Activities Grid) */}
                  <div
                    className={`transition-[max-height] duration-500 ease-in-out overflow-hidden bg-gray-50/50 border-t border-gray-100
                      ${
                        isExpanded
                          ? "max-h-[2000px] opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                  >
                    <div className="p-5">
                      <p className="text-sm text-gray-500 mb-4 font-light flex items-center">
                        <BookOpen size={16} className="mr-2" />
                        เลือก 1 สาขาวิชาสำหรับรอบนี้
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {majors.map((major) => {
                          const seatsKey = `${slot.id}-${major.id}`;
                          const remaining = seatsData[seatsKey] || 0;
                          const isFull = remaining === 0;
                          const isActive = selectedMap[slot.id] === major.id;

                          return (
                            <button
                              key={major.id}
                              onClick={() => handleSelect(slot.id, major.id)}
                              disabled={isFull && !isActive}
                              className={`relative p-4 rounded-xl border-2 text-left transition-all duration-300 flex flex-col justify-between h-full group
                                ${
                                  isActive
                                    ? "bg-orange-600 border-orange-600 text-white shadow-lg shadow-orange-200 scale-[1.02]"
                                    : isFull
                                    ? "bg-gray-100 border-gray-100 opacity-60 cursor-not-allowed grayscale"
                                    : "bg-white border-white hover:border-orange-200 hover:shadow-md"
                                }`}
                            >
                              <div className="mb-3">
                                <h4
                                  className={`font-prompt font-semibold text-base mb-1 line-clamp-2 ${
                                    isActive ? "text-white" : "text-gray-800"
                                  }`}
                                >
                                  {major.name}
                                </h4>
                                <div
                                  className={`flex items-center text-xs ${
                                    isActive
                                      ? "text-orange-100"
                                      : "text-gray-500"
                                  }`}
                                >
                                  <MapPin size={12} className="mr-1" />
                                  ห้อง {major.room}
                                </div>
                              </div>

                              <div className="flex items-center justify-between mt-auto pt-3 border-t border-dashed border-opacity-20 border-gray-400">
                                <div
                                  className={`flex items-center text-sm font-medium ${
                                    isActive
                                      ? "text-white"
                                      : isFull
                                      ? "text-red-500"
                                      : "text-green-600"
                                  }`}
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

                              {/* Corner Highlight for Selection */}
                              {isActive && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full"></div>
                              )}
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
            className="flex items-center px-4 py-3 rounded-xl text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-30 disabled:hover:bg-transparent font-medium"
          >
            <Trash2 size={20} className="mr-2" />
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
              disabled={getSelectedCount() === 0}
              className="flex items-center px-8 py-3.5 bg-orange-600 text-white rounded-xl font-prompt font-bold shadow-lg shadow-orange-200 hover:bg-orange-700 hover:-translate-y-1 transition-all duration-300 disabled:bg-gray-300 disabled:shadow-none disabled:translate-y-0 disabled:cursor-not-allowed"
            >
              ยืนยันการเลือก
              <ArrowRight size={20} className="ml-2" />
            </button>
          </div>
        </div>
      </div>

      {/* --- Toast Notification --- */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-full shadow-2xl flex items-center z-50 animate-enter">
          <AlertCircle size={20} className="text-orange-400 mr-3" />
          <span className="font-prompt text-sm">{toastMessage}</span>
        </div>
      )}

      {/* --- Inline Custom Animation --- */}
      <style>{`
        @keyframes bounce-short {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .animate-bounce-short {
          animation: bounce-short 0.5s ease-in-out 1;
        }
      `}</style>
    </div>
  );
};

export default ActivitySelection;
