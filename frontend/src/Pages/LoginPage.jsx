import React from "react";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Login</h2>

        <input type="email" placeholder="아이디" className="login-input" />
        <input type="password" placeholder="비밀번호" className="login-input" />

        <div className="forgot">forgot password?</div>

        <button className="login-btn">Login</button>

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
