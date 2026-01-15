import React, { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  GraduationCap,
  Users,
  BookOpen,
  Calendar,
  MapPin,
  ChevronRight,
  LogIn,
  UserPlus,
  ArrowRight,
  Star,
  Heart,
} from "lucide-react";

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Simulation of Loading Screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2800); // Show loading for 2.8 seconds
    return () => clearTimeout(timer);
  }, []);

  // Intersection Observer for Scroll Animations
  useEffect(() => {
    if (!isLoading) {
      const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.15, // Trigger when 15% visible
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      const elements = document.querySelectorAll(
        ".fade-in-section, .slide-in-left, .slide-in-right, .scale-up"
      );
      elements.forEach((el) => observer.observe(el));

      return () => observer.disconnect();
    }
  }, [isLoading]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  // --- Loading Screen Component ---
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-orange-50/90 backdrop-blur-sm flex flex-col items-center justify-center z-50">
        <div className="relative">
          {/* Pulsing Background */}
          <div className="absolute inset-0 bg-orange-200 rounded-full animate-ping opacity-20"></div>

          {/* Main Icon Animation */}
          <div className="relative z-10 w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl shadow-orange-100 animate-bounce-slow">
            <GraduationCap className="w-12 h-12 text-orange-600" />
          </div>
        </div>

        {/* Loading Text */}
        <div className="mt-8 space-y-2 text-center">
          <h2 className="text-2xl font-bold text-orange-800 font-prompt tracking-wide animate-pulse">
            Education Open House
          </h2>
          <p className="text-orange-600/70 text-sm font-sarabun">
            Khon Kaen University
          </p>
        </div>

        {/* Custom Loading Keyframes */}
        <style>{`
          @keyframes bounce-slow {
            0%, 100% { transform: translateY(-5%); animation-timing-function: cubic-bezier(0.8, 0, 1, 1); }
            50% { transform: translateY(0); animation-timing-function: cubic-bezier(0, 0, 0.2, 1); }
          }
          .animate-bounce-slow {
            animation: bounce-slow 2s infinite;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 overflow-x-hidden selection:bg-orange-100 selection:text-orange-900">
      {/* --- Global Styles & Custom Animations --- */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&family=Sarabun:wght@300;400;500;600&display=swap');
          
          body { font-family: 'Sarabun', sans-serif; }
          h1, h2, h3, h4, h5, h6, .font-prompt { font-family: 'Prompt', sans-serif; }

          /* Smooth Scroll Behavior */
          html { scroll-behavior: smooth; }

          /* 1. Hero Animations */
          .hero-animate-up {
            opacity: 0;
            transform: translateY(30px);
            animation: heroFadeUp 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
          }
          .delay-100 { animation-delay: 0.1s; }
          .delay-200 { animation-delay: 0.3s; }
          .delay-300 { animation-delay: 0.5s; }

          @keyframes heroFadeUp {
            to { opacity: 1; transform: translateY(0); }
          }

          /* 2. Scroll Trigger Animations */
          .fade-in-section {
            opacity: 0;
            transform: translateY(40px);
            transition: opacity 1s ease-out, transform 1s cubic-bezier(0.2, 0.8, 0.2, 1);
          }
          .slide-in-left {
            opacity: 0;
            transform: translateX(-50px);
            transition: all 1s cubic-bezier(0.2, 0.8, 0.2, 1);
          }
          .slide-in-right {
            opacity: 0;
            transform: translateX(50px);
            transition: all 1s cubic-bezier(0.2, 0.8, 0.2, 1);
          }
          .scale-up {
            opacity: 0;
            transform: scale(0.95);
            transition: all 0.8s ease-out;
          }
          
          .is-visible {
            opacity: 1;
            transform: translate(0) scale(1);
          }

          /* 3. Floating Animation (Icons) */
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          .animate-float {
            animation: float 4s ease-in-out infinite;
          }
          .animate-float-delayed {
            animation: float 5s ease-in-out infinite 1s;
          }

          /* 4. Button Animations */
          .btn-primary-hover {
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .btn-primary-hover:hover {
            transform: translateY(-2px) scale(1.02);
            box-shadow: 0 10px 25px -5px rgba(234, 88, 12, 0.4);
          }
          
          .btn-secondary-hover {
            position: relative;
            z-index: 1;
            overflow: hidden;
            transition: color 0.3s;
          }
          .btn-secondary-hover::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            border-radius: 9999px;
            border: 2px solid transparent;
            transition: all 0.4s ease;
            z-index: -1;
          }
          .btn-secondary-hover:hover {
            box-shadow: 0 0 15px rgba(251, 146, 60, 0.3);
            border-color: #f97316;
            color: #ea580c;
          }
        `}
      </style>

      {/* --- Navbar --- */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-orange-100/50 transition-all duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-200 transition-transform duration-500 group-hover:rotate-12">
                <GraduationCap size={22} />
              </div>
              <div className="flex flex-col">
                <span className="font-prompt font-bold text-xl text-gray-800 leading-none group-hover:text-orange-600 transition-colors">
                  ED KKU
                </span>
                <span className="font-sarabun text-xs text-gray-500 tracking-wide">
                  Open House 2024
                </span>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {["หน้าหลัก", "เกี่ยวกับงาน", "กำหนดการ", "ติดต่อเรา"].map(
                (item, index) => {
                  const sectionIds = ["home", "about", "schedule", "contact"];
                  return (
                    <button
                      key={index}
                      onClick={() => scrollToSection(sectionIds[index])}
                      className="font-prompt text-sm font-medium text-gray-600 hover:text-orange-600 transition-colors relative group"
                    >
                      {item}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100"></span>
                    </button>
                  );
                }
              )}

              <div className="h-6 w-px bg-gray-200 mx-2"></div>

              <div className="flex items-center space-x-3">
                <button className="font-prompt text-sm font-medium px-5 py-2 rounded-full border border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-600 transition-all duration-300 btn-secondary-hover bg-white">
                  เข้าสู่ระบบ
                </button>
                <button className="font-prompt text-sm font-medium px-5 py-2 rounded-full bg-orange-600 text-white shadow-md shadow-orange-100 btn-primary-hover">
                  สมัครเข้าร่วม
                </button>
              </div>
            </div>

            {/* Mobile Toggle */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-500 hover:text-orange-600 transition-colors"
              >
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden bg-white border-b border-gray-100 overflow-hidden transition-all duration-500 ease-in-out ${
            isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-6 py-8 space-y-4">
            {["หน้าหลัก", "เกี่ยวกับงาน", "กำหนดการ", "ติดต่อเรา"].map(
              (item, index) => (
                <button
                  key={index}
                  onClick={() =>
                    scrollToSection(
                      ["home", "about", "schedule", "contact"][index]
                    )
                  }
                  className="block w-full text-left font-prompt text-lg font-medium text-gray-600 hover:text-orange-600 py-2 border-b border-gray-50"
                >
                  {item}
                </button>
              )
            )}
            <div className="pt-6 flex flex-col gap-3">
              <button className="w-full py-3 border border-orange-200 text-orange-600 font-bold rounded-xl bg-orange-50/50">
                เข้าสู่ระบบ
              </button>
              <button className="w-full py-3 bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-200">
                สมัครเข้าร่วมกิจกรรม
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <header
        id="home"
        className="relative pt-16 pb-24 lg:pt-32 lg:pb-40 overflow-hidden bg-orange-50/30"
      >
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-orange-100/40 rounded-full blur-3xl opacity-50 animate-float-delayed"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-yellow-100/40 rounded-full blur-3xl opacity-50 animate-float"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Text Content */}
            <div className="lg:w-1/2 text-center lg:text-left">
              <div className="hero-animate-up inline-flex items-center px-3 py-1 rounded-full bg-orange-100 border border-orange-200 mb-6">
                <span className="w-2 h-2 rounded-full bg-orange-500 mr-2 animate-pulse"></span>
                <span className="text-xs font-semibold text-orange-700 tracking-wide uppercase">
                  KKU Open House 2024
                </span>
              </div>

              <h1 className="hero-animate-up delay-100 font-prompt text-5xl lg:text-7xl font-bold text-gray-900 leading-[1.1] mb-6">
                เปิดประตูสู่ <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400">
                  วิชาชีพครู
                </span>
              </h1>

              <p className="hero-animate-up delay-200 text-lg text-gray-600 font-sarabun font-light leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0">
                ยินดีต้อนรับสู่คณะศึกษาศาสตร์ มหาวิทยาลัยขอนแก่น
                พื้นที่แห่งการเรียนรู้และแรงบันดาลใจ
                มาร่วมค้นหาตัวตนและเตรียมความพร้อมสู่อนาคตที่สดใส
              </p>

              <div className="hero-animate-up delay-300 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button className="w-full sm:w-auto px-8 py-4 bg-orange-600 text-white rounded-full font-prompt font-semibold text-lg shadow-xl shadow-orange-200 btn-primary-hover flex items-center justify-center gap-2 group">
                  สมัครเข้าร่วมกิจกรรม
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
                <button className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-full font-prompt font-medium text-lg btn-secondary-hover">
                  เข้าสู่ระบบสมาชิก
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="hero-animate-up delay-300 mt-12 flex items-center justify-center lg:justify-start gap-8 opacity-70">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden"
                    >
                      <img
                        src={`https://i.pravatar.cc/100?img=${i + 10}`}
                        alt="User"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-orange-100 flex items-center justify-center text-xs font-bold text-orange-600">
                    +2k
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  <p className="font-bold text-gray-800">2,500+</p>
                  <p>นักเรียนที่เข้าร่วม</p>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="lg:w-1/2 relative hero-animate-up delay-200">
              <div className="relative z-10 rounded-[2rem] overflow-hidden shadow-2xl shadow-orange-100 bg-white p-2">
                <div className="relative rounded-[1.5rem] overflow-hidden aspect-[4/3] group">
                  {/* Orange Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-transparent pointer-events-none z-10"></div>

                  <img
                    src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                    alt="Education Activity"
                    className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-105"
                  />

                  {/* Floating Elements on Image */}
                  <div className="absolute bottom-6 left-6 right-6 z-20">
                    <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                          <BookOpen size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-gray-800">
                            Workshop การสอน
                          </p>
                          <p className="text-xs text-gray-500">
                            ทดลองเป็นครูยุคใหม่
                          </p>
                        </div>
                      </div>
                      <div className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">
                        Open
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Icons Outside */}
              <div className="absolute -top-8 -right-8 w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center text-yellow-500 animate-float z-20">
                <Star fill="currentColor" size={32} />
              </div>
              <div className="absolute -bottom-6 -left-4 w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center text-pink-500 animate-float-delayed z-20">
                <Heart fill="currentColor" size={28} />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* --- Features Section --- */}
      <section id="about" className="py-24 bg-white relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20 fade-in-section">
            <span className="text-orange-600 font-bold tracking-wider text-sm uppercase mb-2 block">
              Highlights
            </span>
            <h2 className="font-prompt text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              กิจกรรมที่ <span className="text-orange-600">คัดสรร</span>{" "}
              มาเพื่อคุณ
            </h2>
            <p className="text-gray-500 font-light text-lg">
              เปิดโลกทัศน์ทางการศึกษา สัมผัสประสบการณ์จริง
              และเตรียมความพร้อมสู่มหาวิทยาลัย
              ด้วยกิจกรรมที่หลากหลายและเป็นประโยชน์
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Users size={32} />,
                title: "พบปะรุ่นพี่ & อาจารย์",
                desc: "พูดคุยแลกเปลี่ยนประสบการณ์แบบเป็นกันเอง เพื่อสร้างแรงบันดาลใจ",
                color: "bg-blue-50 text-blue-600",
              },
              {
                icon: <BookOpen size={32} />,
                title: "แนะนำหลักสูตร",
                desc: "เจาะลึกรายละเอียดสาขาวิชาต่างๆ ที่เปิดสอนในคณะศึกษาศาสตร์",
                color: "bg-orange-50 text-orange-600",
              },
              {
                icon: <GraduationCap size={32} />,
                title: "จำลองห้องเรียน",
                desc: "ทดลองเรียนในบรรยากาศจริง สนุกสนานและได้ความรู้",
                color: "bg-green-50 text-green-600",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="scale-up bg-white rounded-[2rem] p-8 border border-gray-100 shadow-lg shadow-gray-100 hover:shadow-xl hover:shadow-orange-50 transition-all duration-500 group"
              >
                <div
                  className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <div
                    className="animate-float"
                    style={{ animationDelay: `${idx * 0.5}s` }}
                  >
                    {feature.icon}
                  </div>
                </div>
                <h3 className="font-prompt text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-500 font-light leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Gallery / Schedule Preview --- */}
      <section id="schedule" className="py-24 bg-gray-50 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12">
            <div className="slide-in-left">
              <h2 className="font-prompt text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                ภาพบรรยากาศ{" "}
                <span className="text-orange-600">ความประทับใจ</span>
              </h2>
              <p className="text-gray-500 font-light">
                รอยยิ้มและความทรงจำดีๆ จากกิจกรรมในปีที่ผ่านมา
              </p>
            </div>
            <div className="slide-in-right mt-6 md:mt-0">
              <button className="flex items-center text-orange-600 font-semibold hover:text-orange-700 transition-colors group">
                ดูแกลเลอรี่ทั้งหมด
                <ChevronRight className="ml-1 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 h-[400px] md:h-[500px]">
            {/* Gallery Grid Items with Staggered Animation */}
            <div className="col-span-2 row-span-2 rounded-3xl overflow-hidden relative group cursor-pointer fade-in-section">
              <img
                src="https://images.unsplash.com/photo-1544531586-fde5298cdd40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Activity"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
            </div>
            <div
              className="col-span-1 row-span-1 rounded-3xl overflow-hidden relative group cursor-pointer fade-in-section"
              style={{ transitionDelay: "100ms" }}
            >
              <img
                src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                alt="Activity"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <div
              className="col-span-1 row-span-1 rounded-3xl overflow-hidden relative group cursor-pointer fade-in-section"
              style={{ transitionDelay: "200ms" }}
            >
              <img
                src="https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                alt="Activity"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            <div
              className="col-span-2 row-span-1 rounded-3xl overflow-hidden relative group cursor-pointer fade-in-section"
              style={{ transitionDelay: "300ms" }}
            >
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Activity"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA Section --- */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-orange-600 to-orange-500 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden fade-in-section">
            {/* Decorative Circles */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

            <div className="relative z-10">
              <h2 className="font-prompt text-3xl md:text-5xl font-bold text-white mb-6">
                พร้อมจะเป็น{" "}
                <span className="text-orange-200">"ครูมืออาชีพ"</span> หรือยัง?
              </h2>
              <p className="text-orange-50 text-lg mb-10 font-light max-w-2xl mx-auto">
                อย่าพลาดโอกาสดีๆ ในการเริ่มต้นเส้นทางสู่อนาคต
                มาร่วมเป็นส่วนหนึ่งของครอบครัวศึกษาศาสตร์ มข.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <button className="px-10 py-4 bg-white text-orange-600 rounded-full font-prompt font-bold text-lg shadow-xl hover:bg-gray-50 hover:scale-105 transition-all duration-300">
                  ลงทะเบียนทันที
                </button>
                <button className="px-10 py-4 bg-transparent border-2 border-white/40 text-white rounded-full font-prompt font-bold text-lg hover:bg-white/10 transition-all duration-300">
                  สอบถามเพิ่มเติม
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer
        id="contact"
        className="bg-gray-50 border-t border-gray-200 pt-20 pb-10"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 fade-in-section">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center text-white">
                  <GraduationCap size={20} />
                </div>
                <span className="font-prompt font-bold text-2xl text-gray-800">
                  ED KKU
                </span>
              </div>
              <p className="text-gray-500 font-light leading-relaxed mb-6 max-w-sm">
                คณะศึกษาศาสตร์ มหาวิทยาลัยขอนแก่น
                <br />
                แหล่งเรียนรู้ชั้นนำ
                เพื่อสร้างสรรค์นวัตกรรมทางการศึกษาและพัฒนาวิชาชีพครูสู่สากล
              </p>
              <div className="flex space-x-4">
                {/* Social Icons with Hover Glow */}
                {["Facebook", "Youtube", "Twitter"].map((social, i) => (
                  <button
                    key={i}
                    className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-orange-600 hover:border-orange-200 hover:shadow-lg hover:shadow-orange-100 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <span className="sr-only">{social}</span>
                    <div className="w-4 h-4 bg-current rounded-sm"></div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-prompt font-bold text-gray-900 mb-6">
                เมนูลัด
              </h4>
              <ul className="space-y-3 text-gray-500 font-light">
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-600 transition-colors inline-block hover:translate-x-1 duration-300"
                  >
                    หน้าหลัก
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-600 transition-colors inline-block hover:translate-x-1 duration-300"
                  >
                    เกี่ยวกับคณะ
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-600 transition-colors inline-block hover:translate-x-1 duration-300"
                  >
                    หลักสูตร
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-600 transition-colors inline-block hover:translate-x-1 duration-300"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-prompt font-bold text-gray-900 mb-6">
                ติดต่อเรา
              </h4>
              <ul className="space-y-4 text-gray-500 font-light text-sm">
                <li className="flex items-start">
                  <MapPin
                    size={18}
                    className="mr-3 text-orange-500 flex-shrink-0 mt-1"
                  />
                  <span>
                    123 หมู่ 16 ถ.มิตรภาพ ต.ในเมือง <br /> อ.เมือง จ.ขอนแก่น
                    40002
                  </span>
                </li>
                <li className="flex items-center">
                  <div className="w-4 h-4 mr-3 flex items-center justify-center text-orange-500">
                    @
                  </div>
                  <span>education@kku.ac.th</span>
                </li>
                <li className="flex items-center">
                  <Calendar size={18} className="mr-3 text-orange-500" />
                  <span>จันทร์ - ศุกร์ : 08.30 - 16.30 น.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm font-light">
            <p>&copy; 2024 Faculty of Education, Khon Kaen University.</p>
            <div className="mt-4 md:mt-0 space-x-6">
              <a href="#" className="hover:text-orange-600 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-orange-600 transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
