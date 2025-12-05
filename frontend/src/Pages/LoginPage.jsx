import React, { useState } from "react";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";
import { login } from "../api/api"; // 백엔드 API 통신 함수 가져오기

export default function LoginPage() {
  const navigate = useNavigate();
  
  // 📝 입력값을 저장하는 state (상태)
  // useState는 React에서 데이터를 기억하는 방법!
  const [username, setUsername] = useState(""); // 아이디 저장
  const [password, setPassword] = useState(""); // 비밀번호 저장
  const [isLoading, setIsLoading] = useState(false); // 로딩 중인지 확인

  /**
   * 🔐 로그인 버튼을 눌렀을 때 실행되는 함수
   */
  const handleLogin = async () => {
    // 1. 입력값 검증 (빈 칸 체크)
    if (!username || !password) {
      alert("아이디와 비밀번호를 모두 입력해주세요!");
      return;
    }

    setIsLoading(true); // 로딩 시작

    try {
      // 2. 백엔드에 로그인 요청 보내기
      console.log("로그인 시도:", { username, password });
      
      const response = await login({
        username: username,
        password: password,
      });

      // 3. 로그인 성공!
      console.log("로그인 성공:", response);
      alert(`환영합니다, ${response.username}님!`);
      
      // Header에 로그인 상태 변경 알림
      window.dispatchEvent(new Event('loginStatusChanged'));
      
      // 4. 메인 페이지로 이동
      navigate("/");

    } catch (error) {
      // 4. 로그인 실패
      console.error("로그인 에러:", error);
      alert("로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.");
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Login</h2>

        {/* 아이디 입력 */}
        <input 
          type="text" 
          placeholder="아이디" 
          className="login-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)} // 입력할 때마다 state 업데이트
          onKeyPress={(e) => e.key === 'Enter' && handleLogin()} // Enter 키로도 로그인 가능
        />
        
        {/* 비밀번호 입력 */}
        <input 
          type="password" 
          placeholder="비밀번호" 
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
        />

        <div className="forgot">forgot password?</div>

        {/* 로그인 버튼 */}
        <button 
          className="login-btn" 
          onClick={handleLogin}
          disabled={isLoading} // 로딩 중에는 버튼 비활성화
        >
          {isLoading ? "로그인 중..." : "Login"}
        </button>

        <p className="bottom-link">
          아직 회원이 아니신가요?{" "}
          <span
            style={{ cursor: "pointer", color: "#3d8bff" }}
            onClick={() => navigate("/signup")}
          >
            회원가입
          </span>
        </p>
      </div>
    </div>
  );
}
