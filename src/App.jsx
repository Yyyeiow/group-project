// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";   // 기존 메인 내용 옮긴 파일
import WritePage from "./pages/WritePage"; // 글쓰기 페이지 파일
import "./App.css"; // 전체 스타일

function App() {
  return (
    <Router>
      <Header /> {/* 모든 페이지 상단 공통 */}
      <Routes>
        <Route path="/" element={<HomePage />} />        {/* 메인 페이지 */}
        <Route path="/write" element={<WritePage />} />  {/* 글쓰기 페이지 */}
      </Routes>
      <Footer /> {/* 모든 페이지 하단 공통 */}
    </Router>
  );
}

export default App;
