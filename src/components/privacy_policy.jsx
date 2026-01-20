import React, { useState, useEffect } from "react";
import {
  Shield,
  FileText,
  Database,
  Share2,
  UserCheck,
  Camera,
  Mail,
  ArrowUp,
  ChevronRight,
  Lock,
  BookOpen,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

const PrivacyPolicy = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Handle Scroll to show "Back to Top" button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth Scroll Function
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 pb-20">
      {/* --- Styles --- */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&family=Sarabun:wght@300;400;500;600&display=swap');
          body { font-family: 'Sarabun', sans-serif; }
          h1, h2, h3, h4, h5, h6, .font-prompt { font-family: 'Prompt', sans-serif; }
          
          .animate-fade-in-up { 
            animation: fadeInUp 0.8s ease-out forwards; 
            opacity: 0; 
            transform: translateY(20px); 
          }
          
          @keyframes fadeInUp { to { opacity: 1; transform: translateY(0); } }
          
          /* Custom List Bullet */
          ul.custom-list li::before {
            content: "•";
            color: #ea580c;
            font-weight: bold;
            display: inline-block;
            width: 1em;
            margin-left: -1em;
          }
        `}
      </style>

      {/* --- Header --- */}
      <header className="bg-gradient-to-r from-orange-600 to-orange-500 text-white py-12 md:py-16 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/3 -translate-y-1/3">
          <Shield size={400} />
        </div>
        <div className="container mx-auto max-w-4xl relative z-10 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Lock size={32} />
            </div>
            <div>
              <h1 className="font-prompt text-3xl md:text-4xl font-bold mb-2">
                นโยบายความเป็นส่วนตัว
              </h1>
              <p className="text-orange-100 font-light text-lg">
                Education Open House KKU
              </p>
            </div>
          </div>
          <div className="inline-block bg-white/10 px-4 py-1.5 rounded-full text-sm font-light border border-white/20 mt-4 md:mt-0">
            ฉบับปรับปรุงล่าสุดเมื่อ: 20 มกราคม 2569
          </div>
        </div>
      </header>

      {/* --- Main Content --- */}
      <main className="container mx-auto max-w-4xl px-4 -mt-8 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6 md:p-12 animate-fade-in-up">
          {/* Introduction */}
          <section className="mb-10 border-b border-gray-100 pb-8">
            <h2 className="font-prompt text-xl font-bold text-gray-800 mb-4">
              บทนำ
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              คณะศึกษาศาสตร์ มหาวิทยาลัยขอนแก่น ("เรา")
              ตระหนักถึงความสำคัญของการคุ้มครองข้อมูลส่วนบุคคลของท่าน
              ไม่ว่าจะเป็นนักเรียน ผู้ปกครอง หรือบุคลากรทางการศึกษา
              ที่เข้าร่วมกิจกรรม Education Open House KKU
            </p>
            <p className="text-gray-600 leading-relaxed">
              เราจึงจัดทำนโยบายความเป็นส่วนตัวฉบับนี้ขึ้น
              เพื่อชี้แจงรายละเอียดเกี่ยวกับการจัดเก็บ รวบรวม ใช้
              และเปิดเผยข้อมูลส่วนบุคคลของท่าน ให้สอดคล้องกับ{" "}
              <strong>
                พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)
              </strong>
            </p>
          </section>

          {/* Table of Contents */}
          <div className="bg-orange-50 rounded-2xl p-6 mb-12 border border-orange-100">
            <h3 className="font-prompt font-bold text-orange-800 mb-4 flex items-center">
              <BookOpen size={20} className="mr-2" /> สารบัญ
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm font-medium text-gray-600">
              {[
                { id: "sec-1", text: "1. ข้อมูลส่วนบุคคลที่เราจัดเก็บ" },
                { id: "sec-2", text: "2. วัตถุประสงค์การเก็บรวบรวมข้อมูล" },
                { id: "sec-3", text: "3. ระยะเวลาการเก็บรักษาข้อมูล" },
                { id: "sec-4", text: "4. การเปิดเผยข้อมูล" },
                { id: "sec-5", text: "5. สิทธิของเจ้าของข้อมูล" },
                { id: "sec-6", text: "6. ข้อสงวนสิทธิ์เกี่ยวกับภาพถ่าย" },
                { id: "sec-7", text: "7. การติดต่อเรา" },
              ].map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className="flex items-center hover:text-orange-600 transition-colors text-left"
                  >
                    <ChevronRight
                      size={16}
                      className="text-orange-400 mr-1 flex-shrink-0"
                    />
                    {item.text}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* 1. Collected Data */}
          <section id="sec-1" className="mb-12 scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                <FileText size={20} />
              </div>
              <h2 className="font-prompt text-2xl font-bold text-gray-800">
                1. ข้อมูลส่วนบุคคลที่เราจัดเก็บ
              </h2>
            </div>
            <div className="pl-0 md:pl-14 text-gray-600 leading-relaxed space-y-4">
              <p>เราอาจจัดเก็บข้อมูลส่วนบุคคลของท่าน ดังต่อไปนี้:</p>
              <ul className="custom-list space-y-2 pl-4">
                <li>
                  <strong>ข้อมูลส่วนตัว:</strong> ชื่อ-นามสกุล,
                  ระดับชั้นการศึกษา, โรงเรียนต้นสังกัด, หมายเลขโทรศัพท์
                  และที่อยู่อีเมล
                </li>
                <li>
                  <strong>ข้อมูลบัญชีผู้ใช้:</strong> รหัสผ่าน
                  (ซึ่งได้รับการเข้ารหัส), ประวัติการลงทะเบียนกิจกรรม
                  และสถานะการเข้าร่วม
                </li>
                <li>
                  <strong>ข้อมูลทางเทคนิค:</strong> หมายเลข IP Address,
                  ประเภทของอุปกรณ์, ข้อมูล Cookies
                  และประวัติการเข้าใช้งานเว็บไซต์
                </li>
                <li>
                  <strong>ข้อมูลภาพถ่ายและวิดีโอ:</strong>{" "}
                  ภาพบรรยากาศการเข้าร่วมกิจกรรม ทั้งภาพนิ่งและภาพเคลื่อนไหว
                </li>
              </ul>
            </div>
          </section>

          {/* 2. Objectives */}
          <section id="sec-2" className="mb-12 scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                <Database size={20} />
              </div>
              <h2 className="font-prompt text-2xl font-bold text-gray-800">
                2. วัตถุประสงค์การเก็บรวบรวมข้อมูล
              </h2>
            </div>
            <div className="pl-0 md:pl-14 text-gray-600 leading-relaxed">
              <p className="mb-3">
                เราจัดเก็บและใช้ข้อมูลของท่านเพื่อวัตถุประสงค์ดังนี้:
              </p>
              <ul className="custom-list space-y-2 pl-4">
                <li>
                  เพื่อการลงทะเบียนยืนยันตัวตน (Check-in)
                  และระบบรักษาความปลอดภัย (OTP)
                </li>
                <li>
                  เพื่อการออกเกียรติบัตรอิเล็กทรอนิกส์ (E-Certificate)
                  สำหรับผู้เข้าร่วมกิจกรรม
                </li>
                <li>
                  เพื่อการวิเคราะห์ข้อมูลเชิงสถิติ
                  ปรับปรุงรูปแบบการจัดกิจกรรมในอนาคต
                </li>
                <li>
                  เพื่อการประชาสัมพันธ์ข่าวสารโครงการ
                  และกิจกรรมของคณะศึกษาศาสตร์
                </li>
                <li>
                  เพื่อใช้ในการติดต่อสื่อสารกรณีฉุกเฉิน
                  หรือแจ้งการเปลี่ยนแปลงกำหนดการ
                </li>
              </ul>
            </div>
          </section>

          {/* 3. Retention Period */}
          <section id="sec-3" className="mb-12 scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                <Shield size={20} />
              </div>
              <h2 className="font-prompt text-2xl font-bold text-gray-800">
                3. ระยะเวลาการเก็บรักษาข้อมูล
              </h2>
            </div>
            <div className="pl-0 md:pl-14 text-gray-600 leading-relaxed">
              <p>
                เราจะเก็บรักษาข้อมูลส่วนบุคคลของท่านเป็นระยะเวลา{" "}
                <strong>ไม่เกิน 1 ปี</strong> นับจากวันที่สิ้นสุดกิจกรรม
                หรือจนกว่าท่านจะแจ้งความประสงค์ให้ลบข้อมูลออกจากระบบ
                เพื่อประโยชน์ในการตรวจสอบย้อนหลังและการออกเกียรติบัตรทดแทน
              </p>
            </div>
          </section>

          {/* 4. Disclosure */}
          <section id="sec-4" className="mb-12 scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                <Share2 size={20} />
              </div>
              <h2 className="font-prompt text-2xl font-bold text-gray-800">
                4. การเปิดเผยข้อมูล
              </h2>
            </div>
            <div className="pl-0 md:pl-14 text-gray-600 leading-relaxed">
              <p>
                เรา <strong>ไม่มีนโยบายจำหน่าย จ่าย แจก หรือแลกเปลี่ยน</strong>{" "}
                ข้อมูลส่วนบุคคลของท่านให้กับบุคคลภายนอก
                ข้อมูลของท่านจะถูกเปิดเผยเฉพาะกับ:
              </p>
              <ul className="custom-list space-y-2 pl-4 mt-2">
                <li>
                  ผู้ให้บริการระบบสารสนเทศที่ทำหน้าที่ดูแลเว็บไซต์
                  (ภายใต้สัญญาปกปิดข้อมูล)
                </li>
                <li>
                  หน่วยงานภายในมหาวิทยาลัยขอนแก่นที่เกี่ยวข้องกับการประมวลผลผลการเรียนหรือการรับเข้าศึกษา
                </li>
                <li>หน่วยงานราชการตามที่กฎหมายกำหนด (หากมีการร้องขอ)</li>
              </ul>
            </div>
          </section>

          {/* 5. User Rights */}
          <section id="sec-5" className="mb-12 scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                <UserCheck size={20} />
              </div>
              <h2 className="font-prompt text-2xl font-bold text-gray-800">
                5. สิทธิของเจ้าของข้อมูลส่วนบุคคล
              </h2>
            </div>
            <div className="pl-0 md:pl-14 text-gray-600 leading-relaxed">
              <p className="mb-3">ท่านมีสิทธิตามกฎหมาย PDPA ดังนี้:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <h4 className="font-bold text-gray-800 mb-1">
                    สิทธิขอเข้าถึง
                  </h4>
                  <p className="text-sm">
                    ขอเข้าถึงหรือขอรับสำเนาข้อมูลส่วนบุคคลของท่าน
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <h4 className="font-bold text-gray-800 mb-1">สิทธิขอแก้ไข</h4>
                  <p className="text-sm">
                    ขอแก้ไขข้อมูลให้ถูกต้อง เป็นปัจจุบัน และสมบูรณ์
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <h4 className="font-bold text-gray-800 mb-1">
                    สิทธิขอลบข้อมูล
                  </h4>
                  <p className="text-sm">
                    ขอให้ลบหรือทำลายข้อมูลเมื่อหมดความจำเป็น
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <h4 className="font-bold text-gray-800 mb-1">
                    สิทธิถอนความยินยอม
                  </h4>
                  <p className="text-sm">
                    ถอนความยินยอมในการเก็บรวบรวมข้อมูลได้ทุกเมื่อ
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 6. Photo Disclaimer */}
          <section id="sec-6" className="mb-12 scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                <Camera size={20} />
              </div>
              <h2 className="font-prompt text-2xl font-bold text-gray-800">
                6. ข้อสงวนสิทธิ์เกี่ยวกับภาพถ่ายกิจกรรม
              </h2>
            </div>
            <div className="pl-0 md:pl-14 text-gray-600 leading-relaxed">
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg">
                <p>
                  ภายในงานจะมีการบันทึกภาพนิ่งและภาพเคลื่อนไหวโดยช่างภาพของโครงการ
                  เพื่อใช้ในการประชาสัมพันธ์ หากท่านไม่ประสงค์ให้บันทึกภาพ
                  หรือต้องการให้นำภาพของท่านออกจากสื่อประชาสัมพันธ์
                  ท่านสามารถแจ้งเจ้าหน้าที่ ณ จุดลงทะเบียน
                  หรือติดต่อเราผ่านช่องทางที่ระบุไว้
                </p>
              </div>
            </div>
          </section>

          {/* 7. Contact */}
          <section id="sec-7" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                <Mail size={20} />
              </div>
              <h2 className="font-prompt text-2xl font-bold text-gray-800">
                7. การติดต่อเรา
              </h2>
            </div>
            <div className="pl-0 md:pl-14 text-gray-600 leading-relaxed">
              <p className="mb-4">
                หากท่านมีข้อสงสัยเกี่ยวกับนโยบายความเป็นส่วนตัว
                หรือต้องการใช้สิทธิของเจ้าของข้อมูลส่วนบุคคล
                สามารถติดต่อผู้ประสานงานโครงการได้ที่:
              </p>

              <div className="bg-white border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-orange-300 transition-colors">
                <h4 className="font-prompt font-bold text-lg text-gray-800 mb-2">
                  ผู้ประสานงานโครงการ Education Open House
                </h4>
                <p className="mb-1">
                  สโมสรนักศึกษาคณะศึกษาศาสตร์ มหาวิทยาลัยขอนแก่น
                </p>
                <div className="flex flex-col md:flex-row gap-4 mt-4">
                  <a
                    href="mailto:technosamoed66@gmail.com"
                    className="flex items-center text-orange-600 hover:text-orange-700 font-medium"
                  >
                    <Mail size={18} className="mr-2" />
                    technosamoed66@gmail.com
                  </a>
                  <a
                    href="#"
                    className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <Share2 size={18} className="mr-2" />
                    Facebook: สโมสรนักศึกษาคณะศึกษาศาสตร์ มข.
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto max-w-4xl px-4 mt-8 text-center text-gray-400 text-sm font-light">
        <p>
          &copy; 2026 Faculty of Education, Khon Kaen University. All rights
          reserved.
        </p>
      </footer>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 bg-orange-600 text-white p-3 rounded-full shadow-lg hover:bg-orange-700 hover:-translate-y-1 transition-all duration-300 z-50 ${showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"}`}
      >
        <ArrowUp size={24} />
      </button>
    </div>
  );
};

export default PrivacyPolicy;
