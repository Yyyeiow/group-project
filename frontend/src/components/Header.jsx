

import React, { useState } from 'react';
import './Header.css'; 
import { useNavigate } from "react-router-dom";


const Header = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  
  const handleMouseMove = (e) => {

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePosition({ x: x, y: y });
  };

  const spotlightStyle = {
    clipPath: isHovering 
      ? `circle(120px at ${mousePosition.x}px ${mousePosition.y}px)` 
      : `circle(0px at ${mousePosition.x}px ${mousePosition.y}px)` 
  };
  const navigate = useNavigate();
  return (
    <header 
      className="header"
     
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={() => navigate("/")}
    >
      

      <div className="site-title base-title">
        Music is my life
      </div>
      
     
      <div 
        className="site-title spotlight-title" 
        style={spotlightStyle} 
      >
        Music is my life
      </div>
      

      <div className="search-bar">
        <input type="text" className="search-input" placeholder="가수명 또는 제목 검색" />
       <button
        type="button"
        className="user-icon"
        onClick={() => navigate("/login")}
        style={{ background: "none", border: "none", cursor: "pointer" }}
      >
        <svg
          className="w-16 h-16"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975 M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
            strokeLinejoin="round"
            strokeLinecap="round"
          ></path>
        </svg>
      </button>
      </div>
    </header>
  );
};

export default Header;