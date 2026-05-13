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
  const getDefaultIcon = (type) => {
    const style = {
      fontSize: "60px",
      color: "#56b556",
    };

    if (type === "강아지") {
      return <FaDog style={style} />;
    }

    if (type === "고양이") {
      return <FaCat style={style} />;
    }

    if (type === "햄스터") {
      return <FaPaw style={style} />;
    }

    if (type === "토끼") {
      return <GiRabbit style={style} />;
    }

    if (type === "앵무새") {
      return <FaCrow style={style} />;
    }

    if (type === "거북이") {
      return <GiTurtle style={style} />;
    }

    return <FaFish style={style} />;
};

  useEffect(() => {
    fetchPets();
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
      console.log("홈 데이터 불러오기 실패:", error);
      setPets([]);
    }
  };

  const dogCount = pets.filter((pet) => pet.type === "강아지").length;
  const catCount = pets.filter((pet) => pet.type === "고양이").length;
  const recentPets = [...pets].slice(-3).reverse();

  return (
    <>
      <Navbar logout={logout} />

      <div className="home-page">
        <div className="home-hero card">
          <h2>🐾 반려동물 관리 홈</h2>
          <p className="home-subtitle">
            우리 아이들의 정보를 한눈에 확인하고 관리해보세요.
          </p>
        </div>

        <div className="home-summary-grid">
          <div className="card summary-card">
            <h3>전체 반려동물</h3>
            <p className="summary-number">{pets.length}</p>
          </div>

          <div className="card summary-card">
            <h3>강아지</h3>
            <p className="summary-number">{dogCount}</p>
          </div>

          <div className="card summary-card">
            <h3>고양이</h3>
            <p className="summary-number">{catCount}</p>
          </div>
        </div>

        <div className="card quick-menu-card">
          <h3>빠른 메뉴</h3>
          <div className="quick-menu-buttons">
            <button className="home-btn primary" onClick={() => navigate("/pets")}>
              반려동물 관리
            </button>
            <button className="home-btn secondary" onClick={() => navigate("/pets/new")}>
              반려동물 추가
            </button>
            <button className="home-btn secondary" onClick={() => navigate("/analysis")}>
              분석 보기
            </button>
          </div>
        </div>

        <div className="card recent-pets-card">
          <h3>최근 등록한 반려동물</h3>

          {recentPets.length === 0 ? (
            <p className="empty-text">아직 등록된 반려동물이 없습니다.</p>
          ) : (
            <div className="recent-pet-list">
              {recentPets.map((pet) => (
                <div key={pet._id} className="recent-pet-item">
                  <div className="pet-image-wrap">
                    {pet.image ? (
                      <img
                        src={`http://localhost:5000${pet.image}`}
                        alt={pet.name}
                        className="pet-image"
                      />
                    ) : (
                      <div className="recent-pet-image">
                        {getDefaultIcon(pet.type)}
                      </div>
                    )}
                  </div>


                  <div className="recent-pet-info">
                    <h4>{pet.name}</h4>
                    <p>종류: {pet.type || "-"}</p>
                    <p>나이: {pet.age ? `${pet.age}살` : "-"}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
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