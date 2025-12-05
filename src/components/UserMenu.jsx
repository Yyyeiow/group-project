// UserMenu.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserMenu.css'; 

const UserMenu = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogoutClick = () => {

    if (onLogout) {
      onLogout(); 
    }
  };

  return (
    <div 
      className="user-menu-container"
      onMouseEnter={() => setIsOpen(true)} 
      onMouseLeave={() => setIsOpen(false)} 
      onClick={(e) => e.stopPropagation()} 
    >
      <button className="user-icon-btn">
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

      {isOpen && (
        <div className="dropdown-menu">
          <div className="menu-header">
            <div className="profile-circle">나연</div>
            <div className="profile-info">
              <p className="user-name">윤나연</p>
              <p className="user-email">yny8225@catholic.ac.kr</p>
            </div>
          </div>
          
          <hr className="menu-divider" />

          <ul className="menu-list">
            <li onClick={() => navigate('/mypage')}>
              <span>🏠 개인 페이지 이동</span>
            </li>
            <li onClick={() => navigate('/saved')}>
              <span>💾 저장한 글 모아보기</span>
            </li>
            <li onClick={() => navigate('/changeid')}>
              <span>⚙️ 프로필 수정</span>
            </li>
            
            <li onClick={handleLogoutClick} className="logout-item">
              <span>🚪 로그아웃</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserMenu;