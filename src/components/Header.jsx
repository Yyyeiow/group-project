// src/components/Header.jsx

import React, { useState } from 'react';
import '../App.css'; 


const Header = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // 3. 마우스가 움직일 때 좌표를 업데이트하는 함수
  const handleMouseMove = (e) => {
    // ★★★ 여기가 핵심 수정 ★★★
    
    // e.currentTarget은 이벤트 리스너가 "부착된" 요소(<header>)를 가리킵니다.
    // e.target은 마우스가 "실제로 올라간" 요소(<input> 등)를 가리킵니다.
    // e.currentTarget을 기준으로 좌표를 계산해야 합니다.
    
    // 1. 헤더의 사각형 영역 정보를 가져옵니다.
    const rect = e.currentTarget.getBoundingClientRect();
    
    // 2. 마우스의 전체 화면 X, Y 좌표(e.clientX/Y)에서
    //    헤더의 왼쪽, 위쪽 좌표(rect.left/top)를 뺍니다.
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 3. 이렇게 하면 마우스가 검색창 위에 있어도
    //    좌표는 항상 <header>를 기준으로 계산됩니다.
    setMousePosition({ x: x, y: y });
  };

  // 4. 스포트라이트 원(circle)의 스타일을 동적으로 생성
  const spotlightStyle = {
    clipPath: isHovering 
      ? `circle(120px at ${mousePosition.x}px ${mousePosition.y}px)` // 마우스 위치에 120px 원
      : `circle(0px at ${mousePosition.x}px ${mousePosition.y}px)` // 마우스가 나가면 원 크기를 0으로
  };

  return (
    <header 
      className="header"
      // 5. 마우스 이벤트 핸들러를 <header>에 연결
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      
      {/* 레이어 1: 기본이 될 어두운(#505050) 텍스트 로고 */}
      <div className="site-title base-title">
        Music is my life
      </div>
      
      {/* 레이어 2: 빛이 비칠 밝은 텍스트 로고 (clip-path 적용) */}
      <div 
        className="site-title spotlight-title" 
        style={spotlightStyle} /* 6. 동적 스타일 적용 */
      >
        Music is my life
      </div>
      
      {/* 레이어 3: 맨 위에 올 검색창 (z-index로 띄움) */}
      <div className="search-bar">
        <input type="text" className="search-input" placeholder="가수명 또는 제목 검색" />
        <div className="user-icon">
          <svg className="w-16 h-16" stroke="currentColor" strokeWidth="2.5"  viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975 M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" strokeLinejoin="round" strokeLinecap="round"></path>
          </svg>
        </div>
      </div>
    </header>
  );
};

export default Header;