import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaDog, FaCat, FaCrow, FaFish, FaPaw } from "react-icons/fa";
import { GiRabbit, GiTurtle, GiGecko } from "react-icons/gi";
import "../App.css";
import "./PetDetail.css";

function PetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pet, setPet] = useState(null);
  const [analysisList, setAnalysisList] = useState([]);

  useEffect(() => {
    fetchPet();
    fetchAnalysis();
  }, [id]);

  const getDefaultIcon = (type) => {
    const style = {
        fontSize: "72px",
        color: "#6c7cff",
    };

    if (type === "강아지") return <FaDog style={style} />;
    if (type === "고양이") return <FaCat style={style} />;
    if (type === "햄스터") return <FaPaw style={style} />;
    if (type === "토끼") return <GiRabbit style={style} />;
    if (type === "앵무새") return <FaCrow style={style} />;
    if (type === "거북이") return <GiTurtle style={style} />;
    if (type === "도마뱀") return <GiGecko style={style} />;

    return <FaFish style={style} />;
    };

  const fetchPet = async () => {
    const res = await fetch(`http://localhost:5000/pets/${id}`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });

    const data = await res.json();

    if (res.ok) {
      setPet(data);
    } else {
      alert(data.error || "반려동물 정보를 불러오지 못했습니다.");
      navigate("/pets");
    }
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

  const updateAnalysisSolutions = async (analysisId, updatedSolutions) => {
  await fetch(`http://localhost:5000/analysis/${analysisId}/solutions`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
    body: JSON.stringify({
      solutions: updatedSolutions,
    }),
  });

  fetchAnalysis();
};



  if (!pet) {
    return <div className="pet-detail-page">불러오는 중...</div>;
  }

  const petAnalyses = analysisList.filter((item) =>
    item.petIds?.map(String).includes(String(pet._id))
  );

  return (
    <div className="pet-detail-page">
      <div className="pet-detail-card">
        <button className="back-btn" onClick={() => navigate("/pets")}>
          ← 목록으로
        </button>

        <h2>{pet.name} 프로필</h2>

        <div className="pet-detail-image-wrap">
            {pet.image ? (
                <img
                src={`http://localhost:5000${pet.image}`}
                alt={pet.name}
                className="pet-detail-image"
                />
            ) : (
                <div className="pet-detail-default-icon">
                {getDefaultIcon(pet.type)}
                </div>
            )}
            </div>

        <div className="pet-detail-info">
          <p><strong>종류</strong> {pet.type || "-"}</p>
          <p><strong>품종</strong> {pet.breed || "-"}</p>
          <p><strong>성별</strong> {pet.gender || "-"}</p>
          <p><strong>중성화</strong> {pet.neutered || "-"}</p>
          <p><strong>나이</strong> {pet.age ? `${pet.age}살` : "-"}</p>
          <p><strong>몸무게</strong> {pet.weight ? `${pet.weight}kg` : "-"}</p>
          <p><strong>성격</strong> {pet.personality || "-"}</p>
          <p><strong>특징</strong> {pet.feature || "-"}</p>
        </div>

        <button
          className="edit-btn"
          onClick={() => navigate(`/pets/edit/${pet._id}`)}
        >
          수정하기
        </button>
      </div>

      <div className="pet-detail-card">
        <h3>최근 화합/갈등 분석</h3>

        {petAnalyses.length === 0 ? (
          <p>아직 분석 결과가 없습니다.</p>
        ) : (
          petAnalyses.slice(0, 5).map((item) => (
            <div key={item._id} className="detail-analysis-card">
              <p><strong>{item.petNames?.join(" ↔ ")}</strong></p>
              <p>{item.result}</p>

              {item.behavior && (
                <p><strong>선택 행동</strong> {item.behavior}</p>
              )}

              {item.solutions?.length > 0 && (
  <div className="record-solution-list">
    <strong>단계별 솔루션 & 미션</strong>

    {[1, 2, 3, 4].map((stage) => {
      const stageSolutions = item.solutions.filter(
        (solution) => solution.stage === stage
      );

      if (stageSolutions.length === 0) return null;

      const stageTitle = stageSolutions[0].stageTitle || "솔루션 단계";

      return (
        <div key={stage} className="solution-stage-box">
          <h4>
            {stage}단계. {stageTitle}
          </h4>

          {stageSolutions.map((solution) => (
            <div key={solution._id || solution.text} className="solution-mission-item">
              <label className="solution-item">
                <input type="checkbox" checked={solution.checked} readOnly />
                <span>{solution.text}</span>
              </label>

              {solution.mission && (
                <div className="mission-box">
                  <h5>🎯 {solution.mission.title}</h5>
                  <p>{solution.mission.description}</p>

                  <div className="mission-bottom-row">
                    <p className="mission-condition">
                      <strong>성공 조건:</strong>{" "}
                      {solution.mission.successCondition}
                    </p>

                    <button
                      className={
                        solution.mission.completed
                          ? "mission-complete-btn done"
                          : "mission-complete-btn"
                      }
                      onClick={() => {
                        const updatedSolutions = item.solutions.map((s) =>
                          s.text === solution.text
                            ? {
                                ...s,
                                mission: {
                                  ...s.mission,
                                  completed: !s.mission?.completed,
                                },
                              }
                            : s
                        );

                        updateAnalysisSolutions(item._id, updatedSolutions);
                      }}
                    >
                      {solution.mission.completed
                        ? "미션 완료됨"
                        : "미션 완료하기"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      );
    })}
  </div>
)}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PetDetail;