import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Pets from "./pages/Pets";
import Analysis from "./pages/Analysis";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import PetForm from "./pages/PetForm";
import MyPage from "./pages/MyPage";
import Profile from "./pages/Profile";
import RecentRecords from "./pages/RecentRecords";
import { FaDog, FaCat, FaCrow, FaFish, FaPaw } from "react-icons/fa";
import { GiRabbit, GiTurtle } from "react-icons/gi";
import PetDetail from "./pages/PetDetail";

import "./App.css";

// 🏠 Home 컴포넌트
function Home({ logout }) {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetchPets();
    fetchRecords();
  }, []);

  const fetchPets = async () => {
    try {
      const res = await fetch("http://localhost:5000/pets", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      const data = await res.json();
      setPets(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("홈 반려동물 데이터 불러오기 실패:", error);
    }
  };

  const fetchRecords = async () => {
    try {
      const res = await fetch("http://localhost:5000/analysis", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      const data = await res.json();
      setRecords(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("홈 분석 기록 불러오기 실패:", error);
    }
  };

  const getPetImage = (pet) => {
    if (pet.image) {
      return (
        <img
          src={`http://localhost:5000${pet.image}`}
          alt={pet.name}
          className="home-pet-avatar-img"
        />
      );
    }

    return <div className="home-pet-avatar-default">🐾</div>;
  };

  const totalPets = pets.length;
  const dogCount = pets.filter((pet) => pet.type === "강아지").length;
  const catCount = pets.filter((pet) => pet.type === "고양이").length;

  const latestRecord = records[0];

  const averageScore =
    records.length > 0
      ? Math.round(
          records.reduce((sum, record) => sum + (record.score || 0), 0) /
            records.length
        )
      : 0;

  const harmonyCount = records.filter(
    (record) => record.relationshipTrend === "harmony"
  ).length;

  const conflictCount = records.filter(
    (record) => record.relationshipTrend === "conflict"
  ).length;

  const completedMissionCount = records.filter(
    (record) => record.todayMissionCompleted
  ).length;

  const recentPets = [...pets].slice(-4).reverse();
  const recentRecords = records.slice(0, 4);

  return (
    <>
      <Navbar logout={logout} />

      <div className="home-dashboard">
        <section className="home-hero-modern">
          <div>
            <span className="hero-badge">Pet Harmony Dashboard</span>
            <h1>우리 아이들의 관계를 더 건강하게</h1>
            <p>
              반려동물의 행동을 기록하고, 관계 분석과 미션을 통해
              화합 과정을 관리해보세요.
            </p>

            <div className="hero-actions">
              <button onClick={() => navigate("/analysis")}>
                🔍 관계 분석하기
              </button>
              <button className="secondary" onClick={() => navigate("/records")}>
                📈 기록 보기
              </button>
            </div>
          </div>

          <div className="hero-status-card">
            <span>오늘의 관계 상태</span>
            <strong>
              {latestRecord
                ? latestRecord.score >= 70
                  ? "안정화 진행 중 🌿"
                  : latestRecord.score >= 40
                  ? "관찰 필요 ⚠️"
                  : "주의 필요 🚨"
                : "분석 대기 중"}
            </strong>
            <p>
              {latestRecord
                ? `${latestRecord.petNames?.join(" ↔ ")} 최근 점수 ${
                    latestRecord.score
                  }점`
                : "아직 분석 기록이 없습니다."}
            </p>
          </div>
        </section>

        <section className="home-kpi-grid">
          <div className="home-kpi-card">
            <span>평균 관계 점수</span>
            <strong>{averageScore}점</strong>
          </div>

          <div className="home-kpi-card">
            <span>완료한 미션</span>
            <strong>{completedMissionCount}개</strong>
          </div>

          <div className="home-kpi-card">
            <span>화합 행동</span>
            <strong>{harmonyCount}회</strong>
          </div>

          <div className="home-kpi-card warning">
            <span>갈등 행동</span>
            <strong>{conflictCount}회</strong>
          </div>
        </section>

        <section className="home-main-grid">
          <div className="home-panel mission-panel">
            <div className="panel-header">
              <h3>🎯 오늘의 관계 미션</h3>
              <button onClick={() => navigate("/pets")}>미션 보러가기</button>
            </div>

            {latestRecord ? (
              <div className="home-mission-card">
                <strong>{latestRecord.petNames?.join(" ↔ ")}</strong>
                <p>
                  {latestRecord.relationshipTrend === "harmony"
                    ? "좋은 관계 행동을 반복해서 안정적인 관계로 이어가요."
                    : latestRecord.relationshipTrend === "conflict"
                    ? "갈등 행동을 줄이고 안전한 거리를 유지해요."
                    : "짧은 시간 동안 서로의 반응을 관찰해보세요."}
                </p>
                <span>
                  최근 행동: {latestRecord.behavior || "행동 기록 없음"}
                </span>
              </div>
            ) : (
              <p className="empty-text">분석 후 오늘의 미션이 생성됩니다.</p>
            )}
          </div>

          <div className="home-panel">
            <div className="panel-header">
              <h3>📋 최근 행동 분석</h3>
              <button onClick={() => navigate("/records")}>전체 보기</button>
            </div>

            <div className="home-log-list">
              {recentRecords.length === 0 ? (
                <p className="empty-text">아직 분석 기록이 없습니다.</p>
              ) : (
                recentRecords.map((record) => (
                  <div key={record._id} className="home-log-item">
                    <div>
                      <strong>{record.petNames?.join(" ↔ ")}</strong>
                      <p>{record.behavior || record.result}</p>
                    </div>
                    <span>{record.score || 0}점</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="home-panel">
          <div className="panel-header">
            <h3>🐾 내 반려동물</h3>
            <button onClick={() => navigate("/pets/new")}>추가하기</button>
          </div>

          <div className="home-pet-grid-modern">
            {recentPets.length === 0 ? (
              <p className="empty-text">아직 등록된 반려동물이 없습니다.</p>
            ) : (
              recentPets.map((pet) => (
                <div
                  key={pet._id}
                  className="home-pet-card-modern"
                  onClick={() => navigate(`/pets/${pet._id}`)}
                >
                  <div className="home-pet-avatar">{getPetImage(pet)}</div>

                  <div>
                    <h4>{pet.name}</h4>
                    <p>{pet.type || "-"}</p>
                    <span>{pet.age ? `${pet.age}살` : "나이 미입력"}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState( 
    !!localStorage.getItem("token"));


  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  const PrivateRoute = ({ children }) => {
    return isLoggedIn ? children : <Navigate to="/" />;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Login setIsLoggedIn={setIsLoggedIn} />}
        />

        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home logout={logout} />
            </PrivateRoute>
          }
        />

        <Route
          path="/pets"
          element={
            <PrivateRoute>
              <>
                <Navbar logout={logout} />
                <Pets logout={logout} />
              </>
            </PrivateRoute>
          }
        />

        <Route
          path="/analysis"
          element={
            <PrivateRoute>
              <>
                <Navbar logout={logout} />
                <Analysis logout={logout} />
              </>
            </PrivateRoute>
          }
        />

        <Route
          path="/pets/new"
          element={
            <PrivateRoute>
              <>
                <Navbar logout={logout} />
                <PetForm />
              </>
            </PrivateRoute>
          }
        />

        <Route
          path="/pets/edit/:id"
          element={
            <PrivateRoute>
              <>
                <Navbar logout={logout} />
                <PetForm />
              </>
            </PrivateRoute>
          }
        />

        <Route
          path="/mypage"
          element={
            <PrivateRoute>
              <>
                <Navbar logout={logout} />
                <MyPage />
              </>
            </PrivateRoute>
          }
        />  

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <>
                <Navbar logout={logout} />
                <Profile />
              </>
            </PrivateRoute>
          }
        />

        <Route
          path="/records"
          element={
            <PrivateRoute>
              <>
                <Navbar logout={logout} />
                <RecentRecords />
              </>
            </PrivateRoute>
          }
        />

        <Route
          path="/pets/:id"
          element={
            <PrivateRoute>
              <>
                <Navbar logout={logout} />
                <PetDetail />
              </>
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;