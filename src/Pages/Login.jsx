import React from "react";
import "./Login.css";

export default function Login() {
  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Login</h2>
        <input type="email" placeholder="이메일" className="login-input" />
        <input type="password" placeholder="비밀번호" className="login-input" />

        <div className="forgot">forgot password?</div>

        <button className="login-btn">Login</button>

        <div className="signup-text">
          아직 회원이 아니신가요? <a href="#">회원가입</a>
        </div>
      </div>
    </div>
  );
}
