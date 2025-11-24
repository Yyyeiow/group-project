import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Signup.css";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    passwordCheck: "",
    code: "",
  });

  const [message, setMessage] = useState("");
  const [isDuplicateChecked, setIsDuplicateChecked] = useState(false);

  // 인증번호 관련
  const [sentCode, setSentCode] = useState("");
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  // 입력 변경
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 아이디 중복 검사
  const handleCheckDuplicate = async () => {
    if (!form.username) {
      return setMessage("아이디를 입력해주세요.");
    }

    try {
      // 실제 API 끝나면 URL만 수정
      const res = await axios.post("/api/check-username", {
        username: form.username,
      });

      if (res.data.exists) {
        setMessage("이미 존재하는 아이디입니다.");
        setIsDuplicateChecked(false);
      } else {
        setMessage("사용 가능한 아이디입니다!");
        setIsDuplicateChecked(true);
      }
    } catch (err) {
      setMessage("서버 요청 실패!");
    }
  };

  // 이메일 유효성 검사
  const validateEmail = (email) => {
    return /^\S+@\S+\.\S+$/.test(email);
  };

  // 비밀번호 규칙 검사 (8자 이상, 숫자/영문 포함)
  const validatePassword = (pw) => {
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(pw);
  };

  // 인증번호 발송
  const handleSendCode = async () => {
    if (!validateEmail(form.email)) {
      return setMessage("올바른 이메일 형식이 아닙니다.");
    }

    try {
      // 실제 구현 시 이메일 전송 API 호출
      const code = String(Math.floor(100000 + Math.random() * 900000));
      setSentCode(code);
      setMessage(`인증번호가 전송되었습니다.`);

      // 3분 타이머
      setTimer(180);
      if (intervalId) clearInterval(intervalId);

      let id = setInterval(() => {
        setTimer((t) => {
          if (t <= 1) {
            clearInterval(id);
            return 0;
          }
          return t - 1;
        });
      }, 1000);

      setIntervalId(id);
    } catch (err) {
      setMessage("인증번호 전송 실패!");
    }
  };

  // 회원가입 제출
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isDuplicateChecked)
      return setMessage("아이디 중복 검사를 진행해주세요.");

    if (!validateEmail(form.email))
      return setMessage("올바른 이메일 형식이 아닙니다.");

    if (!validatePassword(form.password))
      return setMessage("비밀번호는 8자 이상, 숫자+영문 포함이어야 합니다.");

    if (form.password !== form.passwordCheck)
      return setMessage("비밀번호가 일치하지 않습니다.");

    if (form.code !== sentCode)
      return setMessage("인증번호가 올바르지 않습니다.");

    try {
      const res = await axios.post("/api/signup", form);
      setMessage("회원가입 성공!");
      navigate("/login");
    } catch (err) {
      setMessage("회원가입 실패!");
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-box" onSubmit={handleSubmit}>
        <h2>회원가입</h2>

        {/* 아이디 */}
        <div className="input-group">
          <label>아이디 *</label>
          <input
            type="text"
            name="username"
            placeholder="아이디"
            value={form.username}
            onChange={handleChange}
          />
          <button className="btn-duplicate" onClick={handleCheckDuplicate}>
            중복확인
          </button>
        </div>

        {/* 이메일 */}
        <div className="input-group">
          <label>이메일 *</label>
          <input
            type="email"
            name="email"
            placeholder="이메일"
            value={form.email}
            onChange={handleChange}
          />
          <button className="btn-duplicate" onClick={handleSendCode}>
            인증번호 발송
          </button>

          {timer > 0 && (
            <p>
              남은 시간: {Math.floor(timer / 60)}:{String(timer % 60).padStart(2,"0")}
            </p>
          )}
        </div>

        {/* 인증번호 */}
        <div className="input-group">
          <label>인증번호 *</label>
          <input
            type="text"
            name="code"
            placeholder="인증번호 입력"
            value={form.code}
            onChange={handleChange}
          />
        </div>

        {/* 비밀번호 */}
        <div className="input-group">
          <label>비밀번호 *</label>
          <input
            type="password"
            name="password"
            placeholder="비밀번호 (숫자+영문 8자 이상)"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        {/* 비밀번호 확인 */}
        <div className="input-group">
          <label>비밀번호 확인 *</label>
          <input
            type="password"
            name="passwordCheck"
            placeholder="비밀번호 확인"
            value={form.passwordCheck}
            onChange={handleChange}
          />
        </div>

        <button className="signup-btn" type="submit">
          회원가입
        </button>

        {message && <p className="signup-message">{message}</p>}

        <p className="bottom-link">
          이미 계정이 있으신가요?{" "}
          <span
            style={{ cursor: "pointer", color: "#3d8bff" }}
            onClick={() => navigate("/login")}
          >
            로그인
          </span>
        </p>
      </form>
    </div>
  );
}

export default Signup;
