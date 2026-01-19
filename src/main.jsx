// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import Register from "./components/register.jsx";
import Login from "./components/login.jsx";
import UserDashboard from "./components/user_dashboard.jsx";
import Round_select from "./components/round_select.jsx";
import ForgotPassword from "./components/forgot_password.jsx";
import ResetPassword from "./components/reset_password.jsx";
import VerifyOTPResetpassword from "./components/verify_opt_resetpassword.jsx";
import EditProfile from "./components/edit_profile.jsx";
import AdminLogin from "./components/admin_login.jsx";
import AdminDashboard from "./components/admin_dashboard.jsx";
import AdminUserDetail from "./components/admin_user_detail";

// 🔥 1. เพิ่มบรรทัดนี้: Import หน้า VerifyMail
import VerifyMail from "./components/verify_mail.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/register" element={<Register />} />

        {/* 🔥 2. เพิ่มบรรทัดนี้: สร้าง Route สำหรับหน้ายืนยันอีเมล */}
        <Route path="/verify_mail" element={<VerifyMail />} />

        <Route path="/login" element={<Login />} />
        <Route path="/user_dashboard" element={<UserDashboard />} />
        <Route path="/round_select" element={<Round_select />} />
        <Route path="/edit_profile" element={<EditProfile />} />

        {/* หน้าลืมรหัสผ่าน */}
        <Route path="/forgot_password" element={<ForgotPassword />} />
        <Route path="/reset_password" element={<ResetPassword />} />
        <Route
          path="/verify_opt_resetpassword"
          element={<VerifyOTPResetpassword />}
        />

        {/* หน้า Admin */}
        <Route path="/admin_login" element={<AdminLogin />} />
        <Route path="/admin_dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users/:id" element={<AdminUserDetail />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
