// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // import เพิ่ม
import App from "./App.jsx";
import "./index.css";
import Register from "./components/register.jsx";
import Login from "./components/login.jsx";
import UserDashboard from "./components/UserDashboard.jsx";
import Round_select from "./components/round_select.jsx";
import ForgotPassword from "./components/forgot_password.jsx";
import ResetPassword from "./components/reset_password.jsx";
import EmailVerification from "./components/email_verification.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* เส้นทางหลัก (หน้าแรก) โชว์ App */}
        <Route path="/" element={<App />} />

        {/* เส้นทางสมัครสมาชิก โชว์ Register */}
        <Route path="/register" element={<Register />} />
        {/* เส้นทางเข้าสู่ระบบ โชว์ login */}
        <Route path="/login" element={<Login />} />
        <Route path="/userdashboard" element={<UserDashboard />} />
        <Route path="/round_select" element={<Round_select />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<EmailVerification />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
