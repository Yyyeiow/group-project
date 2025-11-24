// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MyFeed from "./Pages/MyFeed";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* 회원가입 */}
        <Route path="/signup" element={<Signup />} />

        {/* 로그인 */}
        <Route path="/login" element={<Login />} />

        {/* 로그인 후 보이는 페이지 (예시) */}
        <Route path="/myfeed" element={<MyFeed />} />
      </Routes>
    </Router>
  );
}

export default App;
