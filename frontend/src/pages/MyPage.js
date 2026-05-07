import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyPage.css";

function MyPage() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [pets, setPets] = useState([]);

  useEffect(() => {
    fetchProfile();
    fetchPets();
  }, []);

  const fetchProfile = async () => {
    const res = await fetch("http://localhost:5000/profile", {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });

    const data = await res.json();

    if (res.ok) {
      setUser(data);
    }
  };

  const fetchPets = async () => {
    const res = await fetch("http://localhost:5000/pets", {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });

    const data = await res.json();
    setPets(Array.isArray(data) ? data : []);
  };

  if (!user) {
    return <div className="mypage-loading">불러오는 중...</div>;
  }

  return (
    <div className="mypage">
      <div className="mypage-card">
        <div className="mypage-header">
          <div className="mypage-avatar">🐾</div>
          <h2>마이페이지</h2>
          <p>내 정보와 반려동물 현황을 확인할 수 있습니다.</p>
        </div>

        <div className="mypage-info">
          <div>
            <span>이메일</span>
            <strong>{user.email}</strong>
          </div>

          <div>
            <span>닉네임</span>
            <strong>{user.nickname || "-"}</strong>
          </div>

          <div>
            <span>성별</span>
            <strong>{user.gender || "-"}</strong>
          </div>

          <div>
            <span>가입 목적</span>
            <strong>{user.purpose || "-"}</strong>
          </div>

          <div>
            <span>가입 시 입력한 반려동물 수</span>
            <strong>{user.petCount || "-"}</strong>
          </div>
        </div>

        <button
          className="mypage-edit-btn"
          onClick={() => navigate("/profile")}
        >
          회원정보 수정
        </button>
      </div>

      <div className="mypage-card">
        <h3>내 반려동물 요약</h3>

        <div className="mypage-summary">
          <div>
            <span>등록된 반려동물</span>
            <strong>{pets.length}마리</strong>
          </div>

          <div>
            <span>강아지</span>
            <strong>{pets.filter((pet) => pet.type === "강아지").length}마리</strong>
          </div>

          <div>
            <span>고양이</span>
            <strong>{pets.filter((pet) => pet.type === "고양이").length}마리</strong>
          </div>
        </div>

        <button
          className="mypage-sub-btn"
          onClick={() => navigate("/pets")}
        >
          반려동물 관리로 이동
        </button>
      </div>
    </div>
  );
}

export default MyPage;