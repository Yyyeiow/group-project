// Header.jsx
import React, { useState, useEffect } from 'react'; 
import './Header.css'; 
import { useNavigate } from "react-router-dom";
import UserMenu from './UserMenu'; 

const Header = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const navigate = useNavigate();

  // 기본값은 false(로그아웃 상태)로 시작
  const [isLoggedIn, setIsLoggedIn] = useState(false); 

  // 1. 토큰 확인 함수
  const checkLoginStatus = () => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); // 토큰이 있으면 true, 없으면 false
  };

  // 2. 페이지 로드 시 & localStorage 변경 시 토큰 확인
  useEffect(() => {
    checkLoginStatus(); // 초기 체크
    
    // storage 이벤트 리스너 (다른 탭에서 변경 감지)
    window.addEventListener('storage', checkLoginStatus);
    
    // 커스텀 이벤트 리스너 (같은 탭에서 로그인/로그아웃 감지)
    window.addEventListener('loginStatusChanged', checkLoginStatus);
    
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('loginStatusChanged', checkLoginStatus);
    };
  }, []);

  // 3. 로그아웃 처리 함수
  const handleLogoutProcess = () => {
    // 저장소에서 토큰 삭제
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    
    // 화면 상태를 '로그아웃'으로 변경
    setIsLoggedIn(false);
    
    // 로그인 상태 변경 이벤트 발생
    window.dispatchEvent(new Event('loginStatusChanged'));
    
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

  const handleSearch = (e) => {
    e.stopPropagation();
    if (searchKeyword.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(searchKeyword.trim())}`);
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
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
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyPress={handleSearchKeyPress}
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