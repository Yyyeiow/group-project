// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./Pages/HomePage";  
import WritePage from "./Pages/WritePage"; 
import LoginPage from "./Pages/LoginPage";
import MyPage from "./Pages/MyPage";
import ChangeId from "./Pages/ChangeId";
import SavedPostsPage from "./Pages/SavedPostsPage";
import SearchResultPage from "./Pages/SearchResultPage";
import "./App.css"; 

function App() {
  return (
    <Router>
       <Header /> 
      <Routes>
       
        <Route path="/" element={<HomePage />} />        
        <Route path="/write" element={<WritePage />} />  
        <Route path="/login" element={<LoginPage />}/>
        <Route path="/mypage" element={<MyPage />}/>
        <Route path="/changeid" element={<ChangeId />}/>
        <Route path="/saved" element={<SavedPostsPage />}/>
        <Route path="/search" element={<SearchResultPage />}/>
      </Routes>
      <Footer /> 
    </Router>
  );
}

export default App;
