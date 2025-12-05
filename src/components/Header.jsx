// Header.jsx
import React, { useState, useEffect } from 'react'; 
import './Header.css'; 
import { useNavigate } from "react-router-dom";
import UserMenu from './UserMenu'; 

const Header = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const navigate = useNavigate();

  // [수정] 기본값은 false(로그아웃 상태)로 시작하는 것이 안전합니다.
  const [isLoggedIn, setIsLoggedIn] = useState(true); 

  // 1. 페이지 로드 시 토큰 확인 (새로고침 해도 로그인 유지)
  useEffect(() => {
    const token = localStorage.getItem('login-token');
    if (token) {
      setIsLoggedIn(true); // 토큰이 있으면 로그인 상태로 변경
    }
  }, []); // [] : 처음 한 번만 실행

  // 2. 로그아웃 처리 함수
  const handleLogoutProcess = () => {
    // 저장소에서 토큰 삭제
    localStorage.removeItem('login-token');
    
    // 화면 상태를 '로그아웃'으로 변경
    setIsLoggedIn(false);
    
    // 메인 페이지로 이동 및 알림
    navigate("/");
    alert("로그아웃 되었습니다.");
  };

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

  return (
    <header 
      className="header"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={() => navigate("/")}
    >
      <div className="site-title base-title">Music is my life</div>
      <div className="site-title spotlight-title" style={spotlightStyle}>
        Music is my life
      </div>
      
      <div className="search-bar">
        <input 
            type="text" 
            className="search-input" 
            placeholder="가수명 또는 제목 검색" 
            onClick={(e) => e.stopPropagation()} 
        />
        
        {/* 로그인 상태에 따라 다르게 보여주기 */}
        {isLoggedIn ? (
          /* 로그인 상태: UserMenu에 로그아웃 함수 전달 */
          <UserMenu onLogout={handleLogoutProcess} />
        ) : (
          /* 로그아웃 상태: 로그인 버튼 표시 */
          <button 
            className="login-text-btn"
            onClick={(e) => {
              e.stopPropagation(); 
              navigate("/login");
            }}
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;