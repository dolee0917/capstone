import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import "./Pets.css";
import { FaDog, FaCat, FaCrow, FaFish, FaPaw } from "react-icons/fa";
import { GiRabbit, GiTurtle, GiGecko } from "react-icons/gi";


function Pets() {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [openPetIds, setOpenPetIds] = useState([]);
  const [analysisList, setAnalysisList] = useState([]);
  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const getDefaultIcon = (type) => {
    const style = {
      fontSize: "72px",
      color: "#6c7cff",
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

    if (type === "도마뱀") {
      return <GiGecko style={style} />;
    }

    return <FaFish style={style} />;
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

  const fetchAnalysis = async () => {
  const res = await fetch("http://localhost:5000/analysis", {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });

  const data = await res.json();
  setAnalysisList(Array.isArray(data) ? data : []);
};

  useEffect(() => {
    fetchPets();
    fetchAnalysis();

  }, []);


  const deletePet = async (id) => {
    const isConfirmed = window.confirm("정말 삭제하시겠습니까?");

    if (!isConfirmed) {
      return;
    }

    await fetch(`http://localhost:5000/pets/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });

    alert("삭제되었습니다.");
    fetchPets();
  };

  return (
    <div className="pets-page">
      <div className="pets-header">
        <h1>🐾 반려동물 관리</h1>

        <button
          className="add-pet-btn"
          onClick={() => navigate("/pets/new")}
        >
          + 반려동물 추가
        </button>
      </div>

      <div className="pet-grid">
        {pets.map((pet) => (
          <div key={pet._id} className="pet-card">
            
            <div className="pet-image-wrap">
              {pet.image ? (
                <img
                  src={`http://localhost:5000${pet.image}`}
                  alt={pet.name}
                  className="pet-image"
                />
              ) : (
                <div className="pet-default-icon">
                  {getDefaultIcon(pet.type)}
                </div>
              )}
            </div>

            <h3 className="pet-title">{pet.name}</h3>

            <div className="pet-simple-info">
              <p>{pet.type || "-"} · {pet.age ? `${pet.age}살` : "-"}</p>
            </div>

             <button
                className="more-btn"
                onClick={() =>
                  setOpenPetIds((prev) =>
                    prev.includes(pet._id)
                      ? prev.filter((id) => id !== pet._id)
                      : [...prev, pet._id]
                  )
                }
              >
                {openPetIds.includes(pet._id) ? "접기" : "더보기"}
              </button>

             {openPetIds.includes(pet._id) && (
            <div className="pet-detail-area">

                <div className="pet-info-box">
                  <p><strong>종류</strong> {pet.type || "-"}</p>
                  <p><strong>품종</strong> {pet.breed || "-"}</p>
                  <p><strong>성별</strong>{pet.gender || "-"}</p>
                  <p><strong>중성화</strong> {pet.neutered || "-"}</p>
                  <p><strong>나이</strong> {pet.age ? `${pet.age}살` : "-"}</p>
                  <p><strong>몸무게</strong> {pet.weight ? `${pet.weight}kg` : "-"}</p>
                </div>

            <div className="pet-sub-info">
              <p><strong>성격</strong> {pet.personality || "-"}</p>
              <p><strong>특징</strong> {pet.feature || "-"}</p>
            </div>

            <div className="pet-analysis-area">
              <h4>최근 화합/갈등 분석</h4>

              {analysisList.filter((item) => item.petIds?.map(String).includes(String(pet._id))).length === 0 ? (
                <p className="no-analysis">아직 분석 결과가 없습니다.</p>
              ) : (
                analysisList
                  .filter((item) => item.petIds?.map(String).includes(String(pet._id)))
                  .slice(0, 3)
                  .map((item) => (
                    <div key={item._id} className="analysis-mini-card">
                      <p>
                        <strong>{item.petNames.join(" ↔ ")}</strong>
                      </p>

                      <p>{item.result}</p>

                      <span>분석 일시: {formatDateTime(item.dateTime)}</span>

                      {item.behavior && (
                        <p>
                          <strong>선택 행동</strong> {item.behavior}
                        </p>
                      )}

                      {item.solutions?.length > 0 && (
                        <div className="analysis-solution-list">
                          <strong>솔루션 체크리스트</strong>

                          {item.solutions.map((solution, index) => (
                            <label key={index} className="solution-item">
                              <input
                                type="checkbox"
                                checked={solution.checked}
                                onChange={async () => {
                                  const updatedSolutions = item.solutions.map((s, i) =>
                                    i === index ? { ...s, checked: !s.checked } : s
                                  );

                                  await fetch(
                                    `http://localhost:5000/analysis/${item._id}/solutions`,
                                    {
                                      method: "PUT",
                                      headers: {
                                        "Content-Type": "application/json",
                                        Authorization: localStorage.getItem("token"),
                                      },
                                      body: JSON.stringify({
                                        solutions: updatedSolutions,
                                      }),
                                    }
                                  );

                                  fetchAnalysis();
                                }}
                              />
                              <span>{solution.text}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
              )}
            </div>
          

            <div className="pet-actions">
              <button
                className="edit-btn"
                onClick={() => navigate(`/pets/edit/${pet._id}`)}
              >
                수정
              </button>

              <button
                className="delete-btn"
                onClick={() => deletePet(pet._id)}
              >
                삭제
              </button>
            </div>
          </div>
        )}
      </div>
        ))}
    </div>
  </div>
  );
  }


export default Pets;