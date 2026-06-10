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
import PetDetail from "./pages/PetDetail";
import AnalysisDetail from "./pages/AnalysisDetail";
import About from "./pages/About";
import RelationshipDetail from "./pages/RelationshipDetail";

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
    const res = await fetch(
      "https://capstone-swkb.onrender.com/pets",
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      console.log("홈 반려동물 데이터 불러오기 실패:", data);
      return;
    }

    setPets(Array.isArray(data) ? data : []);
  } catch (error) {
    console.log("홈 반려동물 데이터 불러오기 실패:", error);
  }
};
  const fetchRecords = async () => {

    try {

      const res = await fetch(
        "https://capstone-swkb.onrender.com/analysis",
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      const data = await res.json();

      setRecords(Array.isArray(data) ? data : []);

    } catch (error) {

      console.log(
        "홈 분석 기록 불러오기 실패:",
        error
      );

    }
  };

  const getPetImage = (pet) => {

    if (pet.image) {

      return (
        <img
          src={`https://capstone-swkb.onrender.com${pet.image}`}
          alt={pet.name}
          className="home-pet-avatar-img"
        />
      );
    }

    return (
      <div className="home-pet-avatar-default">
        🐾
      </div>
    );
  };

  const latestRecord = records[0];

  const getPairKey = (petNames = []) => {
  return [...petNames].sort().join(" ↔ ");
};

const latestMissionsByPair = Object.values(
  records.reduce((acc, record) => {
    const pairKey = getPairKey(record.petNames);

    const currentDate = new Date(record.dateTime || record.createdAt);
    const savedDate = acc[pairKey]
      ? new Date(acc[pairKey].dateTime || acc[pairKey].createdAt)
      : null;

    if (!acc[pairKey] || currentDate > savedDate) {
      acc[pairKey] = record;
    }

    return acc;
  }, {})
);


  const harmonyCount = records.filter(
    (record) =>
      record.relationshipTrend === "harmony"
  ).length;

  const conflictCount = records.filter(
    (record) =>
      record.relationshipTrend === "conflict"
  ).length;

  const completedMissionCount = records.filter(
    (record) =>
      record.todayMissionCompleted
  ).length;

  const recentPets = [...pets]
    .slice(-4)
    .reverse();

  const recentRecords = records.slice(0, 4);

  return (
    <>
      <Navbar logout={logout} />

      <div className="home-dashboard">

        <section className="home-hero-modern">

          <div>

            <span className="hero-badge">
              Pet Harmony Dashboard
            </span>

            <h1>
              우리 아이들의 관계를 더 건강하게
            </h1>

            <p>
              반려동물의 행동을 기록하고,
              관계 분석과 미션을 통해
              화합 과정을 관리해보세요.
            </p>

            <div className="hero-actions">

              <button
                onClick={() =>
                  navigate("/analysis")
                }
              >
                🔍 관계 분석하기
              </button>

              <button
                className="secondary"
                onClick={() =>
                  navigate("/records")
                }
              >
                📈 기록 보기
              </button>

            </div>

          </div>
          </section>

          <section className="home-main-grid">
            <div className="home-panel mission-panel">
              

            <span className="relationship-status-title">
              오늘의 관계 상태
            </span>

            <strong>

              {latestRecord
                ? latestRecord.score >= 70
                  ? "안정화 진행 중 🌿"
                  : latestRecord.score >= 40
                  ? "관찰 필요 ⚠️"
                  : "안정화 진행 중 🌿"
                : "분석 대기 중"}

            </strong>

             {latestMissionsByPair.length > 0 ? (
              <div className="home-mission-list">
                {latestMissionsByPair.map((record) => (
                  <div
                    key={record._id}
                    className="home-mission-card"
                    onClick={() =>
                      navigate(
                        `/relationship/${encodeURIComponent(getPairKey(record.petNames))}`
                      )
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <strong>
                      {getPairKey(record.petNames)}
                    </strong>

                    <p>
                      {record.relationshipTrend === "harmony"
                        ? "좋은 관계 행동을 반복해서 안정적인 관계로 이어가요."
                        : record.relationshipTrend === "conflict"
                        ? "갈등 행동을 줄이고 안전한 거리를 유지해요."
                        : "짧은 시간 동안 서로의 반응을 관찰해보세요."}
                    </p>

                    <span>
                      최근 행동: {record.behavior || "행동 기록 없음"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-text">
                분석 후 오늘의 미션이 생성됩니다.
              </p>
            )}

          </div>

          {/* 최근 행동 분석 */}
          <div className="home-panel">

            <div className="panel-header">

              <h3>
                📋 최근 행동 분석
              </h3>

              <button
                onClick={() =>
                  navigate("/records")
                }
              >
                전체 보기
              </button>

            </div>

            <div className="home-log-list">

              {recentRecords.length === 0 ? (

                <p className="empty-text">
                  아직 분석 기록이 없습니다.
                </p>

              ) : (

                recentRecords.map((record) => (

                  <div
                    key={record._id}
                    className="home-log-item"
                  >

                    <div>

                      <strong>
                        {record.petNames?.join(" ↔ ")}
                      </strong>

                      <p>
                        {record.behavior || record.result}
                      </p>

                    </div>

                  </div>

                ))

              )}

            </div>

          </div>

        </section>

        {/* 반려동물 */}
        <div className="home-pet-wrapper">

                <section
        className="home-panel"
        style={{
          maxWidth: "1180px",
          margin: "28px auto 0"
        }}
>

            <div className="panel-header">

              <h3>
                🐾 내 반려동물
              </h3>

              <button
                onClick={() =>
                  navigate("/pets/new")
                }
              >
                추가하기
              </button>

            </div>

            <div className="home-pet-grid-modern">

              {recentPets.length === 0 ? (

                <p className="empty-text">
                  아직 등록된 반려동물이 없습니다.
                </p>

              ) : (

                recentPets.map((pet) => (

                  <div
                    key={pet._id}
                    className="home-pet-card-modern"
                    onClick={() =>
                      navigate(`/pets/${pet._id}`)
                    }
                  >

                    <div className="home-pet-avatar">
                      {getPetImage(pet)}
                    </div>

                    <div>

                      <h4>{pet.name}</h4>

                      <p>{pet.type || "-"}</p>

                      <span>
                        {pet.age
                          ? `${pet.age}살`
                          : "나이 미입력"}
                      </span>

                    </div>

                  </div>

                ))

              )}

            </div>

          </section>

        </div>

      </div>
    </>
  );
}

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const logout = () => {

    localStorage.removeItem("token");

    setIsLoggedIn(false);
  };

  const PrivateRoute = ({ children }) => {

    return isLoggedIn
      ? children
      : <Navigate to="/" />;
  };

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={ <Login setIsLoggedIn={setIsLoggedIn} /> }
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
         path="/about"
         element={
           <PrivateRoute>
             <>
               <Navbar logout={logout} />
               <About />
             </>
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

        <Route
          path="/analysis-detail"
          element={
            <AnalysisDetail />
          }
        />
        
        <Route
          path="/relationship/:pairKey"
          element={
            <PrivateRoute>
              <RelationshipDetail />
            </PrivateRoute>
          }
        />

        <Route
          path="*"
          element={<Navigate to="/home" />}
        />
      
      </Routes>

    </BrowserRouter>
  );
}

export default App;