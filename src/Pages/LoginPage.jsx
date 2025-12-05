import React, { useState } from "react";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("로그인 성공!");
        navigate("/home");
      } else {
        alert(data.message || "로그인 실패");
      }
    } catch (error) {
      console.error(error);
      alert("서버 오류");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Login</h2>

        <input
          type="email"
          placeholder="아이디"
          className="login-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="비밀번호"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="forgot">forgot password?</div>

        <button className="login-btn" onClick={handleLogin}>
          Login
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