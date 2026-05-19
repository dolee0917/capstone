import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaDog, FaCat, FaCrow, FaFish, FaPaw } from "react-icons/fa";
import { GiRabbit, GiTurtle, GiGecko } from "react-icons/gi";
import "../App.css";
import "./PetDetail.css";

function PetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [completedMissions, setCompletedMissions] = useState({});
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

  const getTodayMission = (analysis) => {
    if (analysis.relationshipTrend === "harmony") {
      return {
        title: "긍정 행동 강화 미션",
        goal: "좋은 관계 행동을 반복해서 안정적인 관계로 이어가요.",
        description: "두 반려동물이 같은 공간에서 차분하게 머물거나 함께 놀이하는 시간을 만들어주세요.",
        successCondition: "공격, 추격, 회피 없이 10분 이상 편안하게 있으면 성공",
        reward: "성공 후 간식 또는 칭찬으로 긍정 행동을 강화해주세요.",
      };
    }

    if (analysis.relationshipTrend === "conflict") {
      return {
        title: "갈등 완화 미션",
        goal: "갈등 행동을 줄이고 안전한 거리를 유지해요.",
        description: "두 반려동물이 바로 접촉하지 않도록 거리를 두고, 보호자가 차분한 상태를 유지해주세요.",
        successCondition: "으르렁, 하악질, 추격, 공격 행동 없이 5분 이상 유지하면 성공",
        reward: "차분히 있으면 간식이나 칭찬으로 보상해주세요.",
      };
    }

    if (analysis.relationshipTrend === "stress") {
      return {
        title: "스트레스 안정 미션",
        goal: "긴장과 회피 행동을 줄이고 안정감을 높여요.",
        description: "각자의 공간을 확보한 뒤, 짧은 시간 동안 서로의 존재에 익숙해지도록 해주세요.",
        successCondition: "숨기, 떨기, 반복 울음 없이 안정적으로 머무르면 성공",
        reward: "안정적으로 머문 뒤 조용히 칭찬해주세요.",
      };
    }

    return {
      title: "관찰 미션",
      goal: "두 반려동물의 반응을 천천히 관찰해요.",
      description: "무리하게 가까이 두지 말고, 보호자가 지켜보는 상태에서 짧게 관찰해주세요.",
      successCondition: "강한 스트레스 반응 없이 짧은 관찰을 마치면 성공",
      reward: "안정적인 반응을 보이면 칭찬해주세요.",
    };
  };

  const petAnalyses = analysisList.filter((item) =>
    item.petIds?.map(String).includes(String(pet._id))
  );

  return (
    <div className="pet-detail-page">
      <div className="pet-profile-hero-card">
      <button className="back-btn" onClick={() => navigate("/pets")}>
        ← 목록으로
      </button>

      <div className="pet-profile-hero">
        <div className="pet-profile-text">
          <span className="pet-profile-badge">Pet Profile</span>

          <h2>
            {pet.name}
            <span className="gender-badge">
              {pet.gender || "성별 미입력"}
            </span>
          </h2>

          <p className="pet-profile-subtitle">
            {pet.personality
              ? `${pet.personality} 성격을 가진 ${pet.name}예요 💜`
              : `${pet.name}의 프로필을 확인해보세요 💜`}
          </p>
        </div>

        <div className="pet-profile-image-area">
          <div className="pet-profile-decoration">👑</div>

          {pet.image ? (
            <img
              src={`http://localhost:5000${pet.image}`}
              alt={pet.name}
              className="pet-profile-main-image"
            />
          ) : (
            <div className="pet-profile-main-default">
              {getDefaultIcon(pet.type)}
            </div>
          )}
        </div>
      </div>

      <div className="pet-summary-row">
        <div className="pet-summary-item">
          <span>🎂</span>
          <strong>{pet.age ? `${pet.age}살` : "-"}</strong>
          <p>나이</p>
        </div>

        <div className="pet-summary-item">
          <span>⚖️</span>
          <strong>{pet.weight ? `${pet.weight}kg` : "-"}</strong>
          <p>몸무게</p>
        </div>

        <div className="pet-summary-item">
          <span>🛡️</span>
          <strong>{pet.personality || "-"}</strong>
          <p>성격</p>
        </div>

        <div className="pet-summary-item">
          <span>⚧</span>
          <strong>{pet.gender || "-"}</strong>
          <p>성별</p>
        </div>
      </div>

      <div className="pet-info-section">
        <h3>🐾 기본 정보</h3>

        <div className="pet-info-modern-list">
          <div>
            <span>🐰 종류</span>
            <strong>{pet.type || "-"}</strong>
          </div>

          <div>
            <span>🏅 품종</span>
            <strong>{pet.breed || "-"}</strong>
          </div>

          <div>
            <span>⚧ 성별</span>
            <strong>{pet.gender || "-"}</strong>
          </div>

          <div>
            <span>🎂 나이</span>
            <strong>{pet.age ? `${pet.age}살` : "-"}</strong>
          </div>

          <div>
            <span>⚖️ 몸무게</span>
            <strong>{pet.weight ? `${pet.weight}kg` : "-"}</strong>
          </div>

          <div>
            <span>💜 성격</span>
            <strong>{pet.personality || "-"}</strong>
          </div>

          <div>
            <span>🛡️ 중성화 여부</span>
            <strong>{pet.neutered || "-"}</strong>
          </div>
        </div>
      </div>

      <div className="pet-memo-box">
        <h4>💬 보호자 메모</h4>
        <p>{pet.feature || "아직 입력된 특징이 없습니다."}</p>
      </div>

      <button
        className="pet-profile-edit-btn"
        onClick={() => navigate(`/pets/edit/${pet._id}`)}
      >
        ✏️ 수정하기
      </button>
    </div>

      <div className="pet-detail-card">
        <h3>최근 화합/갈등 분석</h3>

        <div className="pet-detail-card">
          <h3>🎯 오늘의 관계 미션</h3>

          {petAnalyses.length === 0 ? (
            <p>아직 생성된 관계 미션이 없습니다. 먼저 관계 분석을 진행해주세요.</p>
          ) : (
            petAnalyses.slice(0, 3).map((item) => {
              const mission = getTodayMission(item);

              const otherPets = item.petNames?.filter(
                (name) => name !== pet.name
              );

              return (
                <div key={item._id} className="today-mission-card">
                  <h4>
                    {otherPets?.join(", ") || "다른 반려동물"}와의 미션
                  </h4>

                  <h5>🎯 {mission.title}</h5>

                  <p>
                    <strong>목표:</strong> {mission.goal}
                  </p>

                  <p>
                    <strong>미션:</strong> {mission.description}
                  </p>

                  <div className="mission-bottom-row">
                    <p className="mission-condition">
                      <strong>성공 조건:</strong> {mission.successCondition}
                    </p>

                    <button
                      className={
                        item.todayMissionCompleted
                          ? "mission-complete-btn done"
                          : "mission-complete-btn"
                      }
                      onClick={async () => {
                        const res = await fetch(
                          `http://localhost:5000/analysis/${item._id}/today-mission`,
                          {
                            method: "PUT",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: localStorage.getItem("token"),
                            },
                            body: JSON.stringify({
                              todayMissionCompleted: !item.todayMissionCompleted,
                            }),
                          }
                        );

                        if (res.ok) {
                          fetchAnalysis();
                        }
                      }}
                    >
                      {item.todayMissionCompleted ? "미션 완료됨" : "미션 완료하기"}
                    </button>
                  </div>

                  <p>
                    <strong>보상 방법:</strong> {mission.reward}
                  </p>
                </div>
              );
            })
          )}
        </div>

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