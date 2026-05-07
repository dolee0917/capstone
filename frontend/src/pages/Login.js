import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    nickname: "",
    gender: "",
    purpose: "",
    otherPurpose: "",
    petCount: "",
    agree: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const register = async () => {
    if (form.password !== form.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다");
      return;
    }

    if (!form.nickname) {
      alert("닉네임을 입력해주세요");
      return;
    }

    if (!form.purpose) {
      alert("가입 목적을 선택해주세요");
      return;
    }

    if (form.purpose === "기타" && !form.otherPurpose) {
      alert("기타 목적을 입력해주세요");
      return;
    }

    if (!form.agree) {
      alert("서비스 이용약관에 동의해주세요");
      return;
    }
    const finalPurpose =
    form.purpose === "기타" ? form.otherPurpose : form.purpose;

    const res = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...form,
        purpose: finalPurpose,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("회원가입 완료! 로그인하세요");
      setIsRegister(false);
      setForm({
        email: "",
        password: "",
        confirmPassword: "",
        nickname: "",
        gender: "",
        purpose: "",
        otherPurpose: "",
        petCount: "",
        agree: false,
      });
    } else {
      alert(data.error || "회원가입 실패");
    }
  };

  const login = async () => {
    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: form.email,
        password: form.password,
      }),
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      setIsLoggedIn(true);
      navigate("/home");
    } else {
      alert(data.error || "로그인 실패");
    }
  };

  const handleLoginSubmit = (e) => {
  e.preventDefault();
  login();
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    register();
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <div className="login-intro">
          <h1>🐾 Pet Harmony</h1>
          <h2>반려동물 관리 서비스</h2>
          <p>
            여러 반려동물의 프로필, 성격, 관계를 한 곳에서 관리하고
            더 편안한 반려 생활을 시작해보세요.
          </p>

          <div className="intro-list">
            <span>✔ 반려동물 프로필 관리</span>
            <span>✔ 다중 반려동물 관리</span>
            <span>✔ 관계 및 행동 분석</span>
          </div>
        </div>

        <div className="login-card" 
             onSubmit={isRegister ? handleRegisterSubmit : handleLoginSubmit}>
          <h2>{isRegister ? "회원가입" : "로그인"}</h2>
          <p className="login-subtitle">
            {isRegister
              ? "서비스 이용을 위한 정보를 입력해주세요."
              : "계정으로 로그인해주세요."}
          </p>

          {isRegister && (
            <input
              name="nickname"
              className="login-input"
              placeholder="닉네임"
              value={form.nickname}
              onChange={handleChange}
            />
          )}

          <input
            name="email"
            className="login-input"
            placeholder="이메일"
            value={form.email}
            onChange={handleChange}
          />

          <input
            name="password"
            className="login-input"
            type="password"
            placeholder="비밀번호"
            value={form.password}
            onChange={handleChange}
          />

          {isRegister && (
            <>
              <input
                name="confirmPassword"
                className="login-input"
                type="password"
                placeholder="비밀번호 확인"
                value={form.confirmPassword}
                onChange={handleChange}
              />

              <select
                name="gender"
                className="login-input"
                value={form.gender}
                onChange={handleChange}
              >
                <option value="">성별 선택</option>
                <option value="여성">여성</option>
                <option value="남성">남성</option>
                <option value="선택 안 함">선택 안 함</option>
              </select>

              <select
                name="purpose"
                className="login-input"
                value={form.purpose}
                onChange={handleChange}
              >
                <option value="">가입 목적 선택</option>
                <option value="화합">화합</option>
                <option value="갈등 완화">갈등 완화</option>
                <option value="건강 관리">건강 관리</option>
                <option value="단순 관리">단순 관리</option>
                <option value="행동 분석">행동 분석</option>
                <option value="기타">기타</option>
              </select>

              {form.purpose === "기타" && (
                <input
                  name="otherPurpose"
                  className="login-input"
                  placeholder="가입 목적을 직접 입력하세요"
                  value={form.otherPurpose}
                  onChange={handleChange}
                />
              )}

              <select
                name="petCount"
                className="login-input"
                value={form.petCount}
                onChange={handleChange}
              >
                <option value="">반려동물 수 선택</option>
                <option value="1마리">1마리</option>
                <option value="2마리">2마리</option>
                <option value="3마리 이상">3마리 이상</option>
                <option value="아직 없음">아직 없음</option>
              </select>

              <label className="agree-box">
                <input
                  type="checkbox"
                  name="agree"
                  checked={form.agree}
                  onChange={handleChange}
                />
                서비스 이용약관에 동의합니다.
              </label>
            </>
          )}

          <button type="submit"
            className="login-button"
            onClick={isRegister ? register : login}
          >
            {isRegister ? "회원가입" : "로그인"}
          </button>

          <button
            className="login-toggle"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? "로그인으로 돌아가기" : "회원가입 하러가기"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;