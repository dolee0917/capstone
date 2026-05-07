import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    email: "",
    nickname: "",
    gender: "",
    purpose: "",
    otherPurpose: "",
    petCount: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const res = await fetch("http://localhost:5000/profile", {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });

    const data = await res.json();

    if (res.ok) {
      setProfile({
        email: data.email || "",
        nickname: data.nickname || "",
        gender: data.gender || "",
        purpose: data.purpose || "",
        otherPurpose: data.otherPurpose || "",
        petCount: data.petCount || "",
      });
    } else {
      alert(data.error || "프로필 조회 실패");
    }
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const updateProfile = async () => {
    const res = await fetch("http://localhost:5000/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify(profile),
    });

    const data = await res.json();

    if (res.ok) {
      alert("회원정보가 수정되었습니다.");
      navigate("/mypage");
    } else {
      alert(data.error || "회원정보 수정 실패");
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h2>회원정보 수정</h2>
        <p className="profile-subtitle">내 정보를 수정할 수 있습니다.</p>

        <label>이메일</label>
        <input value={profile.email} disabled />

        <label>닉네임</label>
        <input
          name="nickname"
          value={profile.nickname}
          onChange={handleChange}
          placeholder="닉네임"
        />

        <label>성별</label>
        <select name="gender" value={profile.gender} onChange={handleChange}>
          <option value="">성별 선택</option>
          <option value="여성">여성</option>
          <option value="남성">남성</option>
          <option value="선택 안 함">선택 안 함</option>
        </select>

        <label>가입 목적</label>
        <select name="purpose" value={profile.purpose} onChange={handleChange}>
          <option value="">가입 목적 선택</option>
          <option value="화합">화합</option>
          <option value="갈등 완화">갈등 완화</option>
          <option value="건강 관리">건강 관리</option>
          <option value="단순 관리">단순 관리</option>
          <option value="행동 분석">행동 분석</option>
          <option value="기타">기타</option>
        </select>

        {profile.purpose === "기타" && (
          <>
            <label>기타 목적</label>
            <input
              name="otherPurpose"
              value={profile.otherPurpose}
              onChange={handleChange}
              placeholder="가입 목적을 직접 입력하세요"
            />
          </>
        )}

        <label>반려동물 수</label>
        <select name="petCount" value={profile.petCount} onChange={handleChange}>
          <option value="">반려동물 수 선택</option>
          <option value="1마리">1마리</option>
          <option value="2마리">2마리</option>
          <option value="3마리 이상">3마리 이상</option>
          <option value="아직 없음">아직 없음</option>
        </select>

        <div className="profile-buttons">
          <button className="profile-save-btn" onClick={updateProfile}>
            저장하기
          </button>
          <button className="profile-cancel-btn" onClick={() => navigate("/mypage")}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;