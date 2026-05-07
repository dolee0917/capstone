import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

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
          className={location.pathname === "/mypage" ? "active" : ""}
          onClick={() => navigate("/mypage")}
        >
         👤 마이페이지
        </span>

        <span
          className={location.pathname === "/records" ? "active" : ""}
          onClick={() => navigate("/records")}
        >
          📋 최근 기록
        </span>
      </div>

      <div className="nav-right">
        <button onClick={logout}>로그아웃</button>
      </div>
    </div>
  );
}

export default Navbar;