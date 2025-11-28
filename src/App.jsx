// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MyFeed from "./Pages/MyFeed";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Change from "./Pages/Change";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Change />} />
         {/* 회원가입 */}
        <Route path="/signup" element={<Signup />} />

        {/* 로그인 */}
        <Route path="/login" element={<Login />} />

        <Route path="/myfeed" element={<MyFeed />} />
       
        <Route path="/change" element={<Change />} />
      </Routes>
    </Router>
  );
}

export default App;
