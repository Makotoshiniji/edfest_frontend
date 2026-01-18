// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import Register from "./components/register.jsx";
import Login from "./components/login.jsx";
import UserDashboard from "./components/UserDashboard.jsx";
import Round_select from "./components/round_select.jsx";
import ForgotPassword from "./components/forgot_password.jsx";
import ResetPassword from "./components/reset_password.jsx";
import EmailVerification from "./components/verify_email.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user_dashboard" element={<UserDashboard />} />
        <Route path="/round_select" element={<Round_select />} />

        {/* หน้าลืมรหัสผ่าน (เข้าได้เลย) */}
        <Route path="/forgot_password" element={<ForgotPassword />} />

        {/* --- แก้ไข 2 บรรทัดนี้ (ลบ /:token ออก) --- */}
        <Route path="/reset_password" element={<ResetPassword />} />
        <Route path="/verify_email" element={<EmailVerification />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
