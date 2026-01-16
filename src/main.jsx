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
import Register from "./components/register.jsx";
import Login from "./components/login.jsx";
import Test from "./components/test.jsx";
import "./index.css";

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
        <Route path="/test" element={<Test />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
