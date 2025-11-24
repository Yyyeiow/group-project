// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./Pages/HomePage";  
import WritePage from "./Pages/WritePage"; 
import LoginPage from "./Pages/LoginPage";
import "./App.css"; 

function App() {
  return (
    <Router>
       <Header /> 
      <Routes>
       
        <Route path="/" element={<HomePage />} />        
        <Route path="/write" element={<WritePage />} />  
        <Route path="/login" element={<LoginPage />}/>
      </Routes>
      <Footer /> {/* 모든 페이지 하단 공통 */}
    </Router>
  );
}

export default App;
