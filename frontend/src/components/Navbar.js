import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";
import { FaUserCircle } from "react-icons/fa";

function Navbar({ logout }) {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ 현재 경로 확인

  return (
  <div className="navbar">
    <div className="nav-left">
      <span
        className={location.pathname === "/home" ? "active" : ""}
        onClick={() => navigate("/home")}
      >
        🏠 홈
      </span>

      <span
        className={location.pathname === "/about" ? "active" : ""}
        onClick={() => navigate("/about")}
      >
        📖 서비스 소개
      </span>

      <span
        className={location.pathname === "/pets" ? "active" : ""}
        onClick={() => navigate("/pets")}
      >
        🐾 반려동물
      </span>

      <span
        className={location.pathname === "/analysis" ? "active" : ""}
        onClick={() => navigate("/analysis")}
      >
        ⚠️ 분석
      </span>

      <span
        className={location.pathname === "/records" ? "active" : ""}
        onClick={() => navigate("/records")}
      >
        📋 관계 관리
      </span>
    </div>

    <div className="nav-right">
      <div className="navbar-right">
        <button
          className="profile-icon-btn"
          onClick={() => navigate("/mypage")}
        >
          <FaUserCircle />
        </button>

        <button className="logout-btn" onClick={logout}>
          로그아웃
        </button>
      </div>
    </div>
  </div>
);
}

export default Navbar;