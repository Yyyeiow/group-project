// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Header from "./components/Header";
// import Footer from "./components/Footer";
import MyFeed from "./Pages/MyFeed";

import "./App.css";

function App() {
  return (
    <Router>
      {/* <Header /> */}
      <Routes>
        <Route path="/" element={<MyFeed />} />
      </Routes>
      {/* <Footer /> */}
    </Router>
  );
}

export default App;

